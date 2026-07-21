import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.agents.copilot_agent import CopilotAgent
from app.knowledge.mongo_client import _get_collection

router = APIRouter(prefix="/copilot", tags=["Copilot Agent"])
logger = logging.getLogger(__name__)

agent = CopilotAgent()

class QueryRequest(BaseModel):
    query: str
    session_id: str

def get_history_collection():
    doc_col = _get_collection()
    return doc_col.database["chat_history"]

@router.post("/query")
async def copilot_query(req: QueryRequest):
    """
    SSE Endpoint for Copilot Q&A
    """
    col = get_history_collection()
    history_record = col.find_one({"_id": req.session_id})
    history = history_record["history"] if history_record else []
    
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
            col.update_one(
                {"_id": req.session_id},
                {"$set": {"history": new_history}},
                upsert=True
            )
            
        except Exception as e:
            logger.error(f"Error in Copilot query: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/history")
def get_history(session_id: str) -> Dict[str, Any]:
    col = get_history_collection()
    record = col.find_one({"_id": session_id})
    if not record:
        return {"session_id": session_id, "history": []}
    return {"session_id": session_id, "history": record["history"]}
