import React, { useState } from 'react';
import { Grid, Activity, Info } from 'lucide-react';

export default function HeatmapGrid({ matrixData }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getCellColor = (level) => {
    switch (level) {
      case 0:
        return 'bg-[#1D9E75]/20 hover:bg-[#1D9E75]/40 border-[#1D9E75]/30 text-[#0D3B36]'; // Safe/low
      case 1:
        return 'bg-[#F4B740]/30 hover:bg-[#F4B740]/50 border-[#F4B740]/50 text-[#7A5400]'; // Medium
      case 2:
        return 'bg-[#F0785A]/40 hover:bg-[#F0785A]/60 border-[#F0785A]/60 text-[#8C2911]'; // High
      case 3:
        return 'bg-[#F0785A] hover:bg-[#D6593B] border-[#F0785A] text-white animate-pulse'; // Critical
      default:
        return 'bg-[#DCEEE7]/50';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 0: return 'Normal activity (0-1 anomalies)';
      case 1: return 'Moderate deviation (2-4 anomalies)';
      case 2: return 'High anomaly density (5-9 anomalies)';
      case 3: return 'Critical spike (10+ anomalies)';
      default: return 'No data';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] shadow-card-hover flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#0D3B36]">Network Health Snapshot</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1D9E75]/15 text-[#1D9E75] px-2 py-0.5 rounded-full">
              Realtime Grid
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-0.5">Anomaly density per asset over 4-hour intervals</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6B7B76]">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#1D9E75]/40" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#F4B740]/50" />
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#F0785A]" />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Column Headers (Time Buckets) */}
          <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-2 mb-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7B76] flex items-center">
              System / Time
            </div>
            {matrixData.timeBuckets.map((bucket, idx) => (
              <div key={idx} className="text-center text-[11px] font-semibold text-[#6B7B76]">
                {bucket}
              </div>
            ))}
          </div>

          {/* Rows (Systems) */}
          <div className="space-y-2">
            {matrixData.systems.map((systemName, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-[140px_repeat(6,1fr)] gap-2 items-center">
                <div className="text-xs font-bold text-[#0D3B36] truncate pr-2" title={systemName}>
                  {systemName}
                </div>
                {matrixData.data[rowIndex].map((level, colIndex) => {
                  const isHovered =
                    hoveredCell && hoveredCell.row === rowIndex && hoveredCell.col === colIndex;

                  return (
                    <div
                      key={colIndex}
                      onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex, level })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-8 rounded-xl border ${getCellColor(
                        level
                      )} flex items-center justify-center cursor-pointer transition-all duration-150 relative font-bold text-xs`}
                    >
                      {level > 0 ? (level === 3 ? '!' : level) : ''}

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 bg-[#0D3B36] text-white text-[11px] p-2 rounded-xl shadow-xl pointer-events-none text-center">
                          <div className="font-bold text-[#DCEEE7]">{systemName}</div>
                          <div className="text-white/80 mt-0.5">{matrixData.timeBuckets[colIndex]}</div>
                          <div className="font-semibold text-[#F4B740] mt-1">{getLevelLabel(level)}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between text-xs text-[#6B7B76]">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#1D9E75]" />
          <span>Click any cell to filter alerts by system & time bucket</span>
        </div>
        <span className="font-semibold text-[#0D3B36]">Last synced: Just now</span>
      </div>
    </div>
  );
}
