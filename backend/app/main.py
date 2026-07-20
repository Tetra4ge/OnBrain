from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.core.config import settings
from app.core import auth
from app.api.routes import documents_router

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB

class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    """Enforces 10MB request size limit at ASGI layer before request processing."""
    async def dispatch(self, request: Request, call_next):
        if request.method in ["POST", "PUT", "PATCH"]:
            content_length = request.headers.get("content-length")
            if content_length and content_length.isdigit():
                if int(content_length) > MAX_UPLOAD_SIZE:
                    return JSONResponse(
                        status_code=413,
                        content={"detail": f"File size exceeds maximum allowed limit of {MAX_UPLOAD_SIZE // (1024 * 1024)}MB"}
                    )
        return await call_next(request)

app = FastAPI(
    title="OnBrain API",
    description="Backend API services for OnBrain - Industrial Knowledge Intelligence",
    version="0.1.0"
)

app.add_middleware(LimitUploadSizeMiddleware)

# Setup CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(documents_router, prefix="/api")

@app.get("/health")
def health_check():
    """Simple healthcheck endpoint to verify backend service status."""
    return {"status": "ok"}

