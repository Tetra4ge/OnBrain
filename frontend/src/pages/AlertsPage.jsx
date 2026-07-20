import React from 'react';
import DataTable from '../components/DataTable';
import DetailDrawer from '../components/DetailDrawer';
import { anomalies } from '../mockData';
import { ShieldAlert, Download, RefreshCw } from 'lucide-react';

export default function AlertsPage({ selectedAlert, setSelectedAlert }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36] tracking-tight">
              Anomaly Telemetry & Alerts Feed
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#1D9E75]/30">
              Phase 2 Detail
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Searchable log audit trail with behavioral deviation metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#DCEEE7]/50 hover:bg-[#DCEEE7] text-[#0D3B36] text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors flex items-center gap-2 cursor-pointer">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button className="bg-[#0D3B36] hover:bg-[#155A52] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
            <RefreshCw className="h-4 w-4" />
            <span>Live Sync</span>
          </button>
        </div>
      </div>

      {/* Main Filterable Data Table */}
      <DataTable data={anomalies} onRowClick={(alert) => setSelectedAlert(alert)} />

      {/* Detail Drawer (Slide-in Panel from Right) */}
      <DetailDrawer
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
