import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.tickets import router
from loguru import logger

app = FastAPI(title='Hybrid Priority Engine')

# Read allowed origins from env var (comma-separated), default to * for local dev
# On Render, set CORS_ORIGINS=https://your-app.vercel.app
_raw_origins = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    logger.info("Hybrid Priority Engine API Started")
    logger.info(f"CORS allowed origins: {allowed_origins}")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "hybrid-priority-engine"}

