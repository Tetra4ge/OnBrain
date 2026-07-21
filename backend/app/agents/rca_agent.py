import logging
import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings
from app.knowledge.chroma_client import chroma_client
from app.knowledge.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

class RCAAgent:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                response_mime_type="application/json"
            )
        )

    def gather_evidence(self, equipment_tag: str, failure_desc: str) -> Dict[str, Any]:
        logger.info(f"Gathering evidence for {equipment_tag}")
        
        # 1. Failure history from Neo4j
        failure_history = neo4j_client.get_failure_history(tag=equipment_tag)
        
        # 2. OEM specs / Manuals from Chroma
        query_str = f"{equipment_tag} {failure_desc}"
        manuals = chroma_client.semantic_search(query=query_str, top_k=5, doc_type_filter="manual")
        
        # 3. Inspection logs from Chroma
        inspections = chroma_client.semantic_search(query=query_str, top_k=5, doc_type_filter="inspection_report")
        
        return {
            "failure_history": failure_history,
            "manuals": manuals,
            "inspections": inspections
        }

    def _execute_prompt(self, prompt: str) -> Dict[str, Any]:
        """Executes a prompt requesting JSON output and parses it."""
        try:
            response = self.model.generate_content(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Error in RCA LLM call: {e}")
            return {"error": str(e)}

    def analyze(self, equipment_tag: str, failure_desc: str) -> Dict[str, Any]:
        """
        Executes the 4-step reasoning chain.
        """
        evidence = self.gather_evidence(equipment_tag, failure_desc)
        
        evidence_str = json.dumps(evidence, indent=2)
        
        # Step 1: Pattern detection
        pattern_prompt = f"""
        You are an expert Root Cause Analysis (RCA) engineer.
        Equipment Tag: {equipment_tag}
        Reported Failure: {failure_desc}
        
        Evidence:
        {evidence_str}
        
        Task: Summarize any recurring failure patterns for this equipment based on the evidence.
        Respond ONLY in valid JSON with a single key "pattern_summary" containing a string.
        """
        pattern_res = self._execute_prompt(pattern_prompt)
        pattern_summary = pattern_res.get("pattern_summary", "No clear pattern detected.")

        # Step 2: Hypothesis generation
        hypothesis_prompt = f"""
        You are an expert Root Cause Analysis (RCA) engineer.
        Equipment Tag: {equipment_tag}
        Reported Failure: {failure_desc}
        Pattern Summary: {pattern_summary}
        
        Evidence:
        {evidence_str}
        
        Task: Produce exactly 2 ranked candidate root causes (hypotheses) for this failure.
        Respond ONLY in valid JSON in the format:
        {{"hypotheses": [{{"id": "H1", "description": "..."}}, {{"id": "H2", "description": "..."}}]}}
        """
        hypothesis_res = self._execute_prompt(hypothesis_prompt)
        hypotheses = hypothesis_res.get("hypotheses", [])

        # Step 3: Evidence ranking
        ranking_prompt = f"""
        You are an expert Root Cause Analysis (RCA) engineer.
        Equipment Tag: {equipment_tag}
        Reported Failure: {failure_desc}
        Hypotheses: {json.dumps(hypotheses)}
        
        Evidence:
        {evidence_str}
        
        Task: For each hypothesis, list which pieces of evidence support or weaken it.
        Respond ONLY in valid JSON format:
        {{"evidence_ranking": [
            {{"hypothesis_id": "H1", "supporting": ["..."], "weakening": ["..."]}},
            {{"hypothesis_id": "H2", "supporting": ["..."], "weakening": ["..."]}}
        ]}}
        """
        ranking_res = self._execute_prompt(ranking_prompt)
        evidence_ranking = ranking_res.get("evidence_ranking", [])

        # Step 4: Recommendation generation
        graph_data = neo4j_client.get_equipment_graph(tag=equipment_tag, depth=2)
        procedures = []
        if graph_data:
            for node in graph_data.get("connections", []) + graph_data.get("extended", []):
                if node.get("label") in ["Procedure", "Regulation"]:
                    procedures.append(node)
                    
        rec_prompt = f"""
        You are an expert Root Cause Analysis (RCA) engineer.
        Top Hypothesis: {json.dumps(hypotheses[0] if hypotheses else {{}})}
        
        Available Procedures & Regulations in Graph:
        {json.dumps(procedures)}
        
        Task: Generate a concrete next action (recommendation) for the top hypothesis. 
        If an appropriate procedure or regulation exists in the 'Available Procedures' above, explicitly link it by referencing its ID/Title. 
        If NO matching procedure is provided above, you MUST explicitly state "no matching procedure found". Do not fabricate one.
        
        Respond ONLY in valid JSON format:
        {{"recommendation": "...", "linked_procedure_or_regulation": "..."}}
        """
        rec_res = self._execute_prompt(rec_prompt)
        recommendation = rec_res.get("recommendation", "Unable to generate recommendation.")
        linked_proc = rec_res.get("linked_procedure_or_regulation", "no matching procedure found")

        return {
            "equipment_tag": equipment_tag,
            "failure_description": failure_desc,
            "pattern_summary": pattern_summary,
            "hypotheses": hypotheses,
            "evidence_ranking": evidence_ranking,
            "recommendation": recommendation,
            "linked_procedure_or_regulation": linked_proc,
            "raw_evidence_count": {
                "failures": len(evidence.get("failure_history", [])),
                "manuals": len(evidence.get("manuals", [])),
                "inspections": len(evidence.get("inspections", []))
            }
        }
