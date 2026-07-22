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
  return (
    <WorkspaceShell 
      title="Knowledge explorer" 
      eyebrow="Indexed operational evidence" 
      actions={
        <button onClick={load} className="inline-flex items-center gap-1.5 rounded border border-[#fff9e8]/12 px-3 py-1.5 text-xs font-semibold text-[#c7bea1] transition hover:bg-white/5 hover:text-white">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh index
        </button>
      }
    >
      <div className="w-full space-y-4">
        <Panel className="overflow-hidden rounded-md border border-[#fff9e8]/10 bg-[#272311]/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fff9e8]/10 px-5 py-3.5 bg-[#1f1c0d]/60">
            <div className="flex flex-wrap gap-2">
              {filters.map(item => (
                <button 
                  key={item || 'all'} 
                  onClick={() => setFilter(item)} 
                  className={`rounded px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === item ? 'bg-[#ffbe0b] text-[#181609]' : 'bg-white/5 text-[#c7bea1] hover:bg-white/10 hover:text-white'}`}
                >
                  {item ? item.replace('_', ' ') : 'All sources'}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-[#bfb493]">{documents.length} indexed files</span>
          </div>

          {error ? (
            <div className="p-8 text-center text-xs text-rose-200">{error}</div>
          ) : loading ? (
            <div className="flex min-h-72 items-center justify-center gap-2 text-xs text-[#bfb493]">
              <RefreshCw size={16} className="animate-spin text-[#ffbe0b]" /> Loading operational evidence corpus…
            </div>
          ) : documents.length === 0 ? (
            <EmptyState 
              title="No evidence indexed yet" 
              body="Ingest your first technical document, work order, or PID drawing to make it searchable and available to the copilot." 
              action={
                <Link to="/app/upload" className="inline-flex items-center gap-2 rounded bg-[#ffbe0b] px-4 py-2 text-xs font-bold text-[#181609] transition hover:bg-[#ffda62]">
                  <Upload size={14} /> Ingest a document
                </Link>
              } 
            />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs text-[#c7bea1]">
                <thead className="border-b border-[#fff9e8]/10 bg-[#17150a]/80 text-[10px] uppercase tracking-wider text-[#ffbe0b]">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-bold">Document Source</th>
                    <th scope="col" className="px-5 py-3 font-bold">Category</th>
                    <th scope="col" className="px-5 py-3 font-bold">Entities & Graph</th>
                    <th scope="col" className="px-5 py-3 font-bold">Confidence</th>
                    <th scope="col" className="px-5 py-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fff9e8]/8">
                  {documents.map(document => (
                    <tr key={document.doc_id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4 font-semibold text-[#fff9e8]">
                        <div className="flex items-center gap-2.5">
                          <Database size={15} className="shrink-0 text-[#ffbe0b]" />
                          <span className="truncate max-w-md">{document.filename}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 capitalize font-mono text-[11px]">
                        {document.doc_type?.replace('_', ' ') || 'General'}
                      </td>
                      <td className="px-5 py-4 text-[11px]">
                        <span className="text-[#fff9e8] font-bold">{document.extracted_entity_count || 0}</span> entities · <span className="text-[#fff9e8] font-bold">{document.chunk_count || 0}</span> chunks
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px]">
                        {document.confidence_avg ? `${Math.round(document.confidence_avg * 100)}%` : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <StatusBadge status={document.sync_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </WorkspaceShell>
  )
}
