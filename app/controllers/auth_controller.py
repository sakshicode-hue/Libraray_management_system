from app.cores.database import users_collection
from app.schemas.auth_schema import UserRegister, UserLogin
from app.utils.utils import hash_password, verify_password, create_access_token, generate_reset_token
from fastapi import HTTPException, status
from datetime import datetime
from bson import ObjectId

# In-memory storage for reset tokens (in production, use Redis or database)
reset_tokens = {}

async def register_user(user_data: UserRegister):
    """Register a new user"""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate role
    valid_roles = ["admin", "librarian", "member"]
    if user_data.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )
    
    # Create user document
    user_doc = {
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "role": user_data.role,
        "phone": user_data.phone,
        "address": user_data.address,
        "membership_type": user_data.membership_type,
        "membership_start": datetime.utcnow() if user_data.role == "member" else None,
        "max_books_allowed": 5, # Default
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

async def login_user(login_data: UserLogin):
    """Authenticate user and return JWT token"""
    # Find user by email
    user = await users_collection.find_one({"email": login_data.email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "phone": user.get("phone"),
            "address": user.get("address"),
            "membership_type": user.get("membership_type")
        }
    }

async def logout_user():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

async def forgot_password(email: str):
    """Generate password reset token and send email"""
    user = await users_collection.find_one({"email": email})
    
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    reset_tokens[reset_token] = {
        "user_id": str(user["_id"]),
        "expires_at": datetime.utcnow().timestamp() + 3600  # 1 hour expiry
    }
    
    # TODO: Send email with reset token
    # For now, just return the token (in production, send via email)
    
    return {
        "message": "If the email exists, a reset link has been sent",
        "reset_token": reset_token  # Remove this in production
    }

async def reset_password(token: str, new_password: str):
    """Reset password using reset token"""
    if token not in reset_tokens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    token_data = reset_tokens[token]
    
    # Check if token expired
    if datetime.utcnow().timestamp() > token_data["expires_at"]:
        del reset_tokens[token]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    
    # Update password
    new_hash = hash_password(new_password)
    await users_collection.update_one(
        {"_id": ObjectId(token_data["user_id"])},
        {"$set": {"password_hash": new_hash}}
    )
    
    # Remove used token
    del reset_tokens[token]
    
    return {"message": "Password reset successfully"}

async def get_user_roles():
    """Get available user roles"""
    return {
        "roles": ["admin", "librarian", "member"]
    }
