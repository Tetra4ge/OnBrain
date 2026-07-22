import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.agents.copilot_agent import CopilotAgent
from app.knowledge.firestore_client import get_collection
from app.agents.chat_vision import analyze_chat_image
from app.ingestion import extract_entities_and_relationships, normalize_document
from app.knowledge.sync import sync_document
from app.models.schemas import DocType

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


@router.post("/image")
async def copilot_upload_image(
    file: UploadFile = File(...),
    session_id: str = Form(...)
):
    """
    Accepts an uploaded image from Copilot chat.
    Sends it to Gemini Vision to extract and understand the content,
    then automatically runs the output through the Knowledge Graph (Neo4j/ChromaDB) sync pipeline.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed.")

    try:
        image_bytes = await file.read()
        
        # 1. Analyze the image with Gemini
        extracted_text = analyze_chat_image(image_bytes, file.content_type)
        
        # 2. Extract entities and relationships from the Gemini summary
        doc_type = DocType.INSPECTION_REPORT
        extracted_entities = extract_entities_and_relationships(
            text=extracted_text,
            doc_type=doc_type,
            filename=file.filename
        )
        
        # 3. Normalize mock document payload
        format_info = {
            "format": "text",
            "doc_type": doc_type
        }
        normalized = normalize_document(
            filename=f"chat_upload_{file.filename}.txt",
            raw_text=extracted_text,
            extracted_data=extracted_entities,
            format_info=format_info
        )
        
        # 4. Sync mock document to Firestore, Neo4j, and ChromaDB
        sync_result = await sync_document(normalized)
        
        # 5. Persist image upload event to chat history in Firestore
        try:
            col = get_history_collection()
            history_record = col.document(session_id).get()
            history = history_record.to_dict().get("history", []) if history_record.exists else []
            
            new_history = history + [
                {"role": "user", "content": f"[Uploaded Image: {file.filename}]"},
                {"role": "model", "content": f"Image processed and synced to Knowledge Graph!\n\n**Analysis Summary:**\n{extracted_text}"}
            ]
            new_history = new_history[-20:]
            col.document(session_id).set({"history": new_history}, merge=True)
        except Exception as exc:
            logger.warning("Could not persist image upload event to chat history: %s", exc)

        return {
            "status": "success",
            "extracted_text": extracted_text,
            "sync": sync_result
        }
    except Exception as e:
        logger.error(f"Image copilot processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")
