import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CopilotPage from './pages/CopilotPage'
import UploadCenterPage from './pages/UploadCenterPage'
import DocumentExplorerPage from './pages/DocumentExplorerPage'
import ComplianceScanPage from './pages/ComplianceScanPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage />} />
      <Route path="/app"             element={<CopilotPage />} />
      <Route path="/app/upload"      element={<UploadCenterPage />} />
      <Route path="/app/documents"   element={<DocumentExplorerPage />} />
      <Route path="/app/compliance"  element={<ComplianceScanPage />} />
      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
