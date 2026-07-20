import React, { useState, useEffect } from 'react';
import { FileText, Play, Upload, CheckCircle2, AlertTriangle, Cpu, ChevronRight, Layers, FileJson } from 'lucide-react';
import { getSampleDocuments, processSampleDocument, uploadDocumentFile } from '../lib/api';

export default function IngestionWorkbench({ onDocumentProcessed }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSamples = async () => {
      try {
        const docs = await getSampleDocuments();
        if (isMounted) {
          setSamples(docs);
          if (docs.length > 0) {
            setSelectedSample(docs[0].relative_path);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to retrieve sample document list.');
        }
      }
    };
    fetchSamples();
    return () => { isMounted = false; };
  }, []);

  const handleRunProcess = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let data;
      if (selectedFile) {
        data = await uploadDocumentFile(selectedFile);
      } else if (selectedSample) {
        data = await processSampleDocument(selectedSample);
      } else {
        throw new Error('Please select a sample document or choose a file to upload.');
      }

      setResult(data);
      if (onDocumentProcessed && data.document) {
        onDocumentProcessed(data.document);
      }
    } catch (err) {
      setError(err.message || 'Processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(13,59,54,0.08)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#0D3B36] text-white flex items-center justify-center shadow-md">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#0D3B36]">Document Ingestion Workbench</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1D9E75]/15 text-[#1D9E75] px-2 py-0.5 rounded-full">
                Backend Live
              </span>
            </div>
            <p className="text-xs text-[#6B7B76]">Execute OCR, format detection, and entity extraction pipeline</p>
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunProcess}
          disabled={loading}
          className="bg-[#1D9E75] hover:bg-[#157A5A] text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Execute Ingestion Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Inputs: Pick Sample or Upload Custom File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input 1: Sample Selector */}
        <div className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)]">
          <label className="block text-xs font-bold text-[#0D3B36] mb-1 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-[#1D9E75]" />
            <span>Select Sample Document (`data/samples/`)</span>
          </label>
          <select
            value={selectedSample}
            onChange={(e) => {
              setSelectedSample(e.target.value);
              setSelectedFile(null);
            }}
            className="w-full bg-white border border-[rgba(13,59,54,0.1)] rounded-xl px-3 py-2 text-xs font-medium text-[#0D3B36] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40"
          >
            {samples.length > 0 ? (
              samples.map((s, idx) => (
                <option key={idx} value={s.relative_path}>
                  [{s.category}] {s.filename}
                </option>
              ))
            ) : (
              <option value="">No sample documents found</option>
            )}
          </select>
        </div>

        {/* Input 2: File Upload */}
        <div className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)]">
          <label className="block text-xs font-bold text-[#0D3B36] mb-1 flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-[#1D9E75]" />
            <span>Or Upload Custom File</span>
          </label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="w-full text-xs text-[#6B7B76] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0D3B36] file:text-white cursor-pointer"
          />
          {selectedFile && (
            <span className="text-[11px] text-[#1D9E75] font-bold mt-1 block">
              Selected: {selectedFile.name}
            </span>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-[#F0785A]/15 border border-[#F0785A]/30 text-[#8C2911] text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Ingestion Output Result View */}
      {result && result.document && (
        <div className="space-y-4 pt-4 border-t border-[rgba(13,59,54,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#1D9E75]" />
              <h4 className="text-sm font-extrabold text-[#0D3B36]">
                Extraction Complete: {result.document.filename}
              </h4>
            </div>
            <span className="text-xs font-mono bg-[#DCEEE7] text-[#0D3B36] px-2.5 py-0.5 rounded-md font-bold">
              Doc Type: {result.document.doc_type}
            </span>
          </div>

          {/* Extracted Entities Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76] mb-2 block">
              Extracted Structured Entities ({Object.keys(result.document.entities || {}).reduce((acc, k) => acc + (result.document.entities[k]?.length || 0), 0)})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(result.document.entities || {}).map(([entityType, items]) => (
                <div key={entityType} className="p-3 rounded-xl bg-[#DCEEE7]/40 border border-[rgba(13,59,54,0.06)] text-xs">
                  <div className="font-extrabold text-[#0D3B36] capitalize mb-1 flex items-center justify-between">
                    <span>{entityType}</span>
                    <span className="text-[10px] bg-[#0D3B36] text-white px-1.5 py-0.5 rounded-full font-mono">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {items.map((item, i) => (
                      <div key={i} className="text-[11px] text-[#6B7B76] bg-white px-2 py-1 rounded-md border border-[rgba(13,59,54,0.04)] font-mono">
                        {item.tag || item.id || item.name || item.code || JSON.stringify(item)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Relationships */}
          {result.document.relationships && result.document.relationships.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76] mb-2 block">
                Knowledge Graph Relationships ({result.document.relationships.length})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {result.document.relationships.map((rel, idx) => (
                  <div key={idx} className="bg-[#0D3B36] text-white text-[11px] font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap shadow-xs">
                    <span>{rel.source}</span>
                    <span className="text-[#F4B740] font-bold">-{rel.type}-&gt;</span>
                    <span>{rel.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
