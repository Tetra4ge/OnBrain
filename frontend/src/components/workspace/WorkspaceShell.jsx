import { Menu, Wifi, WifiOff, X } from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { checkHealth } from '../../lib/api'
import '../../pages/HomePage.css'

const navigation = [
  { to: '/app', label: 'Copilot', end: true },
  { to: '/app/upload', label: 'Ingest' },
  { to: '/app/documents', label: 'Knowledge' },
  { to: '/app/compliance', label: 'Compliance' },
]

export default function WorkspaceShell({ title, eyebrow, children, actions }) {
  const navigate = useNavigate()
  const headerRef = useRef(null)
  const [online, setOnline] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = event => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="flex min-h-screen flex-col bg-[#17150a] font-sans text-[#fff9e8]" style={{ '--font-heading': "'Doctor Glitch', sans-serif", '--amber': '#ffbe0b', '--malt': '#272311', '--malt-2': '#181609', '--ink': '#161508', '--cream': '#fff9e8', '--muted-cream': '#c7bea1' }}>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_90%_-10%,rgba(255,190,11,0.12),transparent_26rem)]" />
      <header ref={headerRef} className="sticky top-0 z-30 bg-[#17150a]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 sm:h-20 w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8" aria-label="Workspace navigation">
          <Link className="ob-logo shrink-0" to="/" aria-label="Return to OnBrain home">
            <span>ONBRAIN</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#c7bea1]">
            {navigation.map(({ to, label, end }) => (
              <NavLink 
                key={to} 
                to={to} 
                end={end}
                className="transition hover:text-[#ffbe0b]"
                style={({ isActive }) => isActive ? { color: 'var(--amber)' } : undefined}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`flex items-center gap-1.5 ${online === false ? 'text-rose-400' : 'text-emerald-400'}`} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {online === false ? <WifiOff size={13} /> : <Wifi size={13} />}
              <span className="hidden sm:inline">{online === false ? 'API offline' : online === true ? 'Evidence layer online' : 'Checking API'}</span>
            </span>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden grid size-9 place-items-center rounded border border-[#fff9e8]/15 bg-[#272311] text-[#fff9e8] hover:text-[#ffbe0b]"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-b border-[#fff9e8]/10 bg-[#1b190c] px-4 py-3 space-y-1">
            {navigation.map(({ to, label, end }) => (
              <NavLink 
                key={to} 
                to={to} 
                end={end}
                onClick={() => setMenuOpen(false)}
                className="block rounded px-3.5 py-2 text-xs font-bold transition"
                style={({ isActive }) => isActive ? { color: 'var(--amber)', backgroundColor: 'rgba(255,190,11,0.1)' } : { color: '#c7bea1' }}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pt-4 pb-6 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffbe0b]">{eyebrow}</p>
            <h1 className="text-xl font-semibold tracking-tight text-[#fff9e8] sm:text-2xl">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
        <div className="flex flex-1 flex-col min-h-0">
          {children}
        </div>
      </main>
    </div>
  )
}
