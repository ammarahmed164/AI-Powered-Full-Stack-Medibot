"""
Dashboard Stats Routes
======================
Get real-time statistics for the dashboard
"""

from fastapi import APIRouter, HTTPException
import httpx
from app.core.supabase_client import SUPABASE_URL, SUPABASE_KEY, supabase_headers

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats():
    """Get real-time dashboard statistics"""
    try:
        headers = supabase_headers({"Content-Type": "application/json", "Prefer": "return=representation"})

        async with httpx.AsyncClient() as client:
            # Get total users
            users_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/users?select=id",
                headers=headers
            )
            total_users = len(users_response.json()) if users_response.status_code == 200 else 0

            # Get active users (assuming is_active column exists)
            try:
                active_response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/users?select=id&is_active=eq.true",
                    headers=headers
                )
                active_users = len(active_response.json()) if active_response.status_code == 200 else total_users
            except:
                active_users = total_users

            # Get total consultations (chat sessions)
            sessions_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/chat_sessions?select=id",
                headers=headers
            )
            total_consultations = len(sessions_response.json()) if sessions_response.status_code == 200 else 0

            # Get today's consultations
            import datetime
            today_start = datetime.datetime.now().strftime("%Y-%m-%dT00:00:00")
            today_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/chat_sessions?select=id&created_at=gte.{today_start}",
                headers=headers
            )
            today_consultations = len(today_response.json()) if today_response.status_code == 200 else 0

            return {
                "total_users": total_users,
                "active_users": active_users,
                "total_consultations": total_consultations,
                "today_consultations": today_consultations,
                "success": True
            }

    except Exception as e:
        print(f"❌ Error fetching stats: {str(e)}")
        # Return zeros on error
        return {
            "total_users": 0,
            "active_users": 0,
            "total_consultations": 0,
            "today_consultations": 0,
            "success": False
        }
