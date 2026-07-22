import { BrainCircuit, Bot, FileText, ShieldCheck, Upload, Wifi, WifiOff } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { checkHealth } from '../../lib/api'

const navigation = [
  { to: '/app', label: 'Copilot', icon: Bot, end: true },
  { to: '/app/upload', label: 'Ingest', icon: Upload },
  { to: '/app/documents', label: 'Knowledge', icon: FileText },
  { to: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
]

export default function WorkspaceShell({ title, eyebrow, children, actions }) {
  const navigate = useNavigate()
  const [online, setOnline] = useState(null)

  useEffect(() => {
    let active = true
    const refresh = async () => {
      const result = await checkHealth()
      if (active) setOnline(result.online)
    }
    refresh()
    const timer = window.setInterval(refresh, 30000)
    return () => { active = false; window.clearInterval(timer) }
  }, [])

  return (
    <div className="min-h-screen bg-[#17150a] font-sans text-[#fff9e8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_90%_-10%,rgba(255,190,11,0.12),transparent_26rem)]" />
      <header className="sticky top-0 z-30 border-b border-[#fff9e8]/10 bg-[#1b190c]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 sm:px-6">
          <button onClick={() => navigate('/')} className="flex shrink-0 items-center gap-2.5" aria-label="Return to OnBrain home">
            <span className="grid size-8 place-items-center rounded-lg bg-[#ffbe0b] text-[#181609]"><BrainCircuit size={18} /></span>
            <span className="hidden text-base font-extrabold tracking-[0.08em] sm:block">ONBRAIN</span>
          </button>
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Workspace navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${isActive ? 'bg-[#ffbe0b] text-[#181609]' : 'text-[#c7bea1] hover:bg-white/5 hover:text-white'}`}>
                <Icon size={15} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <span className={`hidden items-center gap-1.5 text-[11px] font-medium sm:flex ${online === false ? 'text-rose-300' : 'text-emerald-300'}`}>
            {online === false ? <WifiOff size={14} /> : <Wifi size={14} />}
            {online === false ? 'API offline' : online === true ? 'Evidence layer online' : 'Checking API'}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffbe0b]">{eyebrow}</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#fff9e8] sm:text-3xl">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  )
}
