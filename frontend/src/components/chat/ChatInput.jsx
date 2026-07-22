import { useState, useRef } from 'react'
import { Send, Paperclip, Zap } from 'lucide-react'

const QUICK_ACTIONS = [
  'Run compliance scan',
  'Summarize recent incidents',
  'List uncovered regulations',
  'Explain last inspection finding',
]

export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="px-4 py-4">
      {/* Quick action chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => { setValue(action); textareaRef.current?.focus() }}
            disabled={disabled}
            className="font-mono text-[10px] tracking-wide uppercase px-3 py-1 rounded-full border border-white/10 text-[#94A3B8] hover:border-[#F7931A]/50 hover:text-[#F7931A] hover:bg-[#F7931A]/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={9} className="inline mr-1" />
            {action}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-3 bg-[#242423] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F7931A]/50 focus-within:shadow-[0_0_20px_-8px_rgba(247,147,26,0.3)] transition-all duration-200">
        <button
          className="text-[#94A3B8] hover:text-[#F7931A] transition-colors flex-shrink-0 pb-0.5"
          aria-label="Attach file"
          onClick={() => {}} // wire to file upload in later phase
        >
          <Paperclip size={18} strokeWidth={1.5} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about your operations… (Enter to send)"
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm font-body placeholder:text-white/25 resize-none outline-none leading-relaxed disabled:opacity-50 max-h-40 overflow-y-auto"
          style={{ height: 'auto' }}
        />

        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(247,147,26,0.4)] hover:scale-110 hover:shadow-[0_0_20px_rgba(247,147,26,0.6)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <Send size={15} className="text-white" strokeWidth={2} />
        </button>
      </div>

      <p className="font-mono text-[9px] tracking-wide text-white/20 text-center mt-2">
        SHIFT+ENTER for new line · AI responses may contain errors
      </p>
    </div>
  )
}
