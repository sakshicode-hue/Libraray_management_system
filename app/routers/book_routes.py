from fastapi import APIRouter
from app.controllers.book_controller import add_book, get_books
from app.schemas.book_schema import BookCreate

router = APIRouter(prefix="/books", tags=["Books"])

@router.post("/")
async def create_book(book: BookCreate):
    return await add_book(book)

@router.get("/")
async def fetch_books():
    return await get_books()
