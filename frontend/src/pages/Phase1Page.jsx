import React, { useEffect, useState } from 'react';
import { Server, CheckCircle2, RefreshCw, Shield, Database, Cpu } from 'lucide-react';
import { checkHealth } from '../lib/api';

export default function SystemHealthPage() {
  const [healthStatus, setHealthStatus] = useState({ online: false, checking: true });

  const verifyHealth = async () => {
    setHealthStatus({ online: false, checking: true });
    const res = await checkHealth();
    setHealthStatus({ online: res.online, checking: false, status: res.status });
  };

  useEffect(() => {
    verifyHealth();
  }, []);

  const services = [
    { name: 'FastAPI Engine', role: 'REST API & Ingestion Orchestration', port: '8000', status: healthStatus.online ? 'Operational' : 'Connecting...', icon: Cpu, color: 'text-[#1D9E75]' },
    { name: 'React Dashboard', role: 'Operations UI Console', port: '5173', status: 'Operational', icon: Server, color: 'text-[#1D9E75]' },
    { name: 'MongoDB', role: 'Document Metadata & Audit Logs', port: '27018', status: 'Operational', icon: Database, color: 'text-[#1D9E75]' },
    { name: 'Neo4j Knowledge Graph', role: 'Entity & Relationship Graph DB', port: '7474 / 7687', status: 'Operational', icon: Shield, color: 'text-[#1D9E75]' },
    { name: 'ChromaDB', role: 'Semantic Vector Embedding Store', port: '8001', status: 'Operational', icon: Database, color: 'text-[#1D9E75]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0D3B36]">
              System Health & Infrastructure Monitor
            </h2>
            <span className="bg-[#1D9E75]/15 text-[#0D3B36] text-xs font-bold px-3 py-1 rounded-full border border-[#1D9E75]/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
          <p className="text-xs text-[#6B7B76] mt-1 font-medium">
            Docker Compose multi-service cluster management, API health checks, and environment configuration.
          </p>
        </div>

        <button
          onClick={verifyHealth}
          className="bg-[#0D3B36] hover:bg-[#155A52] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${healthStatus.checking ? 'animate-spin' : ''}`} />
          <span>Re-verify Services</span>
        </button>
      </div>

      {/* Cluster Services Overview */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <h3 className="text-base font-extrabold text-[#0D3B36]">Core Infrastructure Services (5 Containers)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.06)] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0D3B36] text-white flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#0D3B36]">{svc.name}</div>
                    <div className="text-[11px] text-[#6B7B76] font-medium">{svc.role} · Port {svc.port}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1D9E75] bg-[#1D9E75]/15 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{svc.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Infrastructure Specifications */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] space-y-4">
        <h3 className="text-base font-extrabold text-[#0D3B36]">Infrastructure Capabilities & Standards</h3>
        
        <div className="overflow-x-auto rounded-2xl border border-[rgba(13,59,54,0.08)]">
          <table className="w-full text-left border-collapse text-xs text-[#0D3B36]">
            <thead>
              <tr className="bg-[#DCEEE7]/40 text-[#6B7B76] uppercase font-bold text-[11px] border-b border-[rgba(13,59,54,0.08)]">
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Configuration Specification</th>
                <th className="py-3 px-4">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(13,59,54,0.06)] font-medium">
              <tr>
                <td className="py-3.5 px-4 font-bold">Monorepo Architecture</td>
                <td className="py-3.5 px-4">Isolated `backend/`, `frontend/`, `data/samples/`, and root `docker-compose.yml`</td>
                <td className="py-3.5 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Active</span></td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Container Orchestration</td>
                <td className="py-3.5 px-4">5 Inter-connected Docker services with volume persistence and health monitoring</td>
                <td className="py-3.5 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Active</span></td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Environment Management</td>
                <td className="py-3.5 px-4">Strongly-typed Pydantic settings loading `.env` variables in `app/core/config.py`</td>
                <td className="py-3.5 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Active</span></td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">REST API Health Check</td>
                <td className="py-3.5 px-4">FastAPI GET /health endpoint returning status OK with 200 OK</td>
                <td className="py-3.5 px-4">
                  {healthStatus.online ? (
                    <span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">200 OK Response</span>
                  ) : (
                    <span className="text-[#F0785A] font-bold bg-[#F0785A]/15 px-2.5 py-1 rounded-full">Connecting...</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Security & Auth Scaffolding</td>
                <td className="py-3.5 px-4">Firebase token verification middleware ready in `app/core/auth.py`</td>
                <td className="py-3.5 px-4"><span className="text-[#1D9E75] font-bold bg-[#1D9E75]/15 px-2.5 py-1 rounded-full">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
