import React from 'react';
import { ShieldAlert, Server, Activity, Clock, Zap } from 'lucide-react';

export default function StatCard({ type, data }) {
  // Card 1: Active Anomalies
  if (type === 'activeAnomalies') {
    const count = data.activeAnomalies || 0;
    return (
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76]">Active Anomalies</span>
          <div className="h-9 w-9 rounded-2xl bg-[#1D9E75]/15 text-[#1D9E75] flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="text-4xl font-extrabold text-[#0D3B36] tracking-tight">{count}</div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#1D9E75] bg-[#1D9E75]/10 px-2.5 py-1 rounded-full">
            <span>Nominal</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] text-xs text-[#6B7B76]">
          {count === 0 ? 'No active security deviations detected' : `${count} active anomaly events`}
        </div>
      </div>
    );
  }

  // Card 2: Risk Score
  if (type === 'riskScore') {
    const score = data.riskScore || 0;
    let bgGradient = 'from-[#1D9E75] to-[#147A5A]'; // safe
    let scoreLabel = 'Normal';

    if (score >= 70) {
      bgGradient = 'from-[#F0785A] to-[#D6593B]';
      scoreLabel = 'Critical Risk';
    } else if (score >= 40) {
      bgGradient = 'from-[#F4B740] to-[#D49822]';
      scoreLabel = 'Elevated Risk';
    }

    return (
      <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl p-6 shadow-soft shadow-card-hover text-white flex flex-col justify-between relative overflow-hidden`}>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Risk Score</span>
          <div className="h-9 w-9 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 relative z-10 flex items-baseline gap-3">
          <div className="text-5xl font-black tracking-tight">{score}</div>
          <span className="text-xl font-bold opacity-80">/100</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20 relative z-10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
            {scoreLabel}
          </span>
          <span className="text-xs text-white/90 font-medium">Live Monitoring</span>
        </div>
      </div>
    );
  }

  // Card 3: Systems Monitored
  if (type === 'systemsMonitored') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76]">Services & Engines</span>
          <div className="h-9 w-9 rounded-2xl bg-[#1D9E75]/15 text-[#1D9E75] flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-4xl font-extrabold text-[#0D3B36] tracking-tight">{data.systemsMonitored || 5}</div>
          <div className="text-xs font-bold text-[#1D9E75] bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">
            FastAPI / DB / Graph
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between text-xs text-[#6B7B76]">
          <span>Ingestion & Knowledge Stores</span>
          <span className="text-[#1D9E75] font-semibold">Ready</span>
        </div>
      </div>
    );
  }

  // Card 4: Stacked Stats
  if (type === 'stackedStats') {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#1D9E75]/20 text-[#1D9E75] flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Anomalies Today</span>
          </div>
          <span className="text-lg font-extrabold text-[#0D3B36]">{data.anomaliesToday || 0}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#1D9E75]/20 text-[#1D9E75] flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Correlated Attacks</span>
          </div>
          <span className="text-lg font-extrabold text-[#0D3B36]">{data.correlatedAttacks || 0}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#1D9E75]/20 text-[#1D9E75] flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Avg Response Time</span>
          </div>
          <span className="text-lg font-extrabold text-[#1D9E75]">{data.avgResponseTime || '--'}</span>
        </div>
      </div>
    );
  }

  return null;
}
