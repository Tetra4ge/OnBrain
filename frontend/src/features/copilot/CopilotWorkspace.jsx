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
    <WorkspaceShell title="Copilot" eyebrow="Evidence-backed investigation" actions={messages.length > 1 && <button onClick={clearChat} className="inline-flex items-center gap-2 rounded-lg border border-[#fff9e8]/10 px-3 py-2 text-xs font-semibold text-[#c7bea1] hover:border-rose-300/30 hover:text-rose-200"><Trash2 size={14} /> Clear chat</button>}>
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_16rem]">
        <Panel className="min-h-[580px] overflow-hidden">
          <div className="border-b border-[#fff9e8]/10 px-5 py-4"><div className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} className="text-[#ffbe0b]" /> Investigation thread</div><p className="mt-1 text-xs text-[#bfb493]">Answers are generated only from indexed documents and graph context.</p></div>
          <div className="space-y-5 p-5">
            {messages.map(message => <article key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role !== 'user' && <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#ffbe0b] text-xs font-bold text-[#181609]">AI</span>}
              <div className={`max-w-[85%] ${message.role === 'user' ? 'rounded-l-xl rounded-br-xl bg-[#ffbe0b] text-[#181609]' : 'rounded-r-xl rounded-bl-xl border border-[#fff9e8]/10 bg-[#1c1a0d] text-[#f4eedc]'} px-4 py-3`}>
                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                {message.role !== 'user' && <div className="mt-3 flex flex-wrap items-center gap-2"><StatusBadge status={message.confidence || 'pending'} />{message.citations?.map((citation, index) => <span key={`${citation.doc_id}-${index}`} className="rounded bg-white/5 px-2 py-1 text-[10px] text-[#c7bea1]">{citation.title || citation.doc_id}{citation.page ? ` · p.${citation.page}` : ''}</span>)}</div>}
              </div>
            </article>)}
            {loading && <div className="flex items-center gap-2 text-xs text-[#c7bea1]"><span className="size-2 animate-pulse rounded-full bg-[#ffbe0b]" /> Searching evidence and graph…</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={submit} className="border-t border-[#fff9e8]/10 p-4">
            <div className="flex gap-3 rounded-xl border border-[#fff9e8]/15 bg-[#1a180b] p-2 focus-within:border-[#ffbe0b]/60"><textarea value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) submit(event) }} disabled={loading} rows={2} placeholder="Ask about uploaded records, equipment, or procedures…" className="min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-[#8e876e] disabled:opacity-60" /><button disabled={loading || !query.trim()} className="grid size-10 place-items-center self-end rounded-lg bg-[#ffbe0b] text-[#181609] transition hover:bg-[#ffda62] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send query"><Send size={16} /></button></div>
          </form>
        </Panel>
        <aside className="space-y-4"><Panel className="p-4"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ffbe0b]">Start here</p><div className="mt-3 space-y-2">{starters.map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading} className="group flex w-full items-start justify-between gap-2 rounded-lg border border-[#fff9e8]/8 bg-white/[0.025] p-3 text-left text-xs leading-5 text-[#c7bea1] transition hover:border-[#ffbe0b]/35 hover:text-[#fff9e8]"><span>{prompt}</span><ArrowUpRight size={14} className="shrink-0 text-[#ffbe0b]" /></button>)}</div></Panel><Panel className="p-4 text-xs leading-5 text-[#bfb493]">Upload source files in <span className="font-semibold text-[#fff9e8]">Ingest</span>, then ask a question with an equipment tag for graph-aware answers.</Panel></aside>
      </div>
    </WorkspaceShell>
  )
}
