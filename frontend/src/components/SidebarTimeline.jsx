import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Activity, Zap, RefreshCw } from 'lucide-react';
import TimelineEventBlock from './TimelineEventBlock';

export default function SidebarTimeline({ events, onSelectEvent }) {
  const [currentDate, setCurrentDate] = useState('July 20, 2026');

  return (
    <aside className="w-full lg:w-80 bg-white rounded-3xl p-5 shadow-soft border border-[rgba(13,59,54,0.06)] flex flex-col h-full justify-between">
      <div>
        {/* Date Navigator Header (styled like reference calendar header) */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,59,54,0.06)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#DCEEE7] text-[#0D3B36] flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0D3B36] tracking-tight block">Live Timeline</span>
              <span className="text-[11px] text-[#6B7B76] font-medium">{currentDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-[#6B7B76] hover:bg-[#DCEEE7]/60 hover:text-[#0D3B36] transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-lg text-[#6B7B76] hover:bg-[#DCEEE7]/60 hover:text-[#0D3B36] transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Stream Indicator */}
        <div className="mt-4 flex items-center justify-between bg-[#DCEEE7]/40 px-3 py-2 rounded-2xl border border-[rgba(13,59,54,0.06)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D9E75]"></span>
            </span>
            <span className="text-xs font-bold text-[#0D3B36]">Real-time Anomaly Stream</span>
          </div>
          <RefreshCw className="h-3.5 w-3.5 text-[#6B7B76] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Time-Stamped Vertical Event Feed */}
        <div className="mt-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {events && events.length > 0 ? (
            events.map((event) => (
              <TimelineEventBlock
                key={event.id}
                event={event}
                onClick={() => onSelectEvent && onSelectEvent(event)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[#6B7B76]">
              No events recorded for this timeframe.
            </div>
          )}
        </div>
      </div>

      {/* Footer Mini-Summary */}
      <div className="mt-4 pt-3 border-t border-[rgba(13,59,54,0.06)] flex items-center justify-between text-xs text-[#6B7B76]">
        <div className="flex items-center gap-1.5 font-medium">
          <Zap className="h-3.5 w-3.5 text-[#F4B740]" />
          <span>{events.length} Events Logged Today</span>
        </div>
        <span className="text-[#1D9E75] font-bold">Auto-Sync On</span>
      </div>
    </aside>
  );
}
