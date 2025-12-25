"""
Excel Data Import Script for Library Management System

This script imports data from Excel files into MongoDB collections.
Supports multiple sheets for different data types (books, members, users, etc.)

Usage:
    python import_excel_data.py <excel_file_path> [--clear] [--sheet <sheet_name>]

Example:
    python import_excel_data.py data.xlsx --clear
    python import_excel_data.py data.xlsx --sheet Books
"""

import asyncio
import pandas as pd
import sys
import os
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
from bson import ObjectId
import argparse

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.cores.config import settings
from app.utils.utils import hash_password
from motor.motor_asyncio import AsyncIOMotorClient
from app.controllers.member_controller import generate_membership_id

# Create a new database connection for this script
_client = None
_db = None

def get_db_connection():
    """Get database connection (creates new one if needed)"""
    global _client, _db
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI)
        _db = _client["Library_Management_System"]
    return _db

# Get collections
def get_collections():
    db = get_db_connection()
    return {
        'books': db["books"],
        'members': db["members"],
        'users': db["users"],
        'transactions': db["transactions"],
        'reservations': db["reservations"]
    }


class ExcelImporter:
    def __init__(self, excel_path: str, clear_existing: bool = False):
        self.excel_path = excel_path
        self.clear_existing = clear_existing
        self.collections = get_collections()
        self.stats = {
            'books': {'imported': 0, 'errors': 0},
            'users': {'imported': 0, 'errors': 0},
            'members': {'imported': 0, 'errors': 0},
            'transactions': {'imported': 0, 'errors': 0}
        }
    
    def read_excel(self, sheet_name: Optional[str] = None) -> Dict[str, pd.DataFrame]:
        """Read Excel or CSV file and return dictionary of sheet names and dataframes"""
        try:
            file_ext = os.path.splitext(self.excel_path)[1].lower()
            
            # Handle CSV files
            if file_ext == '.csv':
                print(f"📄 Reading CSV file: {os.path.basename(self.excel_path)}")
                df = pd.read_csv(self.excel_path, encoding='utf-8', on_bad_lines='skip', low_memory=False)
                return {'Sheet1': df}  # CSV files have one "sheet"
            
            # Handle Excel files
            excel_file = pd.ExcelFile(self.excel_path)
            sheets = {}
            
            if sheet_name:
                if sheet_name not in excel_file.sheet_names:
                    raise ValueError(f"Sheet '{sheet_name}' not found. Available sheets: {excel_file.sheet_names}")
                sheets[sheet_name] = pd.read_excel(excel_file, sheet_name=sheet_name)
            else:
                for sheet in excel_file.sheet_names:
                    sheets[sheet] = pd.read_excel(excel_file, sheet_name=sheet)
            
            return sheets
        except UnicodeDecodeError:
            # Try with different encoding for CSV
            print("⚠️  UTF-8 encoding failed, trying latin-1...")
            df = pd.read_csv(self.excel_path, encoding='latin-1', on_bad_lines='skip', low_memory=False)
            return {'Sheet1': df}
        except Exception as e:
            print(f"❌ Error reading file: {str(e)}")
            raise
    
    def normalize_column_names(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normalize column names to lowercase with underscores"""
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('-', '_')
        return df
    
    async def clear_collections(self):
        """Clear existing data from collections"""
        if self.clear_existing:
            print("🗑️  Clearing existing data...")
            await self.collections['books'].delete_many({})
            await self.collections['members'].delete_many({})
            await self.collections['users'].delete_many({})
            await self.collections['transactions'].delete_many({})
            await self.collections['reservations'].delete_many({})
            print("✅ Existing data cleared")
    
    async def import_books(self, df: pd.DataFrame):
        """Import books from DataFrame"""
        print(f"\n📚 Importing books from {len(df)} rows...")
        
        # Expected columns (case-insensitive mapping)
        column_mapping = {
            'title': ['title', 'book_title', 'name'],
            'author': ['author', 'authors', 'writer', 'author_name'],
            'isbn': ['isbn', 'isbn13', 'isbn_13', 'isbn_10'],
            'category': ['category', 'categories', 'genre', 'type', 'search_ca', 'search_categories'],
            'publisher': ['publisher', 'publishing_house'],
            'publication_year': ['publication_year', 'year', 'publish_year', 'pub_year', 'published_date', 'published_description'],
            'total_copies': ['total_copies', 'copies', 'quantity', 'stock'],
            'description': ['description', 'summary', 'synopsis', 'published_description'],
            'cover_image': ['cover_image', 'image', 'cover', 'image_url', 'thumbnail', 'preview_li', 'preview_link'],
            'subtitle': ['subtitle'],
            'page_count': ['page_count', 'page_cour', 'pages'],
            'language': ['language'],
            'isbn_13': ['isbn_13', 'isbn13'],
            'isbn_10': ['isbn_10', 'isbn10']
        }
        
        # Find actual column names
        actual_columns = {}
        for key, possible_names in column_mapping.items():
            for col in df.columns:
                if col.lower() in [name.lower() for name in possible_names]:
                    actual_columns[key] = col
                    break
        
        # Required fields (title is minimum, others can be derived)
        required = ['title']
        missing = [req for req in required if req not in actual_columns]
        if missing:
            print(f"⚠️  Missing required columns: {missing}")
            print(f"   Available columns: {list(df.columns)}")
            return
        
        # Check for ISBN (isbn_13 or isbn_10 or isbn)
        has_isbn = any(key in actual_columns for key in ['isbn', 'isbn_13', 'isbn_10'])
        if not has_isbn:
            print("⚠️  Warning: No ISBN column found. Books will be imported but may have duplicates.")
        
        for idx, row in df.iterrows():
            try:
                # Get ISBN (prefer isbn_13, then isbn_10, then isbn)
                isbn = None
                if actual_columns.get('isbn_13') and pd.notna(row[actual_columns['isbn_13']]):
                    isbn = str(row[actual_columns['isbn_13']]).strip()
                elif actual_columns.get('isbn_10') and pd.notna(row[actual_columns['isbn_10']]):
                    isbn = str(row[actual_columns['isbn_10']]).strip()
                elif actual_columns.get('isbn') and pd.notna(row[actual_columns['isbn']]):
                    isbn = str(row[actual_columns['isbn']]).strip()
                
                # Check if book already exists (by ISBN if available)
                if isbn:
                    existing = await self.collections['books'].find_one({"isbn": isbn})
                    if existing:
                        print(f"   ⚠️  Book with ISBN {isbn} already exists, skipping...")
                        continue
                else:
                    # Check by title and author if no ISBN
                    title = str(row[actual_columns['title']]).strip()
                    author = str(row[actual_columns.get('author', '')]).strip() if actual_columns.get('author') and pd.notna(row[actual_columns.get('author')]) else ''
                    if author:
                        existing = await self.collections['books'].find_one({"title": title, "author": author})
                        if existing:
                            print(f"   ⚠️  Book '{title}' by {author} already exists, skipping...")
                            continue
                
                # Get title (required)
                title = str(row[actual_columns['title']]).strip()
                if not title:
                    print(f"   ⚠️  Row {idx + 1}: Empty title, skipping...")
                    continue
                
                # Get author (from 'authors' column, can be comma-separated)
                author = ''
                if actual_columns.get('author') and pd.notna(row[actual_columns['author']]):
                    author = str(row[actual_columns['author']]).strip()
                    # Take first author if multiple
                    if ',' in author:
                        author = author.split(',')[0].strip()
                
                # Get category (from 'categories' column, can be comma-separated)
                category = 'Uncategorized'
                if actual_columns.get('category') and pd.notna(row[actual_columns['category']]):
                    category = str(row[actual_columns['category']]).strip()
                    # Take first category if multiple
                    if ',' in category or '|' in category:
                        category = category.split(',')[0].split('|')[0].strip()
                elif actual_columns.get('search_ca') and pd.notna(row[actual_columns['search_ca']]):
                    category = str(row[actual_columns['search_ca']]).strip()
                    if ',' in category or '|' in category:
                        category = category.split(',')[0].split('|')[0].strip()
                
                # Extract publication year from published_date if available
                publication_year = None
                if actual_columns.get('publication_year') and pd.notna(row[actual_columns['publication_year']]):
                    try:
                        pub_date = pd.to_datetime(row[actual_columns['publication_year']], errors='coerce')
                        if pd.notna(pub_date):
                            publication_year = pub_date.year
                    except:
                        try:
                            # Try to extract year from string
                            pub_str = str(row[actual_columns['publication_year']])
                            import re
                            year_match = re.search(r'\d{4}', pub_str)
                            if year_match:
                                publication_year = int(year_match.group())
                        except:
                            pass
                
                # Get description
                description = None
                if actual_columns.get('description') and pd.notna(row[actual_columns['description']]):
                    description = str(row[actual_columns['description']]).strip()
                elif actual_columns.get('published_description') and pd.notna(row[actual_columns['published_description']]):
                    description = str(row[actual_columns['published_description']]).strip()
                
                # Get subtitle and append to description if available
                subtitle = None
                if actual_columns.get('subtitle') and pd.notna(row[actual_columns['subtitle']]):
                    subtitle = str(row[actual_columns['subtitle']]).strip()
                    if description:
                        description = f"{description}\n\nSubtitle: {subtitle}"
                    else:
                        description = f"Subtitle: {subtitle}"
                
                # Get cover image (prefer thumbnail)
                cover_image = None
                if actual_columns.get('thumbnail') and pd.notna(row[actual_columns['thumbnail']]):
                    cover_image = str(row[actual_columns['thumbnail']]).strip()
                elif actual_columns.get('cover_image') and pd.notna(row[actual_columns['cover_image']]):
                    cover_image = str(row[actual_columns['cover_image']]).strip()
                elif actual_columns.get('preview_li') and pd.notna(row[actual_columns['preview_li']]):
                    cover_image = str(row[actual_columns['preview_li']]).strip()
                
                # Build book document
                book_doc = {
                    "title": title,
                    "author": author if author else "Unknown",
                    "isbn": isbn if isbn else f"NO-ISBN-{idx+1}",  # Generate placeholder if no ISBN
                    "category": category,
                    "publisher": str(row[actual_columns.get('publisher', '')]).strip() if actual_columns.get('publisher') and pd.notna(row[actual_columns.get('publisher')]) else None,
                    "publication_year": publication_year,
                    "total_copies": int(row[actual_columns.get('total_copies', 1)]) if actual_columns.get('total_copies') and pd.notna(row[actual_columns.get('total_copies')]) else 1,
                    "available_copies": int(row[actual_columns.get('total_copies', 1)]) if actual_columns.get('total_copies') and pd.notna(row[actual_columns.get('total_copies')]) else 1,
                    "description": description,
                    "cover_image": cover_image,
                    "created_at": datetime.now(timezone.utc)
                }
                
                # Add additional fields if available
                if actual_columns.get('page_count') and pd.notna(row[actual_columns['page_count']]):
                    try:
                        book_doc["page_count"] = int(row[actual_columns['page_count']])
                    except:
                        pass
                
                if actual_columns.get('language') and pd.notna(row[actual_columns['language']]):
                    book_doc["language"] = str(row[actual_columns['language']]).strip()
                
                # Remove None values
                book_doc = {k: v for k, v in book_doc.items() if v is not None}
                
                await self.collections['books'].insert_one(book_doc)
                self.stats['books']['imported'] += 1
                
                if (idx + 1) % 10 == 0:
                    print(f"   ✅ Imported {idx + 1}/{len(df)} books...")
                    
            except Exception as e:
                self.stats['books']['errors'] += 1
                print(f"   ❌ Error importing row {idx + 1}: {str(e)}")
                import traceback
                traceback.print_exc()
        
        print(f"✅ Books import complete: {self.stats['books']['imported']} imported, {self.stats['books']['errors']} errors")
    
    async def import_users(self, df: pd.DataFrame):
        """Import users from DataFrame"""
        print(f"\n👥 Importing users from {len(df)} rows...")
        
        column_mapping = {
            'email': ['email', 'e_mail', 'email_address'],
            'password': ['password', 'pwd', 'pass'],
            'full_name': ['full_name', 'name', 'fullname', 'user_name'],
            'role': ['role', 'user_role', 'type']
        }
        
        actual_columns = {}
        for key, possible_names in column_mapping.items():
            for col in df.columns:
                if col.lower() in [name.lower() for name in possible_names]:
                    actual_columns[key] = col
                    break
        
        required = ['email', 'full_name']
        missing = [req for req in required if req not in actual_columns]
        if missing:
            print(f"⚠️  Missing required columns: {missing}")
            print(f"   Available columns: {list(df.columns)}")
            return
        
        # Create user_id mapping for members
        user_id_map = {}
        
        for idx, row in df.iterrows():
            try:
                email = str(row[actual_columns['email']]).strip().lower()
                
                # Check if user already exists
                existing = await self.collections['users'].find_one({"email": email})
                if existing:
                    user_id_map[email] = str(existing["_id"])
                    print(f"   ⚠️  User with email {email} already exists, using existing...")
                    continue
                
                # Generate password if not provided
                password = str(row[actual_columns.get('password', 'password123')]).strip() if actual_columns.get('password') and pd.notna(row[actual_columns.get('password')]) else 'password123'
                full_name = str(row[actual_columns['full_name']]).strip()
                role = str(row[actual_columns.get('role', 'member')]).strip().lower() if actual_columns.get('role') and pd.notna(row[actual_columns.get('role')]) else 'member'
                
                # Validate role
                if role not in ['admin', 'librarian', 'member']:
                    role = 'member'
                
                user_doc = {
                    "email": email,
                    "password_hash": hash_password(password),
                    "full_name": full_name,
                    "role": role,
                    "is_active": True,
                    "created_at": datetime.now(timezone.utc)
                }
                
                result = await self.collections['users'].insert_one(user_doc)
                user_id_map[email] = str(result.inserted_id)
                self.stats['users']['imported'] += 1
                
                if (idx + 1) % 10 == 0:
                    print(f"   ✅ Imported {idx + 1}/{len(df)} users...")
                    
            except Exception as e:
                self.stats['users']['errors'] += 1
                print(f"   ❌ Error importing row {idx + 1}: {str(e)}")
        
        print(f"✅ Users import complete: {self.stats['users']['imported']} imported, {self.stats['users']['errors']} errors")
        return user_id_map
    
    async def import_members(self, df: pd.DataFrame, user_id_map: Dict[str, str]):
        """Import members from DataFrame"""
        print(f"\n👤 Importing members from {len(df)} rows...")
        
        column_mapping = {
            'email': ['email', 'e_mail', 'email_address', 'user_email'],
            'phone': ['phone', 'phone_number', 'mobile', 'contact'],
            'address': ['address', 'location', 'street_address'],
            'membership_type': ['membership_type', 'type', 'member_type', 'plan']
        }
        
        actual_columns = {}
        for key, possible_names in column_mapping.items():
            for col in df.columns:
                if col.lower() in [name.lower() for name in possible_names]:
                    actual_columns[key] = col
                    break
        
        required = ['email', 'phone', 'address']
        missing = [req for req in required if req not in actual_columns]
        if missing:
            print(f"⚠️  Missing required columns: {missing}")
            print(f"   Available columns: {list(df.columns)}")
            return
        
        for idx, row in df.iterrows():
            try:
                email = str(row[actual_columns['email']]).strip().lower()
                
                # Get user_id from mapping
                user_id = user_id_map.get(email)
                if not user_id:
                    print(f"   ⚠️  User with email {email} not found, skipping member...")
                    continue
                
                # Check if member already exists
                existing = await self.collections['members'].find_one({"user_id": user_id})
                if existing:
                    print(f"   ⚠️  Member for user {email} already exists, skipping...")
                    continue
                
                phone = str(row[actual_columns['phone']]).strip()
                address = str(row[actual_columns['address']]).strip()
                membership_type = str(row[actual_columns.get('membership_type', 'standard')]).strip().lower() if actual_columns.get('membership_type') and pd.notna(row[actual_columns.get('membership_type')]) else 'standard'
                
                if membership_type not in ['standard', 'premium']:
                    membership_type = 'standard'
                
                max_books = 10 if membership_type == "premium" else settings.MAX_BOOKS_PER_MEMBER
                
                member_doc = {
                    "user_id": user_id,
                    "membership_id": await generate_membership_id(),
                    "phone": phone,
                    "address": address,
                    "membership_type": membership_type,
                    "membership_start": datetime.now(timezone.utc),
                    "membership_end": datetime.now(timezone.utc).replace(year=datetime.now(timezone.utc).year + 1),
                    "max_books_allowed": max_books,
                    "is_active": True
                }
                
                await self.collections['members'].insert_one(member_doc)
                self.stats['members']['imported'] += 1
                
                if (idx + 1) % 10 == 0:
                    print(f"   ✅ Imported {idx + 1}/{len(df)} members...")
                    
            except Exception as e:
                self.stats['members']['errors'] += 1
                print(f"   ❌ Error importing row {idx + 1}: {str(e)}")
        
        print(f"✅ Members import complete: {self.stats['members']['imported']} imported, {self.stats['members']['errors']} errors")
    
    async def import_transactions(self, df: pd.DataFrame):
        """Import transactions from DataFrame"""
        print(f"\n📖 Importing transactions from {len(df)} rows...")
        
        column_mapping = {
            'member_id': ['member_id', 'member', 'membership_id'],
            'book_id': ['book_id', 'book', 'isbn'],
            'borrow_date': ['borrow_date', 'borrowed_date', 'issue_date', 'loan_date'],
            'due_date': ['due_date', 'return_due_date'],
            'return_date': ['return_date', 'returned_date'],
            'status': ['status', 'transaction_status']
        }
        
        actual_columns = {}
        for key, possible_names in column_mapping.items():
            for col in df.columns:
                if col.lower() in [name.lower() for name in possible_names]:
                    actual_columns[key] = col
                    break
        
        required = ['member_id', 'book_id']
        missing = [req for req in required if req not in actual_columns]
        if missing:
            print(f"⚠️  Missing required columns: {missing}")
            print(f"   Available columns: {list(df.columns)}")
            return
        
        for idx, row in df.iterrows():
            try:
                # Get member_id - could be ObjectId string or membership_id
                member_ref = str(row[actual_columns['member_id']]).strip()
                
                # Try to find member by membership_id first
                member = await self.collections['members'].find_one({"membership_id": member_ref})
                if not member:
                    # Try as ObjectId
                    if ObjectId.is_valid(member_ref):
                        member = await self.collections['members'].find_one({"_id": ObjectId(member_ref)})
                
                if not member:
                    print(f"   ⚠️  Member {member_ref} not found, skipping transaction...")
                    continue
                
                member_id = str(member["_id"])
                
                # Get book_id - could be ObjectId string or ISBN
                book_ref = str(row[actual_columns['book_id']]).strip()
                
                # Try to find book by ISBN first
                book = await self.collections['books'].find_one({"isbn": book_ref})
                if not book:
                    # Try as ObjectId
                    if ObjectId.is_valid(book_ref):
                        book = await self.collections['books'].find_one({"_id": ObjectId(book_ref)})
                
                if not book:
                    print(f"   ⚠️  Book {book_ref} not found, skipping transaction...")
                    continue
                
                book_id = str(book["_id"])
                
                # Parse dates
                borrow_date = None
                if actual_columns.get('borrow_date') and pd.notna(row[actual_columns['borrow_date']]):
                    try:
                        borrow_date = pd.to_datetime(row[actual_columns['borrow_date']]).replace(tzinfo=timezone.utc)
                    except:
                        borrow_date = datetime.now(timezone.utc)
                else:
                    borrow_date = datetime.now(timezone.utc)
                
                due_date = None
                if actual_columns.get('due_date') and pd.notna(row[actual_columns['due_date']]):
                    try:
                        due_date = pd.to_datetime(row[actual_columns['due_date']]).replace(tzinfo=timezone.utc)
                    except:
                        due_date = (borrow_date + timedelta(days=settings.LOAN_PERIOD_DAYS)) if borrow_date else datetime.now(timezone.utc)
                else:
                    due_date = (borrow_date + timedelta(days=settings.LOAN_PERIOD_DAYS)) if borrow_date else datetime.now(timezone.utc)
                
                return_date = None
                if actual_columns.get('return_date') and pd.notna(row[actual_columns['return_date']]):
                    try:
                        return_date = pd.to_datetime(row[actual_columns['return_date']]).replace(tzinfo=timezone.utc)
                    except:
                        return_date = None
                
                status = str(row[actual_columns.get('status', 'borrowed')]).strip().lower() if actual_columns.get('status') and pd.notna(row[actual_columns.get('status')]) else ('returned' if return_date else 'borrowed')
                
                if status not in ['borrowed', 'returned']:
                    status = 'returned' if return_date else 'borrowed'
                
                # Calculate fine if overdue
                fine_amount = 0.0
                if return_date and return_date > due_date:
                    from app.utils.utils import calculate_fine
                    fine_amount = calculate_fine(due_date, return_date)
                
                transaction_doc = {
                    "member_id": member_id,
                    "book_id": book_id,
                    "borrow_date": borrow_date,
                    "due_date": due_date,
                    "return_date": return_date,
                    "status": status,
                    "fine_amount": fine_amount
                }
                
                await self.collections['transactions'].insert_one(transaction_doc)
                self.stats['transactions']['imported'] += 1
                
                if (idx + 1) % 10 == 0:
                    print(f"   ✅ Imported {idx + 1}/{len(df)} transactions...")
                    
            except Exception as e:
                self.stats['transactions']['errors'] += 1
                print(f"   ❌ Error importing row {idx + 1}: {str(e)}")
        
        print(f"✅ Transactions import complete: {self.stats['transactions']['imported']} imported, {self.stats['transactions']['errors']} errors")
    
    async def auto_detect_and_import(self, sheets: Dict[str, pd.DataFrame]):
        """Auto-detect sheet types and import accordingly"""
        print("\n🔍 Auto-detecting sheet types...")
        
        user_id_map = {}
        
        for sheet_name, df in sheets.items():
            df = self.normalize_column_names(df.copy())
            sheet_lower = sheet_name.lower()
            
            print(f"\n📄 Processing sheet: '{sheet_name}' ({len(df)} rows)")
            
            # Auto-detect sheet type based on column names
            columns_lower = [col.lower() for col in df.columns]
            
            if any(col in columns_lower for col in ['isbn', 'title', 'author', 'category']):
                await self.import_books(df)
            elif any(col in columns_lower for col in ['email']) and any(col in columns_lower for col in ['phone', 'address']):
                # Could be members or users - check for phone/address (members)
                if any(col in columns_lower for col in ['phone', 'address']):
                    if not user_id_map:
                        print("   ⚠️  Users must be imported before members. Skipping...")
                    else:
                        await self.import_members(df, user_id_map)
                else:
                    user_id_map = await self.import_users(df)
            elif any(col in columns_lower for col in ['email']) and not any(col in columns_lower for col in ['phone', 'address']):
                user_id_map = await self.import_users(df)
            elif any(col in columns_lower for col in ['member_id', 'book_id', 'borrow_date']):
                await self.import_transactions(df)
            else:
                print(f"   ⚠️  Could not auto-detect sheet type. Available columns: {list(df.columns)}")
                print("   💡 Tip: Sheet should contain columns for: Books, Users, Members, or Transactions")
    
    def print_summary(self):
        """Print import summary"""
        print("\n" + "="*60)
        print("📊 IMPORT SUMMARY")
        print("="*60)
        for data_type, stats in self.stats.items():
            print(f"{data_type.upper()}:")
            print(f"  ✅ Imported: {stats['imported']}")
            print(f"  ❌ Errors: {stats['errors']}")
        print("="*60)


async def main():
    parser = argparse.ArgumentParser(description='Import Excel data into Library Management System')
    parser.add_argument('excel_file', help='Path to Excel file (.xlsx or .xls)')
    parser.add_argument('--clear', action='store_true', help='Clear existing data before import')
    parser.add_argument('--sheet', help='Import specific sheet only (by name)')
    parser.add_argument('--type', choices=['books', 'users', 'members', 'transactions'], 
                       help='Force data type (overrides auto-detection)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.excel_file):
        print(f"❌ Error: File '{args.excel_file}' not found")
        return
    
    print(f"Reading file: {args.excel_file}")
    
    importer = ExcelImporter(args.excel_file, clear_existing=args.clear)
    
    try:
        # Clear collections if requested
        await importer.clear_collections()
        
        # Read Excel file
        sheets = importer.read_excel(sheet_name=args.sheet)
        
        print(f"\n📋 Found {len(sheets)} sheet(s): {list(sheets.keys())}")
        
        # Import data
        if args.type:
            # Force specific type
            for sheet_name, df in sheets.items():
                df = importer.normalize_column_names(df.copy())
                if args.type == 'books':
                    await importer.import_books(df)
                elif args.type == 'users':
                    await importer.import_users(df)
                elif args.type == 'members':
                    user_id_map = await importer.import_users(pd.DataFrame())  # Dummy to get map
                    await importer.import_members(df, user_id_map)
                elif args.type == 'transactions':
                    await importer.import_transactions(df)
        else:
            # Auto-detect
            await importer.auto_detect_and_import(sheets)
        
        # Print summary
        importer.print_summary()
        
        print("\n✅ Import completed successfully!")
        print(f"🌐 Check your data at: http://localhost:3000/docs")
        
    except Exception as e:
        print(f"\n❌ Import failed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Handle event loop issues
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None
    
    if loop and loop.is_running():
        # If there's a running loop, we need to use nest_asyncio
        try:
            import nest_asyncio
            nest_asyncio.apply()
        except ImportError:
            print("⚠️  Warning: nest_asyncio not installed. Installing...")
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "nest_asyncio"])
            import nest_asyncio
            nest_asyncio.apply()
        asyncio.run(main())
    else:
        # No running loop, use asyncio.run normally
        asyncio.run(main())

