from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.cores.config import settings
import secrets
import string

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password.encode('utf-8')[:72])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password.encode('utf-8')[:72], hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def generate_reset_token() -> str:
    """Generate a random token for password reset"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(32))

def calculate_fine(due_date: datetime, return_date: datetime = None) -> float:
    """Calculate fine based on overdue days"""
    if return_date is None:
        return_date = datetime.utcnow()
    
    if return_date <= due_date:
        return 0.0
    
    overdue_days = (return_date - due_date).days
    return overdue_days * settings.FINE_PER_DAY

async def send_notification(user_id: str, message: str):
    """
    Send a notification to the user.
    For this MVP, we will print to console/log.
    """
    print(f"--- NOTIFICATION FOR {user_id} ---")
    print(message)
    print("-----------------------------------")
