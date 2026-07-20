import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import HeatmapGrid from '../components/HeatmapGrid';
import IngestionWorkbench from '../components/IngestionWorkbench';
import { initialStatSummary, emptyHeatmapMatrix } from '../mockData';
import { Activity, ShieldAlert, Cpu, Layers, FileCheck } from 'lucide-react';

export default function DashboardPage({ processedDocs = [], onDocumentProcessed }) {
  const [stats, setStats] = useState({
    ...initialStatSummary,
    systemsMonitored: 5,
  });

  return (
    <div className="space-y-6">
      {/* Welcome & System Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D3B36] tracking-tight">
            SOC Operational Dashboard
          </h2>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Live system telemetry & document ingestion pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#1D9E75]/15 text-[#0D3B36] border border-[#1D9E75]/30 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
            <span>FastAPI Ingestion Engine Ready</span>
          </div>
        </div>
      </div>

      {/* Top Stat Row (4 Cards - Live State) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard type="activeAnomalies" data={stats} />
        <StatCard type="riskScore" data={stats} />
        <StatCard type="systemsMonitored" data={stats} />
        <StatCard type="stackedStats" data={stats} />
      </div>

      {/* Live Ingestion Pipeline Workbench */}
      <IngestionWorkbench onDocumentProcessed={onDocumentProcessed} />

      {/* Network Health Snapshot (Heatmap Tile) */}
      <HeatmapGrid matrixData={emptyHeatmapMatrix} />

      {/* Ingested Documents & Active Telemetry Feed */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#1D9E75]" />
            <h3 className="text-base font-extrabold text-[#0D3B36]">
              Processed Telemetry & Ingested Documents
            </h3>
          </div>
          <span className="text-xs font-bold bg-[#DCEEE7] text-[#0D3B36] px-3 py-1 rounded-full">
            {processedDocs.length} Documents Ingested
          </span>
        </div>

        {processedDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedDocs.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0D3B36]">{doc.filename}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#0D3B36] text-white px-2 py-0.5 rounded-md">
                    {doc.doc_type}
                  </span>
                </div>
                <div className="text-xs text-[#6B7B76]">
                  Entities extracted: <span className="font-bold text-[#0D3B36]">{Object.keys(doc.entities || {}).reduce((acc, k) => acc + (doc.entities[k]?.length || 0), 0)}</span>
                </div>
                <div className="text-[11px] text-[#6B7B76] truncate font-mono">
                  Path: {doc.source_path || doc.filename}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#DCEEE7]/20 border border-dashed border-[rgba(13,59,54,0.12)]">
            <Cpu className="h-8 w-8 text-[#6B7B76] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-[#0D3B36]">No documents ingested in current session</p>
            <p className="text-xs text-[#6B7B76] mt-1 max-w-md mx-auto">
              Use the Document Ingestion Workbench above to process sample work orders, inspection reports, or custom files through the live backend pipeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
