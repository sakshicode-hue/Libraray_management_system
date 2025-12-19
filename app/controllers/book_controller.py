from app.cores.database import book_collection
from app.schemas.book_schema import BookCreate

async def add_book(book: BookCreate):
    await book_collection.insert_one(book.dict())
    return {"message": "Book added successfully"}

async def get_books():
    books = []
    async for book in book_collection.find():
        book["_id"] = str(book["_id"])
        books.append(book)
    return books
