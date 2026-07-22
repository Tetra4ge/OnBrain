const VITE_MODE = import.meta.env.VITE_MODE || 'development';
// const API_BASE = (VITE_MODE === 'production' ? import.meta.env.VITE_API_PRO_URL : import.meta.env.VITE_API_DEV_URL) || 'http://localhost:8000';
const API_BASE = (VITE_MODE === 'production' ? import.meta.env.VITE_API_PRO_URL : import.meta.env.VITE_API_DEV_URL);

const BASE_URL = API_BASE.replace(/\/+$/, '')

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  const res = await fetch(url, options)
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const detail = typeof data === 'object' && data !== null ? data.detail : data
    throw new Error(detail || `Request failed (${res.status})`)
  }

  return data
}

export async function checkHealth() {
  try {
    const data = await request('/health')
    return { online: data.status === 'ok', ...data }
  } catch {
    return { online: false, status: 'offline' }
  }
}

export async function getSampleDocuments() {
  const data = await request('/api/documents/samples')
  return data.samples ?? []
}

export async function processSampleDocument(relativePath) {
  const params = new URLSearchParams({ relative_path: relativePath })
  return request(`/api/documents/process-sample?${params.toString()}`, { method: 'POST' })
}

export async function uploadDocumentFile(file, docTypeOverride) {
  const formData = new FormData()
  formData.append('file', file)
  if (docTypeOverride) formData.append('doc_type_override', docTypeOverride)

  return request('/api/documents/upload', {
    method: 'POST',
    body: formData,
  })
}

export async function getDocumentStatus(docId) {
  return request(`/api/documents/${encodeURIComponent(docId)}/status`)
}

export async function listDocuments(docType, limit = 20, skip = 0) {
  const params = new URLSearchParams()
  if (docType) params.set('doc_type', docType)
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  return request(`/api/documents?${params.toString()}`)
}

export async function semanticSearch(query, topK = 5, docTypeFilter = null) {
  return request('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      top_k: topK,
      doc_type_filter: docTypeFilter,
    }),
  })
}

export async function listEquipmentTags() {
  return request('/api/graph/equipment')
}

export async function streamCopilotResponse({ query, sessionId, onEvent }) {
  const response = await fetch(`${BASE_URL}/api/copilot/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ query, session_id: sessionId }),
  })
  if (!response.ok || !response.body) {
    const detail = await response.text()
    throw new Error(detail || `Copilot request failed (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    for (const rawEvent of events) {
      const dataLine = rawEvent.split('\n').find(line => line.startsWith('data: '))
      if (!dataLine) continue
      const payload = dataLine.slice(6)
      if (payload === '[DONE]') continue
      const event = JSON.parse(payload)
      if (event.type === 'error') throw new Error(event.message || 'Copilot request failed')
      onEvent(event)
    }
    if (done) break
  }
}
