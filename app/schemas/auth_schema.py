from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = "member"  # Default role
    # Extended fields for members
    phone: Optional[str] = None
    address: Optional[str] = None
    membership_type: str = "standard"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    membership_type: Optional[str] = None
    is_active: bool
    created_at: datetime

class RoleResponse(BaseModel):
    roles: list[str]
