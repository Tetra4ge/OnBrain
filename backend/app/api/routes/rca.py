import logging
from datetime import datetime, timezone
from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.agents.rca_agent import RCAAgent
from app.knowledge.mongo_client import _get_collection

router = APIRouter(prefix="/rca", tags=["RCA Agent"])
logger = logging.getLogger(__name__)

agent = RCAAgent()

class AnalyzeRequest(BaseModel):
    equipment_tag: str
    failure_description: str

def get_reports_collection():
    return _get_collection().database["rca_reports"]

@router.post("/analyze")
def analyze_failure(req: AnalyzeRequest):
    """
    Executes the 4-step RCA reasoning chain and returns the full structured output.
    Saves the result to MongoDB.
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
        inserted = col.insert_one(report_record)
        report["report_id"] = str(inserted.inserted_id)
        
        return report
    except Exception as e:
        logger.error(f"Error in RCA analyze: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports")
def get_reports(equipment_tag: str) -> List[Dict[str, Any]]:
    """
    Retrieves saved RCA reports for an equipment tag from MongoDB.
    """
    col = get_reports_collection()
    cursor = col.find({"equipment_tag": equipment_tag}).sort("timestamp", -1)
    
    results = []
    for record in cursor:
        record["report_id"] = str(record.pop("_id"))
        results.append(record)
    return results
