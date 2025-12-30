from fastapi import APIRouter, Depends, File, UploadFile, Form
from app.controllers.ebook_controller import list_ebooks, upload_ebook, download_ebook
from app.utils.auth import librarian_required, member_required, get_current_user
from typing import Optional

router = APIRouter(prefix="/ebooks", tags=["E-Books"])

@router.get("/")
async def fetch_ebooks(category: Optional[str] = None):
    """List all e-books"""
    return await list_ebooks(category)

@router.post("/upload", dependencies=[Depends(librarian_required)])
async def upload_new_ebook(
    title: str = Form(...),
    author: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload an e-book file (librarian/admin only)"""
    return await upload_ebook(title, author, category, file)

@router.get("/{ebook_id}/download", dependencies=[Depends(member_required)])
async def download_ebook_file(ebook_id: str):
    """Download an e-book file"""
    return await download_ebook(ebook_id)


