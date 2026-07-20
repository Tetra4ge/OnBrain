import React, { useState } from 'react';
import { Clock, ExternalLink, Sliders, User, ShieldAlert, Check } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function AlertCard({ alert, onSelectAlert }) {
  const [autoResponse, setAutoResponse] = useState(alert.autoResponseEnabled ?? true);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between transition-all duration-200">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={alert.severity} />
          <span className="bg-[#DCEEE7]/50 text-[#0D3B36] text-xs font-bold px-2.5 py-1 rounded-full border border-[rgba(13,59,54,0.06)]">
            {alert.category || alert.type}
          </span>
          <span className="text-xs font-mono text-[#6B7B76] bg-[#DCEEE7]/30 px-2 py-0.5 rounded-md">
            {alert.id}
          </span>
        </div>

        {/* Action / Detail buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectAlert && onSelectAlert(alert)}
            className="p-2 rounded-xl text-[#6B7B76] hover:text-[#0D3B36] hover:bg-[#DCEEE7]/50 transition-colors cursor-pointer"
            title="Inspect Anomaly Details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Alert Title & Details */}
      <div className="mt-3">
        <h4 className="text-base font-extrabold text-[#0D3B36] tracking-tight leading-snug line-clamp-1">
          {alert.title}
        </h4>
        <p className="text-xs text-[#6B7B76] font-medium mt-1 flex items-center gap-2">
          <span>Target:</span>
          <span className="font-semibold text-[#0D3B36] bg-[#DCEEE7]/40 px-2 py-0.5 rounded-lg">
            {alert.affectedUserDevice}
          </span>
        </p>
      </div>

      {/* Time & Deviation Score Row */}
      <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7B76]">
          <Clock className="h-3.5 w-3.5 text-[#1D9E75]" />
          <span>{alert.timeRange || alert.timeAgo}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#6B7B76] font-medium">Deviation Score:</span>
          <span className="text-xs font-bold text-[#0D3B36] bg-[#DCEEE7] px-2 py-0.5 rounded-md">
            {alert.deviationScore}/100
          </span>
        </div>
      </div>

      {/* Bottom Control Bar: Avatar Stack + Auto Response Toggle Switch */}
      <div className="mt-3.5 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between gap-3">
        {/* Analyst Avatar Stack */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#6B7B76] uppercase tracking-wider">Assigned:</span>
          <div className="flex -space-x-2 overflow-hidden">
            {alert.assignedAnalysts && alert.assignedAnalysts.length > 0 ? (
              alert.assignedAnalysts.map((analyst, idx) => (
                <img
                  key={idx}
                  src={analyst.avatar}
                  alt={analyst.name}
                  title={analyst.name}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                />
              ))
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#DCEEE7] flex items-center justify-center text-[#6B7B76]">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Auto Response Toggle Switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#6B7B76] hidden sm:inline">Auto-Mitigate</span>
          <button
            type="button"
            onClick={() => setAutoResponse(!autoResponse)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              autoResponse ? 'bg-[#1D9E75]' : 'bg-[#6B7B76]/30'
            }`}
            role="switch"
            aria-checked={autoResponse}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                autoResponse ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
