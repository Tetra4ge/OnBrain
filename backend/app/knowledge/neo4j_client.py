"""
Neo4j Knowledge Graph Client
Handles connection pooling, schema constraints, entity upserts (MERGE),
relationship writes, and graph traversal queries for the OnBrain knowledge layer.
"""

import logging
from typing import Any, Dict, List, Optional

from neo4j import GraphDatabase, exceptions as neo4j_exc
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Singleton driver — lazy-initialized on first use
# ---------------------------------------------------------------------------
_driver = None


def _get_driver():
    global _driver
    if _driver is None:
        _driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
            max_connection_pool_size=50,
        )
        _driver.verify_connectivity()
        logger.info("Neo4j driver initialized and connectivity verified.")
        _create_constraints()
    return _driver


# ---------------------------------------------------------------------------
# Schema constraints — run once at startup, idempotent
# ---------------------------------------------------------------------------

def _create_constraints():
    """Create uniqueness constraints on key entity properties."""
    driver = _driver  # already set by the time this is called
    constraints = [
        "CREATE CONSTRAINT equipment_tag IF NOT EXISTS FOR (e:Equipment) REQUIRE e.tag IS UNIQUE",
        "CREATE CONSTRAINT workorder_id  IF NOT EXISTS FOR (w:WorkOrder)  REQUIRE w.id  IS UNIQUE",
        "CREATE CONSTRAINT failure_id    IF NOT EXISTS FOR (f:Failure)    REQUIRE f.id  IS UNIQUE",
        "CREATE CONSTRAINT procedure_id  IF NOT EXISTS FOR (p:Procedure)  REQUIRE p.id  IS UNIQUE",
        "CREATE CONSTRAINT regulation_code IF NOT EXISTS FOR (r:Regulation) REQUIRE r.code IS UNIQUE",
        "CREATE CONSTRAINT document_id   IF NOT EXISTS FOR (d:Document)   REQUIRE d.id  IS UNIQUE",
    ]
    with driver.session() as session:
        for cypher in constraints:
            try:
                session.run(cypher)
            except Exception as e:
                logger.warning(f"Constraint creation note: {e}")
    logger.info("Neo4j constraints ensured.")


# ---------------------------------------------------------------------------
# Entity upserts (MERGE — idempotent, no duplicates on re-ingest)
# ---------------------------------------------------------------------------

_UPSERT_QUERIES: Dict[str, str] = {
    "Equipment": """
        MERGE (e:Equipment {tag: $tag})
        SET e.name     = $name,
            e.type     = $type,
            e.location = $location
        RETURN elementId(e) AS node_id
    """,
    "WorkOrder": """
        MERGE (w:WorkOrder {id: $id})
        SET w.date        = $date,
            w.description = $description,
            w.status      = $status
        RETURN elementId(w) AS node_id
    """,
    "Failure": """
        MERGE (f:Failure {id: $id})
        SET f.date        = $date,
            f.description = $description,
            f.severity    = $severity
        RETURN elementId(f) AS node_id
    """,
    "Procedure": """
        MERGE (p:Procedure {id: $id})
        SET p.title   = $title,
            p.version = $version
        RETURN elementId(p) AS node_id
    """,
    "Regulation": """
        MERGE (r:Regulation {code: $code})
        SET r.title     = $title,
            r.authority = $authority
        RETURN elementId(r) AS node_id
    """,
    "Personnel": """
        MERGE (p:Personnel {name: $name})
        SET p.role = $role
        RETURN elementId(p) AS node_id
    """,
    "Document": """
        MERGE (d:Document {id: $id})
        SET d.filename    = $filename,
            d.doc_type    = $doc_type,
            d.upload_date = $upload_date
        RETURN elementId(d) AS node_id
    """,
}

