import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SidebarTimeline from './components/SidebarTimeline';
import SystemHealthPage from './pages/Phase1Page';
import DataSchemasPage from './pages/Phase2Page';
import IngestionPipelinePage from './pages/Phase3Page';

export default function App() {
  const [activeTab, setActiveTab] = useState('ingestion'); // 'health' | 'data-schemas' | 'ingestion'
  const [processedDocs, setProcessedDocs] = useState([]);

  const handleDocumentProcessed = (newDoc) => {
    setProcessedDocs((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#DCEEE7] flex flex-col font-sans">
      {/* Global Navigation Header (Functional Tabs: System Health, Data & Schemas, Ingestion Pipeline) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Main Section */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'health' && <SystemHealthPage />}

            {activeTab === 'data-schemas' && <DataSchemasPage />}

            {activeTab === 'ingestion' && (
              <IngestionPipelinePage
                processedDocs={processedDocs}
                onDocumentProcessed={handleDocumentProcessed}
              />
            )}
          </div>

          {/* Right Sidebar: Pipeline Session Activity Feed */}
          <div className="w-full lg:w-80 flex-shrink-0 sticky top-24">
            <SidebarTimeline processedDocs={processedDocs} />
          </div>
        </div>
      </main>
    </div>
  );
}
