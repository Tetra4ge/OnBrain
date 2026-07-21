import { useNavigate } from 'react-router-dom'
import {
  Zap, Shield, FileSearch, GitBranch,
  ArrowRight, CheckCircle, Layers, BarChart3,
  FileText, Brain, AlertTriangle, Network
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'

// ── Data ──────────────────────────────────────────────────────
const STATS = [
  '12,000+ Documents Indexed',
  '3 Specialized AI Agents',
  '98% Query Accuracy',
  '<2s Response Time',
  'On-Premise Deployable',
  'Zero-Shot Compliance Scanning',
  'Knowledge Graph Powered',
  'Multi-Format Ingestion',
]

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Smart Ingestion Agent',
    desc: 'Automatically processes work orders, inspection reports, regulations, and incident documents. Extracts entities, builds relationships, and populates the knowledge graph without manual tagging.',
    badge: 'Autonomous',
  },
  {
    icon: Shield,
    title: 'Compliance Gap Scanner',
    desc: "Proactively scans your document graph for missing inspections, uncovered regulations, and orphaned references — before anyone asks. The agent that runs while your team sleeps.",
    badge: 'Proactive',
  },
  {
    icon: Brain,
    title: 'Copilot Chat',
    desc: 'Ask natural-language questions about your operations. Get cited, confidence-scored answers drawn from your actual documents — not hallucinated generics.',
    badge: 'On-Demand',
  },
  {
    icon: AlertTriangle,
    title: 'RCA Report Generator',
    desc: 'Submit an incident description and receive a structured root cause analysis: contributing factors, historical patterns, and recommended actions, all with inline citations.',
    badge: 'On-Demand',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Documents',
    desc: 'Drop PDFs, Word docs, or plain text — work orders, inspection reports, regulations, incident records. The ingestion agent handles the rest.',
  },
  {
    step: '02',
    title: 'Index & Graph',
    desc: 'The ingestion agent extracts entities and relationships, embeds chunks into vector storage, and wires everything into a live knowledge graph.',
  },
  {
    step: '03',
    title: 'Scan Proactively',
    desc: 'The compliance agent autonomously scans for gaps — missing inspections, unlinked regulations, outdated procedures — and populates your dashboard.',
  },
  {
    step: '04',
    title: 'Query with Confidence',
    desc: "Ask the Copilot anything. It retrieves via hybrid vector + graph search, answers with citations, and tells you exactly how confident it is.",
  },
]

