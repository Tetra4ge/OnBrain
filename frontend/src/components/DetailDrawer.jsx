import React from 'react';
import { X, ShieldAlert, Terminal, Activity, CheckCircle, Lock, User, Clock } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function DetailDrawer({ alert, isOpen, onClose }) {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0D3B36]/30 backdrop-blur-xs flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[rgba(13,59,54,0.1)] p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,59,54,0.08)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#0D3B36] text-white flex items-center justify-center shadow-md">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#6B7B76] font-bold">{alert.id}</span>
                <h3 className="text-base font-extrabold text-[#0D3B36] leading-tight">
                  {alert.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7B76] hover:bg-[#DCEEE7]/50 hover:text-[#0D3B36] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Badges & Meta */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={alert.severity} />
            <span className="bg-[#DCEEE7] text-[#0D3B36] text-xs font-bold px-3 py-1 rounded-full">
              {alert.category || alert.type}
            </span>
            <span className="text-xs text-[#6B7B76] font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {alert.timestamp}
            </span>
          </div>

          {/* Affected Target Card */}
          <div className="mt-5 p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7B76]">Affected Asset / User</span>
            <div className="text-sm font-extrabold text-[#0D3B36] mt-0.5">{alert.affectedUserDevice}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#6B7B76] pt-2 border-t border-[rgba(13,59,54,0.06)]">
              <span>Deviation Score</span>
              <span className="font-bold text-[#F0785A] bg-[#F0785A]/10 px-2 py-0.5 rounded-md">
                {alert.deviationScore}/100 Deviation
              </span>
            </div>
          </div>

          {/* Baseline vs Observed Comparison Block */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0D3B36]">
              Behavioral Deviation Breakdown
            </h4>

            <div className="p-4 rounded-2xl bg-white border border-[#1D9E75]/30 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1D9E75] mb-1">
                <CheckCircle className="h-4 w-4" />
                <span>Expected Historical Baseline</span>
              </div>
              <p className="text-xs text-[#0D3B36] font-medium">{alert.baselineVal}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#F0785A]/40 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F0785A] mb-1">
                <Activity className="h-4 w-4" />
                <span>Observed Anomalous Telemetry</span>
              </div>
              <p className="text-xs text-[#8C2911] font-semibold">{alert.observedVal}</p>
            </div>
          </div>

          {/* Raw Log Snippet Block */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D3B36] flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-[#1D9E75]" />
                <span>Raw Log Evidence</span>
              </span>
              <span className="text-[10px] font-mono text-[#6B7B76]">syslog / auditd</span>
            </div>
            <pre className="bg-[#0D3B36] text-[#DCEEE7] p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-[rgba(13,59,54,0.1)]">
              {alert.logSnippet}
            </pre>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 pt-4 border-t border-[rgba(13,59,54,0.08)] space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-[#F0785A] hover:bg-[#D6593B] text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer">
              <Lock className="h-4 w-4" />
              <span>Quarantine Asset</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#0D3B36] hover:bg-[#155A52] text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer">
              <User className="h-4 w-4" />
              <span>Assign Analyst</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[#DCEEE7]/50 hover:bg-[#DCEEE7] text-[#0D3B36] text-xs font-bold py-2.5 rounded-2xl transition-colors cursor-pointer"
          >
            Close Detail Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
