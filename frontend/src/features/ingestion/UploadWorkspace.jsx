import { useRef, useState } from 'react'
import { FileUp, LoaderCircle, Upload } from 'lucide-react'
import WorkspaceShell from '../../components/workspace/WorkspaceShell'
import { Panel, StatusBadge } from '../../components/workspace/WorkspaceUi'
import { uploadDocumentFile } from '../../lib/api'

const types = ['', 'manual', 'work_order', 'inspection_report', 'regulation', 'pid']

export default function UploadWorkspace() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [type, setType] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const upload = async () => {
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try { setResult(await uploadDocumentFile(file, type || undefined)) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  const document = result?.document
  const sync = result?.sync
  return <WorkspaceShell title="Ingest documents" eyebrow="Evidence intake"><div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.35fr_.65fr]"><Panel className="p-6"><input ref={inputRef} type="file" className="hidden" accept=".pdf,.csv,.json,.txt,.png,.jpg,.jpeg" onChange={event => setFile(event.target.files?.[0] || null)} /><button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-72 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#ffbe0b]/35 bg-[#ffbe0b]/[0.025] px-6 text-center transition hover:bg-[#ffbe0b]/[0.06]"><span className="grid size-14 place-items-center rounded-2xl bg-[#ffbe0b]/10 text-[#ffbe0b]"><FileUp size={26} /></span><strong className="mt-4 text-base">{file ? file.name : 'Choose an industrial source file'}</strong><span className="mt-2 text-sm text-[#bfb493]">PDF, CSV, JSON, TXT, PNG or JPEG · up to 10 MB</span></button><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]"><label className="text-sm text-[#c7bea1]">Document type<select value={type} onChange={event => setType(event.target.value)} className="mt-2 block w-full rounded-lg border border-[#fff9e8]/12 bg-[#1a180b] px-3 py-2.5 text-sm text-[#fff9e8] outline-none focus:border-[#ffbe0b]">{types.map(item => <option key={item} value={item}>{item ? item.replace('_', ' ') : 'Auto-detect'}</option>)}</select></label><button onClick={upload} disabled={!file || loading} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#ffbe0b] px-5 text-sm font-bold text-[#181609] hover:bg-[#ffda62] disabled:cursor-not-allowed disabled:opacity-40">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}{loading ? 'Processing' : 'Process file'}</button></div>{error && <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p>}</Panel><Panel className="p-5"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ffbe0b]">Pipeline status</p>{!result ? <p className="mt-4 text-sm leading-6 text-[#bfb493]">Upload a file to extract text, identify entities, index vector chunks, and link evidence in the knowledge graph.</p> : <div className="mt-4 space-y-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold">{document?.filename}</span><StatusBadge status={sync?.sync_status} /></div><div className="grid grid-cols-2 gap-3 text-center">{[['Entities', document?.extracted_entity_count], ['Graph nodes', sync?.neo4j_nodes], ['Vector chunks', sync?.chroma_chunks], ['Confidence', document?.confidence_avg ? `${Math.round(document.confidence_avg * 100)}%` : '—']].map(([label, value]) => <div key={label} className="rounded-lg bg-white/[0.035] p-3"><b className="block text-lg text-[#fff9e8]">{value ?? 0}</b><span className="text-[10px] uppercase tracking-wider text-[#bfb493]">{label}</span></div>)}</div>{sync?.errors?.length > 0 && <p className="rounded-lg bg-rose-300/10 p-3 text-xs text-rose-200">{sync.errors.join(' ')}</p>}</div>}</Panel></div></WorkspaceShell>
}
