from app.cores.database import transactions_collection, books_collection, users_collection, fines_collection
from app.schemas.transaction_schema import BorrowRequest, ReturnRequest
from app.utils.utils import calculate_fine
from app.cores.config import settings
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, timedelta

async def borrow_book(borrow_data: BorrowRequest):
    """Borrow a book"""
    # Validate IDs
    if not ObjectId.is_valid(borrow_data.member_id) or not ObjectId.is_valid(borrow_data.book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID or book ID"
        )
    
    # Check member eligibility
    eligibility = await check_member_eligibility(borrow_data.member_id)
    if not eligibility["is_eligible"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=eligibility["reason"]
        )
    
    # Check book availability
    book = await books_collection.find_one({"_id": ObjectId(borrow_data.book_id)})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    if book["available_copies"] <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book is not available"
        )
    
    # Create transaction
    transaction_doc = {
        "member_id": borrow_data.member_id,
        "book_id": borrow_data.book_id,
        "borrow_date": datetime.utcnow(),
        "due_date": datetime.utcnow() + timedelta(days=settings.LOAN_PERIOD_DAYS),
        "return_date": None,
        "status": "borrowed",
        "fine_amount": 0.0
    }
    
    result = await transactions_collection.insert_one(transaction_doc)
    
    # Update book availability
    await books_collection.update_one(
        {"_id": ObjectId(borrow_data.book_id)},
        {"$inc": {"available_copies": -1}}
    )
    
    return {
        "message": "Book borrowed successfully",
        "transaction_id": str(result.inserted_id),
        "due_date": transaction_doc["due_date"]
    }

async def return_book(return_data: ReturnRequest):
    """Return a borrowed book"""
    if not ObjectId.is_valid(return_data.transaction_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid transaction ID"
        )
    
    # Get transaction
    transaction = await transactions_collection.find_one({"_id": ObjectId(return_data.transaction_id)})
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    if transaction["status"] == "returned":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book already returned"
        )
    
    # Calculate fine if overdue
    return_date = datetime.utcnow()
    fine_amount = calculate_fine(transaction["due_date"], return_date)
    
    # Update transaction
    await transactions_collection.update_one(
        {"_id": ObjectId(return_data.transaction_id)},
        {
            "$set": {
                "return_date": return_date,
                "status": "returned",
                "fine_amount": fine_amount
            }
        }
    )
    
    # Update book availability
    await books_collection.update_one(
        {"_id": ObjectId(transaction["book_id"])},
        {"$inc": {"available_copies": 1}}
    )
    
    # Create fine record if applicable
    if fine_amount > 0:
        fine_doc = {
            "transaction_id": return_data.transaction_id,
            "member_id": transaction["member_id"],
            "amount": fine_amount,
            "reason": "Overdue return",
            "status": "pending",
            "created_at": datetime.utcnow(),
            "paid_at": None
        }
        await fines_collection.insert_one(fine_doc)
    
    return {
        "message": "Book returned successfully",
        "fine_amount": fine_amount,
        "return_date": return_date
    }

async def get_transaction_history(
    member_id: str = None,
    page: int = 1,
    page_size: int = None
):
    """Get transaction history"""
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    page_size = min(page_size, settings.MAX_PAGE_SIZE)
    skip = (page - 1) * page_size
    
    query = {}
    if member_id:
        if not ObjectId.is_valid(member_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid member ID"
            )
        query["member_id"] = member_id
    
    total = await transactions_collection.count_documents(query)
    
    transactions = []
    cursor = transactions_collection.find(query).sort("borrow_date", -1).skip(skip).limit(page_size)
    async for transaction in cursor:
        # Get book details
        book = await books_collection.find_one({"_id": ObjectId(transaction["book_id"])})
        
        transaction["id"] = str(transaction.pop("_id"))
        if book:
            transaction["book_details"] = {
                "title": book["title"],
                "author": book["author"]
            }
        transactions.append(transaction)
    
    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "page_size": page_size
    }

