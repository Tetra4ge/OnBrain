import React, { useEffect, useState } from 'react';
import { Shield, Search, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkHealth } from '../lib/api';

export default function TopNav({ activeTab, setActiveTab }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });

  useEffect(() => {
    let isMounted = true;
    const verifyBackend = async () => {
      const status = await checkHealth();
      if (isMounted) {
        setBackendStatus({ online: status.online, checking: false });
      }
    };
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const tabs = [
    { id: 'health', label: 'System Health' },
    { id: 'data-schemas', label: 'Data & Schemas' },
    { id: 'ingestion', label: 'Ingestion Pipeline' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[rgba(13,59,54,0.08)] px-6 py-3.5 shadow-soft">
      <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0D3B36] text-[#DCEEE7] flex items-center justify-center shadow-md">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#0D3B36]">OnBrain</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1D9E75]/15 text-[#1D9E75] px-2 py-0.5 rounded-full">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-[#6B7B76] font-medium -mt-0.5">Industrial AI Operations</p>
            </div>
          </div>

          {/* Backend Health Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-[rgba(13,59,54,0.08)] bg-[#DCEEE7]/30">
            {backendStatus.checking ? (
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-ping" />
            ) : backendStatus.online ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1D9E75]" />
                <span className="text-[#0D3B36]">FastAPI API Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-[#F0785A]" />
                <span className="text-[#F0785A]">API Offline</span>
              </>
            )}
          </div>

          {/* Professional Functional Tabs */}
          <nav className="flex items-center bg-[#DCEEE7]/50 p-1.5 rounded-2xl border border-[rgba(13,59,54,0.06)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0D3B36] text-[#FFFFFF] shadow-sm'
                      : 'text-[#6B7B76] hover:text-[#0D3B36] hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B76]" />
            <input
              type="text"
              placeholder="Search assets, documents, entities..."
              className="w-full bg-[#DCEEE7]/40 border border-[rgba(13,59,54,0.08)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0D3B36] placeholder-[#6B7B76] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:bg-[#FFFFFF] transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & User Avatar */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2.5 rounded-xl text-[#0D3B36] hover:bg-[#DCEEE7]/60 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="h-6 w-[1px] bg-[rgba(13,59,54,0.1)] hidden sm:block" />

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-1">
            <div className="h-9 w-9 rounded-2xl bg-[#0D3B36] text-white flex items-center justify-center font-bold text-xs">
              ENG
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-bold text-[#0D3B36] leading-snug">Operations Engineer</div>
              <div className="text-xs text-[#6B7B76] font-medium">Command Center</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
