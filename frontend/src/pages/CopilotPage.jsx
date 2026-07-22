import { useEffect, useRef } from 'react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import { useChat } from '../hooks/useChat'
import WorkspacePageHero from '../components/layout/WorkspacePageHero'
import { ArrowUpRight, Database, Info, Network, Trash2 } from 'lucide-react'

// Max content width for the chat column
const CHAT_MAX_W = '48rem'

const promptStarters = [
  ['Investigate an asset', 'Trace incidents, inspections and maintenance records around an equipment tag.', Network, 'Show me every record connected to compressor P-204'],
  ['Surface a compliance gap', 'Find missing evidence against a process or regulatory requirement.', Database, 'What compliance gaps exist in my documents?'],
]

export default function CopilotPage() {
  const { messages, loading, sendMessage, clearChat } = useChat()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="app-shell ob-workspace-shell" style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className="app-sidebar"><AppSidebar /></div>

      {/* Main column */}
      <div className="app-main ob-workspace-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <AppHeader title="Copilot" />

        {/* Chat scroll area */}
        <div className="ob-workspace-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
          {/* Ambient glow */}
          <div
            className="pointer-events-none"
            style={{
              position: 'fixed', top: 0, right: 0,
              width: '24rem', height: '24rem',
              background: '#F7931A', opacity: 0.03,
              filter: 'blur(120px)', borderRadius: '50%',
            }}
          />

          {/* Content column — centered */}
          <div className="ob-app-content ob-copilot-column" style={{ width: '100%', maxWidth: CHAT_MAX_W, margin: '0 auto' }}>
            {messages.length <= 1 && (
              <>
                <WorkspacePageHero
                  eyebrow="Your industrial copilot"
                  title={<>Ask once. <em>Know why.</em></>}
                  description="Turn the records around your operation into a clear, source-backed path to action."
                  metrics={[{ value: '24', label: 'connected sources' }, { value: '94%', label: 'evidence confidence' }]}
                />
                <div className="ob-copilot-starters" aria-label="Suggested investigations">
                  {promptStarters.map(([title, detail, Icon, prompt]) => (
                    <button key={title} onClick={() => sendMessage(prompt)} className="ob-copilot-starter">
                      <span className="ob-copilot-starter-icon"><Icon size={19} /></span>
                      <span><b>{title}</b><small>{detail}</small></span>
                      <ArrowUpRight size={17} />
                    </button>
                  ))}
                </div>
                <div className="ob-chat-section-label"><span /> Start an investigation</div>
              </>
            )}
            {/* Info banner — shown only on first load */}
            {messages.length <= 1 && (
              <div
                className="mb-6"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  background: 'rgba(245,203,92,0.07)',
                  border: '1px solid rgba(245,203,92,0.2)',
                  borderRadius: '0.875rem', padding: '0.875rem 1.125rem',
                }}
              >
                <Info size={15} style={{ color: '#F5CB5C', flexShrink: 0, marginTop: '0.125rem' }} />
                <p className="font-mono text-[11px] text-[#94A3B8] leading-relaxed tracking-wide">
                  Running against <span style={{ color: '#F5CB5C' }}>mock data</span> — upload documents to unlock real knowledge graph queries. API status shown in the header.
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area — full-width border, constrained content */}
        <div className="ob-chat-dock" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="ob-copilot-input" style={{ width: '100%', maxWidth: CHAT_MAX_W, margin: '0 auto' }}>
            <ChatInput onSend={sendMessage} disabled={loading} />
          </div>
        </div>
      </div>

      {/* Clear chat — floating */}
      {messages.length > 1 && (
        <button
          onClick={clearChat}
          title="Clear conversation"
          style={{
            position: 'fixed', bottom: '6.5rem', right: '1.5rem',
            width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem',
            background: '#242423', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#94A3B8', cursor: 'pointer', zIndex: 20,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EA580C'; e.currentTarget.style.borderColor = 'rgba(234,88,12,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}
