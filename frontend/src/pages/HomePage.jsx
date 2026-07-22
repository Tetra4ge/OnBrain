import { ArrowRight, ArrowUpRight, Check, CircleAlert, FileText, Network, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import useLandingLenis from '../hooks/useLandingLenis'

const capabilities = [
  ['Unify the evidence', 'Bring manuals, work orders, inspection reports and drawings into one searchable operating memory.', FileText],
  ['Reveal the signal', 'Connect assets, events and decisions to expose the pattern hiding across your documents.', Network],
  ['Act with context', 'Give every operator an auditable, source-backed answer when the work cannot wait.', ShieldCheck],
]

const activity = [
  ['P-204 centrifugal pump', 'Recurring vibration pattern detected', 'High'],
  ['WO-24819', 'Maintenance history connected', 'Ready'],
  ['PID-07 / Unit 3', 'Evidence package assembled', 'Complete'],
]

export default function HomePage() {
  useLandingLenis()

  return (
    <main className="ob-home">
      <div className="ob-noise" aria-hidden="true" />
      <nav className="ob-nav wrap" aria-label="Main navigation">
        <Link className="ob-logo" to="/" aria-label="OnBrain home">
          <span>ONBRAIN</span>
        </Link>
        <div className="ob-nav-links">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#security">Security</a>
        </div>
        <Link className="ob-nav-cta" to="/app">Enter workspace <ArrowUpRight size={16} /></Link>
      </nav>

      <section className="ob-hero wrap">
        <div className="ob-hero-copy">
          <div className="ob-eyebrow">- Industrial intelligence, made operational</div>
          <h1>Give your<br /><em>knowledge</em><br />a working memory.</h1>
          <p className="ob-hero-lede">OnBrain turns fragmented engineering evidence into a connected, reliable intelligence layer for the teams that keep industry moving.</p>
          <div className="ob-hero-actions">
            <Link className="ob-button ob-button-primary" to="/app">Explore the workspace <ArrowRight size={18} /></Link>
            <a className="ob-button ob-button-quiet" href="#platform"><Play size={15} fill="currentColor" /> See how it works</a>
          </div>
          <div className="ob-proof"><span className="ob-proof-avatars"><i>AK</i><i>RM</i><i>JS</i></span><span>Built for high-context operations teams</span></div>
        </div>

        <div className="ob-console" aria-label="OnBrain intelligence preview">
          <div className="ob-console-top"><span className="ob-window-dots"><i /><i /><i /></span><span>LIVE KNOWLEDGE GRAPH</span><span className="ob-live"><b /> SYNCHRONIZED</span></div>
          <div className="ob-console-body">
            <div className="ob-console-label">CURRENT INVESTIGATION <span>03 / 12</span></div>
            <div className="ob-issue-card"><span className="ob-risk">Priority event</span><h2>P-204 / vibration escalation</h2><p>67 connected evidence points across 14 source documents.</p><div><span>CONFIDENCE <b>94%</b></span><span>LAST SYNC <b>2m ago</b></span></div></div>
            <div className="ob-graph" aria-hidden="true"><i className="node n1" /><i className="node n2" /><i className="node n3" /><i className="node n4" /><i className="node n5" /><i className="node n6" /><b className="line l1" /><b className="line l2" /><b className="line l3" /><b className="line l4" /></div>
            <div className="ob-console-footer"><span><Sparkles size={14} /> Root cause path identified</span><ArrowUpRight size={16} /></div>
          </div>
        </div>
      </section>

      <section className="ob-trust"><div className="wrap"><span>ONE OPERATING MEMORY</span><b /> <span>FOR COMPLEX INDUSTRY</span><b /> <span>BUILT ON YOUR EVIDENCE</span><b /> <span>ONE OPERATING MEMORY</span></div></section>

      <section className="ob-section wrap" id="platform">
        <div className="ob-section-heading"><div><p className="ob-kicker">The platform</p><h2>From scattered records<br />to <em>decisive action.</em></h2></div><p>Make your information more than accessible. Make it useful at the exact moment it changes an outcome.</p></div>
        <div className="ob-capabilities">
          {capabilities.map(([title, body, Icon], index) => <article className="ob-capability" key={title}><span className="ob-cap-number">0{index + 1}</span><Icon className="ob-cap-icon" size={24} strokeWidth={1.8} /><h3>{title}</h3><p>{body}</p><a href="#workflow" aria-label={`Learn about ${title}`}><ArrowUpRight size={18} /></a></article>)}
        </div>
      </section>

      <section className="ob-workflow" id="workflow"><div className="wrap ob-workflow-grid"><div><p className="ob-kicker">A clear line to the answer</p><h2>Investigate in<br /><em>one motion.</em></h2><p className="ob-body-copy">Every conclusion keeps its trail. Move from a live signal to its records, relationships and reasoning without jumping between systems.</p><Link to="/app" className="ob-text-link">Open the copilot <ArrowRight size={17} /></Link></div><div className="ob-activity-panel"><div className="ob-panel-title"><span>INVESTIGATION FEED</span><span>24 JUL 2026</span></div>{activity.map(([source, detail, status]) => <div className="ob-activity" key={source}><span className={status === 'High' ? 'ob-status high' : 'ob-status'}>{status === 'High' ? <CircleAlert size={16} /> : <Check size={15} />}</span><div><b>{source}</b><p>{detail}</p></div><ArrowUpRight size={16} /></div>)}<div className="ob-panel-bottom">VIEW ALL CONNECTED EVIDENCE <ArrowRight size={15} /></div></div></div></section>

      <section className="ob-final wrap" id="security"><div className="ob-final-orb" aria-hidden="true" /><p className="ob-kicker">Designed for the work that matters</p><h2>Know more.<br /><em>Move sooner.</em></h2><p>Start connecting the evidence your operation already owns.</p><Link className="ob-button ob-button-primary" to="/app">Enter OnBrain <ArrowRight size={18} /></Link></section>

      <footer className="ob-footer wrap">
        <div className="ob-logo"><span>ONBRAIN</span></div>
        <span>Knowledge intelligence for industrial teams.</span>
        <span>Built by <a href="https://github.com/tetra4ge" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Team TetraFourge</a></span>
        <span>© 2026 ONBRAIN</span>
      </footer>
    </main>
  )
}
