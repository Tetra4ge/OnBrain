import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CopilotPage from './pages/CopilotPage'
import UploadCenterPage from './pages/UploadCenterPage'
import DocumentExplorerPage from './pages/DocumentExplorerPage'
import ComplianceScanPage from './pages/ComplianceScanPage'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#17150a] text-xs font-mono uppercase tracking-[0.18em] text-[#ffbe0b]">Checking secure workspace…</main>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/app"             element={<ProtectedRoute><CopilotPage /></ProtectedRoute>} />
      <Route path="/app/upload"      element={<ProtectedRoute><UploadCenterPage /></ProtectedRoute>} />
      <Route path="/app/documents"   element={<ProtectedRoute><DocumentExplorerPage /></ProtectedRoute>} />
      <Route path="/app/compliance"  element={<ProtectedRoute><ComplianceScanPage /></ProtectedRoute>} />
      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
