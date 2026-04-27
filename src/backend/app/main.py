from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.tickets import router
from loguru import logger

app = FastAPI(title='Hybrid Priority Engine')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    logger.info("Hybrid Priority Engine API Started")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "hybrid-priority-engine"}
