# import asyncio
# import os
# import sys
# import random
# from datetime import datetime, timedelta
# from faker import Faker
# from motor.motor_asyncio import AsyncIOMotorClient
# from bson import ObjectId

# # Add current directory to path
# sys.path.append(os.getcwd())

# try:
#     from app.cores.config import settings
#     # Override settings to ensure we see what we are connecting to
# except Exception as e:
#     # Minimal settings fallback if import fails
#     class Settings:
#         MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sakshicode:Hue123456@cluster0.pqv4g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
#         FINE_PER_DAY = 5.0
#     settings = Settings()

# fake = Faker()

# async def seed_data():
#     client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
#     db = client["Library_Management_System"]
    
#     print("Connected to MongoDB. Starting database seed...")

    
#     # 1. Create Users & Members
#     users = []
#     members = []
#     print("Seeding Users and Members...")
#     for _ in range(10):
#         user_id = str(ObjectId())
#         email = fake.unique.email()
#         full_name = fake.name()
        
        
#         # Merge member data into user
#         user = {
#             "_id": user_id,
#             "email": email,
#             "full_name": full_name,
#             "password": "hashed_secret_password", # Mock hash
#             "role": "member",
#             "is_active": True,
#             "created_at": datetime.utcnow(),
#             # Merged Member Fields
#             "membership_id": fake.unique.bothify(text='MEM-#####'),
#             "phone": fake.phone_number(),
#             "address": fake.address(),
#             "membership_type": random.choice(["standard", "premium"]),
#             "membership_start": datetime.utcnow() - timedelta(days=random.randint(10, 365)),
#             "membership_end": datetime.utcnow() + timedelta(days=365),
#             "max_books_allowed": 5
#         }
#         users.append(user)
#         # Note: 'members' collection is removed, so we track 'member' objects just for linking transactions later
#         members.append(user) # We treat the user object as the member for linking purposes

#     if users:
#         await db.users.insert_many(users)
#         # await db.members.insert_many(members) # Removed
#     print(f"- Inserted {len(users)} users (merged members).")

#     # 2. Create Books
#     books = []
#     print("Seeding Books...")
#     categories = ["Fiction", "Non-Fiction", "Sci-Fi", "History", "Technology", "Biography"]
#     for i in range(20):
#         book_id = str(ObjectId())
#         total_copies = random.randint(1, 5)
        
#         book = {
#             "_id": book_id,
#             "title": fake.catch_phrase().title(),
#             "author": fake.name(),
#             "isbn": fake.unique.isbn13(),
#             "category": random.choice(categories),
#             "publisher": fake.company(),
#             "publication_year": random.randint(1980, 2024),
#             "total_copies": total_copies,
#             "available_copies": total_copies, # Initially all available
#             "description": fake.paragraph(),
#             "cover_image": f"https://placehold.co/400x600?text=Book+{i+1}",
#             "created_at": datetime.utcnow(),
#             "page_count": random.randint(100, 800),
#             "language": "en"
#         }
#         books.append(book)
    
#     if books:
#         await db.books.insert_many(books)
#     print(f"- Inserted {len(books)} books.")

#     # 3. Create Transactions (Borrowing)
#     transactions = []
#     print("Seeding Transactions...")
    
#     # Active borrows
#     for _ in range(15):
#         member = random.choice(members)
#         book = random.choice(books)
        
#         if book["available_copies"] > 0:
#             days_ago = random.randint(1, 20)
#             borrow_date = datetime.utcnow() - timedelta(days=days_ago)
#             due_date = borrow_date + timedelta(days=14)
            
#             txn = {
#                 "_id": str(ObjectId()),
#                 "member_id": member["_id"], # Link directly to user _id
#                 "book_id": book["_id"],
#                 "book_details": {"title": book["title"], "author": book["author"]}, # Snapshot
#                 "borrow_date": borrow_date,
#                 "due_date": due_date,
#                 "return_date": None,
#                 "status": "borrowed",
#                 "fine_amount": 0.0,
#                 "returned": False
#             }
#             transactions.append(txn)
            
