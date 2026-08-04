"""
Chat History Routes
====================
Save and retrieve chat history
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx
from app.core.supabase_client import SUPABASE_URL, SUPABASE_KEY, supabase_headers

router = APIRouter()

class ChatMessage(BaseModel):
    sender_type: str  # 'user' or 'bot'
    content: str

class ChatSession(BaseModel):
    user_id: str
    session_name: Optional[str] = None
    messages: List[ChatMessage] = []

# Save chat session
@router.post("/sessions")
async def save_session(session: ChatSession):
    """Save chat session to database"""
    print(f"\n=== SAVE SESSION REQUEST ===")
    print(f"User ID: {session.user_id}")
    print(f"Session Name: {session.session_name}")
    print(f"Messages: {len(session.messages)}")

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Supabase not configured — skipping chat history persist (chat still works).")
        return {"success": False, "skipped": True, "reason": "history_backend_not_configured"}
    
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        # Create session
        session_data = {
            "user_id": session.user_id,
            "session_name": session.session_name or f"Chat {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        }
        
        print(f"Supabase URL: {SUPABASE_URL}")
        print(f"Session Data: {session_data}")

        async with httpx.AsyncClient() as client:
            # Insert session
            print("Inserting session to Supabase...")
            response = await client.post(
                f"{SUPABASE_URL}/rest/v1/chat_sessions",
                headers=headers,
                json=session_data
            )

            print(f"Session Response Status: {response.status_code}")
            print(f"Session Response Body: {response.text}")

            if response.status_code in [200, 201]:
                result = response.json()
                session_id = result[0]['id'] if isinstance(result, list) else result.get('id')
                print(f"✅ Session created with ID: {session_id}")

                # Insert messages
                for msg in session.messages:
                    msg_data = {
                        "session_id": session_id,
                        "sender_type": msg.sender_type,
                        "content": msg.content
                    }
                    msg_response = await client.post(
                        f"{SUPABASE_URL}/rest/v1/chat_messages",
                        headers=headers,
                        json=msg_data
                    )
                    print(f"Message saved: {msg_response.status_code}")

                return {"success": True, "session_id": session_id}
            else:
                print(f"❌ Failed to save session: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=response.text)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Exception in save_session: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Get user sessions
@router.get("/sessions/{user_id}")
async def get_sessions(user_id: str):
    """Get all chat sessions for a user"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/chat_sessions?user_id=eq.{user_id}&order=created_at.desc",
                headers=headers
            )
            
            if response.status_code == 200:
                return {"sessions": response.json()}
        
        raise HTTPException(status_code=500, detail="Failed to get sessions")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin: all consultation sessions with previews
@router.get("/admin/feed")
async def get_admin_feed(limit: int = 80):
    """All chat sessions for admin dashboard with user info and message previews."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"sessions": [], "configured": False}

    try:
        headers = supabase_headers({"Content-Type": "application/json"})

        async with httpx.AsyncClient(timeout=30.0) as client:
            sessions_resp = await client.get(
                f"{SUPABASE_URL}/rest/v1/chat_sessions?select=*&order=created_at.desc&limit={limit}",
                headers=headers,
            )
            if sessions_resp.status_code != 200:
                raise HTTPException(status_code=sessions_resp.status_code, detail=sessions_resp.text)

            sessions = sessions_resp.json() or []
            if not sessions:
                return {"sessions": [], "configured": True}

            users_resp = await client.get(
                f"{SUPABASE_URL}/rest/v1/users?select=id,full_name,email",
                headers=headers,
            )
            users_map = {}
            if users_resp.status_code == 200:
                for user in users_resp.json() or []:
                    users_map[user.get("id")] = user

            session_ids = [s["id"] for s in sessions if s.get("id")]
            messages_by_session: dict = {sid: [] for sid in session_ids}

            if session_ids:
                ids_filter = ",".join(session_ids)
                messages_resp = await client.get(
                    f"{SUPABASE_URL}/rest/v1/chat_messages?session_id=in.({ids_filter})&order=created_at.asc",
                    headers=headers,
                )
                if messages_resp.status_code == 200:
                    for msg in messages_resp.json() or []:
                        sid = msg.get("session_id")
                        if sid in messages_by_session:
                            messages_by_session[sid].append(msg)

            feed = []
            for session in sessions:
                sid = session.get("id")
                user = users_map.get(session.get("user_id"), {})
                msgs = messages_by_session.get(sid, [])
                user_msgs = [m for m in msgs if m.get("sender_type") == "user"]
                preview = ""
                if user_msgs:
                    preview = (user_msgs[0].get("content") or "")[:160]
                elif msgs:
                    preview = (msgs[0].get("content") or "")[:160]

                feed.append({
                    "id": sid,
                    "session_name": session.get("session_name") or "Consultation",
                    "created_at": session.get("created_at"),
                    "user_id": session.get("user_id"),
                    "user_name": user.get("full_name") or "Unknown user",
                    "user_email": user.get("email") or "—",
                    "message_count": len(msgs),
                    "preview": preview,
                    "messages": msgs,
                })

            return {"sessions": feed, "configured": True}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ admin feed error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Get session messages
@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str):
    """Get all messages for a session"""
    print(f"\n=== GET MESSAGES REQUEST ===")
    print(f"Session ID: {session_id}")
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        async with httpx.AsyncClient() as client:
            url = f"{SUPABASE_URL}/rest/v1/chat_messages?session_id=eq.{session_id}&order=created_at.asc"
            print(f"Fetching from: {url}")
            response = await client.get(url, headers=headers)

            print(f"Supabase Status: {response.status_code}")
            print(f"Supabase Response: {response.text[:200]}")

            if response.status_code == 200:
                return {"messages": response.json()}
            else:
                print(f"❌ Supabase Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=response.text)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Exception in get_messages: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Save medical report
@router.post("/reports")
async def save_report(
    user_id: str,
    report_type: str,
    file_name: str,
    analysis_result: str
):
    """Save medical report analysis"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        
        report_data = {
            "user_id": user_id,
            "report_type": report_type,
            "file_name": file_name,
            "analysis_result": analysis_result
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SUPABASE_URL}/rest/v1/medical_reports",
                headers=headers,
                json=report_data
            )
            
            if response.status_code == 201:
                return {"success": True}
        
        raise HTTPException(status_code=500, detail="Failed to save report")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get user reports
@router.get("/reports/{user_id}")
async def get_reports(user_id: str):
    """Get all medical reports for a user"""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/medical_reports?user_id=eq.{user_id}&order=created_at.desc",
                headers=headers
            )
            
            if response.status_code == 200:
                return {"reports": response.json()}
        
        raise HTTPException(status_code=500, detail="Failed to get reports")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
