import React from 'react';
import SeverityBadge from './SeverityBadge';

export default function TimelineEventBlock({ event, onClick, isExpanded = false }) {
  const getSeverityStyle = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical':
      case 'high':
        return {
          bg: 'bg-[#F0785A]/15 hover:bg-[#F0785A]/25',
          border: 'border-l-4 border-l-[#F0785A] border-y border-r border-y-[rgba(13,59,54,0.06)] border-r-[rgba(13,59,54,0.06)]',
          text: 'text-[#8C2911]',
          time: 'bg-[#F0785A]/20 text-[#8C2911]',
        };
      case 'medium':
        return {
          bg: 'bg-[#F4B740]/15 hover:bg-[#F4B740]/25',
          border: 'border-l-4 border-l-[#F4B740] border-y border-r border-y-[rgba(13,59,54,0.06)] border-r-[rgba(13,59,54,0.06)]',
          text: 'text-[#7A5400]',
          time: 'bg-[#F4B740]/25 text-[#7A5400]',
        };
      default: // low / info
        return {
          bg: 'bg-[#1D9E75]/15 hover:bg-[#1D9E75]/25',
          border: 'border-l-4 border-l-[#1D9E75] border-y border-r border-y-[rgba(13,59,54,0.06)] border-r-[rgba(13,59,54,0.06)]',
          text: 'text-[#0D3B36]',
          time: 'bg-[#1D9E75]/20 text-[#0D3B36]',
        };
    }
  };

  const style = getSeverityStyle(event.severity);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-3.5 ${style.bg} ${style.border} transition-all duration-200 cursor-pointer shadow-sm`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${style.time}`}>
          {event.time}
        </span>
        <SeverityBadge severity={event.severity} size="small" />
      </div>

      <h5 className="text-xs font-bold text-[#0D3B36] mt-2 leading-snug">
        {event.title}
      </h5>

      {event.category && (
        <span className="inline-block text-[10px] font-semibold text-[#6B7B76] mt-1">
          Category: {event.category}
        </span>
      )}

      {/* Expanded view for correlation page */}
      {isExpanded && (
        <div className="mt-3 pt-2.5 border-t border-[rgba(13,59,54,0.08)] text-xs space-y-1.5 text-[#0D3B36]">
          {event.mitreTechnique && (
            <div className="font-mono text-[11px] bg-white/70 px-2 py-1 rounded-lg border border-[rgba(13,59,54,0.08)]">
              <span className="font-bold text-[#1D9E75]">MITRE:</span> {event.mitreTechnique}
            </div>
          )}
          {event.description && <p className="text-[#6B7B76] leading-relaxed">{event.description}</p>}
          {event.system && (
            <div className="text-[11px] text-[#0D3B36] font-semibold">
              System: <span className="font-normal">{event.system}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
