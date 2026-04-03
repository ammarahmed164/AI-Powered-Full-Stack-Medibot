"""
Authentication Routes
======================
User registration and login
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from passlib.context import CryptContext
import httpx

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Supabase Configuration
import os
SUPABASE_URL = "https://jqajcavffgdmoniqobpz.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_5IaQMCqZ0e_o5QRVb9O7Xw_94lHOfL8")

# Request/Response Models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str

class TokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Helper Functions
async def supabase_insert(table: str, data: dict):
    """Insert data into Supabase table"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            json=data,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        )
        if response.status_code not in [200, 201]:
            raise Exception(f"Supabase error: {response.text}")
        return response.json()

async def supabase_select(table: str, column: str, value: str):
    """Select data from Supabase table"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{value}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            }
        )
        if response.status_code != 200:
            raise Exception(f"Supabase error: {response.text}")
        return response.json()

# Routes
@router.post("/register", response_model=dict)
async def register(data: RegisterRequest):
    """Register a new user"""
    try:
        # Check if email exists
        existing_users = await supabase_select("users", "email", data.email)
        
        if existing_users and len(existing_users) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        password_hash = pwd_context.hash(data.password)
        
        # Create user data
        user_data = {
            "email": data.email,
            "password_hash": password_hash,
            "full_name": data.full_name,
            "phone": data.phone,
            "role": "patient",
            "is_active": True
        }
        
        # Insert into Supabase
        result = await supabase_insert("users", user_data)
        new_user = result[0] if isinstance(result, list) else result
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": new_user.get('id', 'unknown'),
                "email": new_user['email'],
                "full_name": new_user['full_name'],
                "role": new_user.get('role', 'patient')
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Registration Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """Login user"""
    try:
        # First check admin_users table
        try:
            admin_users = await supabase_select("admin_users", "email", data.email)
            
            if admin_users and len(admin_users) > 0:
                admin = admin_users[0]
                
                if pwd_context.verify(data.password, admin['password_hash']):
                    if not admin.get('is_active', True):
                        raise HTTPException(status_code=403, detail="User account is deactivated")
                    
                    return TokenResponse(
                        message="Admin login successful",
                        access_token=f"admin_jwt_{admin['id']}",
                        user=UserResponse(
                            id=admin.get('id', 'unknown'),
                            email=admin['email'],
                            full_name=admin['full_name'],
                            role=admin.get('role', 'admin')
                        )
                    )
        except:
            pass
        
        # Check regular users table
        users = await supabase_select("users", "email", data.email)
        
        if not users or len(users) == 0:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = users[0]
        
        if not pwd_context.verify(data.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not user.get('is_active', True):
            raise HTTPException(status_code=403, detail="User account is deactivated")
        
        return TokenResponse(
            message="Login successful",
            access_token=f"jwt_{user['id']}",
            user=UserResponse(
                id=user.get('id', 'unknown'),
                email=user['email'],
                full_name=user['full_name'],
                role=user.get('role', 'patient')
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
