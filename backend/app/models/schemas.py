from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

# --- Enums ---

class DocType(str, Enum):
    WORK_ORDER = "work_order"
    INSPECTION_REPORT = "inspection_report"
    MANUAL = "manual"
    REGULATION = "regulation"
    PID = "pid"

class SyncStatus(str, Enum):
    PENDING = "pending"
    PARTIAL = "partial"
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

# --- Core Entity Schemas ---

class Equipment(BaseModel):
    tag: str = Field(..., description="Unique equipment identification tag, e.g., P-101A")
    name: str = Field(..., description="Human readable name of the equipment")
    type: str = Field(..., description="Category/type of equipment, e.g., Centrifugal Pump, Heat Exchanger")
    location: str = Field(..., description="Plant section or physical location code")
    description: Optional[str] = Field(None, description="Detailed equipment description")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional properties or specifications")

class WorkOrder(BaseModel):
    id: str = Field(..., description="Unique Work Order identifier, e.g., WO-88392")
    date: str = Field(..., description="Work Order issuance or completion date (ISO format)")
    description: str = Field(..., description="Summary of work performed or requested")
    status: str = Field(..., description="Status of work order, e.g., OPEN, COMPLETED, IN_PROGRESS")
    equipment_tag: Optional[str] = Field(None, description="Associated equipment tag")
    severity: Optional[str] = Field(None, description="Priority or severity level")
    assigned_to: Optional[str] = Field(None, description="Personnel assigned to the work order")

class Failure(BaseModel):
    id: str = Field(..., description="Unique failure record identifier, e.g., FAIL-2026-001")
    date: str = Field(..., description="Date of failure occurrence")
    description: str = Field(..., description="Observed symptom or failure description")
    severity: str = Field(..., description="Impact level, e.g., CRITICAL, MAJOR, MINOR")
    equipment_tag: Optional[str] = Field(None, description="Tag of equipment affected")
    root_cause: Optional[str] = Field(None, description="Identified root cause of the failure")

class Procedure(BaseModel):
    id: str = Field(..., description="Procedure code/ID, e.g., SOP-PUMP-004")
    title: str = Field(..., description="Procedure document title")
    version: str = Field(..., description="Version string, e.g., v2.1")
    content: Optional[str] = Field(None, description="Procedure body text or step list")
    equipment_tag: Optional[str] = Field(None, description="Applicable equipment tag or family")

class Regulation(BaseModel):
    code: str = Field(..., description="Regulatory compliance code, e.g., OSHA 1910.119")
    title: str = Field(..., description="Official title of regulation")
    authority: str = Field(..., description="Regulatory body, e.g., OSHA, EPA, ISO")
    description: Optional[str] = Field(None, description="Summary of compliance requirements")

class Personnel(BaseModel):
    id: Optional[str] = Field(None, description="Employee ID or badge number")
    name: str = Field(..., description="Full name of personnel")
    role: str = Field(..., description="Role/Title, e.g., Maintenance Technician, Reliability Engineer")

class Document(BaseModel):
    id: str = Field(..., description="Unique document ID (UUID)")
    filename: str = Field(..., description="Original filename")
    doc_type: DocType = Field(..., description="Document category type")
    upload_date: str = Field(..., description="Upload timestamp in ISO format")
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
    upload_date: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="Upload ISO timestamp")
    uploaded_by: Optional[str] = Field("system", description="User ID of uploader")
    source_path: str = Field(..., description="Relative or storage path")
    sync_status: SyncStatus = Field(SyncStatus.PENDING, description="Current ingestion sync state")
    chroma_chunk_ids: List[str] = Field(default_factory=list, description="Vector chunk IDs stored in ChromaDB")
    neo4j_node_ids: List[str] = Field(default_factory=list, description="Node IDs written to Neo4j Graph")
    extracted_entity_count: int = Field(0, description="Count of extracted entities")
    error_log: List[str] = Field(default_factory=list, description="Log of any extraction errors")

    class Config:
        populate_by_name = True

class VectorChunkMetadata(BaseModel):
    doc_id: str = Field(..., description="Parent document UUID")
    doc_type: DocType = Field(..., description="Document category type")
    chunk_index: int = Field(..., description="Zero-based index of chunk in document")
    page_number: Optional[int] = Field(1, description="Page number source")
    source_filename: str = Field(..., description="Filename of source document")
    equipment_tags: List[str] = Field(default_factory=list, description="Associated equipment tags in chunk")
