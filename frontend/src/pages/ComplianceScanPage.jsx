import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, ShieldAlert, Search, ChevronDown, ChevronUp,
  FileText, Download, Clock, AlertTriangle, CheckCircle2,
  Cpu, RefreshCw, Trash2, Upload
} from 'lucide-react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import { semanticSearch, listEquipmentTags } from '../lib/api'

// ── Helpers ───────────────────────────────────────────────────
const LS_KEY = 'onbrain_compliance_scans'
const loadHistory = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] } }
const saveHistory = items => localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 5)))

function relevanceScore(result) {
  if (typeof result?.relevance_score === 'number') return result.relevance_score
  if (typeof result?.score === 'number') return result.score
  if (typeof result?.distance === 'number') return Math.max(0, Math.min(1, 1 - (result.distance / 2)))
  return 0
}

function gapClass(score) {
  if (score >= 0.65) return { cls: 'gap-card-covered', label: 'Covered', Icon: CheckCircle2, color: '#34d399', badgeCls: 'status-badge status-synced' }
  if (score >= 0.4)  return { cls: 'gap-card-warning', label: 'Review', Icon: AlertTriangle, color: '#F5CB5C', badgeCls: 'status-badge status-pending' }
  return               { cls: 'gap-card-missing', label: 'Gap', Icon: ShieldAlert, color: '#EA580C', badgeCls: 'status-badge status-error' }
}

