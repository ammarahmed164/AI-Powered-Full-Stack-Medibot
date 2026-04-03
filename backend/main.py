"""
MediBot Backend - Simple & Working
===================================
Uses Supabase REST API directly (no SDK needed)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from passlib.context import CryptContext
import httpx
import uvicorn

# ============================================
# Configuration
# ============================================
SUPABASE_URL = "https://jqajcavffgdmoniqobpz.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_5IaQMCqZ0e_o5QRVb9O7Xw_94lHOfL8"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI(title="MediBot", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Models
# ============================================
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = ""

class RegisterResponse(BaseModel):
    message: str
    user: dict

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    role: str
    is_active: bool

# ============================================
# Supabase Helper Functions
# ============================================
async def supabase_insert(table: str, data: dict):
    """Insert data into Supabase table"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            json=data,
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        )
        if response.status_code != 201:
            raise Exception(f"Supabase error: {response.text}")
        return response.json()

async def supabase_select(table: str, column: str, value: str):
    """Select data from Supabase table"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{value}",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
            }
        )
        if response.status_code != 200:
            raise Exception(f"Supabase error: {response.text}")
        return response.json()

async def supabase_select_all(table: str):
    """Select all data from Supabase table"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
            }
        )
        if response.status_code != 200:
            raise Exception(f"Supabase error: {response.text}")
        return response.json()

# ============================================
# API Routes
# ============================================

@app.get("/")
async def root():
    return {
        "message": "MediBot Backend is Running!",
        "status": "OK",
        "database": "Supabase PostgreSQL"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MediBot"}

@app.post("/api/v1/auth/register", response_model=RegisterResponse, status_code=201)
async def register_user(data: RegisterRequest):
    """Register a new user - Saves to Supabase"""
    
    print(f"\n{'='*60}")
    print(f"📝 REGISTRATION REQUEST: {data.email}")
    print(f"{'='*60}\n")
    
    try:
        # Check if email exists
        existing_users = await supabase_select("users", "email", data.email)
        
        if existing_users and len(existing_users) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        password_hash = pwd_context.hash(data.password)
        
        # Prepare user data
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
        
        print(f"✅ USER SAVED TO SUPabase!")
        print(f"  ID: {new_user.get('id', 'N/A')}")
        print(f"  Email: {new_user['email']}")
        print(f"  Name: {new_user['full_name']}\n")
        
        return RegisterResponse(
            message="User registered successfully!",
            user={
                "id": new_user.get('id', 'unknown'),
                "email": new_user['email'],
                "full_name": new_user['full_name'],
                "phone": new_user.get('phone'),
                "is_active": new_user.get('is_active', True)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/v1/auth/login", response_model=LoginResponse)
async def login_user(data: LoginRequest):
    """Login user - checks both users and admin_users tables"""

    print(f"\n🔐 LOGIN REQUEST: {data.email}\n")

    try:
        # First check admin_users table
        try:
            admin_users = await supabase_select("admin_users", "email", data.email)
            
            if admin_users and len(admin_users) > 0:
                admin = admin_users[0]
                
                # Verify password for admin
                if pwd_context.verify(data.password, admin['password_hash']):
                    if not admin.get('is_active', True):
                        raise HTTPException(status_code=403, detail="User account is deactivated")
                    
                    access_token = f"admin_jwt_{admin['id']}_{datetime.now().timestamp()}"
                    
                    print(f"✅ ADMIN LOGIN SUCCESSFUL!\n")
                    
                    return LoginResponse(
                        message="Admin login successful",
                        access_token=access_token,
                        user={
                            "id": admin.get('id', 'unknown'),
                            "email": admin['email'],
                            "full_name": admin['full_name'],
                            "role": admin.get('role', 'admin')
                        }
                    )
        except:
            pass  # Ignore admin_users table errors, check users table
        
        # Check regular users table
        users = await supabase_select("users", "email", data.email)

        if not users or len(users) == 0:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user = users[0]

        if not pwd_context.verify(data.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user.get('is_active', True):
            raise HTTPException(status_code=403, detail="User account is deactivated")

        access_token = f"jwt_{user['id']}_{datetime.now().timestamp()}"

        print(f"✅ USER LOGIN SUCCESSFUL!\n")

        return LoginResponse(
            message="Login successful",
            access_token=access_token,
            user={
                "id": user.get('id', 'unknown'),
                "email": user['email'],
                "full_name": user['full_name'],
                "role": user.get('role', 'patient')
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/api/v1/users", response_model=List[UserResponse])
async def get_all_users():
    """Get all users (for admin)"""
    try:
        users = await supabase_select_all("users")
        return [
            UserResponse(
                id=u.get('id', 'unknown'),
                email=u['email'],
                full_name=u['full_name'],
                phone=u.get('phone'),
                role=u.get('role', 'patient'),
                is_active=u.get('is_active', True)
            )
            for u in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/admin/login", response_model=LoginResponse)
async def admin_login(data: LoginRequest):
    """Admin login"""
    
    ADMIN_EMAIL = "admin@medibot.com"
    ADMIN_PASSWORD = "Admin@123"
    
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        return LoginResponse(
            message="Admin login successful",
            access_token="admin_token_12345",
            user={
                "id": "admin",
                "email": ADMIN_EMAIL,
                "full_name": "System Administrator",
                "role": "admin"
            }
        )
    
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

# ============================================
# Main
# ============================================
if __name__ == "__main__":
    print("\n" + "="*60)
    print("  🚀 MediBot Backend Starting...")
    print("="*60)
    print()
    print("  Database: Supabase PostgreSQL")
    print(f"  URL: {SUPABASE_URL}")
    print()
    print("  Server: http://localhost:8000")
    print("  API Docs: http://localhost:8000/docs")
    print()
    print("  Ready for registrations!")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
