import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SidebarTimeline from './components/SidebarTimeline';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import CorrelationPage from './pages/CorrelationPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'alerts' | 'correlation'
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [processedDocs, setProcessedDocs] = useState([]);

  const handleDocumentProcessed = (newDoc) => {
    setProcessedDocs((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#DCEEE7] flex flex-col font-sans">
      {/* Global Top Bar (with Live FastAPI Health Check) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={0}
      />

      {/* Main Two-Column Body Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column: Active View */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardPage
                processedDocs={processedDocs}
                onDocumentProcessed={handleDocumentProcessed}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsPage
                processedDocs={processedDocs}
                selectedAlert={selectedAlert}
                setSelectedAlert={setSelectedAlert}
              />
            )}

            {activeTab === 'correlation' && (
              <CorrelationPage processedDocs={processedDocs} />
            )}
          </div>

          {/* Right Column: Persistent Ingestion Timeline */}
          <div className="w-full lg:w-80 flex-shrink-0 sticky top-24">
            <SidebarTimeline processedDocs={processedDocs} />
          </div>
        </div>
      </main>
    </div>
  );
}
