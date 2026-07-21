import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, Shield, Network, FileSearch, GitBranch,
  ArrowRight, CheckCircle, Layers, BarChart3,
  FileText, Brain, AlertTriangle
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
  { name: 'Ingestion Agent',     trigger: 'Every upload',    color: 'from-[#EA580C] to-[#F7931A]', icon: FileText  },
  { name: 'Compliance Agent',    trigger: 'Scheduled scan',  color: 'from-[#F7931A] to-[#F5CB5C]', icon: Shield    },
  { name: 'RCA Agent',           trigger: 'Incident submit', color: 'from-[#F5CB5C] to-[#EA580C]', icon: GitBranch },
  { name: 'Copilot Agent',       trigger: 'User question',   color: 'from-[#EA580C] to-[#F7931A]', icon: Brain     },
]

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const tickerRef = useRef(null)

  return (
    <div className="min-h-screen bg-[#030304] font-body">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Radial blur orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F7931A] opacity-6 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F5CB5C] opacity-5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EA580C] opacity-4 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-24">
          {/* Left: copy */}
          <div className="flex flex-col gap-8">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 self-start bg-[#F7931A]/10 border border-[#F7931A]/30 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7931A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7931A]" />
              </span>
              <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A]">
                Multi-Agent AI Platform
              </span>
            </div>

            <div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white mb-4">
                Industrial Knowledge,{' '}
                <br className="hidden sm:block" />
                <span className="gradient-text">Engineered to Answer</span>
              </h1>
              <p className="font-body text-lg text-[#94A3B8] leading-relaxed max-w-xl">
                OnBrain is a multi-agent AI platform that ingests your operational documents,
                surfaces compliance gaps automatically, and answers your team's questions
                with cited, confidence-scored precision.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
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
            <div className="flex flex-wrap gap-3">
              {['No hallucinations — cited answers', 'On-premise deployable', 'Multi-format ingestion'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] border border-white/10 rounded-full px-3 py-1">
                  <CheckCircle size={11} className="text-[#F5CB5C]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Animated orbital graphic */}
          <div className="flex items-center justify-center">
            <OrbitalGraphic />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── STATS TICKER ──────────────────────────────────────── */}
      <section className="border-y border-white/8 bg-[#0d0d0c] py-4 overflow-hidden">
        <div className="flex" ref={tickerRef}>
          <div className="flex gap-16 animate-ticker whitespace-nowrap">
            {[...STATS, ...STATS].map((s, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0">
                <span className="w-1 h-1 rounded-full bg-[#F7931A]" />
                <span className="font-mono text-xs tracking-wider text-[#94A3B8] uppercase">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-[#030304]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A] mb-4 block">
              What OnBrain Does
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
              Four agents, one platform,{' '}
              <span className="gradient-text">zero blind spots</span>
            </h2>
            <p className="font-body text-[#94A3B8] text-lg max-w-2xl mx-auto">
              Not a chatbot. A system of specialized agents that work autonomously and on-demand — processing, scanning, and answering across your entire operational knowledge base.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div
                key={title}
                className="group bg-[#242423] border border-white/8 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/40 hover:shadow-[0_0_40px_-10px_rgba(247,147,26,0.2)]"
              >
                {/* Background watermark icon */}
                <Icon
                  size={120}
                  strokeWidth={0.5}
                  className="absolute -right-6 -bottom-6 text-white opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300"
                />

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#EA580C]/15 border border-[#EA580C]/40 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-300">
                      <Icon size={22} className="text-[#F7931A]" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#F5CB5C] border border-[#F5CB5C]/30 bg-[#F5CB5C]/10 rounded-full px-2.5 py-1">
                      {badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-white mb-2">{title}</h3>
                    <p className="font-body text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#0d0d0c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A] mb-4 block">
              The Pipeline
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">
              From document to{' '}
              <span className="gradient-text">insight in seconds</span>
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical gradient line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#F7931A] via-[#F5CB5C] to-transparent hidden md:block" />

            <div className="flex flex-col gap-6">
              {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
                <div key={step} className="corner-accent bg-[#242423] border border-white/8 rounded-2xl p-8 md:pl-20 relative group hover:border-[#F7931A]/30 transition-all duration-300">
                  {/* Step number node */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] items-center justify-center shadow-[0_0_16px_rgba(247,147,26,0.5)] z-10">
                    <span className="font-mono text-xs font-bold text-white">{i + 1}</span>
                  </div>

                  {/* Mobile step */}
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#F7931A] mb-1 block md:hidden">
                    Step {step}
                  </span>

                  <h3 className="font-heading font-semibold text-xl text-white mb-2">{title}</h3>
                  <p className="font-body text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENTS SECTION ────────────────────────────────────── */}
      <section id="agents" className="py-24 bg-[#030304]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A] mb-4 block">
              Multi-Agent Architecture
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">
              Agents that{' '}
              <span className="gradient-text">work without being asked</span>
            </h2>
            <p className="font-body text-[#94A3B8] text-lg max-w-2xl mx-auto mt-4">
              The compliance and ingestion agents run autonomously. The RCA and copilot agents run on-demand. Together, they cover your entire operational knowledge lifecycle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENTS.map(({ name, trigger, color, icon: Icon }) => (
              <div
                key={name}
                className="group bg-[#242423] border border-white/8 rounded-2xl p-6 text-center hover:border-[#F7931A]/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(247,147,26,0.3)] group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">{name}</h3>
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#94A3B8] border border-white/10 rounded-full px-3 py-1">
                  <Zap size={9} className="text-[#F5CB5C]" />
                  {trigger}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────── */}
      <section className="py-24 bg-[#0d0d0c] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F7931A] opacity-5 blur-[150px] rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-[#F7931A] mb-6 block">
            Start Now
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Your operational knowledge,{' '}
            <span className="gradient-text">finally answerable</span>
          </h2>
          <p className="font-body text-[#94A3B8] text-lg mb-10 max-w-2xl mx-auto">
            Upload a document, ask a question, and see OnBrain surface insights your team didn't know were buried in the data.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/app')}>
              Open Copilot <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold gradient-text">OnBrain</span>
          </div>
          <p className="font-mono text-xs text-[#94A3B8] tracking-wide">
            © 2025 OnBrain · Industrial AI Knowledge Platform
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="font-mono text-xs text-[#94A3B8] hover:text-[#F7931A] transition-colors tracking-wide">GitHub</a>
            <a href="#" className="font-mono text-xs text-[#94A3B8] hover:text-[#F7931A] transition-colors tracking-wide">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Orbital Graphic Component ─────────────────────────────────
function OrbitalGraphic() {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center animate-float">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[#F7931A]/20 animate-spin-slow" style={{ borderStyle: 'dashed' }} />

      {/* Middle ring */}
      <div className="absolute inset-8 rounded-full border border-[#F5CB5C]/15 animate-spin-reverse" />

      {/* Inner ring */}
      <div className="absolute inset-16 rounded-full border border-[#F7931A]/10 animate-spin-slow" style={{ animationDuration: '20s' }} />

      {/* Center orb */}
      <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_60px_rgba(247,147,26,0.5),0_0_120px_rgba(234,88,12,0.2)]">
        <Brain size={48} className="text-white" strokeWidth={1} />
      </div>

      {/* Orbiting nodes */}
      {[
        { label: '1,247 Nodes', angle:  30,  icon: Network,   delay: '0s'   },
        { label: '98% Accuracy', angle: 150,  icon: BarChart3, delay: '1.5s' },
        { label: '3 Agents',    angle:  270, icon: Layers,    delay: '3s'   },
      ].map(({ label, angle, icon: Icon, delay }) => {
        const rad = (angle * Math.PI) / 180
        const r   = 48  // % from center
        const x   = 50 + r * Math.cos(rad)
        const y   = 50 + r * Math.sin(rad)
        return (
          <div
            key={label}
            className="absolute glass-card rounded-xl px-3 py-2 flex items-center gap-2 animate-bounce"
            style={{
              left: `${x}%`,
              top:  `${y}%`,
              transform: 'translate(-50%, -50%)',
              animationDuration: '4s',
              animationDelay: delay,
            }}
          >
            <Icon size={12} className="text-[#F7931A]" />
            <span className="font-mono text-[10px] text-white whitespace-nowrap">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
