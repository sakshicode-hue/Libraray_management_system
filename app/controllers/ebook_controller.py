from app.cores.database import ebooks_collection, fs, users_collection
from fastapi import HTTPException, status, UploadFile
from fastapi.responses import StreamingResponse
from bson import ObjectId
from datetime import datetime
import io

async def list_ebooks(category: str = None):
    """List all e-books"""
    query = {}
    if category:
        query["category"] = category
    
    ebooks = []
    cursor = ebooks_collection.find(query).sort("upload_date", -1)
    async for ebook in cursor:
        ebook["id"] = str(ebook.pop("_id"))
        ebooks.append(ebook)
    
    return {
        "ebooks": ebooks,
        "total": len(ebooks)
    }

async def upload_ebook(
    title: str,
    author: str,
    category: str,
    file: UploadFile
):
    """Upload an e-book file using GridFS"""
    # Validate file format
    allowed_formats = ["pdf", "epub", "mobi"]
    file_extension = file.filename.split(".")[-1].lower()
    
    if file_extension not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format. Allowed: {', '.join(allowed_formats)}"
        )
    
    # Read file content
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    
    # Upload to GridFS
    file_id = await fs.upload_from_stream(
        file.filename,
        file_content,
        metadata={
            "title": title,
            "author": author,
            "category": category,
            "content_type": file.content_type
        }
    )
    
    # Create e-book record
    ebook_doc = {
        "title": title,
        "author": author,
        "file_id": str(file_id),
        "format": file_extension,
        "size_mb": round(file_size_mb, 2),
        "category": category,
        "upload_date": datetime.utcnow()
    }
    
    result = await ebooks_collection.insert_one(ebook_doc)
    
    return {
        "message": "E-book uploaded successfully",
        "ebook_id": str(result.inserted_id),
        "file_size_mb": ebook_doc["size_mb"]
    }

async def download_ebook(ebook_id: str):
    """Download an e-book file"""
    if not ObjectId.is_valid(ebook_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid e-book ID"
        )
    
    ebook = await ebooks_collection.find_one({"_id": ObjectId(ebook_id)})
    if not ebook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="E-book not found"
        )
    
    # Download from GridFS
    try:
        grid_out = await fs.open_download_stream(ObjectId(ebook["file_id"]))
        file_content = await grid_out.read()
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(file_content),
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f"attachment; filename={ebook['title']}.{ebook['format']}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error downloading file"
        )


