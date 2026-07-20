from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core import auth

app = FastAPI(
    title="OnBrain API",
    description="Backend API services for OnBrain - Industrial Knowledge Intelligence",
    version="0.1.0"
)

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Simple healthcheck endpoint to verify backend service status."""
    return {"status": "ok"}
