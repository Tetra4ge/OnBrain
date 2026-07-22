import logging
from uuid import uuid4
from datetime import datetime, timezone
from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.agents.rca_agent import RCAAgent
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from app.knowledge.firestore_client import get_collection

router = APIRouter(prefix="/rca", tags=["RCA Agent"])
logger = logging.getLogger(__name__)

agent = RCAAgent()

class AnalyzeRequest(BaseModel):
    equipment_tag: str
    failure_description: str

def get_reports_collection():
    return get_collection("rca_reports")

@router.post("/analyze")
def analyze_failure(req: AnalyzeRequest):
    """
    Executes the 4-step RCA reasoning chain and returns the full structured output.
    Saves the result to Firestore.
    """
    try:
        report = agent.analyze(req.equipment_tag, req.failure_description)
        
        # Save report
        col = get_reports_collection()
        report_record = {
            "equipment_tag": req.equipment_tag,
            "failure_description": req.failure_description,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "report": report
        }
        report_id = str(uuid4())
        col.document(report_id).set(report_record)
        report["report_id"] = report_id
        
        return report
    except Exception as e:
        logger.error(f"Error in RCA analyze: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports")
def get_reports(equipment_tag: str) -> List[Dict[str, Any]]:
    """
    Retrieves saved RCA reports for an equipment tag from Firestore.
    """
    col = get_reports_collection()
    cursor = col.where(
        filter=FieldFilter("equipment_tag", "==", equipment_tag)
    ).order_by("timestamp", direction=firestore.Query.DESCENDING).stream()
    
    results = []
    for record in cursor:
        results.append({"report_id": record.id, **record.to_dict()})
    return results
