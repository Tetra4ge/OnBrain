import { Activity, ArrowUpRight, Sparkles } from 'lucide-react'

export default function WorkspacePageHero({ eyebrow, title, description, metrics = [], action }) {
  return (
    <section className="ob-page-hero">
      <div className="ob-page-hero-copy">
        <p className="ob-page-eyebrow"><Sparkles size={13} /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="ob-page-hero-side">
        <div className="ob-page-hero-status"><span><Activity size={12} /> Workspace intelligence</span><b>LIVE</b></div>
        <div className="ob-page-hero-metrics">
          {metrics.map(({ label, value }) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
        </div>
        {action && <div className="ob-page-hero-action">{action}<ArrowUpRight size={15} /></div>}
      </div>
    </section>
  )
}