#             # Update book availability
#             book["available_copies"] -= 1
#             await db.books.update_one({"_id": book["_id"]}, {"$set": {"available_copies": book["available_copies"]}})

#     # Overdue/Returned transactions
#     for _ in range(10):
#         member = random.choice(members)
#         book = random.choice(books)
        
#         borrow_date = datetime.utcnow() - timedelta(days=random.randint(30, 60))
#         due_date = borrow_date + timedelta(days=14)
#         return_date = due_date + timedelta(days=random.randint(1, 10)) # Returned late
        
#         # Calculate fine
#         overdue_days = (return_date - due_date).days
#         fine_amount = max(0, overdue_days * 5.0)

#         txn = {
#             "_id": str(ObjectId()),
#             "member_id": member["_id"],
#             "book_id": book["_id"],
#             "book_details": {"title": book["title"], "author": book["author"]},
#             "borrow_date": borrow_date,
#             "due_date": due_date,
#             "return_date": return_date,
#             "status": "returned",
#             "fine_amount": fine_amount,
#             "returned": True
#         }
#         transactions.append(txn)
        
#         # Create Fine record if fine > 0
#         if fine_amount > 0:
#             fine = {
#                 "_id": str(ObjectId()),
#                 "transaction_id": txn["_id"],
#                 "member_id": member["_id"],
#                 "amount": fine_amount,
#                 "reason": f"Overdue by {overdue_days} days",
#                 "status": "pending",
#                 "created_at": return_date
#             }
#             await db.fines.insert_one(fine)

#     if transactions:
#         await db.transactions.insert_many(transactions)
#     print(f"- Inserted {len(transactions)} transactions.")

#     # 4. Create Reservations
#     reservations = []
#     print("Seeding Reservations...")
#     for _ in range(5):
#         member = random.choice(members)
#         book = random.choice(books)
        
#         res = {
#             "_id": str(ObjectId()),
#             "member_id": member["_id"],
#             "book_id": book["_id"],
#             "reservation_date": datetime.utcnow(),
#             "status": "active",
#             "queue_position": 1,
#             "expiry_date": datetime.utcnow() + timedelta(days=7)
#         }
#         reservations.append(res)
    
#     if reservations:
#         await db.reservations.insert_many(reservations)
#     print(f"- Inserted {len(reservations)} reservations.")
    
#     # 5. Ebooks and Bookmarks
#     ebooks = []
#     print("Seeding Ebooks...")
#     for i in range(5):
#         ebook = {
#             "_id": str(ObjectId()),
#             "title": f"Digital Guide {i+1}",
#             "author": fake.name(),
#             "file_id": str(ObjectId()), # Mock gridfs id
#             "format": "pdf",
#             "size_mb": random.uniform(1.0, 15.0),
#             "category": "Education",
#             "upload_date": datetime.utcnow()
#         }
#         ebooks.append(ebook)
        
#         # Random bookmark for this ebook
#         if random.choice([True, False]):
#              bookmark = {
#                  "_id": str(ObjectId()),
#                  "user_id": random.choice(members)["_id"],
#                  "ebook_id": ebook["_id"],
#                  "page_number": random.randint(1, 50),
#                  "updated_at": datetime.utcnow()
#              }
#              await db.bookmarks.insert_one(bookmark)
             
#     if ebooks:
#         await db.ebooks.insert_many(ebooks)
#     print(f"- Inserted {len(ebooks)} ebooks.")

#     # 6. System Settings
#     settings_data = [
#         {"key": "library_name", "value": "Central City Library", "description": "Name of the library"},
#         {"key": "fine_per_day", "value": "5.0", "description": "Fine amount per day in currency"},
#         {"key": "max_books_per_user", "value": "5", "description": "Maximum books a user can borrow"}
#     ]
#     # Use update_one with upsert to avoid duplicates if re-running
#     for s in settings_data:
#         await db.system_settings.update_one(
#             {"key": s["key"]}, 
#             {"$set": s}, 
#             upsert=True
#         )
#     print("- Inserted System Settings.")

#     print("Database seed completed successfully!")

# if __name__ == "__main__":
#     asyncio.run(seed_data())
