import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

const confidenceConfig = {
  high:   { label: 'High Confidence',   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  medium: { label: 'Medium Confidence', color: 'text-[#F5CB5C]',   bg: 'bg-[#F5CB5C]/10 border-[#F5CB5C]/30'   },
  low:    { label: 'Low Confidence',    color: 'text-[#EA580C]',   bg: 'bg-[#EA580C]/10 border-[#EA580C]/30'   },
}

// ── Single chat message ──────────────────────────────────────
export default function ChatMessage({ message }) {
  const { role, content, confidence, confidence_score, citations } = message
  const isUser = role === 'user'

  return (
    <div className={`ob-chat-message animate-fade-up ${isUser ? 'is-user' : 'is-assistant'}`}>
      {/* Avatar */}
      <div className="ob-chat-avatar">
        {isUser ? (
          <div className="ob-chat-avatar-user">
            <span className="font-mono text-[#94A3B8] text-xs font-bold">U</span>
          </div>
        ) : (
          <div className="ob-chat-avatar-assistant">
            <span className="font-mono text-white text-xs font-bold">AI</span>
          </div>
        )}
      </div>

      <div className="ob-chat-message-content">
        {/* Bubble */}
        <div
          className={`ob-chat-bubble ${isUser ? 'is-user' : 'is-assistant'}`}
        >
          {content}
        </div>

        {/* Confidence badge + Citations (AI only) */}
        {!isUser && confidence && (
          <ConfidenceAndCitations
            confidence={confidence}
            score={confidence_score}
            citations={citations}
          />
        )}
      </div>
    </div>
  )
}

// ── Confidence badge + expandable citations ──────────────────
function ConfidenceAndCitations({ confidence, score, citations = [] }) {
  const [open, setOpen] = useState(false)
  const cfg = confidenceConfig[confidence] ?? confidenceConfig.medium

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Row: badge + citation toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {cfg.label}
          {score !== undefined && ` · ${Math.round(score * 100)}%`}
        </span>

        {citations.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-[#94A3B8] hover:text-[#F7931A] transition-colors"
          >
            <FileText size={11} />
            {citations.length} source{citations.length !== 1 ? 's' : ''}
            {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        )}
      </div>

      {/* Citation panel */}
      {open && citations.length > 0 && (
        <div className="bg-[#0d0d0c] border border-white/8 rounded-xl p-3 flex flex-col gap-2">
          {citations.map((c, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="w-5 h-5 rounded-md bg-[#F7931A]/15 border border-[#F7931A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText size={10} className="text-[#F7931A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-wide text-white truncate">{c.title}</span>
                  {c.page && (
                    <span className="font-mono text-[9px] text-[#94A3B8] flex-shrink-0">p.{c.page}</span>
                  )}
                </div>
                {c.snippet && (
                  <p className="font-body text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">{c.snippet}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
