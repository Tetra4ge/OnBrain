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
  return (
    <WorkspaceShell title="Ingest documents" eyebrow="Evidence intake">
      <div className="w-full grid gap-6 lg:grid-cols-[1fr_340px]">
        <Panel className="p-6 rounded-md border border-[#fff9e8]/10 bg-[#272311]/70">
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.csv,.json,.txt,.png,.jpg,.jpeg" onChange={event => setFile(event.target.files?.[0] || null)} />
          <button 
            type="button" 
            onClick={() => inputRef.current?.click()} 
            className="flex min-h-72 w-full flex-col items-center justify-center rounded-md border border-dashed border-[#ffbe0b]/40 bg-[#ffbe0b]/[0.02] p-8 text-center transition hover:border-[#ffbe0b] hover:bg-[#ffbe0b]/[0.05]"
          >
            <span className="grid size-14 place-items-center rounded bg-[#ffbe0b]/10 text-[#ffbe0b]">
              <FileUp size={28} />
            </span>
            <strong className="mt-4 text-base font-semibold text-[#fff9e8]">
              {file ? file.name : 'Choose an industrial source file or drag & drop'}
            </strong>
            <p className="mt-1.5 text-xs text-[#bfb493]">
              PDF, CSV, JSON, TXT, PNG or JPEG · up to 10 MB per file
            </p>
            {file && (
              <span className="mt-3 inline-flex rounded bg-[#ffbe0b]/15 px-3 py-1 text-xs font-bold text-[#ffbe0b]">
                Selected: {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </button>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <label className="text-xs font-medium text-[#c7bea1]">
              Document type / taxonomy
              <select 
                value={type} 
                onChange={event => setType(event.target.value)} 
                className="mt-2 block w-full rounded border border-[#fff9e8]/15 bg-[#17150a] px-3 py-2.5 text-xs text-[#fff9e8] outline-none focus:border-[#ffbe0b]"
              >
                {types.map(item => (
                  <option key={item} value={item}>
                    {item ? item.replace('_', ' ').toUpperCase() : 'Auto-detect document type'}
                  </option>
                ))}
              </select>
            </label>
            <button 
              onClick={upload} 
              disabled={!file || loading} 
              className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#ffbe0b] px-6 text-xs font-bold text-[#181609] transition hover:bg-[#ffda62] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
              {loading ? 'Processing Pipeline…' : 'Process File'}
            </button>
          </div>
          {error && <p className="mt-4 rounded border border-rose-300/20 bg-rose-300/10 p-3 text-xs text-rose-200">{error}</p>}
        </Panel>

        <Panel className="p-5 rounded-md border border-[#fff9e8]/10 bg-[#272311]/70 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffbe0b]">Pipeline status</p>
            {!result ? (
              <div className="mt-4 space-y-3 text-xs leading-6 text-[#bfb493]">
                <p>Upload a file to extract text, identify entities, index vector chunks, and link evidence in the knowledge graph.</p>
                <div className="space-y-2 pt-2 border-t border-[#fff9e8]/8">
                  <div className="flex items-center gap-2 text-[11px] text-[#c7bea1]">
                    <span className="size-1.5 rounded-full bg-[#ffbe0b]" /> Text extraction & OCR
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#c7bea1]">
                    <span className="size-1.5 rounded-full bg-[#ffbe0b]" /> Entity recognition & tag linking
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#c7bea1]">
                    <span className="size-1.5 rounded-full bg-[#ffbe0b]" /> Vector embedding generation
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#fff9e8]/10 pb-3">
                  <span className="truncate text-xs font-semibold text-[#fff9e8]">{document?.filename}</span>
                  <StatusBadge status={sync?.sync_status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    ['Entities', document?.extracted_entity_count], 
                    ['Graph nodes', sync?.neo4j_nodes], 
                    ['Vector chunks', sync?.chroma_chunks], 
                    ['Confidence', document?.confidence_avg ? `${Math.round(document.confidence_avg * 100)}%` : '—']
                  ].map(([label, value]) => (
                    <div key={label} className="rounded border border-[#fff9e8]/8 bg-white/[0.03] p-3">
                      <b className="block text-lg font-extrabold text-[#fff9e8]">{value ?? 0}</b>
                      <span className="text-[9px] uppercase tracking-wider text-[#bfb493]">{label}</span>
                    </div>
                  ))}
                </div>
                {sync?.errors?.length > 0 && (
                  <p className="rounded bg-rose-300/10 p-2.5 text-xs text-rose-200">{sync.errors.join(' ')}</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-[#fff9e8]/8 text-[11px] text-[#8e876e]">
            Synchronized with ChromaDB & Neo4j graph store
          </div>
        </Panel>
      </div>
    </WorkspaceShell>
  )
}
