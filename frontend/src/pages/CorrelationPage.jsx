import React, { useState } from 'react';
import MitreStepper from '../components/MitreStepper';
import TimelineEventBlock from '../components/TimelineEventBlock';
import SeverityBadge from '../components/SeverityBadge';
import { mitreStages, correlatedIncidents } from '../mockData';
import { ShieldAlert, Zap, GitCommit, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function CorrelationPage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState(correlatedIncidents[0].id);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const activeIncident =
    correlatedIncidents.find((i) => i.id === selectedIncidentId) || correlatedIncidents[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Confidence Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36] tracking-tight">
              Attack Pattern Correlation Workbench
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#1D9E75]/30">
              Phase 3 View
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Multi-stage anomaly graph correlation mapping to MITRE ATT&CK® techniques
          </p>
        </div>

        {/* Top-Right Confidence Score Badge (Large Pill) */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F0785A]/15 border-2 border-[#F0785A] text-[#8C2911] px-5 py-2.5 rounded-full flex items-center gap-3 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-[#F0785A] animate-pulse" />
            <div className="text-left">
              <div className="text-sm font-black leading-none">
                {activeIncident.confidence}% Confidence Match
              </div>
              <div className="text-[10px] font-bold opacity-80 mt-0.5 uppercase tracking-wider">
                Matches Known APT Pattern
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Horizontal Stepper */}
      <MitreStepper stages={mitreStages} />

      {/* Incident Selection Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B76]">Correlated Campaigns:</span>
        {correlatedIncidents.map((incident) => {
          const isSelected = incident.id === selectedIncidentId;
          return (
            <button
              key={incident.id}
              onClick={() => setSelectedIncidentId(incident.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#0D3B36] text-white border-[#0D3B36] shadow-sm'
                  : 'bg-white text-[#6B7B76] border-[rgba(13,59,54,0.08)] hover:bg-[#DCEEE7]/50'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5" />
              <span>{incident.title}</span>
              <SeverityBadge severity={incident.severity} size="small" />
            </button>
          );
        })}
      </div>

      {/* Main Campaign Breakdown Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-6">
        {/* Campaign Details Header */}
        <div className="p-5 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#6B7B76]">{activeIncident.id}</span>
              <SeverityBadge severity={activeIncident.severity} />
              <span className="text-xs font-bold text-[#0D3B36] bg-[#DCEEE7] px-2.5 py-0.5 rounded-md">
                {activeIncident.mitreStage}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#0D3B36] mt-1">
              {activeIncident.title}
            </h3>
            <p className="text-xs text-[#6B7B76] mt-1 max-w-3xl leading-relaxed">
              {activeIncident.summary}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#0D3B36] whitespace-nowrap border-l border-[rgba(13,59,54,0.1)] pl-4">
            <div>
              <div className="text-[10px] text-[#6B7B76] uppercase tracking-wider font-semibold">Anomalies Chained</div>
              <div className="text-base font-black text-[#F0785A]">{activeIncident.anomaliesCount} Anomalies</div>
            </div>
            <div>
              <div className="text-[10px] text-[#6B7B76] uppercase tracking-wider font-semibold">First Detected</div>
              <div className="text-xs font-mono">{activeIncident.startTime}</div>
            </div>
          </div>
        </div>

        {/* Chronological Event Correlation Chain */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold text-[#0D3B36] tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#1D9E75]" />
              <span>Chronological Correlation Timeline</span>
            </h4>
            <span className="text-xs text-[#6B7B76]">Click any event block to expand raw telemetry & MITRE technique</span>
          </div>

          <div className="space-y-3">
            {activeIncident.timelineEvents.map((event) => {
              const isExpanded = expandedEventId === event.id;
              return (
                <TimelineEventBlock
                  key={event.id}
                  event={event}
                  isExpanded={isExpanded}
                  onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
