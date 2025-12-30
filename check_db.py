import asyncio
import os
import sys

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from motor.motor_asyncio import AsyncIOMotorClient
try:
    from app.cores.config import settings
    # Override settings to ensure we see what we are connecting to
    # print(f"URI from settings: {settings.MONGO_URI}")
except Exception as e:
    print(f"Could not import settings: {e}")
    # Fallback or exit
    sys.exit(1)

async def main():
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        # Force a connection check
        await client.admin.command('ping')
        print("Ping successful. Connected to MongoDB.")
        
        db_name = "Library_Management_System" 
        # Note: The database.py hardcodes this name: db = client["Library_Management_System"]
        
        db = client[db_name]
        collections = await db.list_collection_names()
        
        print(f"Database: {db_name}")
        print(f"Number of collections: {len(collections)}")
        print("Collections found:")
        for col in sorted(collections):
            print(f"- {col}")
            
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
