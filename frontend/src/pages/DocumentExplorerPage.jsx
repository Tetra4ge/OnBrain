import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Filter, Search, ChevronLeft, ChevronRight,
  Upload, Database, AlertCircle, RefreshCw, X, ExternalLink
} from 'lucide-react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import { listDocuments } from '../lib/api'

const PAGE_SIZE = 20

const DOC_TYPES = [
  { value: null,               label: 'All',               pill: 'doc-pill doc-pill-root' },
  { value: 'work_order',       label: 'Work Orders',        pill: 'doc-pill doc-pill-work_order' },
  { value: 'manual',           label: 'Manuals',            pill: 'doc-pill doc-pill-manual' },
  { value: 'inspection_report',label: 'Inspection Reports', pill: 'doc-pill doc-pill-inspection' },
  { value: 'regulation',       label: 'Regulations',        pill: 'doc-pill doc-pill-regulation' },
  { value: 'pid',              label: 'P&ID Drawings',      pill: 'doc-pill doc-pill-pid' },
]

const DOC_PILL = {
  manual:             'doc-pill doc-pill-manual',
  work_order:         'doc-pill doc-pill-work_order',
  inspection_report:  'doc-pill doc-pill-inspection',
  regulation:         'doc-pill doc-pill-regulation',
  pid:                'doc-pill doc-pill-pid',
}

function syncBadge(status) {
  if (status === 'synced' || status === 'success') return 'status-badge status-synced'
  if (status === 'error')   return 'status-badge status-error'
  if (status === 'partial') return 'status-badge status-partial'
  return 'status-badge status-pending'
}

