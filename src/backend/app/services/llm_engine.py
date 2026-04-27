from google import genai
from google.genai import types
from app.config import settings
import json
import os
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def llm_priority(description: str) -> dict:
    key = os.getenv("GEMINI_API_KEY") or settings.gemini_api_key
    client = None
    try:
        if key:
            client = genai.Client(api_key=key)
    except Exception as e:
        logger.warning(f"Gemini client initialization failed: {e}")

    if not client:
        logger.warning("No Gemini API key set, bypassing LLM engine.")
        return {
            "priority": "MEDIUM",
            "priority_score": 50,
            "category": "General",
            "reason": "LLM client not configured."
        }

    prompt = f"""
You are an NGO support triage engine.

Return JSON only:
{{
"priority": "EXTREME",
"priority_score": 90,
"category": "Medical Emergency",
"reason": "..."
}}

Ticket:
{description}
"""

    try:
        response = client.models.generate_content(
            model=settings.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Failed to parse LLM response: {e}")
        return {
            "priority": "MEDIUM",
            "priority_score": 50,
            "category": "General",
            "reason": "Failed to parse AI response."
        }
