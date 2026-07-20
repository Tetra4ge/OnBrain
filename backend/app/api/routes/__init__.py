# API subroutes module
from app.api.routes.documents import router as documents_router
from app.api.routes.knowledge import router as knowledge_router

__all__ = ["documents_router", "knowledge_router"]
