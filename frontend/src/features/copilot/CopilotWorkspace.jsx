import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Send, Sparkles, Trash2 } from 'lucide-react'
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
    <WorkspaceShell title="Copilot" eyebrow="Evidence-backed investigation" actions={messages.length > 1 && <button onClick={clearChat} className="inline-flex items-center gap-2 rounded border border-[#fff9e8]/10 px-3 py-1.5 text-xs font-semibold text-[#c7bea1] hover:border-rose-300/30 hover:text-rose-200"><Trash2 size={13} /> Clear chat</button>}>
      <div className="w-full grid flex-1 min-h-[480px] lg:h-[calc(100vh-160px)] gap-5 lg:grid-cols-[1fr_300px]">
        <Panel className="flex flex-col h-full min-h-0 overflow-hidden rounded-md border border-[#fff9e8]/10 bg-[#272311]/75 shadow-lg">
          <div className="shrink-0 border-b border-[#fff9e8]/10 px-4 py-2.5"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fff9e8]"><Sparkles size={15} className="text-[#ffbe0b]" /> Investigation thread</div><p className="mt-0.5 text-[11px] text-[#bfb493]">Answers are generated only from indexed documents and graph context.</p></div>
          <div className="flex-1 overflow-y-auto min-h-0 space-y-4 p-4">
            {messages.map(message => <article key={message.id} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role !== 'user' && <span className="grid size-7 shrink-0 place-items-center rounded bg-[#ffbe0b] text-[11px] font-bold text-[#181609]">AI</span>}
              <div className={`max-w-[85%] ${message.role === 'user' ? 'rounded bg-[#ffbe0b] text-[#181609]' : 'rounded border border-[#fff9e8]/10 bg-[#1c1a0d] text-[#f4eedc]'} px-3.5 py-2.5`}>
                <p className="whitespace-pre-wrap text-xs leading-5">{message.content}</p>
                {message.role !== 'user' && <div className="mt-2 flex flex-wrap items-center gap-1.5"><StatusBadge status={message.confidence || 'pending'} />{message.citations?.map((citation, index) => <span key={`${citation.doc_id}-${index}`} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#c7bea1]">{citation.title || citation.doc_id}{citation.page ? ` · p.${citation.page}` : ''}</span>)}</div>}
              </div>
            </article>)}
            {loading && <div className="flex items-center gap-2 text-xs text-[#c7bea1]"><span className="size-2 animate-pulse rounded-full bg-[#ffbe0b]" /> Searching evidence and graph…</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={submit} className="shrink-0 border-t border-[#fff9e8]/10 p-2 bg-[#1a180b]/90">
            <div className="flex gap-2.5 rounded border border-[#fff9e8]/15 bg-[#141208] p-1.5 focus-within:border-[#ffbe0b]/70"><textarea value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) submit(event) }} disabled={loading} rows={2} placeholder="Ask about uploaded records, equipment, or procedures…" className="min-h-10 flex-1 resize-none bg-transparent px-2 py-1 text-xs outline-none placeholder:text-[#8e876e] disabled:opacity-60" /><button disabled={loading || !query.trim()} className="grid size-9 place-items-center self-end rounded bg-[#ffbe0b] text-[#181609] transition hover:bg-[#ffda62] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send query"><Send size={15} /></button></div>
          </form>
        </Panel>
        <aside className="space-y-3 flex flex-col justify-start"><Panel className="p-3.5 rounded-md"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffbe0b]">Start here</p><div className="mt-2.5 space-y-1.5">{starters.map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading} className="group flex w-full items-start justify-between gap-2 rounded border border-[#fff9e8]/8 bg-white/[0.025] p-2.5 text-left text-xs leading-4 text-[#c7bea1] transition hover:border-[#ffbe0b]/35 hover:text-[#fff9e8]"><span>{prompt}</span><ArrowUpRight size={13} className="shrink-0 text-[#ffbe0b]" /></button>)}</div></Panel><Panel className="p-3.5 rounded-md text-xs leading-5 text-[#bfb493]">Upload source files in <span className="font-semibold text-[#fff9e8]">Ingest</span>, then ask a question with an equipment tag for graph-aware answers.</Panel></aside>
      </div>
    </WorkspaceShell>
  )
}
