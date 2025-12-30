
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import random
import string
from datetime import datetime, timedelta

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/Library_Management_System")

async def generate_membership_id(collection):
    while True:
        random_part = ''.join(random.choices(string.digits, k=6))
        membership_id = f"MEM-{random_part}"
        existing = await collection.find_one({"membership_id": membership_id})
        if not existing:
            return membership_id

async def seed_members():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.get_database()
    users_coll = db.users
    members_coll = db.members
    
    print("Fetching users...")
    users = await users_coll.find({}).to_list(None)
    print(f"Found {len(users)} users.")
    
    count = 0
    for user in users:
        user_id = user["_id"]
        # Check if member exists
        existing = await members_coll.find_one({"user_id": str(user_id)})
        if existing:
            print(f"Member already exists for user: {user.get('email')}")
            continue
            
        print(f"Creating member for: {user.get('email')}")
        
        member_doc = {
            "user_id": str(user_id),
            "phone": "+1 555-0100", # Mock data
            "address": "123 Library Lane", # Mock data
            "membership_type": "premium" if user.get("role") == "admin" else "standard",
            "membership_id": await generate_membership_id(members_coll),
            "membership_start": datetime.utcnow(),
            "membership_end": datetime.utcnow() + timedelta(days=365),
            "max_books_allowed": 10,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        
        await members_coll.insert_one(member_doc)
        count += 1
        
    print(f"Successfully created {count} new member profiles.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_members())
