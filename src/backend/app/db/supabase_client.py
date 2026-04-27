from supabase import create_client, Client
from app.config import settings
from loguru import logger

try:
    if settings.supabase_url and settings.supabase_key:
        supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    else:
        logger.warning("Supabase URL or Key not set in environment.")
        supabase = None
except Exception as e:
    logger.warning(f"Supabase client initialization failed: {e}")
    supabase = None
