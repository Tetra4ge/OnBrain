import React from 'react';
import { Calendar, RefreshCw, Layers } from 'lucide-react';

export default function SidebarTimeline({ processedDocs = [] }) {
  return (
    <aside className="w-full lg:w-80 bg-white rounded-3xl p-5 shadow-soft border border-[rgba(13,59,54,0.06)] flex flex-col h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,59,54,0.06)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#DCEEE7] text-[#0D3B36] flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0D3B36] tracking-tight block">Live Ingestion Feed</span>
              <span className="text-[11px] text-[#6B7B76] font-medium">Session Timeline</span>
            </div>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="mt-4 flex items-center justify-between bg-[#DCEEE7]/40 px-3 py-2 rounded-2xl border border-[rgba(13,59,54,0.06)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D9E75]"></span>
            </span>
            <span className="text-xs font-bold text-[#0D3B36]">Pipeline Listening</span>
          </div>
          <RefreshCw className="h-3.5 w-3.5 text-[#6B7B76] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Live Ingested Events Stream */}
        <div className="mt-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {processedDocs.length > 0 ? (
            processedDocs.map((doc, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0D3B36]">{doc.filename}</span>
                  <span className="text-[9px] font-bold bg-[#1D9E75] text-white px-1.5 py-0.5 rounded-md">
                    INGESTED
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7B76]">
                  Doc Type: <span className="font-semibold text-[#0D3B36]">{doc.doc_type}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[#6B7B76] space-y-2">
              <Layers className="h-6 w-6 text-[#6B7B76] mx-auto opacity-40" />
              <p className="font-medium">No document ingestion events logged yet in this session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between text-xs text-[#6B7B76]">
        <span>{processedDocs.length} Documents Ingested</span>
        <span className="text-[#1D9E75] font-bold">FastAPI Sync</span>
      </div>
    </aside>
  );
}
