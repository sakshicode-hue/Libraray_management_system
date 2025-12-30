
import asyncio
from app.cores.database import users_collection
from app.main import app  # Import app to initialize db connection if needed

async def list_users():
    cursor = users_collection.find({})
    users = []
    async for user in cursor:
        print(f"User: {user.get('email')}, Role: {user.get('role')}, ID: {user.get('_id')}")
        users.append(user)
    
    if not users:
        print("No users found.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(list_users())
