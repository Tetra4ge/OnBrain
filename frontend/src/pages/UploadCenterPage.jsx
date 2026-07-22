import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ArrowUpCircle, FileText, AlertCircle,
  Layers, ChevronRight, RefreshCw, FolderOpen, Upload, Zap
} from 'lucide-react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import WorkspacePageHero from '../components/layout/WorkspacePageHero'
import {
  uploadDocumentFile,
  getSampleDocuments,
  processSampleDocument,
  getDocumentStatus,
} from '../lib/api'

const DOC_TYPES = [
  { value: '', label: 'Auto-detect' },
  { value: 'manual', label: 'Manual / OEM Spec' },
  { value: 'work_order', label: 'Work Order' },
  { value: 'inspection_report', label: 'Inspection Report' },
  { value: 'regulation', label: 'Regulation / Standard' },
  { value: 'pid', label: 'P&ID Drawing' },
]

const DOC_PILL_CLASS = {
  manual: 'doc-pill doc-pill-manual',
  work_order: 'doc-pill doc-pill-work_order',
  inspection_report: 'doc-pill doc-pill-inspection',
  regulation: 'doc-pill doc-pill-regulation',
  pid: 'doc-pill doc-pill-pid',
}

function statusMeta(status) {
  if (!status || status === 'pending') return { cls: 'status-pending', label: 'Queued', spin: false }
  if (status === 'processing')         return { cls: 'status-pending', label: 'Processing', spin: true }
  if (status === 'synced' || status === 'success') return { cls: 'status-synced', label: 'Synced', spin: false }
  if (status === 'error')              return { cls: 'status-error',   label: 'Error', spin: false }
  if (status === 'partial')            return { cls: 'status-partial', label: 'Partial', spin: false }
  return { cls: 'status-pending', label: 'Processing', spin: true }
}

function fmt(n) { return typeof n === 'number' ? n.toLocaleString() : '—' }
const LS_KEY = 'onbrain_recent_uploads'
const loadRecent = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] } }
const saveRecent = items => localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 8)))

