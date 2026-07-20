import React from 'react';

export default function SeverityBadge({ severity = 'low', size = 'normal', text }) {
  const normalized = (severity || 'low').toLowerCase();

  const styles = {
    low: {
      bg: 'bg-[#1D9E75]/15',
      text: 'text-[#0D3B36]',
      border: 'border-[#1D9E75]/30',
      dot: 'bg-[#1D9E75]',
    },
    info: {
      bg: 'bg-[#1D9E75]/15',
      text: 'text-[#0D3B36]',
      border: 'border-[#1D9E75]/30',
      dot: 'bg-[#1D9E75]',
    },
    medium: {
      bg: 'bg-[#F4B740]/20',
      text: 'text-[#7A5400]',
      border: 'border-[#F4B740]/40',
      dot: 'bg-[#F4B740]',
    },
    high: {
      bg: 'bg-[#F0785A]/20',
      text: 'text-[#8C2911]',
      border: 'border-[#F0785A]/40',
      dot: 'bg-[#F0785A]',
    },
    critical: {
      bg: 'bg-[#F0785A]/25',
      text: 'text-[#8C2911]',
      border: 'border-[#F0785A]/50',
      dot: 'bg-[#F0785A] animate-pulse',
    },
  };

  const activeStyle = styles[normalized] || styles.low;
  const padding = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';
  const labelText = text || normalized.toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${activeStyle.bg} ${activeStyle.text} ${activeStyle.border} ${padding} transition-all duration-150`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${activeStyle.dot}`} />
      <span>{labelText}</span>
    </span>
  );
}
