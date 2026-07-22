import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.agents.copilot_agent import CopilotAgent
from app.knowledge.firestore_client import get_collection

router = APIRouter(prefix="/copilot", tags=["Copilot Agent"])
logger = logging.getLogger(__name__)

agent = CopilotAgent()

class QueryRequest(BaseModel):
    query: str
    session_id: str

def get_history_collection():
    return get_collection("chat_history")

@router.post("/query")
async def copilot_query(req: QueryRequest):
    """
    SSE Endpoint for Copilot Q&A
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    if not req.session_id.strip():
        raise HTTPException(status_code=400, detail="Session ID cannot be empty.")

    col = None
    history = []
    try:
        col = get_history_collection()
        history_record = col.document(req.session_id).get()
        history = history_record.to_dict().get("history", []) if history_record.exists else []
    except Exception as exc:
        logger.warning("Chat history unavailable; continuing without it: %s", exc)
    
    async def event_generator():
        full_answer = ""
        meta_data = {}
        
        try:
            async for event in agent.process_query_stream(req.query, history):
                if event["type"] == "meta":
                    meta_data = event
                elif event["type"] == "token":
                    full_answer += event["text"]
                yield f"data: {json.dumps(event)}\n\n"
                
            yield "data: [DONE]\n\n"
            
            # Save history
            new_history = history + [
                {"role": "user", "content": req.query},
                {"role": "model", "content": full_answer}
            ]
            new_history = new_history[-20:]
            if col is not None:
                try:
                    col.document(req.session_id).set({"history": new_history}, merge=True)
                except Exception as exc:
                    logger.warning("Could not persist chat history: %s", exc)
            
        except Exception as e:
            logger.error(f"Error in Copilot query: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/history")
def get_history(session_id: str) -> Dict[str, Any]:
    try:
        col = get_history_collection()
        record = col.document(session_id).get()
    except Exception:
        return {"session_id": session_id, "history": []}
    if not record.exists:
        return {"session_id": session_id, "history": []}
    return {"session_id": session_id, "history": record.to_dict().get("history", [])}
