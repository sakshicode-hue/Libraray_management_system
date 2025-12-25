from app.cores.database import members_collection, users_collection, transactions_collection
from app.schemas.member_schema import MemberCreate, MemberUpdate
from app.cores.config import settings
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, timedelta
import random
import string

async def generate_membership_id():
    """Generate unique membership ID"""
    while True:
        # Generate format: MEM-XXXXXX
        random_part = ''.join(random.choices(string.digits, k=6))
        membership_id = f"MEM-{random_part}"
        
        # Check if already exists
        existing = await members_collection.find_one({"membership_id": membership_id})
        if not existing:
            return membership_id

async def list_members(page: int = 1, page_size: int = None):
    """List all members with pagination"""
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    page_size = min(page_size, settings.MAX_PAGE_SIZE)
    skip = (page - 1) * page_size
    
    total = await members_collection.count_documents({})
    
    members = []
    cursor = members_collection.find({}).skip(skip).limit(page_size)
    async for member in cursor:
        # Get user details
        user = await users_collection.find_one({"_id": ObjectId(member["user_id"])})
        
        member["id"] = str(member.pop("_id"))
        if user:
            member["user_details"] = {
                "email": user["email"],
                "full_name": user["full_name"]
            }
        members.append(member)
    
    return {
        "members": members,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

async def add_member(member_data: MemberCreate):
    """Add a new member"""
    # Validate user exists
    if not ObjectId.is_valid(member_data.user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    user = await users_collection.find_one({"_id": ObjectId(member_data.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if member already exists for this user
    existing_member = await members_collection.find_one({"user_id": member_data.user_id})
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member profile already exists for this user"
        )
    
    # Validate membership type
    if member_data.membership_type not in ["standard", "premium"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Membership type must be 'standard' or 'premium'"
        )
    
    # Set max books based on membership type
    max_books = 10 if member_data.membership_type == "premium" else settings.MAX_BOOKS_PER_MEMBER
    
    member_doc = {
        **member_data.model_dump(),
        "membership_id": await generate_membership_id(),
        "membership_start": datetime.utcnow(),
        "membership_end": datetime.utcnow() + timedelta(days=365),  # 1 year
        "max_books_allowed": max_books,
        "is_active": True
    }
    
    result = await members_collection.insert_one(member_doc)
    
    return {
        "message": "Member added successfully",
        "member_id": str(result.inserted_id),
        "membership_id": member_doc["membership_id"]
    }

async def update_member(member_id: str, member_update: MemberUpdate):
    """Update member details"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    update_data = {k: v for k, v in member_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )
    
    result = await members_collection.update_one(
        {"_id": ObjectId(member_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    return {"message": "Member updated successfully"}

async def search_members(query: str, page: int = 1, page_size: int = None):
    """Search members by name, email, or membership ID"""
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    page_size = min(page_size, settings.MAX_PAGE_SIZE)
    skip = (page - 1) * page_size
    
    # Search in members collection
    member_query = {
        "$or": [
            {"membership_id": {"$regex": query, "$options": "i"}},
            {"phone": {"$regex": query, "$options": "i"}}
        ]
    }
    
    # Also search in users collection
    users = []
    async for user in users_collection.find({
        "$or": [
            {"email": {"$regex": query, "$options": "i"}},
            {"full_name": {"$regex": query, "$options": "i"}}
        ]
    }):
        users.append(str(user["_id"]))
    
    if users:
        member_query["$or"].append({"user_id": {"$in": users}})
    
    total = await members_collection.count_documents(member_query)
    
    members = []
    cursor = members_collection.find(member_query).skip(skip).limit(page_size)
    async for member in cursor:
        user = await users_collection.find_one({"_id": ObjectId(member["user_id"])})
        
        member["id"] = str(member.pop("_id"))
        if user:
            member["user_details"] = {
                "email": user["email"],
                "full_name": user["full_name"]
            }
        members.append(member)
    
    return {
        "members": members,
        "total": total,
        "page": page,
        "page_size": page_size
    }

async def get_member_profile(member_id: str):
    """Get member profile with user details"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    member = await members_collection.find_one({"_id": ObjectId(member_id)})
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    # Get user details
    user = await users_collection.find_one({"_id": ObjectId(member["user_id"])})
    
    member["id"] = str(member.pop("_id"))
    if user:
        member["user_details"] = {
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    
    return member

async def get_borrowing_history(member_id: str):
    """Get member's borrowing history"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    # Verify member exists
    member = await members_collection.find_one({"_id": ObjectId(member_id)})
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    # Get all transactions for this member
    transactions = []
    cursor = transactions_collection.find({"member_id": member_id}).sort("borrow_date", -1)
    async for transaction in cursor:
        transaction["id"] = str(transaction.pop("_id"))
        transactions.append(transaction)
    
    return {
        "member_id": member_id,
        "membership_id": member["membership_id"],
        "transactions": transactions,
        "total_transactions": len(transactions)
    }
