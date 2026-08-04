"""
Shared Supabase REST configuration for MediBot backend.
"""

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv(
    "SUPABASE_URL",
    "https://jqajcavffgdmoniqobpz.supabase.co",
)
SUPABASE_KEY = (
    os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or "sb_publishable_5IaQMCqZ0e_o5QRVb9O7Xw_94lHOfL8"
)


def supabase_headers(extra: Optional[dict] = None) -> dict:
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    if extra:
        headers.update(extra)
    return headers
