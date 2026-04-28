from pydantic_settings import BaseSettings
from pathlib import Path

# Path to the root .env file (only exists in local dev, not on Render)
_env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"

class Settings(BaseSettings):
    gemini_api_key: str = ""
    model_name: str = "gemini-2.5-flash"
    supabase_url: str = ""
    supabase_key: str = ""

    class Config:
        env_file = str(_env_path) if _env_path.exists() else None
        extra = "ignore"

settings = Settings()

