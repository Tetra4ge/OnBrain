import React from 'react';

export default function MitreStepper({ stages }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-[#0D3B36] tracking-tight">
            MITRE ATT&CK® Killchain Stage Tracker
          </h3>
          <p className="text-xs text-[#6B7B76]">Progression map of correlated anomalies across tactics</p>
        </div>
        <span className="text-xs font-bold text-[#1D9E75] bg-[#1D9E75]/15 px-3 py-1 rounded-full border border-[#1D9E75]/30">
          6 of 8 Tactics Active
        </span>
      </div>

      {/* Horizontal Stepper */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-3 min-w-[720px] justify-between">
          {stages.map((stage, idx) => {
            const isActive = stage.active;

            let badgeStyle = 'bg-[#DCEEE7]/30 text-[#6B7B76] border-[rgba(13,59,54,0.08)]';
            if (isActive) {
              if (stage.severity === 'critical' || stage.severity === 'high') {
                badgeStyle = 'bg-[#F0785A] text-white border-[#F0785A] shadow-md shadow-[#F0785A]/20';
              } else if (stage.severity === 'medium') {
                badgeStyle = 'bg-[#F4B740] text-[#0D3B36] border-[#F4B740] shadow-sm';
              } else {
                badgeStyle = 'bg-[#1D9E75] text-white border-[#1D9E75] shadow-sm';
              }
            }

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Pill */}
                <div
                  className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-200 flex-1 ${badgeStyle}`}
                >
                  <span className="text-[10px] font-mono font-extrabold opacity-80 uppercase tracking-wider">
                    {stage.code}
                  </span>
                  <span className="text-xs font-extrabold mt-0.5 whitespace-nowrap">
                    {stage.name}
                  </span>
                  <span className="text-[9px] mt-1 font-bold opacity-90 uppercase tracking-widest">
                    {isActive ? 'TRIGGERED' : 'INACTIVE'}
                  </span>
                </div>

                {/* Connector Line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`h-[2px] w-4 flex-shrink-0 ${
                      isActive && stages[idx + 1].active
                        ? 'bg-[#F0785A]'
                        : 'bg-[#DCEEE7]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
