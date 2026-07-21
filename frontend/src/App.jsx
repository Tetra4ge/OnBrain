import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CopilotPage from './pages/CopilotPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<CopilotPage />} />
      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
