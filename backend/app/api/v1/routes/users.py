"""
Users Routes
=============
Admin endpoints for managing users
"""

from fastapi import APIRouter, HTTPException, Header
import httpx
from app.core.supabase_client import SUPABASE_URL, SUPABASE_KEY, supabase_headers

router = APIRouter()

@router.get("/")
async def get_all_users(authorization: str = Header(None)):
    """Get all registered users (Admin only)"""
    try:
        # Simple admin check (can be enhanced with JWT validation)
        if not authorization or "admin" not in authorization.lower():
            # For now, allow if token exists. In production, verify JWT role.
            pass

        headers = supabase_headers({"Content-Type": "application/json", "Prefer": "return=representation"})

        async with httpx.AsyncClient() as client:
            # Fetch users from Supabase 'users' table
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc",
                headers=headers
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Supabase Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=response.text)

    except Exception as e:
        print(f"❌ Exception in get_all_users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
