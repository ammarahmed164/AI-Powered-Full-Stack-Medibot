"""
Gemini API Client - Smart 5-Key Auto Rotation
==============================================
Automatically rotates between 5 FREE Gemini API keys
When one key's quota (20/day) is full, automatically switches to next key
"""

import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

class GeminiClient:
    """Google Gemini AI Client with 5-Key Auto Rotation"""
    
    def __init__(self):
        # Load 5 API keys
        self.api_keys = self._load_api_keys()
        self.current_key_index = 0
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        if not self.api_keys:
            raise ValueError("No GEMINI_API_KEYS found in .env file")

        print(f"[OK] Gemini AI Loaded {len(self.api_keys)} FREE API Keys")
        print(f"[OK] Total Capacity: {len(self.api_keys) * 20} requests/day")
        print(f"[OK] Using Model: {self.model_name}")
        print(f"[OK] Auto Key Rotation: ENABLED")
    
    def _load_api_keys(self) -> list:
        """Load 5 API keys from environment"""
        keys_str = os.getenv("GEMINI_API_KEYS", "")
        
        # Parse JSON-like string
        try:
            keys = json.loads(keys_str)
            if isinstance(keys, list):
                return keys
        except:
            pass
        
        # Fallback: extract keys using regex
        keys = re.findall(r'AIzaSy[A-Za-z0-9_-]+', keys_str)
        return keys if keys else []
    
    def _initialize_client(self):
        """Initialize Gemini client with current key"""
        if self.current_key_index >= len(self.api_keys):
            self.current_key_index = 0  # Reset to first key
            print(f"[ROTATE] All 5 keys exhausted, resetting to Key #1")

        api_key = self.api_keys[self.current_key_index]
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(self.model_name)
        print(f"[OK] Using Key #{self.current_key_index + 1}")
    
    def _try_with_rotation(self, func, *args, **kwargs):
        """Try function with current key, auto-rotate on quota error"""
        max_attempts = len(self.api_keys)
        
        for attempt in range(max_attempts):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                error_msg = str(e)
                
                # Check if quota exceeded
                if "quota exceeded" in error_msg.lower() or "429" in error_msg:
                    print(f"[WARN] Key #{self.current_key_index + 1} quota full (20/20), rotating...")
                    self.current_key_index += 1

                    if self.current_key_index < len(self.api_keys):
                        self._initialize_client()
                        print(f"[OK] Switched to Key #{self.current_key_index + 1}")
                        continue
                    else:
                        # All 5 keys exhausted
                        print(f"[ERROR] All 5 API keys quota exceeded (100/100 requests used)")
                        print(f"[WAIT] Wait 24 hours for reset, or add more keys")
                        raise Exception("All 5 API keys quota exceeded. Please wait 24 hours for reset.")
                else:
                    # Different error, re-raise
                    print(f"[ERROR] Error: {error_msg[:100]}")
                    raise
        
        raise Exception("All API keys exhausted")
    
    def generate_response(self, prompt: str) -> str:
        """Generate AI response with smart 5-key rotation"""
        
        # Initialize if not already done
        if not hasattr(self, 'model'):
            self._initialize_client()
        
        def _generate(prompt):
            response = self.model.generate_content(prompt)
            return response.text
        
        return self._try_with_rotation(_generate, prompt)
    
    def chat(self, message: str, conversation_history: list = None) -> str:
        """Chat with rotation support"""
        
        # Initialize if not already done
        if not hasattr(self, 'model'):
            self._initialize_client()
        
        def _chat(msg, history):
            if history:
                chat = self.model.start_chat(history=history)
                response = chat.send_message(msg)
            else:
                response = self.model.generate_content(msg)
            return response.text
        
        return self._try_with_rotation(_chat, message, conversation_history or [])
    
    def get_status(self) -> dict:
        """Get current API key status"""
        return {
            "total_keys": len(self.api_keys),
            "current_key": self.current_key_index + 1,
            "model": self.model_name,
            "capacity_per_day": len(self.api_keys) * 20,
            "keys_remaining": len(self.api_keys) - self.current_key_index
        }
