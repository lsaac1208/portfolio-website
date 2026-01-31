from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100, description="密码，最少8位")


class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None


class UserResponse(UserBase):
    id: int
    name: Optional[str]
    bio: Optional[str]
    image: Optional[str]
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None
