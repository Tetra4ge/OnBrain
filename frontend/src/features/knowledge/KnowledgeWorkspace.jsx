import { useCallback, useEffect, useState } from 'react'
import { Database, RefreshCw, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspaceShell from '../../components/workspace/WorkspaceShell'
import { EmptyState, Panel, StatusBadge } from '../../components/workspace/WorkspaceUi'
import { listDocuments } from '../../lib/api'

const filters = [null, 'manual', 'work_order', 'inspection_report', 'regulation', 'pid']

export default function KnowledgeWorkspace() {
  const [documents, setDocuments] = useState([])
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => { setLoading(true); setError(''); try { const data = await listDocuments(filter, 100); setDocuments(data.documents || []) } catch (err) { setError(err.message) } finally { setLoading(false) } }, [filter])
  useEffect(() => { load() }, [load])
  return <WorkspaceShell title="Knowledge explorer" eyebrow="Indexed operational evidence" actions={<button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-[#fff9e8]/12 px-3 py-2 text-xs font-semibold text-[#c7bea1] hover:text-white"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh</button>}><Panel className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fff9e8]/10 p-4"><div className="flex flex-wrap gap-2">{filters.map(item => <button key={item || 'all'} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${filter === item ? 'bg-[#ffbe0b] text-[#181609]' : 'bg-white/5 text-[#c7bea1] hover:text-white'}`}>{item ? item.replace('_', ' ') : 'All sources'}</button>)}</div><span className="text-xs text-[#bfb493]">{documents.length} documents</span></div>{error ? <div className="p-6 text-sm text-rose-200">{error}</div> : loading ? <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-[#bfb493]"><RefreshCw size={15} className="animate-spin" /> Loading evidence…</div> : documents.length === 0 ? <EmptyState title="No evidence indexed yet" body="Ingest a file to make it searchable and available to the copilot." action={<Link to="/app/upload" className="inline-flex items-center gap-2 rounded-lg bg-[#ffbe0b] px-4 py-2 text-sm font-bold text-[#181609]"><Upload size={15} /> Ingest a document</Link>} /> : <div className="divide-y divide-[#fff9e8]/8">{documents.map(document => <article key={document.doc_id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"><div className="min-w-0"><div className="flex items-center gap-2"><Database size={15} className="shrink-0 text-[#ffbe0b]" /><h2 className="truncate text-sm font-semibold">{document.filename}</h2></div><p className="mt-1 text-xs text-[#bfb493]">{document.doc_type?.replace('_', ' ')} · {document.extracted_entity_count || 0} entities · {document.chunk_count || 0} chunks</p></div><span className="text-xs text-[#c7bea1]">{document.confidence_avg ? `${Math.round(document.confidence_avg * 100)}% confidence` : 'Processing'}</span><StatusBadge status={document.sync_status} /></article>)}</div>}</Panel></WorkspaceShell>
}
