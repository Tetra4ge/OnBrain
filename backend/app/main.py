from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings  # noqa: F401
from app.core import auth              # noqa: F401 — Firebase init side-effect
from app.api.routes import documents_router, knowledge_router

logger = logging.getLogger(__name__)

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle manager."""
    logger.info("OnBrain API starting up...")
    yield
    logger.info("OnBrain API shutting down — closing Neo4j driver...")
    try:
        from app.knowledge.neo4j_client import close as neo4j_close
        neo4j_close()
    except Exception as e:
        logger.warning(f"Neo4j shutdown warning: {e}")


app = FastAPI(
    title="OnBrain API",
    description=(
        "Backend API for OnBrain — Industrial Knowledge Intelligence Platform. "
        "Provides document ingestion, knowledge graph queries, semantic search, "
        "Copilot RAG chat, and RCA analysis."
    ),
    version="0.2.0",
    lifespan=lifespan,
)

# CORS — allow all origins in dev; restrict to frontend origin in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(documents_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint — confirms API service is running."""
    return {"status": "ok", "version": app.version}
