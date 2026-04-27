from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    gemini_api_key: str = ""
    model_name: str = "gemini-2.5-flash"
    supabase_url: str = ""
    supabase_key: str = ""

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent.parent.parent / ".env")
        extra = "ignore"

settings = Settings()