const AGENTS = [
  { name: 'Ingestion Agent',  trigger: 'Every upload',    color: 'from-[#EA580C] to-[#F7931A]', icon: FileText  },
  { name: 'Compliance Agent', trigger: 'Scheduled scan',  color: 'from-[#F7931A] to-[#F5CB5C]', icon: Shield    },
  { name: 'RCA Agent',        trigger: 'Incident submit', color: 'from-[#F5CB5C] to-[#EA580C]', icon: GitBranch },
  { name: 'Copilot Agent',    trigger: 'User question',   color: 'from-[#EA580C] to-[#F7931A]', icon: Brain     },
]

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#030304]" style={{ fontFamily: 'var(--font-body)' }}>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F7931A] opacity-[0.06] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#F5CB5C] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

        {/* Content */}
        <div className="wrap relative z-10 py-24">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Left: Copy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Live badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}
                   className="bg-[#F7931A]/10 border border-[#F7931A]/30 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7931A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7931A]" />
                </span>
                <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A]">
                  Multi-Agent AI Platform
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', marginBottom: '1.25rem' }}>
                  Industrial Knowledge,{' '}
                  <span className="gradient-text">Engineered<br />to Answer</span>
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.8, maxWidth: '34rem' }}>
                  OnBrain is a multi-agent AI platform that ingests your operational documents,
                  surfaces compliance gaps automatically, and answers your team's questions
                  with cited, confidence-scored precision.
                </p>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Button size="lg" onClick={() => navigate('/app')}>
                  Try It Out <ArrowRight size={18} />
                </Button>
                <Button variant="outline" size="lg" onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  How It Works
                </Button>
              </div>

              {/* Trust chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {['No hallucinations — cited answers', 'On-premise deployable', 'Multi-format ingestion'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] border border-white/10 rounded-full px-3 py-1.5">
                    <CheckCircle size={11} className="text-[#F5CB5C]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Orbital graphic */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <OrbitalGraphic />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ══ STATS TICKER ══════════════════════════════════════ */}
      <section className="border-y border-white/8 bg-[#0d0d0c] py-5 overflow-hidden">
        <div style={{ display: 'flex' }}>
          <div className="flex gap-16 animate-ticker whitespace-nowrap">
            {[...STATS, ...STATS].map((s, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] flex-shrink-0" />
                <span className="font-mono text-xs tracking-wider text-[#94A3B8] uppercase">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-[#030304]">
        <div className="wrap">
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">What OnBrain Does</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Four agents, one platform,{' '}
              <span className="gradient-text">zero blind spots</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.8, maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
              Not a chatbot. A system of specialized agents that work autonomously and on-demand — processing, scanning, and answering across your entire operational knowledge base.
            </p>
          </div>

          {/* Feature cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div
                key={title}
                className="group bg-[#242423] border border-white/8 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/40"
                style={{ padding: '2.25rem', boxShadow: 'none' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px -10px rgba(247,147,26,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Watermark icon */}
                <Icon
                  size={110}
                  strokeWidth={0.5}
                  className="absolute -right-4 -bottom-4 text-white opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300"
                />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div
                      className="group-hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-300"
                      style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon size={20} style={{ color: '#F7931A' }} strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#F5CB5C] border border-[#F5CB5C]/30 bg-[#F5CB5C]/10 rounded-full px-2.5 py-1">
                      {badge}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>{title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.75 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-[#0d0d0c]">
        <div className="wrap">
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">The Pipeline</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              From document to{' '}
              <span className="gradient-text">insight in seconds</span>
            </h2>
          </div>

          {/* Timeline steps */}
          <div className="wrap-mid" style={{ padding: 0 }}>
            {/* Vertical connector line */}
            <div style={{ position: 'relative' }}>
              {/* Gradient line — decorative, sits behind cards */}
              <div
                className="hidden md:block"
                style={{
                  position: 'absolute',
                  left: '1.75rem',
                  top: '2.5rem',
                  bottom: '2.5rem',
                  width: '2px',
                  background: 'linear-gradient(to bottom, #F7931A, #F5CB5C, transparent)',
                  borderRadius: '9999px',
                  zIndex: 0,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
                  <div
                    key={step}
                    className="corner-accent bg-[#242423] border border-white/8 rounded-2xl transition-all duration-300 hover:border-[#F7931A]/30"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      padding: '1.75rem 2rem',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Step number bubble */}
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #EA580C, #F7931A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 16px rgba(247,147,26,0.5)',
                      }}
                    >
                      <span className="font-mono font-bold text-white text-sm">{i + 1}</span>
                    </div>
                    {/* Content */}
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>
                        {title}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.75 }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AGENTS ════════════════════════════════════════════ */}
      <section id="agents" className="py-24 bg-[#030304]">
        <div className="wrap">
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">Multi-Agent Architecture</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Agents that{' '}
              <span className="gradient-text">work without being asked</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.8, maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
              The compliance and ingestion agents run autonomously. The RCA and copilot agents run on-demand. Together, they cover your entire operational knowledge lifecycle.
            </p>
          </div>

          {/* Agent cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {AGENTS.map(({ name, trigger, color, icon: Icon }) => (
              <div
                key={name}
                className="group bg-[#242423] border border-white/8 rounded-2xl text-center transition-all duration-300 hover:border-[#F7931A]/40 hover:-translate-y-1"
                style={{ padding: '2rem 1.5rem' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px -10px rgba(247,147,26,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div
                  className={`bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 20px rgba(247,147,26,0.3)' }}
                >
                  <Icon size={22} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.625rem' }}>{name}</h3>
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#94A3B8] border border-white/10 rounded-full px-3 py-1">
                  <Zap size={9} className="text-[#F5CB5C]" />
                  {trigger}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0d0d0c] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F7931A] opacity-[0.05] blur-[150px] rounded-full" />

        <div className="wrap relative z-10" style={{ textAlign: 'center' }}>
          <span className="section-label">Start Now</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Your operational knowledge,{' '}
            <span className="gradient-text">finally answerable</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.8, maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
            Upload a document, ask a question, and see OnBrain surface insights your team didn't know were buried in the data.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Button size="lg" onClick={() => navigate('/app')}>
              Open Copilot <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="border-t border-white/8 py-10">
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#EA580C,#F7931A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }} className="gradient-text">OnBrain</span>
          </div>
          <p className="font-mono text-xs text-[#94A3B8] tracking-wide">
            © 2025 OnBrain · Industrial AI Knowledge Platform
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" className="font-mono text-xs text-[#94A3B8] hover:text-[#F7931A] transition-colors tracking-wide">GitHub</a>
            <a href="#" className="font-mono text-xs text-[#94A3B8] hover:text-[#F7931A] transition-colors tracking-wide">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Orbital Graphic ───────────────────────────────────────────
function OrbitalGraphic() {
  return (
    <div
      className="animate-float"
      style={{ position: 'relative', width: 'clamp(280px,35vw,420px)', height: 'clamp(280px,35vw,420px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Rings */}
      <div className="absolute inset-0 rounded-full border border-[#F7931A]/20 animate-spin-slow" style={{ borderStyle: 'dashed' }} />
      <div className="absolute rounded-full border border-[#F5CB5C]/15 animate-spin-reverse" style={{ inset: '8%' }} />
      <div className="absolute rounded-full border border-[#F7931A]/10 animate-spin-slow" style={{ inset: '18%', animationDuration: '20s' }} />

      {/* Center orb */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: 'clamp(100px,12vw,144px)', height: 'clamp(100px,12vw,144px)',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #EA580C, #F7931A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 60px rgba(247,147,26,0.5), 0 0 120px rgba(234,88,12,0.2)',
      }}>
        <Brain size={52} className="text-white" strokeWidth={1} />
      </div>

      {/* Orbiting stat cards */}
      {[
        { label: '1,247 Nodes', angle:  30,  icon: Network   },
        { label: '98% Accuracy', angle: 155, icon: BarChart3 },
        { label: '3 Agents',    angle:  270, icon: Layers    },
      ].map(({ label, angle, icon: Icon }, idx) => {
        const rad = (angle * Math.PI) / 180
        const r   = 43
        const x   = 50 + r * Math.cos(rad)
        const y   = 50 + r * Math.sin(rad)
        return (
          <div
            key={label}
            className="glass-card rounded-xl animate-bounce"
            style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%,-50%)',
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              animationDuration: `${3.5 + idx * 0.8}s`,
              animationDelay: `${idx * 0.6}s`,
            }}
          >
            <Icon size={11} style={{ color: '#F7931A' }} />
            <span className="font-mono text-[10px] text-white whitespace-nowrap">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
