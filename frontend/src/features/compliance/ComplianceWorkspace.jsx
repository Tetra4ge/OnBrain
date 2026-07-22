import { useState } from 'react'
import { Search, ShieldCheck } from 'lucide-react'
import WorkspaceShell from '../../components/workspace/WorkspaceShell'
import { EmptyState, Panel } from '../../components/workspace/WorkspaceUi'
import { semanticSearch } from '../../lib/api'

const quickScans = [
  'Pressure vessel inspection intervals',
  'Centrifugal pump vibration limits',
  'Lockout / tagout safety procedures',
  'ISO 9001 compliance requirements'
]

export default function ComplianceWorkspace() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event, customQuery) => {
    if (event) event.preventDefault()
    const q = customQuery || query
    if (!q.trim()) return
    setLoading(true); setError('')
    try {
      const data = await semanticSearch(q, 10, 'regulation')
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WorkspaceShell title="Compliance scan" eyebrow="Regulatory evidence coverage">
      <div className="w-full space-y-6">
        <Panel className="p-6 rounded-md border border-[#fff9e8]/10 bg-[#272311]/70">
          <form onSubmit={submit} className="flex flex-col gap-4 sm:flex-row items-end">
            <div className="flex-1 min-w-0">
              <label htmlFor="compliance-query" className="block mb-2 text-xs font-semibold text-[#c7bea1]">
                Target Process, Equipment, or Regulatory Standard
              </label>
              <textarea 
                id="compliance-query" 
                value={query} 
                onChange={event => setQuery(event.target.value)} 
                rows={2} 
                placeholder="Describe the procedure, requirement, or risk scenario you need to validate against indexed regulations…" 
                className="w-full resize-none rounded border border-[#fff9e8]/15 bg-[#17150a] px-3.5 py-2.5 text-xs text-[#fff9e8] outline-none placeholder:text-[#8e876e] focus:border-[#ffbe0b]" 
              />
            </div>
            <button 
              disabled={loading || !query.trim()} 
              className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#ffbe0b] px-6 text-xs font-bold text-[#181609] transition hover:bg-[#ffda62] disabled:opacity-40"
            >
              <Search size={16} />
              {loading ? 'Scanning Corpus…' : 'Run Compliance Scan'}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-[#fff9e8]/8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#bfb493] mr-1">Quick Scans:</span>
            {quickScans.map(prompt => (
              <button
                key={prompt}
                onClick={e => { setQuery(prompt); submit(e, prompt) }}
                className="rounded border border-[#fff9e8]/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#c7bea1] transition hover:border-[#ffbe0b]/40 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Panel>

        {error && <p className="rounded border border-rose-300/20 bg-rose-300/10 p-4 text-xs text-rose-200">{error}</p>}

        <div className="w-full">
          {results === null ? (
            <Panel className="p-8">
              <EmptyState 
                title="Scan your regulatory evidence corpus" 
                body="Once regulation documents, safety manuals, or ISO standards are ingested, OnBrain automatically scores and ranks relevant clauses against your target query." 
              />
            </Panel>
          ) : results.length === 0 ? (
            <Panel className="p-8">
              <EmptyState 
                title="No matching regulation evidence found" 
                body="Try ingesting regulation documents in Ingest, or broaden your search query to include general equipment standards." 
              />
            </Panel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((result, index) => (
                <Panel key={result.chunk_id || index} className="p-5 rounded-md border border-[#fff9e8]/10 bg-[#272311]/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-[#fff9e8]/8 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#fff9e8]">
                        <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
                        <span className="truncate">{result.source_filename || 'Regulatory Standard'}</span>
                      </div>
                      <span className="rounded bg-[#ffbe0b]/15 px-2 py-0.5 text-[10px] font-bold text-[#ffda62]">
                        {Math.round((result.relevance_score || 0) * 100)}% match
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-[#c7bea1]">
                      "{result.text}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#fff9e8]/8 flex items-center justify-between text-[11px] text-[#8e876e]">
                    <span>Page {result.page_number || 1}</span>
                    <span className="uppercase font-mono text-[10px]">{result.doc_type?.replace('_', ' ')}</span>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  )
};