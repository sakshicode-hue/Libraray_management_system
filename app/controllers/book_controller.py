from app.cores.database import books_collection
from app.schemas.book_schema import BookCreate, BookUpdate
from app.cores.config import settings
from fastapi import HTTPException, status, UploadFile
from bson import ObjectId
from datetime import datetime
from typing import Optional
import shutil
import os

async def add_book(book: BookCreate):
    """Add a new book to the library"""
    # Check if ISBN already exists
    existing_book = await books_collection.find_one({"isbn": book.isbn})
    if existing_book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book with this ISBN already exists"
        )
    
    book_doc = {
        **book.model_dump(),
        "available_copies": book.total_copies,
        "created_at": datetime.utcnow()
    }
    
    result = await books_collection.insert_one(book_doc)
    return {
        "message": "Book added successfully",
        "book_id": str(result.inserted_id)
    }

async def get_books(
    page: int = 1,
    page_size: int = None,
    category: Optional[str] = None,
    author: Optional[str] = None,
    search: Optional[str] = None
):
    """List books with pagination and filters"""
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    page_size = min(page_size, settings.MAX_PAGE_SIZE)
    skip = (page - 1) * page_size
    
    # Build filter query
    query = {}
    if category:
        query["category"] = category
    if author:
        query["author"] = {"$regex": author, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"author": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await books_collection.count_documents(query)
    
    # Get paginated results
    books = []
    cursor = books_collection.find(query).skip(skip).limit(page_size)
    async for book in cursor:
        book["id"] = str(book.pop("_id"))
        books.append(book)
    
    return {
        "books": books,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

async def get_book_by_id(book_id: str):
    """Get a single book by ID"""
    if not ObjectId.is_valid(book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid book ID"
        )
    
    book = await books_collection.find_one({"_id": ObjectId(book_id)})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    book["id"] = str(book.pop("_id"))
    return book

async def update_book(book_id: str, book_update: BookUpdate):
    """Update book details"""
    if not ObjectId.is_valid(book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid book ID"
        )
    
    # Get update data (exclude None values)
    update_data = {k: v for k, v in book_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )
    
    result = await books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    return {"message": "Book updated successfully"}

async def delete_book(book_id: str):
    """Delete a book"""
    if not ObjectId.is_valid(book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid book ID"
        )
    
    result = await books_collection.delete_one({"_id": ObjectId(book_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    return {"message": "Book deleted successfully"}

async def get_categories():
    """Get all unique book categories"""
    categories = await books_collection.distinct("category")
    return {"categories": sorted(categories)}

async def get_authors():
    """Get all unique authors"""
    authors = await books_collection.distinct("author")
    return {"authors": sorted(authors)}

async def check_availability(book_id: str):
    """Check book availability"""
    if not ObjectId.is_valid(book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid book ID"
        )
    
    book = await books_collection.find_one({"_id": ObjectId(book_id)})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    return {
        "book_id": str(book["_id"]),
        "title": book["title"],
        "total_copies": book["total_copies"],
        "available_copies": book["available_copies"],
        "is_available": book["available_copies"] > 0
    }

async def upload_book_with_image(
    title: str,
    author: str,
    isbn: str,
    category: str,
    total_copies: int,
    cover_image: UploadFile = None,
    publisher: str = None,
    publication_year: int = None,
    description: str = None
):
    """Upload book with cover image (form data)"""
    # Handle file upload
    cover_image_path = None
    if cover_image:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/covers"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, f"{isbn}_{cover_image.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(cover_image.file, buffer)
        
        cover_image_path = file_path
    
    # Create book
    book_data = BookCreate(
        title=title,
        author=author,
        isbn=isbn,
        category=category,
        total_copies=total_copies,
        publisher=publisher,
        publication_year=publication_year,
        description=description,
        cover_image=cover_image_path
    )
    
    return await add_book(book_data)

