import logging
from typing import Dict, Any, List
from app.knowledge.chroma_client import chroma_client
from app.knowledge.neo4j_client import neo4j_client
from app.knowledge.firestore_client import firestore_client

logger = logging.getLogger(__name__)

def search_documents(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search for relevant document chunks using vector semantic search.
    Returns chunks containing metadata (doc_id, page_number, source_filename, text).
    """
    try:
        results = chroma_client.semantic_search(query=query, top_k=limit)
        # We ensure standard fields for citations
        citations = []
        for res in results:
            citations.append({
                "doc_id": res.get("doc_id", ""),
                "page_number": res.get("page_number", 1),
                "source_filename": res.get("source_filename", ""),
                "text": res.get("text", ""),
                "relevance_score": res.get("relevance_score", 0.0)
            })
        return citations
    except Exception as e:
        logger.error(f"Error in search_documents tool: {e}")
        return []

def query_graph(equipment_tag: str) -> Dict[str, Any]:
    """
    Query the Knowledge Graph for a specific equipment tag.
    Returns the equipment details, direct connections (1st hop), and extended connections (2nd hop).
    """
    try:
        result = neo4j_client.get_equipment_graph(tag=equipment_tag, depth=2)
        if not result:
            return {"error": f"No equipment found with tag {equipment_tag}"}
        return result
    except Exception as e:
        logger.error(f"Error in query_graph tool: {e}")
        return {"error": str(e)}

def get_document_metadata(doc_id: str) -> Dict[str, Any]:
    """
    Retrieve full metadata for a specific document.
    """
    try:
        result = firestore_client.get_document(doc_id=doc_id)
        if not result:
            return {"error": f"Document {doc_id} not found."}
        return result
    except Exception as e:
        logger.error(f"Error in get_document_metadata tool: {e}")
        return {"error": str(e)}
