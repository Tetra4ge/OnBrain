import React from 'react';
import { TrendingUp, ShieldAlert, Server, Activity, Clock, Zap } from 'lucide-react';

export default function StatCard({ type, data }) {
  // Card 1: Active Anomalies (with sparkline)
  if (type === 'activeAnomalies') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76]">Active Anomalies</span>
          <div className="h-9 w-9 rounded-2xl bg-[#F0785A]/15 text-[#F0785A] flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="text-4xl font-extrabold text-[#0D3B36] tracking-tight">{data.activeAnomalies}</div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#F0785A] bg-[#F0785A]/10 px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{data.activeTrend}</span>
          </div>
        </div>
        {/* SVG Sparkline */}
        <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)]">
          <div className="flex items-center justify-between text-xs text-[#6B7B76] mb-1.5">
            <span>Last 24 hrs Activity</span>
            <span className="font-semibold text-[#0D3B36]">Peak: 18/hr</span>
          </div>
          <svg className="w-full h-9 overflow-visible" viewBox="0 0 100 25">
            <path
              d="M0 20 Q 15 18, 30 12 T 60 15 T 80 4 T 100 8"
              fill="none"
              stroke="#F0785A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 20 Q 15 18, 30 12 T 60 15 T 80 4 T 100 8 L 100 25 L 0 25 Z"
              fill="url(#gradient-coral)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient-coral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F0785A" />
                <stop offset="100%" stopColor="#F0785A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  // Card 2: Risk Score (Large number on colored block: shifts teal/amber/coral)
  if (type === 'riskScore') {
    const score = data.riskScore;
    let bgGradient = 'from-[#1D9E75] to-[#147A5A]'; // teal (safe)
    let scoreLabel = 'Low Threat';
    let textColor = 'text-white';

    if (score >= 70) {
      bgGradient = 'from-[#F0785A] to-[#D6593B]'; // coral (critical)
      scoreLabel = 'Critical Risk';
    } else if (score >= 40) {
      bgGradient = 'from-[#F4B740] to-[#D49822]'; // amber (medium)
      scoreLabel = 'Elevated Risk';
    }

    return (
      <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl p-6 shadow-soft shadow-card-hover text-white flex flex-col justify-between relative overflow-hidden`}>
        {/* Decorative circle glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

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
          <span className="text-xs text-white/90 font-medium">Updated 1m ago</span>
        </div>
      </div>
    );
  }

  // Card 3: Systems Monitored
  if (type === 'systemsMonitored') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76]">Systems Monitored</span>
          <div className="h-9 w-9 rounded-2xl bg-[#1D9E75]/15 text-[#1D9E75] flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-4xl font-extrabold text-[#0D3B36] tracking-tight">{data.systemsMonitored}</div>
          <div className="text-xs font-bold text-[#1D9E75] bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">
            {data.systemsOnline} / {data.systemsMonitored} Online
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between text-xs text-[#6B7B76]">
          <span>SCADA, DB, IAM, Firewall</span>
          <span className="text-[#1D9E75] font-semibold">97.6% Operational</span>
        </div>
      </div>
    );
  }

  // Card 4: Stacked Mini-Stats (Anomalies Today / Correlated Attacks / Avg Response Time)
  if (type === 'stackedStats') {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between gap-3">
        {/* Mini Item 1 */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#F4B740]/20 text-[#7A5400] flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Anomalies Today</span>
          </div>
          <span className="text-lg font-extrabold text-[#0D3B36]">{data.anomaliesToday}</span>
        </div>

        {/* Mini Item 2 */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#F0785A]/20 text-[#8C2911] flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Correlated Attacks</span>
          </div>
          <span className="text-lg font-extrabold text-[#F0785A]">{data.correlatedAttacks}</span>
        </div>

        {/* Mini Item 3 */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-[#1D9E75]/20 text-[#1D9E75] flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#6B7B76]">Avg Response Time</span>
          </div>
          <span className="text-lg font-extrabold text-[#1D9E75]">{data.avgResponseTime}</span>
        </div>
      </div>
    );
  }

  return null;
}
