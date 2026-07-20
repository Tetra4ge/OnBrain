import React from 'react';
import { Shield, Search, Bell, Mail, User } from 'lucide-react';

export default function TopNav({ activeTab, setActiveTab, unreadCount = 14 }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'correlation', label: 'Correlation' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[rgba(13,59,54,0.08)] px-6 py-3.5 shadow-soft">
      <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0D3B36] text-[#DCEEE7] flex items-center justify-center shadow-md">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#0D3B36]">OnBrain</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1D9E75]/15 text-[#1D9E75] px-2 py-0.5 rounded-full">SOC AI</span>
              </div>
              <p className="text-[11px] text-[#6B7B76] font-medium -mt-0.5">Knowledge Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs (Dashboard | Alerts | Correlation) */}
          <nav className="flex items-center bg-[#DCEEE7]/50 p-1.5 rounded-2xl border border-[rgba(13,59,54,0.06)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
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
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B76]" />
            <input
              type="text"
              placeholder="Search alerts, assets, users, MITRE codes..."
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
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[#F0785A] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            className="p-2.5 rounded-xl text-[#0D3B36] hover:bg-[#DCEEE7]/60 transition-colors cursor-pointer hidden sm:block"
            aria-label="Inbox"
          >
            <Mail className="h-5 w-5" />
          </button>

          <div className="h-6 w-[1px] bg-[rgba(13,59,54,0.1)] hidden sm:block" />

          {/* User Avatar & Role */}
          <div className="flex items-center gap-3 pl-1">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Security Analyst"
                className="h-10 w-10 rounded-2xl object-cover ring-2 ring-[#1D9E75]/30"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#1D9E75] ring-2 ring-white" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-bold text-[#0D3B36] leading-snug">Alex Rivera</div>
              <div className="text-xs text-[#6B7B76] font-medium">Security Analyst (L2)</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
