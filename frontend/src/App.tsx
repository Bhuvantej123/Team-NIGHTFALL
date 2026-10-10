import { useEffect, useState } from 'react';
import type { HealthResponse } from './types';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: HealthResponse = await response.json();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-surface-900 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Banner / Navigation */}
      <header className="border-b border-surface-600/60 bg-surface-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <span className="text-xl font-black text-white tracking-wider">C</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                CreatorConnect <span className="gradient-text font-black">AI</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Team NIGHTFALL • Hackathon 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Connection Status Pill */}
            {loading ? (
              <span className="badge-neutral animate-pulse">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping mr-1"></span>
                Checking backend...
              </span>
            ) : error ? (
              <span className="badge-danger">
                <span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span>
                Backend Offline
              </span>
            ) : (
              <span className="badge-success">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>
                Backend Live (Flask)
              </span>
            )}

            {/* AI Provider Badge */}
            {health && (
              health.source === 'gemini' ? (
                <span className="badge-success font-semibold">
                  ⚡ Live Gemini: {health.gemini_model ?? 'Active'}
                </span>
              ) : (
                <span className="badge-warning font-semibold">
                  🛡 Mock Mode ({health.mock_reason || 'Active'})
                </span>
              )
            )}

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200 border border-surface-600 transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-card border border-brand-500/20 shadow-2xl shadow-indigo-950/50">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              Phase 0 Complete • Architecture v3 Initialized
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Matching for <span className="gradient-text">AI Creators</span> & High-Growth Brands
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              CreatorConnect AI leverages verified contracts, deterministic test providers, and multi-dimensional scoring (relevance, skills, budget, and availability) to connect marketing briefs with top AI content creators.
            </p>
          </div>
        </div>

        {/* System Health & Provider Card */}
        <section className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-600/50 pb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                System Health & Gemini Integration
              </h2>
              <p className="text-sm text-slate-400">
                Live verification of REST endpoints, SQLite persistence, and AI provider fallback
              </p>
            </div>
            {lastChecked && (
              <span className="text-xs text-slate-400 font-mono">
                Last checked: {lastChecked}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Backend Connectivity Status */}
            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend API</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">Flask Server</span>
                {loading ? (
                  <span className="badge-neutral">Testing...</span>
                ) : error ? (
                  <span className="badge-danger">Disconnected</span>
                ) : (
                  <span className="badge-success">Operational (200 OK)</span>
                )}
              </div>
              <p className="text-xs text-slate-400">Target: <code className="text-brand-300 font-mono">GET /api/health</code></p>
            </div>

            {/* Provider Type */}
            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brief Provider Engine</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  {health ? (health.source === 'gemini' ? 'Google Gemini' : 'Mock Provider') : 'Unknown'}
                </span>
                {health?.source === 'gemini' ? (
                  <span className="badge-success">Live API</span>
                ) : (
                  <span className="badge-warning">Deterministic Mock</span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {health?.source === 'gemini'
                  ? `Model: ${health.gemini_model}`
                  : `Reason: ${health?.mock_reason || 'Development fallback'}`}
              </p>
            </div>

            {/* Architecture Compliance */}
            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Design Standards</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">Architecture v3</span>
                <span className="badge-info">Approved</span>
              </div>
              <p className="text-xs text-slate-400">Contracts synchronized in Python & TypeScript</p>
            </div>
          </div>

          {/* Fallback Mode Explanation Banner */}
          {health?.source === 'mock' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <span className="text-amber-400 text-xl font-bold">ℹ</span>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-amber-200">
                  Running on Deterministic Mock Provider ({health.mock_reason})
                </p>
                <p className="text-amber-300/80 leading-relaxed text-xs">
                  The backend has initialized properly without requiring a live Gemini API key. All downstream brief generation, creator matching, and workflows will execute smoothly with deterministic sample data. To connect to live Gemini, supply <code className="font-mono text-amber-100">GEMINI_API_KEY</code> and <code className="font-mono text-amber-100">GEMINI_MODEL</code> in your <code className="font-mono text-amber-100">.env</code> file.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <span className="text-red-400 text-xl font-bold">⚠</span>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-red-200">Unable to reach backend server</p>
                <p className="text-red-300/80 text-xs">{error}</p>
                <p className="text-xs text-slate-400 pt-1">
                  Ensure the Flask backend is running on <code className="font-mono text-slate-200">http://127.0.0.1:5000</code>.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 4-Person Ownership Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Team NIGHTFALL Ownership Matrix</h2>
            <span className="text-xs text-slate-400 font-medium">Strict Code Isolation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Person 1 */}
            <div className="p-5 rounded-2xl glass-card border-brand-500/30 hover:border-brand-500/60 transition group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Person 1</span>
                <span className="badge-info text-[10px]">Team Lead</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition">Backend & AI Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owns Flask architecture, Gemini/Mock brief providers, SQLAlchemy schema, and creator matching algorithms.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-surface-600/40">
                backend/, contracts/
              </div>
            </div>

            {/* Person 2 */}
            <div className="p-5 rounded-2xl glass-card border-purple-500/30 hover:border-purple-500/60 transition group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Person 2</span>
                <span className="badge text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">Frontend Lead</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">UI / UX & Workflows</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owns React application, responsive Tailwind design system, campaign brief editor, and creator cards.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-surface-600/40">
                frontend/src/
              </div>
            </div>

            {/* Person 3 */}
            <div className="p-5 rounded-2xl glass-card border-emerald-500/30 hover:border-emerald-500/60 transition group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Person 3</span>
                <span className="badge text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Data & Assets</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">Creator Profiles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authors realistic seed profiles, AI tool mappings, style tags, and mock portfolio assets in dedicated directory.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-surface-600/40">
                contributions/p3_creator_data/
              </div>
            </div>

            {/* Person 4 */}
            <div className="p-5 rounded-2xl glass-card border-sky-500/30 hover:border-sky-500/60 transition group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Person 4</span>
                <span className="badge text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">QA & Workflows</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">Campaign QA & Pitch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Creates test campaign scenarios, end-to-end edge case checks, demo walkthrough script, and QA documentation.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-surface-600/40">
                contributions/p4_qa_demo/
              </div>
            </div>
          </div>
        </section>

        {/* Hackathon Implementation Roadmap */}
        <section className="glass-card p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold text-white">Hackathon Implementation Phases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/40 space-y-2">
              <span className="text-xs font-bold text-brand-300">PHASE 0</span>
              <p className="font-semibold text-sm text-white">Foundation</p>
              <span className="badge-success text-[10px]">Active & Verified</span>
              <p className="text-xs text-slate-400">Contracts, Flask factory, health endpoint & frontend build.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2 opacity-80 hover:opacity-100 transition">
              <span className="text-xs font-bold text-slate-400">PHASE 1</span>
              <p className="font-semibold text-sm text-white">Creator Directory</p>
              <span className="badge-neutral text-[10px]">Next Task</span>
              <p className="text-xs text-slate-400">JSON seeder, GET /api/creators with filtering, CreatorCard UI.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2 opacity-70 hover:opacity-100 transition">
              <span className="text-xs font-bold text-slate-400">PHASE 2</span>
              <p className="font-semibold text-sm text-white">Brief Generator</p>
              <span className="badge-neutral text-[10px]">Pending</span>
              <p className="text-xs text-slate-400">Gemini/Mock brief creation, editable fields, budget lock.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2 opacity-70 hover:opacity-100 transition">
              <span className="text-xs font-bold text-slate-400">PHASE 3</span>
              <p className="font-semibold text-sm text-white">Matching Engine</p>
              <span className="badge-neutral text-[10px]">Pending</span>
              <p className="text-xs text-slate-400">5-factor weighted scoring, evidence explainability, persisted matches.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-600/40 space-y-2 opacity-70 hover:opacity-100 transition">
              <span className="text-xs font-bold text-slate-400">PHASE 4</span>
              <p className="font-semibold text-sm text-white">Shortlist & Pitch</p>
              <span className="badge-neutral text-[10px]">Pending</span>
              <p className="text-xs text-slate-400">Workflow transitions, demo scenarios, final rehearsal.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-surface-600/50 bg-surface-950 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>CreatorConnect AI • Built by Team NIGHTFALL for Hackathon 2026</p>
        <p className="font-mono text-[11px] text-slate-600">TypeScript 5 • React 18 • Vite 8 • Tailwind CSS 3 • Python 3.13 • Flask 3 • SQLite</p>
      </footer>
    </div>
  );
}
