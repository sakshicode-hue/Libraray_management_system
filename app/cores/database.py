from motor.motor_asyncio import AsyncIOMotorClient
from app.cores.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client["Library_Management_System"]

book_collection = db["Library_Management_System"]
