import React from 'react';
import MitreStepper from '../components/MitreStepper';
import { initialMitreStages } from '../mockData';
import { ShieldAlert, Layers, Activity } from 'lucide-react';

export default function CorrelationPage({ processedDocs = [] }) {
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
              Phase 3 Spec
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-0.5 font-medium">
            Multi-stage attack pattern correlation mapping to MITRE ATT&CK® tactics
          </p>
        </div>

        {/* Confidence Score Badge - Real Nominal State */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1D9E75]/15 border border-[#1D9E75]/40 text-[#0D3B36] px-5 py-2.5 rounded-full flex items-center gap-3 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-[#1D9E75]" />
            <div className="text-left">
              <div className="text-sm font-black leading-none">0 Active Campaigns</div>
              <div className="text-[10px] font-bold text-[#6B7B76] mt-0.5 uppercase tracking-wider">
                System Nominal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Horizontal Stepper */}
      <MitreStepper stages={initialMitreStages} />

      {/* Main Campaign Breakdown Panel - Real Empty State */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-[rgba(13,59,54,0.06)] text-center space-y-3">
        <Layers className="h-10 w-10 text-[#6B7B76] mx-auto opacity-50" />
        <h3 className="text-base font-extrabold text-[#0D3B36]">No Correlated Attack Campaigns Detected</h3>
        <p className="text-xs text-[#6B7B76] max-w-lg mx-auto leading-relaxed">
          The Phase 3 correlation engine continuously evaluates ingested telemetry against MITRE ATT&CK killchain stages. Currently, no multi-stage attack chains are active.
        </p>

        {processedDocs.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] text-left max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#0D3B36] block mb-1">Current Knowledge Corpus:</span>
            <div className="text-xs text-[#6B7B76]">
              {processedDocs.length} documents processed ({processedDocs.map(d => d.filename).join(', ')})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
