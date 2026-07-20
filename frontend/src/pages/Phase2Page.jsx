import React, { useEffect, useState } from 'react';
import { Database, FileText, Code2 } from 'lucide-react';
import { getSampleDocuments } from '../lib/api';

export default function DataSchemasPage() {
  const [samples, setSamples] = useState([]);
  const [activeSchemaTab, setActiveSchemaTab] = useState('mongo'); // 'mongo' | 'neo4j' | 'chroma'

  useEffect(() => {
    let isMounted = true;
    const loadSamples = async () => {
      const docs = await getSampleDocuments();
      if (isMounted) setSamples(docs);
    };
    loadSamples();
    return () => { isMounted = false; };
  }, []);

  const schemas = {
    mongo: {
      title: 'MongoDB Metadata Schema (`app.models.schemas.DocumentMetadata`)',
      description: 'Tracks document upload metadata, pipeline sync status, and vector/graph node IDs.',
      code: `{
  "_id": "doc_88405_uuid",
  "filename": "WO-88405-valve-actuator-overhaul.json",
  "doc_type": "work_order",
  "upload_date": "2026-07-20T17:30:00Z",
  "sync_status": "complete",
  "chroma_chunk_ids": ["doc_88405_chunk_0", "doc_88405_chunk_1"],
  "neo4j_node_ids": ["XV-204B", "WO-88405", "FAIL-2026-004"],
  "extracted_entity_count": 8,
  "confidence_avg": 0.94,
  "error_log": []
}`
    },
    neo4j: {
      title: 'Neo4j Node & Relationship Knowledge Graph Schema',
      description: 'Entity node definitions (Equipment, WorkOrder, Failure, Procedure, Regulation, Personnel) and graph relationships.',
      code: `// Node Labels
(:Equipment {tag, name, type, location})
(:WorkOrder {id, date, description, status})
(:Failure {id, date, description, severity})
(:Procedure {id, title, version})
(:Regulation {code, title, authority})
(:Personnel {name, role})

// Graph Edge Relationships
(Equipment)-[:HAS_WORK_ORDER]->(WorkOrder)
(Equipment)-[:EXPERIENCED]->(Failure)
(Failure)-[:RESOLVED_BY]->(WorkOrder)
(Equipment)-[:COMPLIES_WITH]->(Regulation)
(WorkOrder)-[:PERFORMED_BY]->(Personnel)
(Document)-[:MENTIONS]->(Equipment | Failure | Procedure)
(Document)-[:CONTAINS]->(Procedure)`
    },
    chroma: {
      title: 'ChromaDB Vector Store Collection Schema',
      description: '500-character overlapping chunks carrying metadata tags for citation deep-linking.',
      code: `{
  "collection": "documents",
  "embedding_model": "models/embedding-001",
  "chunk_metadata": {
    "doc_id": "doc_88405_uuid",
    "source_filename": "WO-88405-valve-actuator-overhaul.json",
    "doc_type": "work_order",
    "chunk_index": 0,
    "page_number": 1,
    "equipment_tags": ["XV-204B", "P-101A"]
  }
}`
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36]">
              Industrial Document Corpus & Database Schemas
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-3 py-1 rounded-full border border-[#1D9E75]/30">
              Schema Locked
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-1 font-medium">
            Real sample document corpus (Vision Pavers / Index Industries) & unified database schemas.
          </p>
        </div>
      </div>

      {/* Feature Capabilities Overview */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <h3 className="text-base font-extrabold text-[#0D3B36]">Data & Schema Foundation</h3>
        
        <div className="overflow-x-auto rounded-2xl border border-[rgba(13,59,54,0.08)]">
          <table className="w-full text-left border-collapse text-xs text-[#0D3B36]">
            <thead>
              <tr className="bg-[#DCEEE7]/40 text-[#6B7B76] uppercase font-bold text-[11px] border-b border-[rgba(13,59,54,0.08)]">
                <th className="py-3 px-4">Data Domain</th>
                <th className="py-3 px-4">Implementation Detail</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(13,59,54,0.06)] font-medium">
              <tr>
                <td className="py-3 px-4 font-bold">Real Demo Documents</td>
                <td className="py-3 px-4">Vision Pavers / Index Industries Work Orders & Inspection Reports in `data/samples/`</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Available ({samples.length} Files)</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Supplementary Regulatory Standards</td>
                <td className="py-3 px-4">OSHA & API 570 regulatory standards in `data/samples/regulatory/`</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Available</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">MongoDB Document Schema</td>
                <td className="py-3 px-4">Pydantic `DocumentMetadata` model in `backend/app/models/schemas.py`</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Locked</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Neo4j Knowledge Graph Schema</td>
                <td className="py-3 px-4">6 Entity Node Types & 7 Relationship Types locked in `schemas.py`</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Locked</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">ChromaDB Vector Collection Schema</td>
                <td className="py-3 px-4">500-character text chunking format with metadata tags for citation linking</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Locked</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Document Catalog Explorer */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#1D9E75]" />
            <h3 className="text-base font-extrabold text-[#0D3B36]">
              Industrial Sample Document Catalog (`data/samples/`)
            </h3>
          </div>
          <span className="text-xs font-bold bg-[#DCEEE7] text-[#0D3B36] px-3 py-1 rounded-full">
            {samples.length} Documents Registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((doc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0D3B36] truncate">{doc.filename}</span>
                <span className="text-[10px] font-mono font-bold bg-[#0D3B36] text-white px-2 py-0.5 rounded-md uppercase">
                  {doc.category}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7B76] font-mono">
                Path: {doc.relative_path}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Entity & Schema Specification Viewer */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(13,59,54,0.08)]">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#1D9E75]" />
            <h3 className="text-base font-extrabold text-[#0D3B36]">
              Database Schema Specification Viewer
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-[#DCEEE7]/50 p-1.5 rounded-2xl border border-[rgba(13,59,54,0.06)]">
            <button
              onClick={() => setActiveSchemaTab('mongo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSchemaTab === 'mongo' ? 'bg-[#0D3B36] text-white' : 'text-[#6B7B76]'
              }`}
            >
              MongoDB
            </button>
            <button
              onClick={() => setActiveSchemaTab('neo4j')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSchemaTab === 'neo4j' ? 'bg-[#0D3B36] text-[#FFFFFF]' : 'text-[#6B7B76]'
              }`}
            >
              Neo4j Graph
            </button>
            <button
              onClick={() => setActiveSchemaTab('chroma')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSchemaTab === 'chroma' ? 'bg-[#0D3B36] text-white' : 'text-[#6B7B76]'
              }`}
            >
              ChromaDB
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-[#0D3B36] mb-1">
            {schemas[activeSchemaTab].title}
          </h4>
          <p className="text-xs text-[#6B7B76] mb-3">
            {schemas[activeSchemaTab].description}
          </p>
          <pre className="bg-[#0D3B36] text-[#DCEEE7] p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
            {schemas[activeSchemaTab].code}
          </pre>
        </div>
      </div>
    </div>
  );
}
