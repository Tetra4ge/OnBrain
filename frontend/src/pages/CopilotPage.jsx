import { useEffect, useRef } from 'react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import { useChat } from '../hooks/useChat'
import { Trash2, Info } from 'lucide-react'

export default function CopilotPage() {
  const { messages, loading, sendMessage, clearChat } = useChat()
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex h-screen bg-[#030304] overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <AppHeader title="Copilot" />

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7931A] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

          {/* Info banner */}
          {messages.length <= 1 && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex items-start gap-3 bg-[#F5CB5C]/8 border border-[#F5CB5C]/20 rounded-xl px-4 py-3">
                <Info size={15} className="text-[#F5CB5C] flex-shrink-0 mt-0.5" />
                <p className="font-mono text-[11px] text-[#94A3B8] leading-relaxed tracking-wide">
                  Running against <span className="text-[#F5CB5C]">mock data</span> — upload documents to unlock real knowledge graph queries. API status shown in the header.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Chat input */}
        <div className="max-w-3xl w-full mx-auto w-full">
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </div>

      {/* Clear chat button — floating */}
      {messages.length > 1 && (
        <button
          onClick={clearChat}
          title="Clear conversation"
          className="fixed bottom-24 right-6 w-9 h-9 rounded-xl bg-[#242423] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#EA580C] hover:border-[#EA580C]/40 transition-all duration-200 shadow-lg z-20"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}
