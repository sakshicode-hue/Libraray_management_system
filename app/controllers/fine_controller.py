from app.cores.database import fines_collection, transactions_collection, users_collection
from app.schemas.fine_schema import PayFineRequest, WaiveFineRequest
from app.cores.config import settings
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime

async def list_fines(
    member_id: str = None,
    fine_status: str = None,
    page: int = 1,
    page_size: int = None
):
    """List fines with filters"""
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
    
    if fine_status:
        if fine_status not in ["pending", "paid", "waived"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be 'pending', 'paid', or 'waived'"
            )
        query["status"] = fine_status
    
    total = await fines_collection.count_documents(query)
    
    fines = []
    cursor = fines_collection.find(query).sort("created_at", -1).skip(skip).limit(page_size)
    async for fine in cursor:
        # Get member details
        member = await users_collection.find_one({"_id": ObjectId(fine["member_id"])})
        
        fine["id"] = str(fine.pop("_id"))
        if member:
            fine["member_details"] = {
                "membership_id": member["membership_id"]
            }
        fines.append(fine)
    
    return {
        "fines": fines,
        "total": total,
        "page": page,
        "page_size": page_size
    }

async def pay_fine(fine_id: str, payment_data: PayFineRequest):
    """Pay a fine"""
    if not ObjectId.is_valid(fine_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid fine ID"
        )
    
    fine = await fines_collection.find_one({"_id": ObjectId(fine_id)})
    if not fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fine not found"
        )
    
    if fine["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fine is already {fine['status']}"
        )
    
    # Update fine status
    await fines_collection.update_one(
        {"_id": ObjectId(fine_id)},
        {
            "$set": {
                "status": "paid",
                "paid_at": datetime.utcnow(),
                "payment_method": payment_data.payment_method,
                "payment_reference": payment_data.payment_reference
            }
        }
    )
    
    return {
        "message": "Fine paid successfully",
        "fine_id": fine_id,
        "amount": fine["amount"]
    }

async def waive_fine(fine_id: str, waive_data: WaiveFineRequest):
    """Waive a fine (admin only)"""
    if not ObjectId.is_valid(fine_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid fine ID"
        )
    
    fine = await fines_collection.find_one({"_id": ObjectId(fine_id)})
    if not fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fine not found"
        )
    
    if fine["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fine is already {fine['status']}"
        )
    
    # Update fine status
    await fines_collection.update_one(
        {"_id": ObjectId(fine_id)},
        {
            "$set": {
                "status": "waived",
                "waived_at": datetime.utcnow(),
                "waive_reason": waive_data.reason
            }
        }
    )
    
    return {
        "message": "Fine waived successfully",
        "fine_id": fine_id,
        "amount": fine["amount"]
    }

async def get_fine_summary(member_id: str = None):
    """Get fine summary statistics"""
    query = {}
    if member_id:
        if not ObjectId.is_valid(member_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid member ID"
            )
        query["member_id"] = member_id
    
    # Aggregate fines by status
    total_fines = await fines_collection.count_documents(query)
    
    pending_fines = []
    paid_fines = []
    waived_fines = []
    
    async for fine in fines_collection.find(query):
        if fine["status"] == "pending":
            pending_fines.append(fine["amount"])
        elif fine["status"] == "paid":
            paid_fines.append(fine["amount"])
        elif fine["status"] == "waived":
            waived_fines.append(fine["amount"])
    
    return {
        "total_fines": total_fines,
        "total_amount": sum(pending_fines) + sum(paid_fines) + sum(waived_fines),
        "pending_amount": sum(pending_fines),
        "paid_amount": sum(paid_fines),
        "waived_amount": sum(waived_fines),
        "pending_count": len(pending_fines),
        "paid_count": len(paid_fines),
        "waived_count": len(waived_fines)
    }
