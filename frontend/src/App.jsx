import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [healthStatus, setHealthStatus] = useState('checking')
  const [testCount, setTestCount] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setHealthStatus('healthy')
        } else {
          setHealthStatus('unhealthy')
        }
      })
      .catch(() => {
        setHealthStatus('unhealthy')
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20">
            OB
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">OnBrain</h1>
            <span className="text-xs text-slate-400">Industrial Knowledge Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${
              healthStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' :
              healthStatus === 'unhealthy' ? 'bg-rose-500' : 'bg-amber-500 animate-bounce'
            }`}></span>
            API Connection: {healthStatus.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center items-center">
        <div className="text-center max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4 uppercase tracking-wider">
            Phase 1 Complete
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-teal-400 leading-tight mb-4">
            Industrial Knowledge Intelligence Platform
          </h2>
          <p className="text-slate-400 text-lg">
            A unified intelligence layer fusing P&IDs, equipment procedures, inspection logs, and maintenance history into a single predictive knowledge graph.
          </p>
        </div>

        {/* Services Health Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {/* API service card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur flex flex-col justify-between hover:border-violet-500/50 transition-colors group">
            <div className="text-left">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Service 01</span>
                <span className={`w-2 h-2 rounded-full ${healthStatus === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">FastAPI Backend</h3>
              <p className="text-slate-400 text-sm">Provides standard API routes, AI agents orchestration, and model sync routines.</p>
            </div>
            <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
              <span>Port: 8000</span>
              <span className="text-slate-400 bg-slate-800/50 px-2 py-1 rounded">/health route ready</span>
            </div>
          </div>

          {/* Frontend service card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
            <div className="text-left">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Service 02</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Vite + React Frontend</h3>
              <p className="text-slate-400 text-sm">Responsive dashboard interface utilizing Tailwind CSS v4 styling structure.</p>
            </div>
            <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
              <span>Port: 5173</span>
              <button 
                onClick={() => setTestCount(c => c + 1)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium border border-indigo-500/30 rounded px-2 py-0.5 cursor-pointer"
              >
                Interactive Count: {testCount}
              </button>
            </div>
          </div>

          {/* Databases card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur flex flex-col justify-between hover:border-teal-500/50 transition-colors group">
            <div className="text-left">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Services 03-05</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Knowledge DBs</h3>
              <p className="text-slate-400 text-sm">MongoDB (metadata), Neo4j (graph relations), and ChromaDB (vector embeddings) stack.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px]">
              <span className="bg-slate-850 text-slate-300 px-2 py-1 rounded">MongoDB: 27017</span>
              <span className="bg-slate-850 text-slate-300 px-2 py-1 rounded">Neo4j: 7474</span>
              <span className="bg-slate-850 text-slate-300 px-2 py-1 rounded">Chroma: 8001</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={`${API_URL}/health`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold text-white transition-all shadow-lg hover:shadow-violet-600/20 text-center w-full sm:w-auto"
          >
            Check API Health
          </a>
          <a
            href="http://localhost:7474"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 font-semibold text-slate-200 transition-all text-center w-full sm:w-auto"
          >
            Launch Neo4j Browser
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} OnBrain Monorepo Dev Skeleton · Phase 1 foundation complete.
      </footer>
    </div>
  )
}

export default App
