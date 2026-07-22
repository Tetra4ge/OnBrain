import { NavLink, useNavigate } from 'react-router-dom'
import { BrainCircuit, FileText, MessageSquare, ShieldCheck, Upload } from 'lucide-react'

const navItems = [
  { icon: MessageSquare, label: 'Copilot', path: '/app', end: true },
  { icon: Upload, label: 'Ingest', path: '/app/upload' },
  { icon: FileText, label: 'Knowledge', path: '/app/documents' },
  { icon: ShieldCheck, label: 'Compliance', path: '/app/compliance' },
]

// This deliberately uses the landing page's horizontal navigation pattern.
// Workspace navigation stays visible without consuming the content canvas.
export default function AppSidebar() {
  const navigate = useNavigate()

  return (
    <aside className="ob-workspace-nav">
      <button onClick={() => navigate('/')} className="ob-workspace-brand" aria-label="Return to OnBrain homepage">
        <span><BrainCircuit size={19} strokeWidth={2.35} /></span>
        <b>ONBRAIN</b>
        <i>Operations workspace</i>
      </button>
      <nav aria-label="Workspace navigation">
        {navItems.map(({ icon: Icon, label, path, end }) => (
          <NavLink key={path} to={path} end={end} className={({ isActive }) => `ob-workspace-nav-link${isActive ? ' is-active' : ''}`}>
            <Icon size={16} strokeWidth={1.8} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="ob-workspace-nav-signal"><span /> Evidence layer active</div>
    </aside>
  )
}