function scoreBar(score) {
  const pct = Math.round(score * 100)
  const color = score >= 0.65 ? '#34d399' : score >= 0.4 ? '#F5CB5C' : '#EA580C'
  return (
    <div className="h-1 bg-white/8 rounded-full overflow-hidden mt-2">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ── Result Card ───────────────────────────────────────────────
function ResultCard({ result, index }) {
  const [open, setOpen] = useState(index < 3)
  const score = relevanceScore(result)
  const { cls, label, Icon, color, badgeCls } = gapClass(score)
  const meta = result.metadata ?? {}

  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${cls}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs text-white truncate">{meta.source ?? meta.title ?? `Result ${index + 1}`}</span>
            {meta.page && <span className="font-mono text-[9px] text-[#94A3B8]">p.{meta.page}</span>}
          </div>
          {scoreBar(score)}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-mono text-[10px]" style={{ color }}>{Math.round(score * 100)}% match</span>
          <span className={badgeCls}>{label}</span>
          {open ? <ChevronUp size={13} className="text-[#94A3B8]" /> : <ChevronDown size={13} className="text-[#94A3B8]" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-white/6">
          {/* Snippet */}
          {result.text && (
            <blockquote className="font-body text-[11px] text-[#94A3B8] leading-relaxed mt-4 pl-3 border-l-2 border-[#F7931A]/30 italic">
              {result.text.slice(0, 400)}{result.text.length > 400 ? '…' : ''}
            </blockquote>
          )}

          {/* Metadata chips */}
          {(meta.doc_type || meta.source) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {meta.doc_type && (
                <span className={`doc-pill doc-pill-${meta.doc_type === 'inspection_report' ? 'inspection' : meta.doc_type}`}>
                  {meta.doc_type}
                </span>
              )}
              {meta.source && (
                <span className="font-mono text-[9px] text-[#94A3B8] flex items-center gap-1">
                  <FileText size={9} />{meta.source}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Scan History Item ─────────────────────────────────────────
function HistoryItem({ item, onRestore }) {
  const summary = item.results?.length ?? 0
  const covered = item.results?.filter(r => relevanceScore(r) >= 0.65).length ?? 0
  return (
    <button onClick={() => onRestore(item)}
      className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/4 hover:bg-white/7 transition-colors text-left w-full group">
      <Clock size={13} className="text-[#94A3B8] flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-white truncate">{item.query}</p>
        <p className="font-mono text-[9px] text-[#94A3B8] mt-0.5">
          {summary} results · {covered} covered · {item.timestamp}
        </p>
      </div>
      <RefreshCw size={12} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function ComplianceScanPage() {
  const navigate = useNavigate()
  const [query, setQuery]           = useState('')
  const [equipTags, setEquipTags]   = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [results, setResults]       = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [history, setHistory]       = useState(loadHistory)
  const [topK, setTopK]             = useState(10)

  useEffect(() => {
    listEquipmentTags().then(data => setEquipTags(data.tags ?? []))
  }, [])

  const runScan = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true); setError(null); setResults(null)
    try {
      const fullQuery = selectedTag ? `[Equipment: ${selectedTag}] ${query}` : query
      const data = await semanticSearch(fullQuery, topK, 'regulation')
      const scanResults = data.results ?? []
      setResults(scanResults)

      const entry = {
        query: query.trim(),
        equipment_tag: selectedTag || null,
        results: scanResults,
        timestamp: new Date().toLocaleString(),
      }
      setHistory(prev => { const h = [entry, ...prev]; saveHistory(h); return h })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query, selectedTag, topK])

  const restoreHistory = (item) => {
    setQuery(item.query)
    setSelectedTag(item.equipment_tag ?? '')
    setResults(item.results)
  }

  const exportJSON = () => {
    if (!results) return
    const blob = new Blob([JSON.stringify({ query, equipment_tag: selectedTag, results, exported_at: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'compliance-scan.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const covered = results?.filter(r => relevanceScore(r) >= 0.65).length ?? 0
  const review  = results?.filter(r => { const s = relevanceScore(r); return s >= 0.4 && s < 0.65 }).length ?? 0
  const gaps    = results?.filter(r => relevanceScore(r) < 0.4).length ?? 0

  return (
    <div className="app-shell ob-workspace-shell" style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      <div className="app-sidebar"><AppSidebar /></div>
      <div className="app-main ob-workspace-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AppHeader title="Compliance Scan" />
        <div className="ob-workspace-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.5rem 2rem' }}>

          {/* Ambient glow */}
          <div className="pointer-events-none" style={{
            position: 'fixed', top: 0, right: 0, width: '28rem', height: '28rem',
            background: '#34d399', opacity: 0.02, filter: 'blur(120px)', borderRadius: '50%',
          }} />

          <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

            {/* Heading */}
            <div className="mb-8 animate-fade-up text-center">
              <span className="section-label">Regulatory Intelligence</span>
              <h1 className="font-heading text-2xl text-white mb-2">Compliance Scan</h1>
              <p className="font-body text-sm text-[#94A3B8]">
                Describe a process or procedure — we surface matching regulations and flag coverage gaps.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem' }}>

              {/* Left — Form + History */}
              <div className="flex flex-col gap-4">
                {/* Scan form */}
                <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[#34d399]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-white">Scan Parameters</span>
                  </div>

                  {/* Equipment tag */}
                  {equipTags.length > 0 && (
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] block mb-1.5">Equipment Tag (optional)</label>
                      <select id="equipment-tag-select" value={selectedTag} onChange={e => setSelectedTag(e.target.value)}
                        style={{ width: '100%', background: 'rgba(36,36,35,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff',
                          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }}>
                        <option value="">No equipment filter</option>
                        {equipTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Query textarea */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] block mb-1.5">Process / Procedure Description</label>
                    <textarea
                      id="compliance-query"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      rows={5}
                      placeholder="e.g. Emergency shutdown procedure for high-pressure steam valve isolation..."
                      style={{
                        width: '100%', background: 'rgba(36,36,35,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem',
                        padding: '0.75rem 0.875rem', color: '#fff', resize: 'vertical',
                        fontFamily: 'var(--font-body)', fontSize: '0.8125rem', outline: 'none',
                        lineHeight: '1.6',
                      }}
                      onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) runScan() }}
                    />
                    <p className="font-mono text-[9px] text-[#94A3B8] mt-1">Ctrl+Enter to run</p>
                  </div>

                  {/* Top-K slider */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">Results depth</label>
                      <span className="font-mono text-[10px] text-white">Top {topK}</span>
                    </div>
                    <input type="range" min={3} max={20} value={topK} onChange={e => setTopK(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#F7931A' }} />
                  </div>

                  {/* Run button */}
                  <button id="compliance-run-btn"
                    onClick={runScan}
                    disabled={loading || !query.trim()}
                    style={{
                      width: '100%', padding: '0.75rem',
                      background: loading || !query.trim() ? 'rgba(247,147,26,0.15)' : 'linear-gradient(to right,#EA580C,#F7931A)',
                      border: 'none', borderRadius: '0.875rem', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}>
                    {loading
                      ? <><RefreshCw size={14} className="animate-spin" /> Scanning regulations…</>
                      : <><Search size={14} /> Run Compliance Scan</>}
                  </button>
                </div>

                {/* Scan history */}
                {history.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#94A3B8]" />
                        <span className="font-mono text-xs uppercase tracking-widest text-white">Recent Scans</span>
                      </div>
                      <button onClick={() => { setHistory([]); saveHistory([]) }}
                        className="font-mono text-[10px] text-[#94A3B8] hover:text-[#EA580C] transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {history.map((item, i) => <HistoryItem key={i} item={item} onRestore={restoreHistory} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Results */}
              <div className="flex flex-col gap-4">
                {/* No regulations ingested */}
                {results === null && !loading && !error && (
                  <div className="flex flex-col items-center justify-center h-full py-24 gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-white/4 flex items-center justify-center">
                      <ShieldCheck size={32} className="text-[#94A3B8]" />
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-semibold text-white text-lg mb-1">Ready to scan</p>
                      <p className="font-body text-sm text-[#94A3B8] mb-5">Enter a process description and run the scan.</p>
                      <p className="font-mono text-[10px] text-[#94A3B8]">
                        Make sure regulation documents are ingested via the{' '}
                        <button onClick={() => navigate('/app/upload')} className="text-[#F7931A] hover:underline">Upload Center</button>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center">
                      <Cpu size={24} className="text-[#34d399] animate-pulse" />
                    </div>
                    <p className="font-mono text-sm text-white">Scanning regulation corpus…</p>
                    <p className="font-mono text-[11px] text-[#94A3B8]">Performing semantic search across ingested regulations</p>
                  </div>
                )}

                {/* Error */}
                {error && !loading && (
                  <div className="bg-red-500/8 border border-red-500/25 rounded-2xl p-5 flex items-start gap-3">
                    <ShieldAlert size={18} className="text-[#EA580C] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-sm text-[#EA580C] font-semibold mb-1">Scan failed</p>
                      <p className="font-mono text-[11px] text-[#94A3B8]">{error}</p>
                      {error.includes('regulation') && (
                        <button onClick={() => navigate('/app/upload')}
                          className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-[#F7931A] hover:underline">
                          <Upload size={11} /> Upload regulation documents first
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Results */}
                {results !== null && !loading && !error && (
                  <>
                    {/* Summary bar */}
                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">Scan Summary</span>
                        <div className="flex gap-2">
                          <button onClick={exportJSON} title="Export JSON"
                            className="flex items-center gap-1.5 font-mono text-[10px] text-[#94A3B8] hover:text-[#F7931A] transition-colors px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/8">
                            <Download size={11} /> Export
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Covered', count: covered, color: '#34d399', badgeCls: 'status-synced' },
                          { label: 'Review',  count: review,  color: '#F5CB5C', badgeCls: 'status-pending' },
                          { label: 'Gap',     count: gaps,    color: '#EA580C', badgeCls: 'status-error' },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="text-center bg-white/4 rounded-xl p-3">
                            <div className="font-heading font-bold text-2xl" style={{ color }}>{count}</div>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>

                      {results.length === 0 && (
                        <p className="font-mono text-[11px] text-[#94A3B8] text-center mt-3">
                          No matching regulations found — ensure regulation documents are uploaded and ingested.
                        </p>
                      )}
                    </div>

                    {/* Result cards */}
                    <div className="flex flex-col gap-3">
                      {results.map((r, i) => <ResultCard key={r.id ?? i} result={r} index={i} />)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