async def get_overdue_transactions():
    """Get all overdue transactions"""
    current_date = datetime.utcnow()
    
    query = {
        "status": "borrowed",
        "due_date": {"$lt": current_date}
    }
    
    transactions = []
    cursor = transactions_collection.find(query).sort("due_date", 1)
    async for transaction in cursor:
        # Get member and book details
        member = await users_collection.find_one({"_id": ObjectId(transaction["member_id"])})
        book = await books_collection.find_one({"_id": ObjectId(transaction["book_id"])})
        
        # Calculate current fine
        current_fine = calculate_fine(transaction["due_date"], current_date)
        
        transaction["id"] = str(transaction.pop("_id"))
        transaction["current_fine"] = current_fine
        transaction["days_overdue"] = (current_date - transaction["due_date"]).days
        
        if member:
            transaction["member_details"] = {
                "membership_id": member["membership_id"]
            }
        if book:
            transaction["book_details"] = {
                "title": book["title"],
                "author": book["author"]
            }
        
        transactions.append(transaction)
    
    return {
        "overdue_transactions": transactions,
        "total": len(transactions)
    }

async def search_available_books(search: str = None, category: str = None):
    """Search for available books"""
    query = {"available_copies": {"$gt": 0}}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"author": {"$regex": search, "$options": "i"}}
        ]
    
    if category:
        query["category"] = category
    
    books = []
    cursor = books_collection.find(query)
    async for book in cursor:
        book["id"] = str(book.pop("_id"))
        books.append(book)
    
    return {
        "available_books": books,
        "total": len(books)
    }

async def check_member_eligibility(member_id: str):
    """Check if member is eligible to borrow books"""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID"
        )
    
    # Get member
    member = await users_collection.find_one({"_id": ObjectId(member_id)})
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    # Check if member is active
    if not member.get("is_active", False):
        return {
            "member_id": member_id,
            "is_eligible": False,
            "reason": "Member account is inactive",
            "current_books_borrowed": 0,
            "max_books_allowed": member["max_books_allowed"],
            "pending_fines": 0.0
        }
    
    # Check membership expiry
    if member["membership_end"] < datetime.utcnow():
        return {
            "member_id": member_id,
            "is_eligible": False,
            "reason": "Membership has expired",
            "current_books_borrowed": 0,
            "max_books_allowed": member["max_books_allowed"],
            "pending_fines": 0.0
        }
    
    # Count current borrowed books
    current_borrowed = await transactions_collection.count_documents({
        "member_id": member_id,
        "status": "borrowed"
    })
    
    # Check book limit
    if current_borrowed >= member["max_books_allowed"]:
        return {
            "member_id": member_id,
            "is_eligible": False,
            "reason": f"Maximum book limit reached ({member['max_books_allowed']} books)",
            "current_books_borrowed": current_borrowed,
            "max_books_allowed": member["max_books_allowed"],
            "pending_fines": 0.0
        }
    
    # Check pending fines
    pending_fines_cursor = fines_collection.find({
        "member_id": member_id,
        "status": "pending"
    })
    
    total_pending_fines = 0.0
    async for fine in pending_fines_cursor:
        total_pending_fines += fine["amount"]
    
    if total_pending_fines > 0:
        return {
            "member_id": member_id,
            "is_eligible": False,
            "reason": f"Pending fines: ${total_pending_fines:.2f}. Please clear fines before borrowing.",
            "current_books_borrowed": current_borrowed,
            "max_books_allowed": member["max_books_allowed"],
            "pending_fines": total_pending_fines
        }
    
    # Member is eligible
    return {
        "member_id": member_id,
        "is_eligible": True,
        "reason": None,
        "current_books_borrowed": current_borrowed,
        "max_books_allowed": member["max_books_allowed"],
        "pending_fines": 0.0
    }