function fmtDate(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

function pct(v) { return typeof v === 'number' ? `${Math.round(v * 100)}%` : '—' }

// ── Detail Drawer ─────────────────────────────────────────────
function DocDrawer({ doc, onClose }) {
  if (!doc) return null
  const pillCls = DOC_PILL[doc.doc_type] ?? 'doc-pill doc-pill-root'
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div className="flex-1" onClick={onClose} style={{ background: 'rgba(3,3,4,0.6)', backdropFilter: 'blur(4px)' }} />
      <div className="glass-dark flex flex-col" style={{
        width: '26rem', height: '100%',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <span className="section-label" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>Document Detail</span>
            <h2 className="font-heading font-semibold text-white text-sm truncate" style={{ maxWidth: '18rem' }}>{doc.filename}</h2>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors p-1"><X size={18} /></button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={pillCls}>{doc.doc_type || 'unknown'}</span>
            <span className={syncBadge(doc.sync_status)}>{doc.sync_status || 'pending'}</span>
            <span className="font-mono text-[10px] text-[#94A3B8]">{fmtDate(doc.upload_date)}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Extracted Entities', value: doc.extracted_entity_count ?? '—', color: '#F7931A' },
              { label: 'Neo4j Nodes',         value: doc.neo4j_nodes ?? '—',             color: '#60a5fa' },
              { label: 'Chroma Chunks',       value: doc.chroma_chunks ?? '—',           color: '#a78bfa' },
              { label: 'Avg Confidence',      value: pct(doc.confidence_avg),             color: '#34d399' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card rounded-xl p-3">
                <div className="font-heading font-bold text-lg" style={{ color }}>{value}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Doc ID */}
          {doc.doc_id && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] mb-1.5">Document ID</p>
              <code className="font-mono text-[10px] text-[#F5CB5C] bg-white/4 rounded-lg px-3 py-2 block break-all">{doc.doc_id}</code>
            </div>
          )}

          {/* Error log */}
          {doc.error_log?.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="font-mono text-[10px] text-[#EA580C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle size={10} /> Error Log
              </p>
              {doc.error_log.map((e, i) => (
                <p key={i} className="font-mono text-[10px] text-[#94A3B8] leading-relaxed">• {e}</p>
              ))}
            </div>
          )}

          {/* Confidence bar */}
          {typeof doc.confidence_avg === 'number' && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider">Extraction Quality</span>
                <span className="font-mono text-xs text-white">{pct(doc.confidence_avg)}</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: pct(doc.confidence_avg),
                  background: doc.confidence_avg >= 0.7
                    ? 'linear-gradient(to right,#34d399,#10b981)'
                    : doc.confidence_avg >= 0.4
                    ? 'linear-gradient(to right,#EA580C,#F7931A)'
                    : '#EA580C'
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function DocumentExplorerPage() {
  const navigate = useNavigate()
  const [docType, setDocType]   = useState(null)
  const [search, setSearch]     = useState('')
  const [docs, setDocs]         = useState([])
  const [total, setTotal]       = useState(0)
  const [skip, setSkip]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [selected, setSelected] = useState(null)

  const fetchDocs = useCallback(async (type, offset) => {
    setLoading(true); setError(null)
    try {
      const data = await listDocuments(type, PAGE_SIZE, offset)
      setDocs(data.documents ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDocs(docType, skip) }, [docType, skip, fetchDocs])

  const changeType = (t) => { setDocType(t); setSkip(0); setSelected(null) }
  const prevPage = () => setSkip(s => Math.max(0, s - PAGE_SIZE))
  const nextPage = () => { if (skip + PAGE_SIZE < total) setSkip(s => s + PAGE_SIZE) }

  const filtered = search.trim()
    ? docs.filter(d => d.filename?.toLowerCase().includes(search.toLowerCase()))
    : docs

  const page    = Math.floor(skip / PAGE_SIZE) + 1
  const maxPage = Math.ceil(total / PAGE_SIZE) || 1

  return (
    <div className="app-shell ob-workspace-shell" style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      <div className="app-sidebar"><AppSidebar /></div>
      <div className="app-main ob-workspace-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AppHeader title="Document Explorer" />
        <div className="ob-workspace-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.5rem 2rem' }}>
          <div className="pointer-events-none" style={{
            position: 'fixed', top: 0, right: 0, width: '28rem', height: '28rem',
            background: '#60a5fa', opacity: 0.015, filter: 'blur(120px)', borderRadius: '50%',
          }} />
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

            {/* Heading */}
            <div className="mb-6 animate-fade-up">
              <span className="section-label">Knowledge Store</span>
              <h1 className="font-heading text-2xl text-white text-center mb-2">Document Explorer</h1>
              <p className="font-body text-sm text-[#94A3B8] text-center">Browse all ingested documents in your knowledge base.</p>
            </div>

            {/* Controls bar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {/* Type filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={13} className="text-[#94A3B8]" />
                {DOC_TYPES.map(dt => (
                  <button key={String(dt.value)} onClick={() => changeType(dt.value)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                      docType === dt.value
                        ? 'bg-[#F7931A]/15 border-[#F7931A]/40 text-[#F7931A]'
                        : 'bg-white/4 border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/8'
                    }`}>
                    {dt.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="ml-auto flex items-center gap-2 bg-white/4 border border-white/10 rounded-xl px-3 py-2">
                <Search size={13} className="text-[#94A3B8]" />
                <input type="text" placeholder="Filter by filename…" value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-transparent font-mono text-xs text-white placeholder-[#94A3B8] outline-none w-40" />
                {search && <button onClick={() => setSearch('')}><X size={11} className="text-[#94A3B8] hover:text-white" /></button>}
              </div>

              <button onClick={() => fetchDocs(docType, skip)} title="Refresh"
                className="p-2 rounded-lg bg-white/4 border border-white/10 text-[#94A3B8] hover:text-[#F7931A] transition-colors">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="font-mono text-[11px] text-[#94A3B8]">
                {loading ? 'Loading…' : `${total.toLocaleString()} documents${docType ? ` · ${docType}` : ''}`}
              </p>
              {total > PAGE_SIZE && (
                <p className="font-mono text-[11px] text-[#94A3B8]">Page {page} of {maxPage}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle size={15} className="text-[#EA580C] flex-shrink-0 mt-0.5" />
                <p className="font-mono text-xs text-[#EA580C]">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-20 h-20 rounded-3xl bg-white/4 flex items-center justify-center">
                  <Database size={32} className="text-[#94A3B8]" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-semibold text-white text-lg mb-1">No documents found</p>
                  <p className="font-body text-sm text-[#94A3B8] mb-5">
                    {search ? 'No results match your filter.' : 'Upload your first document to get started.'}
                  </p>
                  <button onClick={() => navigate('/app/upload')}
                    className="flex items-center gap-2 mx-auto font-mono text-xs text-[#F7931A] border border-[#F7931A]/40 rounded-xl px-5 py-2.5 hover:bg-[#F7931A]/10 transition-colors">
                    <Upload size={13} /> Go to Upload Center
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            {filtered.length > 0 && (
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid text-[#94A3B8] font-mono text-[9px] uppercase tracking-widest px-5 py-3 border-b border-white/8"
                  style={{ gridTemplateColumns: '2fr 120px 80px 80px 80px 100px 100px' }}>
                  <span>Filename</span>
                  <span>Type</span>
                  <span>Entities</span>
                  <span>Chunks</span>
                  <span>Confidence</span>
                  <span>Status</span>
                  <span>Uploaded</span>
                </div>

                {/* Rows */}
                {filtered.map((doc, i) => {
                  const pillCls = DOC_PILL[doc.doc_type] ?? 'doc-pill doc-pill-root'
                  const badge   = syncBadge(doc.sync_status)
                  return (
                    <button key={doc.doc_id ?? i} onClick={() => setSelected(doc)}
                      className="w-full grid text-left px-5 py-3.5 border-b border-white/4 hover:bg-white/4 transition-colors group"
                      style={{ gridTemplateColumns: '2fr 120px 80px 80px 80px 100px 100px' }}>
                      <span className="font-mono text-xs text-white truncate pr-4 flex items-center gap-2">
                        <FileText size={13} className="text-[#94A3B8] flex-shrink-0" />
                        {doc.filename}
                        <ExternalLink size={11} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </span>
                      <span><span className={pillCls}>{doc.doc_type || '—'}</span></span>
                      <span className="font-mono text-xs text-white">{doc.extracted_entity_count ?? '—'}</span>
                      <span className="font-mono text-xs text-white">{doc.chunk_count ?? doc.chroma_chunks ?? '—'}</span>
                      <span className="font-mono text-xs text-white">{pct(doc.confidence_avg)}</span>
                      <span><span className={badge}>{doc.sync_status || 'pending'}</span></span>
                      <span className="font-mono text-[10px] text-[#94A3B8]">{fmtDate(doc.upload_date)}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-4 mt-5">
                <button onClick={prevPage} disabled={skip === 0}
                  className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg bg-white/4 border border-white/8">
                  <ChevronLeft size={13} /> Previous
                </button>
                <span className="font-mono text-xs text-[#94A3B8]">{page} / {maxPage}</span>
                <button onClick={nextPage} disabled={skip + PAGE_SIZE >= total}
                  className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg bg-white/4 border border-white/8">
                  Next <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && <DocDrawer doc={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
