from app.cores.database import reservations_collection, books_collection, users_collection
from app.schemas.reservation_schema import ReservationCreate
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, timedelta

async def list_reservations(member_id: str = None, book_id: str = None):
    """List reservations with optional filters"""
    query = {"status": "active"}
    
    if member_id:
        if not ObjectId.is_valid(member_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid member ID"
            )
        query["member_id"] = member_id
    
    if book_id:
        if not ObjectId.is_valid(book_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid book ID"
            )
        query["book_id"] = book_id
    
    reservations = []
    cursor = reservations_collection.find(query).sort("reservation_date", 1)
    async for reservation in cursor:
        # Get book and member details
        book = await books_collection.find_one({"_id": ObjectId(reservation["book_id"])})
        member = await users_collection.find_one({"_id": ObjectId(reservation["member_id"])})
        
        reservation["id"] = str(reservation.pop("_id"))
        if book:
            reservation["book_details"] = {
                "title": book["title"],
                "author": book["author"]
            }
        if member:
            reservation["member_details"] = {
                "membership_id": member.get("membership_id")
            }
        reservations.append(reservation)
    
    return {
        "reservations": reservations,
        "total": len(reservations)
    }

async def create_reservation(reservation_data: ReservationCreate):
    """Create a new reservation"""
    # Validate IDs
    if not ObjectId.is_valid(reservation_data.member_id) or not ObjectId.is_valid(reservation_data.book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid member ID or book ID"
        )
    
    # Check if member exists
    member = await users_collection.find_one({"_id": ObjectId(reservation_data.member_id)})
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    # Check if book exists
    book = await books_collection.find_one({"_id": ObjectId(reservation_data.book_id)})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    # Check if member already has active reservation for this book
    existing = await reservations_collection.find_one({
        "member_id": reservation_data.member_id,
        "book_id": reservation_data.book_id,
        "status": "active"
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active reservation for this book"
        )
    
    # Calculate queue position
    queue_count = await reservations_collection.count_documents({
        "book_id": reservation_data.book_id,
        "status": "active"
    })
    
    reservation_doc = {
        **reservation_data.model_dump(),
        "reservation_date": datetime.utcnow(),
        "status": "active",
        "queue_position": queue_count + 1,
        "expiry_date": datetime.utcnow() + timedelta(days=7)  # 7 days to claim
    }
    
    result = await reservations_collection.insert_one(reservation_doc)
    
    return {
        "message": "Reservation created successfully",
        "reservation_id": str(result.inserted_id),
        "queue_position": reservation_doc["queue_position"]
    }

async def cancel_reservation(reservation_id: str):
    """Cancel a reservation"""
    if not ObjectId.is_valid(reservation_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reservation ID"
        )
    
    reservation = await reservations_collection.find_one({"_id": ObjectId(reservation_id)})
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    if reservation["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Reservation is already {reservation['status']}"
        )
    
    # Update reservation status
    await reservations_collection.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"status": "cancelled"}}
    )
    
    # Update queue positions for remaining reservations
    await reservations_collection.update_many(
        {
            "book_id": reservation["book_id"],
            "status": "active",
            "queue_position": {"$gt": reservation["queue_position"]}
        },
        {"$inc": {"queue_position": -1}}
    )
    
    return {"message": "Reservation cancelled successfully"}

async def get_reservation_queue(book_id: str):
    """Get reservation queue for a specific book"""
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
    
    queue = []
    cursor = reservations_collection.find({
        "book_id": book_id,
        "status": "active"
    }).sort("queue_position", 1)
    
    async for reservation in cursor:
        member = await users_collection.find_one({"_id": ObjectId(reservation["member_id"])})
        
        reservation["id"] = str(reservation.pop("_id"))
        if member:
            reservation["member_details"] = {
                "membership_id": member["membership_id"]
            }
        queue.append(reservation)
    
    return {
        "book_id": book_id,
        "book_title": book["title"],
        "queue": queue,
        "queue_length": len(queue)
    }
