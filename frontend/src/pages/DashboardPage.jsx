import React from 'react';
import StatCard from '../components/StatCard';
import HeatmapGrid from '../components/HeatmapGrid';
import AlertCard from '../components/AlertCard';
import { statSummary, heatmapMatrix, anomalies } from '../mockData';
import { Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function DashboardPage({ onSelectAlert, onViewAllAlerts }) {
  // Take top 4 active alerts for dashboard view
  const activeAlerts = anomalies.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D3B36] tracking-tight">
            SOC Operational Dashboard
          </h2>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Phase 2 real-time anomaly detection & telemetry monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#1D9E75]/15 text-[#0D3B36] border border-[#1D9E75]/30 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
            <span>Telemetry Pipeline Healthy</span>
          </div>

          <button
            onClick={onViewAllAlerts}
            className="bg-[#0D3B36] hover:bg-[#155A52] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All {anomalies.length} Alerts</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Top Stat Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard type="activeAnomalies" data={statSummary} />
        <StatCard type="riskScore" data={statSummary} />
        <StatCard type="systemsMonitored" data={statSummary} />
        <StatCard type="stackedStats" data={statSummary} />
      </div>

      {/* Network Health Snapshot (Heatmap Tile) */}
      <HeatmapGrid matrixData={heatmapMatrix} />

      {/* Active Alerts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-[#0D3B36] tracking-tight">
              Active Security Alerts
            </h3>
            <span className="bg-[#F0785A]/15 text-[#8C2911] border border-[#F0785A]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {activeAlerts.length} Critical/High
            </span>
          </div>

          <button
            onClick={onViewAllAlerts}
            className="text-xs font-bold text-[#1D9E75] hover:underline cursor-pointer"
          >
            See full feed →
          </button>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onSelectAlert={onSelectAlert} />
          ))}
        </div>
      </div>
    </div>
  );
}
