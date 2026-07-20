import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SidebarTimeline from './components/SidebarTimeline';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import CorrelationPage from './pages/CorrelationPage';
import { sidebarTimeline } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'alerts' | 'correlation'
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleSelectAlertFromCard = (alert) => {
    setSelectedAlert(alert);
    setActiveTab('alerts'); // Jump to detail feed drawer view
  };

  return (
    <div className="min-h-screen bg-[#DCEEE7] flex flex-col font-sans">
      {/* Global Top Bar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={14}
      />

      {/* Main Two-Column Body Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column: Active Main View (Dashboard / Alerts / Correlation) */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardPage
                onSelectAlert={handleSelectAlertFromCard}
                onViewAllAlerts={() => setActiveTab('alerts')}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsPage
                selectedAlert={selectedAlert}
                setSelectedAlert={setSelectedAlert}
              />
            )}

            {activeTab === 'correlation' && <CorrelationPage />}
          </div>

          {/* Right Column: Persistent Live Activity Timeline Panel */}
          <div className="w-full lg:w-80 flex-shrink-0 sticky top-24">
            <SidebarTimeline
              events={sidebarTimeline}
              onSelectEvent={(evt) => {
                setActiveTab('correlation');
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
