"""
MediBot Backend - Main Application
===================================
AI-Powered Healthcare Chatbot API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

# Import routes
from app.api.v1.routes import auth, chat, history, upload, dashboard, users

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# -------------------------------------------
# Lifespan Context Manager
# -------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("\n" + "="*60)
    print("  🚀 MediBot API Starting...")
    print("="*60)
    print("\n  Services:")
    print("    ✅ Authentication")
    print("    ✅ NLP Chatbot")
    print("    ✅ Supabase Database")
    print("\n  Endpoints:")
    print("    http://localhost:8000")
    print("    http://localhost:8000/docs")
    print("\n" + "="*60 + "\n")
    yield
    # Shutdown
    print("\n👋 MediBot API Shutting Down...\n")

# -------------------------------------------
# FastAPI Application
# -------------------------------------------
app = FastAPI(
    title="MediBot",
    description="AI-Powered Healthcare Chatbot",
    version="1.0.0",
    lifespan=lifespan
)

# -------------------------------------------
# Middleware
# -------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------
# API Routes
# -------------------------------------------
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat & Consultation"])
app.include_router(history.router, prefix="/api/v1/history", tags=["Chat History"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["File Upload"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard Stats"])
app.include_router(users.router, prefix="/api/v1/users", tags=["User Management"])

# -------------------------------------------
# Root Endpoint
# -------------------------------------------
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "MediBot",
        "version": "1.0.0",
        "description": "AI-Powered Healthcare Chatbot",
        "status": "Running",
        "docs": "/docs"
    }

# -------------------------------------------
# Health Check
# -------------------------------------------
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "MediBot",
        "version": "1.0.0"
    }

# -------------------------------------------
# Main Execution
# -------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
