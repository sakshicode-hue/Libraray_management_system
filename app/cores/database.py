from motor.motor_asyncio import AsyncIOMotorClient
import motor.motor_asyncio
from app.cores.config import settings

# MongoDB Client
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client["Library_Management_System"]

# Collections
users_collection = db["users"]
books_collection = db["books"]
transactions_collection = db["transactions"]
fines_collection = db["fines"]
reservations_collection = db["reservations"]
ebooks_collection = db["ebooks"]

system_settings_collection = db["system_settings"]

# GridFS for e-book file storage
fs = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db)