function StatusCard({ s }) {
  const sm = statusMeta(s?.sync_status)
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">Live Sync Status</p>
        <span className={`status-badge ${sm.cls}`}>{sm.label}</span>
      </div>
      {s?.filename && <p className="font-mono text-xs text-white truncate">{s.filename}</p>}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Entities', value: fmt(s?.extracted_entity_count), color: '#F7931A' },
          { label: 'Neo4j Nodes', value: fmt(s?.neo4j_nodes), color: '#60a5fa' },
          { label: 'Chroma Chunks', value: fmt(s?.chroma_chunks), color: '#a78bfa' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/4 rounded-xl p-3 text-center">
            <div className="font-heading font-bold text-xl" style={{ color }}>{value}</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      {typeof s?.confidence_avg === 'number' && (
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider">Confidence</span>
            <span className="font-mono text-xs text-white">{Math.round(s.confidence_avg * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round(s.confidence_avg * 100)}%`, background: 'linear-gradient(to right,#EA580C,#F7931A)' }} />
          </div>
        </div>
      )}
      {s?.error_log?.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <p className="font-mono text-[10px] text-[#EA580C] uppercase tracking-wider mb-1">Errors</p>
          {s.error_log.map((e, i) => <p key={i} className="font-mono text-[10px] text-[#94A3B8]">• {e}</p>)}
        </div>
      )}
    </div>
  )
}

function UploadRow({ item, onRefresh }) {
  const sm = statusMeta(item.sync_status)
  const pill = DOC_PILL_CLASS[item.doc_type] ?? 'doc-pill doc-pill-root'
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 hover:bg-white/6 transition-colors group">
      <FileText size={14} className="text-[#94A3B8] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-white truncate">{item.filename}</p>
        <p className="font-mono text-[9px] text-[#94A3B8] mt-0.5">{item.uploaded_at}</p>
      </div>
      <span className={pill}>{item.doc_type || 'auto'}</span>
      <span className={`status-badge ${sm.cls}`}>{sm.label}</span>
      {(item.sync_status === 'pending' || item.sync_status === 'processing') && item.doc_id && (
        <button onClick={() => onRefresh(item.doc_id)} title="Refresh"
          className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#F7931A] transition-all">
          <RefreshCw size={13} />
        </button>
      )}
    </div>
  )
}

export default function UploadCenterPage() {
  const [dragOver, setDragOver]           = useState(false)
  const [docType, setDocType]             = useState('')
  const [uploading, setUploading]         = useState(false)
  const [progress, setProgress]           = useState(0)
  const [latestStatus, setLatestStatus]   = useState(null)
  const [recentUploads, setRecentUploads] = useState(loadRecent)
  const [samples, setSamples]             = useState([])
  const [sampleProcessing, setSampleProcessing] = useState(null)
  const [error, setError]                 = useState(null)

  const fileInputRef = useRef(null)
  const pollRef      = useRef(null)

  useEffect(() => { getSampleDocuments().then(setSamples) }, [])
  useEffect(() => () => clearInterval(pollRef.current), [])

  const pollStatus = useCallback((docId) => {
    clearInterval(pollRef.current)
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      try {
        const s = await getDocumentStatus(docId)
        setLatestStatus(s)
        setRecentUploads(prev => {
          const u = prev.map(x => x.doc_id === docId ? { ...x, sync_status: s.sync_status } : x)
          saveRecent(u); return u
        })
        if (['synced','error','success'].includes(s.sync_status) || attempts > 20) clearInterval(pollRef.current)
      } catch { if (attempts > 6) clearInterval(pollRef.current) }
    }, 2000)
  }, [])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError(null); setLatestStatus(null); setUploading(true); setProgress(10)
    const prog = setInterval(() => setProgress(p => Math.min(p + 4, 85)), 250)
    try {
      const result = await uploadDocumentFile(file, docType || undefined)
      clearInterval(prog); setProgress(100)
      const docId = result?.document?.doc_id
      const entry = {
        doc_id: docId, filename: file.name,
        doc_type: result?.document?.doc_type || docType || 'auto',
        sync_status: result?.sync?.status || 'pending',
        uploaded_at: new Date().toLocaleString(),
      }
      setRecentUploads(prev => { const u = [entry, ...prev]; saveRecent(u); return u })
      if (docId) { setLatestStatus({ ...result?.document, ...result?.sync }); pollStatus(docId) }
    } catch (err) { clearInterval(prog); setError(err.message) }
    finally { setUploading(false); setTimeout(() => setProgress(0), 800) }
  }, [docType, pollStatus])

  const onDrop = e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }
  const onFileInput = e => { handleFile(e.target.files?.[0]); e.target.value = '' }

  const handleSample = async s => {
    setSampleProcessing(s.relative_path); setError(null); setLatestStatus(null)
    try {
      const result = await processSampleDocument(s.relative_path)
      const docId = result?.document?.doc_id
      const entry = {
        doc_id: docId, filename: s.filename,
        doc_type: result?.document?.doc_type || 'auto',
        sync_status: result?.sync?.status || 'pending',
        uploaded_at: new Date().toLocaleString(),
      }
      setRecentUploads(prev => { const u = [entry, ...prev]; saveRecent(u); return u })
      if (docId) { setLatestStatus({ ...result?.document, ...result?.sync }); pollStatus(docId) }
    } catch (err) { setError(err.message) }
    finally { setSampleProcessing(null) }
  }

  const refreshItem = async docId => {
    try {
      const s = await getDocumentStatus(docId)
      setLatestStatus(s)
      setRecentUploads(prev => { const u = prev.map(x => x.doc_id === docId ? { ...x, sync_status: s.sync_status } : x); saveRecent(u); return u })
    } catch { /* silent */ }
  }

  return (
    <div className="app-shell ob-workspace-shell" style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      <div className="app-sidebar"><AppSidebar /></div>
      <div className="app-main ob-workspace-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AppHeader title="Upload Center" />
        <div className="ob-workspace-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.5rem 2rem' }}>
          <div className="pointer-events-none" style={{
            position: 'fixed', top: 0, right: 0, width: '32rem', height: '32rem',
            background: '#F7931A', opacity: 0.025, filter: 'blur(120px)', borderRadius: '50%',
          }} />
          <div className="ob-app-content" style={{ maxWidth: '62rem', margin: '0 auto' }}>
            <WorkspacePageHero
              eyebrow="Document ingestion"
              title={<>Turn files into <em>working evidence.</em></>}
              description="Upload the records your team trusts. OnBrain extracts the relationships that make them useful in the moment."
              metrics={[{ value: '05', label: 'supported formats' }, { value: '10 MB', label: 'per file' }]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="flex flex-col gap-4">
                <div className="glass-card rounded-2xl p-4">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] block mb-2">Document Type Override</label>
                  <select id="doc-type-select" value={docType} onChange={e => setDocType(e.target.value)}
                    style={{ width: '100%', background: 'rgba(36,36,35,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }}>
                    {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
                  </select>
                </div>

                <div id="upload-drop-zone"
                  className={`drop-zone cursor-pointer flex flex-col items-center justify-center gap-4 py-12 px-6 text-center ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => !uploading && fileInputRef.current?.click()}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? 'bg-[#F7931A]/20 shadow-[0_0_30px_rgba(247,147,26,0.4)]' : 'bg-white/6'}`}>
                    {uploading
                      ? <RefreshCw size={28} className="text-[#F7931A] animate-spin" />
                      : <ArrowUpCircle size={28} className={dragOver ? 'text-[#F7931A]' : 'text-[#94A3B8]'} />}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-white mb-1">{uploading ? 'Processing document…' : 'Drop document here'}</p>
                    <p className="font-mono text-xs text-[#94A3B8]">PDF · CSV · JSON · PNG · JPEG · max 10 MB</p>
                  </div>
                  {!uploading && (
                    <button id="upload-browse-btn"
                      className="font-mono text-xs text-[#F7931A] border border-[#F7931A]/40 rounded-lg px-4 py-2 hover:bg-[#F7931A]/10 transition-colors"
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}>
                      Browse files
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }}
                    accept=".pdf,.csv,.json,.png,.jpg,.jpeg,.txt" onChange={onFileInput} />
                </div>

                {progress > 0 && (
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${progress < 100 ? 'progress-stripe' : ''}`}
                      style={{ width: `${progress}%`, background: progress === 100
                        ? 'linear-gradient(to right,#34d399,#10b981)' : 'linear-gradient(to right,#EA580C,#F7931A)' }} />
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={15} className="text-[#EA580C] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-xs text-[#EA580C] font-semibold">Upload failed</p>
                      <p className="font-mono text-[10px] text-[#94A3B8] mt-0.5">{error}</p>
                    </div>
                  </div>
                )}
                {latestStatus && <StatusCard s={latestStatus} />}
              </div>

              <div className="flex flex-col gap-4">
                <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={15} className="text-[#F7931A]" />
                      <span className="font-mono text-xs uppercase tracking-widest text-white">Sample Documents</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#94A3B8]">{samples.length} files</span>
                  </div>
                  {samples.length === 0 ? (
                    <p className="font-mono text-[11px] text-[#94A3B8] text-center py-4">No samples in data/samples/</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
                      {samples.map(s => {
                        const isProc = sampleProcessing === s.relative_path
                        return (
                          <button key={s.relative_path} onClick={() => !isProc && handleSample(s)} disabled={!!sampleProcessing}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/7 transition-colors text-left group">
                            <FileText size={13} className="text-[#94A3B8] flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-xs text-white truncate">{s.filename}</p>
                              <p className="font-mono text-[9px] text-[#94A3B8]">{s.category}</p>
                            </div>
                            {isProc
                              ? <RefreshCw size={13} className="text-[#F7931A] animate-spin flex-shrink-0" />
                              : <ChevronRight size={13} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={15} className="text-[#60a5fa]" />
                      <span className="font-mono text-xs uppercase tracking-widest text-white">Recent Uploads</span>
                    </div>
                    {recentUploads.length > 0 && (
                      <button onClick={() => { setRecentUploads([]); saveRecent([]) }}
                        className="font-mono text-[10px] text-[#94A3B8] hover:text-[#EA580C] transition-colors">Clear</button>
                    )}
                  </div>
                  {recentUploads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Upload size={20} className="text-[#94A3B8]" />
                      </div>
                      <p className="font-mono text-[11px] text-[#94A3B8]">No uploads yet this session</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {recentUploads.map((item, i) => <UploadRow key={item.doc_id ?? i} item={item} onRefresh={refreshItem} />)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 glass-card rounded-2xl p-4">
              <Zap size={14} className="text-[#F5CB5C] flex-shrink-0 mt-0.5" />
              <p className="font-mono text-[11px] text-[#94A3B8] leading-relaxed">
                Documents are processed through OCR &rarr; Entity Extraction &rarr; Neo4j Graph Sync &rarr; ChromaDB Vector Store.
                Sync typically completes in <span className="text-white">5-15 seconds</span>.
                Once synced, documents appear in <span className="text-[#F7931A]">Document Explorer</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
