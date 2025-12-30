
import asyncio
from app.cores.database import users_collection
from app.cores.config import settings

async def promote_users():
    print(f"Connecting to MongoDB at: {settings.MONGO_URI}")
    
    # Update users
    result = await users_collection.update_many(
        {},
        {"$set": {"role": "admin"}}
    )
    print(f"Promoted {result.modified_count} users to admin.")
    
    # List users to verify
    cursor = users_collection.find({})
    async for user in cursor:
        print(f"Verified User: {user.get('email')} -> Role: {user.get('role')}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(promote_users())
