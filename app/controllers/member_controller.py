from app.cores.database import users_collection, transactions_collection
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
        existing = await users_collection.find_one({"membership_id": membership_id})
        if not existing:
            return membership_id

async def list_members(page: int = 1, page_size: int = None):
    """List all members with pagination"""
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    page_size = min(page_size, settings.MAX_PAGE_SIZE)
    skip = (page - 1) * page_size
    
    # Filter for role="member"
    query = {"role": "member"}
    
    total = await users_collection.count_documents(query)
    
    members = []
    cursor = users_collection.find(query).skip(skip).limit(page_size)
    async for member in cursor:
        member_dict = member.copy()
        member_dict["id"] = str(member_dict.pop("_id"))
        member_dict["user_id"] = member_dict["id"] # Consistent ID
        # User details are already in the document
        member_dict["user_details"] = {
            "email": member_dict.get("email"),
            "full_name": member_dict.get("full_name")
        }
        members.append(member_dict)
    
    return {
        "members": members,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

async def add_member(member_data: MemberCreate):
    """Promote existing user to member or update member details"""
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
    
    # Check if already a member/has membership_id
    if user.get("membership_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member"
        )

    # Validate membership type
    if member_data.membership_type not in ["standard", "premium"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Membership type must be 'standard' or 'premium'"
        )
    
    # Set max books based on membership type
    max_books = 10 if member_data.membership_type == "premium" else settings.MAX_BOOKS_PER_MEMBER
    
    membership_id = await generate_membership_id()
    
    update_data = {
        "role": "member", # Ensure role is member
        "phone": member_data.phone,
        "address": member_data.address,
        "membership_type": member_data.membership_type,
        "membership_id": membership_id,
        "membership_start": datetime.utcnow(),
        "membership_end": datetime.utcnow() + timedelta(days=365),
        "max_books_allowed": max_books,
        "is_active": True
    }
    
    await users_collection.update_one(
        {"_id": ObjectId(member_data.user_id)},
        {"$set": update_data}
    )
    
    return {
        "message": "User promoted to member successfully",
        "member_id": member_data.user_id,
        "membership_id": membership_id
    }

async def update_member(member_id: str, member_update: MemberUpdate):
    """Update member details (maps to updating user)"""
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
    
    # Update user directly since member data is in users_collection
    result = await users_collection.update_one(
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
    
    # Search in users collection where role is member
    member_query = {
        "role": "member",
        "$or": [
             {"membership_id": {"$regex": query, "$options": "i"}},
             {"phone": {"$regex": query, "$options": "i"}},
             {"email": {"$regex": query, "$options": "i"}},
             {"full_name": {"$regex": query, "$options": "i"}}
        ]
    }
    
    total = await users_collection.count_documents(member_query)
    
    members = []
    cursor = users_collection.find(member_query).skip(skip).limit(page_size)
    async for member in cursor:
        member_dict = member.copy()
        member_dict["id"] = str(member_dict.pop("_id"))
        member_dict["user_id"] = member_dict["id"]
        member_dict["user_details"] = {
            "email": member_dict.get("email"),
            "full_name": member_dict.get("full_name")
        }
        members.append(member_dict)
    
    return {
        "members": members,
        "total": total,
        "page": page,
        "page_size": page_size
    }

async def get_member_profile(member_id: str):
    """Get member profile by ID"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    member = await users_collection.find_one({"_id": ObjectId(member_id), "role": "member"})
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    member_dict = member.copy()
    member_dict["id"] = str(member_dict.pop("_id"))
    member_dict["user_id"] = member_dict["id"]
    member_dict["user_details"] = {
        "email": member_dict.get("email"),
        "full_name": member_dict.get("full_name"),
        "role": member_dict.get("role")
    }
    
    return member_dict

async def get_borrowing_history(member_id: str):
    """Get member's borrowing history"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    # Verify member exists
    member = await users_collection.find_one({"_id": ObjectId(member_id)})
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
