import React from 'react';
import IngestionWorkbench from '../components/IngestionWorkbench';
import { Cpu, CheckCircle2, Layers } from 'lucide-react';

export default function IngestionPipelinePage({ processedDocs = [], onDocumentProcessed }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36]">
              Document Ingestion & Extraction Pipeline
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-3 py-1 rounded-full border border-[#1D9E75]/30">
              Pipeline Active
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-1 font-medium">
            Format detector, Tesseract OCR, Groq LLM entity extraction, confidence scoring & unified normalizer.
          </p>
        </div>
      </div>

      {/* Feature Status Table */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <h3 className="text-base font-extrabold text-[#0D3B36]">Pipeline Capabilities & Module Status</h3>
        
        <div className="overflow-x-auto rounded-2xl border border-[rgba(13,59,54,0.08)]">
          <table className="w-full text-left border-collapse text-xs text-[#0D3B36]">
            <thead>
              <tr className="bg-[#DCEEE7]/40 text-[#6B7B76] uppercase font-bold text-[11px] border-b border-[rgba(13,59,54,0.08)]">
                <th className="py-3 px-4">Pipeline Feature</th>
                <th className="py-3 px-4">Module Implementation</th>
                <th className="py-3 px-4">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(13,59,54,0.06)] font-medium">
              <tr>
                <td className="py-3 px-4 font-bold">Format detection</td>
                <td className="py-3 px-4">`app/ingestion/format_detector.py` (Text PDF vs scanned PDF vs image vs P&ID vs JSON)</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">OCR (Tesseract)</td>
                <td className="py-3 px-4">`app/ingestion/ocr.py` text extraction with page numbers & bounding boxes</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">PaddleOCR fallback</td>
                <td className="py-3 px-4">`app/ingestion/ocr.py` fallback handler when Tesseract quality is low</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Groq-based entity extraction</td>
                <td className="py-3 px-4">`app/ingestion/extractor.py` Groq Llama3 & Gemini structured JSON prompts</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Extraction confidence scoring</td>
                <td className="py-3 px-4">Entity self-reported confidence & `confidence_avg` calculation</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Normalizer (unified schema)</td>
                <td className="py-3 px-4">`app/ingestion/normalizer.py` payload generator for Mongo/Neo4j/Chroma</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">YOLOv8 P&ID symbol detection</td>
                <td className="py-3 px-4">P&ID symbol class parser & image heuristic fallback in `format_detector.py`</td>
                <td className="py-3 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Operational</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Live Ingestion Workbench */}
      <IngestionWorkbench onDocumentProcessed={onDocumentProcessed} />

      {/* Session Ingestion Results Log */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#1D9E75]" />
            <h3 className="text-base font-extrabold text-[#0D3B36]">
              Session Ingested Document Payloads
            </h3>
          </div>
          <span className="text-xs font-bold bg-[#DCEEE7] text-[#0D3B36] px-3 py-1 rounded-full">
            {processedDocs.length} Documents Normalized
          </span>
        </div>

        {processedDocs.length > 0 ? (
          <div className="space-y-4">
            {processedDocs.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0D3B36]">{doc.filename}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-[#1D9E75] text-white px-2 py-0.5 rounded-full">
                      Avg Conf: {(doc.confidence_avg * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#0D3B36] text-white px-2 py-0.5 rounded-md">
                      {doc.doc_type}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#6B7B76]">
                  Extracted <span className="font-bold text-[#0D3B36]">{doc.extracted_entity_count} entities</span> and <span className="font-bold text-[#0D3B36]">{doc.relationships?.length || 0} relationships</span> across <span className="font-bold text-[#0D3B36]">{doc.chunk_count} vector chunks</span>.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#DCEEE7]/20 border border-dashed border-[rgba(13,59,54,0.12)]">
            <Cpu className="h-8 w-8 text-[#6B7B76] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-[#0D3B36]">No documents normalized in current session</p>
            <p className="text-xs text-[#6B7B76] mt-1 max-w-md mx-auto">
              Use the workbench above to execute the live FastAPI ingestion pipeline on any sample document or custom file upload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