# Relationship Cypher — keyed by relation string
_REL_QUERIES: Dict[str, str] = {
    "HAS_WORK_ORDER": """
        MATCH (a:Equipment {tag: $source_id})
        MATCH (b:WorkOrder  {id: $target_id})
        MERGE (a)-[:HAS_WORK_ORDER]->(b)
    """,
    "EXPERIENCED": """
        MATCH (a:Equipment {tag: $source_id})
        MATCH (b:Failure   {id: $target_id})
        MERGE (a)-[:EXPERIENCED]->(b)
    """,
    "RESOLVED_BY": """
        MATCH (a:Failure  {id: $source_id})
        MATCH (b:WorkOrder{id: $target_id})
        MERGE (a)-[:RESOLVED_BY]->(b)
    """,
    "COMPLIES_WITH": """
        MATCH (a:Equipment  {tag:  $source_id})
        MATCH (b:Regulation {code: $target_id})
        MERGE (a)-[:COMPLIES_WITH]->(b)
    """,
    "PERFORMED_BY": """
        MATCH (a:WorkOrder {id:   $source_id})
        MATCH (b:Personnel {name: $target_id})
        MERGE (a)-[:PERFORMED_BY]->(b)
    """,
    "MENTIONS": """
        MATCH (a:Document {id: $source_id})
        MATCH (b {tag: $target_id})
        WHERE b:Equipment OR b:Failure OR b:Regulation
        MERGE (a)-[:MENTIONS]->(b)
    """,
    "CONTAINS": """
        MATCH (a:Document  {id: $source_id})
        MATCH (b:Procedure {id: $target_id})
        MERGE (a)-[:CONTAINS]->(b)
    """,
}


def upsert_entity(entity_type: str, data: Dict[str, Any]) -> Optional[str]:
    """
    Upsert a single entity node using MERGE. Returns the Neo4j elementId or None on error.
    entity_type: one of Equipment | WorkOrder | Failure | Procedure | Regulation | Personnel | Document
    """
    query = _UPSERT_QUERIES.get(entity_type)
    if not query:
        logger.warning(f"No upsert query for entity_type='{entity_type}'")
        return None
    try:
        driver = _get_driver()
        with driver.session() as session:
            result = session.run(query, **data)
            record = result.single()
            return record["node_id"] if record else None
    except neo4j_exc.ConstraintError as e:
        # On rare race condition duplicate — treat as success
        logger.debug(f"Constraint conflict on upsert (safe to ignore): {e}")
        return None
    except Exception as e:
        logger.error(f"Neo4j upsert failed for {entity_type}: {e}")
        return None


def write_all_entities(normalized_doc: Dict[str, Any]) -> List[str]:
    """
    Writes all entities from a normalized document dict to Neo4j.
    Returns list of node_ids successfully written.
    """
    node_ids: List[str] = []
    entities = normalized_doc.get("extracted_entities", {})

    # Document node itself
    doc_node_id = upsert_entity("Document", {
        "id":          normalized_doc["doc_id"],
        "filename":    normalized_doc["filename"],
        "doc_type":    normalized_doc["doc_type"],
        "upload_date": normalized_doc.get("upload_date", ""),
    })
    if doc_node_id:
        node_ids.append(doc_node_id)

    # Equipment
    for eq in entities.get("equipment", []):
        nid = upsert_entity("Equipment", {
            "tag":      eq.get("tag", ""),
            "name":     eq.get("name", ""),
            "type":     eq.get("type", ""),
            "location": eq.get("location", ""),
        })
        if nid:
            node_ids.append(nid)

    # WorkOrder
    for wo in entities.get("work_orders", []):
        nid = upsert_entity("WorkOrder", {
            "id":          wo.get("id", ""),
            "date":        wo.get("date", ""),
            "description": wo.get("description", ""),
            "status":      wo.get("status", ""),
        })
        if nid:
            node_ids.append(nid)

    # Failure
    for f in entities.get("failures", []):
        nid = upsert_entity("Failure", {
            "id":          f.get("id", ""),
            "date":        f.get("date", ""),
            "description": f.get("description", ""),
            "severity":    f.get("severity", ""),
        })
        if nid:
            node_ids.append(nid)

    # Procedure
    for p in entities.get("procedures", []):
        nid = upsert_entity("Procedure", {
            "id":      p.get("id", ""),
            "title":   p.get("title", ""),
            "version": p.get("version", "v1.0"),
        })
        if nid:
            node_ids.append(nid)

    # Regulation
    for r in entities.get("regulations", []):
        nid = upsert_entity("Regulation", {
            "code":      r.get("code", ""),
            "title":     r.get("title", ""),
            "authority": r.get("authority", ""),
        })
        if nid:
            node_ids.append(nid)

    # Personnel
    for p in entities.get("personnel", []):
        nid = upsert_entity("Personnel", {
            "name": p.get("name", ""),
            "role": p.get("role", ""),
        })
        if nid:
            node_ids.append(nid)

    return node_ids


