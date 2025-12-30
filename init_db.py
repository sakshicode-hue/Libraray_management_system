import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def test_connection():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")
    print(f"Testing connection to: {mongo_uri[:20]}...")
    
    try:
        client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Try to command ping
        await client.admin.command('ping')
        print("MongoDB connection successful!")
        
        db = client["Library_Management_System"]
        
        # Create Indexes (The Schema for MongoDB)
        print("Creating indexes...")
        
        # User indexes
        await db.users.create_index("email", unique=True)
        print("- User email index created")
        
        # Book indexes
        await db.books.create_index("isbn", unique=True)
        await db.books.create_index([("title", "text"), ("author", "text"), ("category", "text")])
        print("- Book indexes created")
        
        # Transaction indexes
        await db.transactions.create_index("member_id")
        await db.transactions.create_index("book_id")
        print("- Transaction indexes created")

        # Member indexes
        await db.members.create_index("email", unique=True)
        print("- Member indexes created")

        # Fine indexes
        await db.fines.create_index("member_id")
        await db.fines.create_index("status")
        print("- Fine indexes created")

        # Reservation indexes
        await db.reservations.create_index("member_id")
        await db.reservations.create_index("book_id")
        await db.reservations.create_index("status")
        print("- Reservation indexes created")

        # Ebook indexes
        await db.ebooks.create_index("title")
        await db.ebooks.create_index("author")
        print("- Ebook indexes created")

        # Bookmark indexes
        await db.bookmarks.create_index("user_id")
        print("- Bookmark indexes created")
        
        # System Settings (Ensure exists by creating a dummy index or just checking)
        await db.system_settings.create_index("key", unique=True)
        print("- System Settings indexes created")
        
        print("Database initialized successfully!")
        
    except Exception as e:
        print("ERROR: Connection failed")
        print(f"Details: {str(e)}")
        print("\nCommon issues:")
        print("1. IP Whitelist: Check MongoDB Atlas -> Network Access (Allow 0.0.0.0/0 for testing)")
        print("2. Password: Ensure '<password>' is replaced with actual password in .env")
        print("3. Special Characters: If your password has @, :, etc., you must URL encode them.")

if __name__ == "__main__":
    asyncio.run(test_connection())
