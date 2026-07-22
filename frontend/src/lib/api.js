async function request(path, options = {}) {
  const res = await fetch(path, options)
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
