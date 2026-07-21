import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Circle } from 'lucide-react'
import { checkHealth } from '../../lib/api'

export default function AppHeader({ title = 'Copilot' }) {
  const [status, setStatus] = useState('checking') // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      const result = await checkHealth()
      if (!cancelled) setStatus(result.online ? 'online' : 'offline')
    }
    ping()
    const interval = setInterval(ping, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/8 bg-[#030304]/60 backdrop-blur-sm flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs tracking-widest uppercase text-[#94A3B8]">OnBrain</span>
        <span className="text-white/20">/</span>
        <span className="font-heading font-semibold text-sm text-white">{title}</span>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {status === 'checking' && (
          <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
            <Circle size={8} className="animate-pulse fill-[#94A3B8]" />
            Connecting…
          </span>
        )}
        {status === 'online' && (
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            API Online
          </span>
        )}
        {status === 'offline' && (
          <span className="font-mono text-xs text-[#EA580C] flex items-center gap-1.5">
            <WifiOff size={12} />
            API Offline — using mock data
          </span>
        )}
      </div>
    </header>
  )
}
