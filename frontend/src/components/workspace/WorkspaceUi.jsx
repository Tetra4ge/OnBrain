export function Panel({ children, className = '' }) {
  return <section className={`rounded-md border border-[#fff9e8]/10 bg-[#272311]/75 shadow-[0_8px_24px_rgba(0,0,0,0.16)] ${className}`}>{children}</section>
}

export function StatusBadge({ status }) {
  const value = String(status || 'pending').toLowerCase()
  const tones = value === 'complete' || value === 'synced' || value === 'success'
    ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
    : value === 'failed' || value === 'error'
      ? 'border-rose-300/25 bg-rose-300/10 text-rose-200'
      : value === 'partial'
        ? 'border-amber-200/20 bg-amber-200/10 text-amber-100'
        : 'border-[#ffbe0b]/25 bg-[#ffbe0b]/10 text-[#ffda62]'
  return <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${tones}`}>{value}</span>
}

export function EmptyState({ title, body, action }) {
  return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><p className="text-base font-semibold text-[#fff9e8]">{title}</p><p className="mt-2 max-w-sm text-sm text-[#bfb493]">{body}</p>{action && <div className="mt-5">{action}</div>}</div>
}
