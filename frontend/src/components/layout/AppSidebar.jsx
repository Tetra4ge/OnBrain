import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BrainCircuit, MessageSquare, Upload, FileText,
  ChevronLeft, ChevronRight, BarChart3, Home
} from 'lucide-react'

const navItems = [
  { icon: MessageSquare, label: 'Copilot',           path: '/app',         end: true  },
  { icon: Upload,        label: 'Upload Center',     path: '/app/upload'              },
  { icon: FileText,      label: 'Document Explorer', path: '/app/documents'           },
  { icon: BarChart3,     label: 'Compliance Scan',   path: '/app/compliance'          },
]

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <aside
      className={`
        flex flex-col h-full
        ob-workspace-sidebar bg-[#0d0d0c] border-r border-white/8
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-white/8 flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <button
          onClick={() => navigate('/')}
          className="ob-workspace-mark flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Go to homepage"
        >
          <BrainCircuit size={17} className="text-[#181609]" strokeWidth={2.3} />
        </button>
        {!collapsed && (
          <span className="font-heading font-bold text-lg text-[#fff9e8] tracking-wide">ONBRAIN</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map(({ icon: Icon, label, path, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                   ${isActive
                    ? 'ob-workspace-active bg-[#F7931A]/15 text-[#F7931A] border border-[#F7931A]/30'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/6'
                  }
                   ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} strokeWidth={1.5} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="font-mono text-xs tracking-wide uppercase">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to home (bottom) */}
      <div className="px-2 pb-4 border-t border-white/8 pt-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/6 transition-all"
          title={collapsed ? 'Home' : undefined}
        >
          <Home size={18} strokeWidth={1.5} />
          {!collapsed && <span className="font-mono text-xs tracking-wide uppercase">Home</span>}
        </NavLink>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-white/8 text-[#94A3B8] hover:text-[#F7931A] hover:bg-white/4 transition-all flex-shrink-0"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
