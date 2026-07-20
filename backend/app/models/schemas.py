from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime, timezone

# --- Enums ---

class DocType(str, Enum):
    WORK_ORDER = "work_order"
    INSPECTION_REPORT = "inspection_report"
    MANUAL = "manual"
    REGULATION = "regulation"
    PID = "pid"

class SyncStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETE = "complete"
    FAILED = "failed"

class RelationshipType(str, Enum):
    HAS_WORK_ORDER = "HAS_WORK_ORDER"
    EXPERIENCED = "EXPERIENCED"
    RESOLVED_BY = "RESOLVED_BY"
    COMPLIES_WITH = "COMPLIES_WITH"
    PERFORMED_BY = "PERFORMED_BY"
    MENTIONS = "MENTIONS"
    CONTAINS = "CONTAINS"

# --- Domain Entity Schemas ---

class EquipmentEntity(BaseModel):
    tag: str = Field(..., description="Unique equipment tag, e.g., P-101A")
    name: str = Field(..., description="Full descriptive name")
    type: str = Field(..., description="Equipment category, e.g., Pump, Valve, Heat Exchanger")
    location: Optional[str] = Field(None, description="Physical plant unit or building location")

class WorkOrderEntity(BaseModel):
    id: str = Field(..., description="Work order code, e.g., WO-88405")
    date: str = Field(..., description="Date of work order issuance/completion")
    description: str = Field(..., description="Summary of work performed or requested")
    status: str = Field(..., description="Work order status, e.g., COMPLETED, IN_PROGRESS")

class FailureEntity(BaseModel):
    id: str = Field(..., description="Failure incident code, e.g., FAIL-2026-004")
    date: str = Field(..., description="Date failure incident was logged")
    description: str = Field(..., description="Failure symptoms or root cause observation")
    severity: str = Field(..., description="Incident severity level, e.g., CRITICAL, MAJOR, MINOR")

class ProcedureEntity(BaseModel):
    id: str = Field(..., description="Procedure or SOP document ID, e.g., SOP-PUMP-004")
    title: str = Field(..., description="Standard operating procedure title")
    version: Optional[str] = Field("v1.0", description="Procedure version string")

class RegulationEntity(BaseModel):
    code: str = Field(..., description="Regulatory standard identifier, e.g., OSHA 1910.119, API 570")
    title: str = Field(..., description="Title of safety or maintenance regulation")
    authority: str = Field(..., description="Regulatory body name, e.g., OSHA, API, EPA")

class PersonnelEntity(BaseModel):
    name: str = Field(..., description="Individual technician or inspector name")
    role: str = Field(..., description="Job role or title")

class NormalizedDocument(BaseModel):
    doc_id: str = Field(..., description="Unique UUID for document record")
    filename: str = Field(..., description="Original filename")
    doc_type: DocType = Field(..., description="Detected or specified document category")
    raw_text: str = Field(..., description="Extracted raw text content from OCR or parser")
    equipment: List[EquipmentEntity] = Field(default_factory=list)
    work_orders: List[WorkOrderEntity] = Field(default_factory=list)
    failures: List[FailureEntity] = Field(default_factory=list)
    procedures: List[ProcedureEntity] = Field(default_factory=list)
    regulations: List[RegulationEntity] = Field(default_factory=list)
    personnel: List[PersonnelEntity] = Field(default_factory=list)
    source_path: str = Field(..., description="Storage path or URI")

# --- Graph Relationship Schema ---

class GraphRelationship(BaseModel):
    source_id: str = Field(..., description="ID or Tag of source entity node")
    source_label: str = Field(..., description="Label/Type of source node, e.g., Equipment")
    relation: RelationshipType = Field(..., description="Relationship type enum value")
    target_id: str = Field(..., description="ID or Tag of target entity node")
    target_label: str = Field(..., description="Label/Type of target node, e.g., Failure")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Relationship properties")

# --- Storage Metadata Schemas ---

class DocumentMetadata(BaseModel):
    id: str = Field(..., alias="_id", description="MongoDB unique document ID")
    filename: str = Field(..., description="Original file name")
    doc_type: DocType = Field(..., description="Document type tag")
    upload_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="Upload ISO timestamp")
    uploaded_by: Optional[str] = Field("system", description="User ID of uploader")
    source_path: str = Field(..., description="Relative or storage path")
    sync_status: SyncStatus = Field(SyncStatus.PENDING, description="Current ingestion sync state")
    chroma_chunk_ids: List[str] = Field(default_factory=list, description="Vector chunk IDs stored in ChromaDB")
    neo4j_node_ids: List[str] = Field(default_factory=list, description="Node IDs written to Neo4j Graph")
    extracted_entity_count: int = Field(0, ge=0, description="Count of extracted entities")
    error_log: List[str] = Field(default_factory=list, description="Log of any extraction errors")

    class Config:
        populate_by_name = True

class VectorChunkMetadata(BaseModel):
    doc_id: str = Field(..., description="Parent document UUID")
    doc_type: DocType = Field(..., description="Document category type")
    chunk_index: int = Field(..., ge=0, description="Zero-based index of chunk in document")
    page_number: Optional[int] = Field(1, description="Page number source")
    source_filename: str = Field(..., description="Filename of source document")
    equipment_tags: List[str] = Field(default_factory=list, description="Associated equipment tags in chunk")
