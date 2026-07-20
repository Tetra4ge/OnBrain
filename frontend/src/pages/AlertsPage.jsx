import React from 'react';
import DataTable from '../components/DataTable';
import DetailDrawer from '../components/DetailDrawer';
import { ShieldAlert, Download, RefreshCw, Cpu } from 'lucide-react';

export default function AlertsPage({ processedDocs = [], selectedAlert, setSelectedAlert }) {
  // Map real processed documents into telemetry items if present
  const telemetryItems = processedDocs.flatMap((doc, docIdx) => {
    const docEntities = doc.entities || {};
    const failures = docEntities.failures || [];
    const workOrders = docEntities.work_orders || [];

    if (failures.length === 0 && workOrders.length === 0) {
      return [{
        id: `DOC-${docIdx + 1}`,
        title: `Processed Document: ${doc.filename}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: doc.doc_type || 'Ingestion Event',
        affectedUserDevice: doc.filename,
        deviationScore: 0,
        severity: 'low',
        status: 'complete',
        category: 'Ingestion',
        baselineVal: 'Standard document structure',
        observedVal: `${doc.raw_text?.length || 0} characters extracted`,
        logSnippet: JSON.stringify(doc.format_info || {}, null, 2),
      }];
    }

    return failures.map((f, fIdx) => ({
      id: f.id || `FAIL-${fIdx + 1}`,
      title: `Failure Record: ${f.description || f.id}`,
      timestamp: f.date || new Date().toISOString().slice(0, 10),
      type: 'Equipment Failure',
      affectedUserDevice: f.equipment_tag || doc.filename,
      deviationScore: f.severity === 'critical' ? 90 : f.severity === 'high' ? 75 : 45,
      severity: f.severity || 'medium',
      status: 'open',
      category: 'Failure Extraction',
      baselineVal: 'Zero unexpected equipment failure events',
      observedVal: f.description || 'Failure recorded in ingested maintenance log',
      logSnippet: JSON.stringify(f, null, 2),
    }));
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36] tracking-tight">
              Telemetry & Anomaly Feed
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#1D9E75]/30">
              Live Backend
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Searchable audit trail derived from ingested documents
          </p>
        </div>
      </div>

      {/* Main Filterable Data Table */}
      <DataTable data={telemetryItems} onRowClick={(alert) => setSelectedAlert(alert)} />

      {/* Detail Drawer (Slide-in Panel from Right) */}
      <DetailDrawer
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
