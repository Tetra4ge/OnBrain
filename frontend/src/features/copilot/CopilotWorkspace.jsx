import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Send, Trash2 } from 'lucide-react'
import WorkspaceShell from '../../components/workspace/WorkspaceShell'
import { Panel, StatusBadge } from '../../components/workspace/WorkspaceUi'
import { useChat } from '../../hooks/useChat'

const starters = [
  'Show the failure history for P-204',
  'What evidence mentions vibration escalation?',
  'Summarize the latest maintenance work orders.',
]

export default function CopilotWorkspace() {
  const { messages, loading, sendMessage, clearChat } = useChat()
  const [query, setQuery] = useState('')
  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])
  const submit = event => { event.preventDefault(); if (query.trim()) { sendMessage(query.trim()); setQuery('') } }

  return (
    <WorkspaceShell title="Copilot" eyebrow="Evidence-backed investigation" actions={messages.length > 1 && <button onClick={clearChat} className="inline-flex items-center gap-1.5 rounded border border-[#fff9e8]/10 px-2.5 py-1.5 text-xs font-semibold text-[#c7bea1] hover:border-rose-300/30 hover:text-rose-200"><Trash2 size={13} /> <span className="hidden sm:inline">Clear chat</span></button>}>
      <div className="w-full grid flex-1 gap-5 lg:grid-cols-[1fr_300px]">
        <Panel className="flex flex-col h-[calc(100vh-220px)] sm:h-[calc(100vh-210px)] lg:h-[calc(100vh-210px)] overflow-hidden rounded-md border border-[#fff9e8]/10 bg-[#272311]/75 shadow-lg">
          <div className="flex-1 overflow-y-auto min-h-0 space-y-4 p-3 sm:p-4">
            {messages.map(message => <article key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] sm:max-w-[85%] ${message.role === 'user' ? 'rounded bg-[#ffbe0b] text-[#181609]' : 'rounded border border-[#fff9e8]/10 bg-[#1c1a0d] text-[#f4eedc]'} px-3.5 sm:px-4 py-2.5 sm:py-3`}>
                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                {message.role !== 'user' && <div className="mt-2.5 flex flex-wrap items-center gap-1.5"><StatusBadge status={message.confidence || 'pending'} />{message.citations?.map((citation, index) => <span key={`${citation.doc_id}-${index}`} className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-[#c7bea1]">{citation.title || citation.doc_id}{citation.page ? ` · p.${citation.page}` : ''}</span>)}</div>}
              </div>
            </article>)}
            {loading && <div className="flex items-center gap-2 text-xs text-[#c7bea1]"><span className="size-2 animate-pulse rounded-full bg-[#ffbe0b]" /> Searching evidence and graph…</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={submit} className="shrink-0 border-t border-[#fff9e8]/10 p-2 bg-[#1a180b]/90">
            <div className="flex items-center gap-2 rounded border border-[#fff9e8]/15 bg-[#141208] p-1.5 focus-within:border-[#ffbe0b]/70">
              <input type="text" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit(event) }} disabled={loading} placeholder="Ask about uploaded records, equipment, or procedures…" className="h-9 flex-1 min-w-0 bg-transparent px-2 text-sm text-[#fff9e8] outline-none focus:outline-none focus-visible:outline-none focus:ring-0 placeholder:text-[#8e876e] disabled:opacity-60" />
              <button disabled={loading || !query.trim()} className="grid size-9 shrink-0 place-items-center rounded bg-[#ffbe0b] text-[#181609] transition hover:bg-[#ffda62] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send query"><Send size={15} /></button>
            </div>
          </form>
        </Panel>
        <aside className="space-y-3 flex flex-col justify-start"><Panel className="p-3.5 rounded-md"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffbe0b]">Start here</p><div className="mt-2.5 space-y-1.5">{starters.map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading} className="group flex w-full items-start justify-between gap-2 rounded border border-[#fff9e8]/8 bg-white/[0.025] p-2.5 text-left text-xs leading-4 text-[#c7bea1] transition hover:border-[#ffbe0b]/35 hover:text-[#fff9e8]"><span>{prompt}</span><ArrowUpRight size={13} className="shrink-0 text-[#ffbe0b]" /></button>)}</div></Panel><Panel className="p-3.5 rounded-md text-xs leading-5 text-[#bfb493]">Upload source files in <span className="font-semibold text-[#fff9e8]">Ingest</span>, then ask a question with an equipment tag for graph-aware answers.</Panel></aside>
      </div>
    </WorkspaceShell>
  )
}