def write_relationships(relationships: List[Dict[str, Any]]) -> int:
    """
    Write a list of relationships to Neo4j. Skips any with missing MATCH targets silently.
    Returns count of successful writes.
    """
    success_count = 0
    driver = _get_driver()
    with driver.session() as session:
        for rel in relationships:
            rel_type = rel.get("relation", "")
            query = _REL_QUERIES.get(rel_type)
            if not query:
                logger.debug(f"No query for relationship type: {rel_type}")
                continue
            try:
                session.run(
                    query,
                    source_id=rel.get("source_id", ""),
                    target_id=rel.get("target_id", ""),
                )
                success_count += 1
            except Exception as e:
                # Missing MATCH target → not a crash, just skip
                logger.debug(f"Relationship write skipped ({rel_type}): {e}")
    return success_count


# ---------------------------------------------------------------------------
# Graph Traversal — for Graph Explorer and RCA agent
# ---------------------------------------------------------------------------

def get_equipment_graph(tag: str, depth: int = 2) -> Optional[Dict[str, Any]]:
    """
    Returns equipment node + all directly connected nodes up to `depth` hops.
    Suitable for Graph Explorer visualization and RCA evidence gathering.
    """
    driver = _get_driver()
    # Bounded traversal: collect equipment + its 1-hop and 2-hop neighbors
    query = """
        MATCH (e:Equipment {tag: $tag})
        OPTIONAL MATCH (e)-[r1]->(n1)
        OPTIONAL MATCH (n1)-[r2]->(n2)
        RETURN e,
               collect(DISTINCT {rel: type(r1), node: n1, label: labels(n1)}) AS first_hop,
               collect(DISTINCT {rel: type(r2), node: n2, label: labels(n2)}) AS second_hop
    """
    try:
        with driver.session() as session:
            result = session.run(query, tag=tag)
            record = result.single()
            if not record:
                return None

            equipment_node = dict(record["e"])

            def serialize_hop(hop_list):
                nodes = []
                for item in hop_list:
                    if item["node"] is None:
                        continue
                    nodes.append({
                        "label":      item["label"][0] if item["label"] else "Unknown",
                        "relation":   item["rel"],
                        "properties": dict(item["node"]),
                    })
                return nodes

            return {
                "equipment":   equipment_node,
                "connections": serialize_hop(record["first_hop"]),
                "extended":    serialize_hop(record["second_hop"]),
            }
    except Exception as e:
        logger.error(f"Graph traversal failed for tag={tag}: {e}")
        return None


def get_all_equipment_tags() -> List[str]:
    """Returns all Equipment tags currently in the graph — used to populate RCA form dropdown."""
    try:
        driver = _get_driver()
        with driver.session() as session:
            result = session.run("MATCH (e:Equipment) RETURN e.tag AS tag ORDER BY tag")
            return [record["tag"] for record in result]
    except Exception as e:
        logger.error(f"Failed to fetch equipment tags: {e}")
        return []


def get_failure_history(tag: str) -> List[Dict[str, Any]]:
    """
    Returns failure nodes linked to a given equipment tag.
    Used by the RCA agent as evidence source 1.
    """
    try:
        driver = _get_driver()
        with driver.session() as session:
            result = session.run(
                """
                MATCH (e:Equipment {tag: $tag})-[:EXPERIENCED]->(f:Failure)
                RETURN f ORDER BY f.date DESC
                """,
                tag=tag,
            )
            return [dict(record["f"]) for record in result]
    except Exception as e:
        logger.error(f"Failure history query failed for tag={tag}: {e}")
        return []


def close():
    """Close the Neo4j driver. Call on application shutdown."""
    global _driver
    if _driver:
        _driver.close()
        _driver = None
        logger.info("Neo4j driver closed.")


# Module-level singleton accessor used by other modules
class _Neo4jClient:
    """Thin wrapper to expose a consistent client interface."""
    def upsert_entity(self, *a, **kw): return upsert_entity(*a, **kw)
    def write_all_entities(self, *a, **kw): return write_all_entities(*a, **kw)
    def write_relationships(self, *a, **kw): return write_relationships(*a, **kw)
    def get_equipment_graph(self, *a, **kw): return get_equipment_graph(*a, **kw)
    def get_all_equipment_tags(self): return get_all_equipment_tags()
    def get_failure_history(self, *a, **kw): return get_failure_history(*a, **kw)
    def close(self): return close()


neo4j_client = _Neo4jClient()
