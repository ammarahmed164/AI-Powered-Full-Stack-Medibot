"""
Grok API Client (xAI) - Smart Key Rotation
==========================================
Automatically rotates between two Grok API keys
"""

import os
import json
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

class GrokClient:
    """xAI Grok API Client with Smart Key Rotation"""
    
    def __init__(self):
        # Load multiple API keys
        self.api_keys = self._load_api_keys()
        self.current_key_index = 0
        self.model = os.getenv("GROK_MODEL", "grok-beta")
        self.base_url = "https://api.x.ai/v1"
        
        if not self.api_keys:
            raise ValueError("No GROK_API_KEYS found in .env file")
        
        print(f"✅ Grok AI Loaded {len(self.api_keys)} keys")
        print(f"✅ Using Model: {self.model}")
    
    def _load_api_keys(self) -> list:
        """Load API keys from environment"""
        keys_str = os.getenv("GROK_API_KEYS", "")
        
        # Parse JSON-like string
        try:
            keys = json.loads(keys_str)
            if isinstance(keys, list):
                return keys
        except:
            pass
        
        # Fallback: extract keys using regex
        keys = re.findall(r'xai-[A-Za-z0-9_-]+', keys_str)
        return keys if keys else []
    
    def _get_current_key(self) -> str:
        """Get current API key"""
        if self.current_key_index >= len(self.api_keys):
            self.current_key_index = 0  # Reset to first key
        return self.api_keys[self.current_key_index]
    
    def _rotate_key(self):
        """Rotate to next API key"""
        old_index = self.current_key_index
        self.current_key_index += 1
        
        if self.current_key_index >= len(self.api_keys):
            self.current_key_index = 0
            print(f"⚠️  All keys exhausted, resetting to Key #1")
        else:
            print(f"⚠️  Key #{old_index + 1} quota exceeded, rotating to Key #{self.current_key_index + 1}")
    
    def _make_request(self, messages: list, max_retries: int = 2) -> str:
        """Make API request with automatic key rotation"""
        
        for attempt in range(max_retries):
            api_key = self._get_current_key()
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            payload = {
                "model": self.model,
                "messages": messages,
                "max_tokens": 1024,
                "temperature": 0.7,
                "stream": False
            }
            
            try:
                response = httpx.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                
                elif response.status_code == 429:  # Rate limit
                    print(f"⚠️  Key #{self.current_key_index + 1} rate limited, rotating...")
                    self._rotate_key()
                    continue
                
                elif response.status_code >= 500:  # Server error
                    print(f"⚠️  Server error, retrying...")
                    continue
                
                else:
                    print(f"❌ API Error {response.status_code}: {response.text[:100]}")
                    raise Exception(f"Grok API error: {response.status_code}")
            
            except httpx.TimeoutException:
                print(f"⚠️  Timeout, retrying...")
                continue
            
            except httpx.RequestError as e:
                print(f"❌ Request error: {str(e)[:100]}")
                if attempt < max_retries - 1:
                    self._rotate_key()
                    continue
                raise
        
        raise Exception("All API keys exhausted or max retries reached")
    
    def generate_response(self, prompt: str, system_prompt: str = None) -> str:
        """Generate AI response with smart key rotation"""
        
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        return self._make_request(messages)
    
    def chat(self, messages: list) -> str:
        """Chat with conversation history"""
        return self._make_request(messages)
