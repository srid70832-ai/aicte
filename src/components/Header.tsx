import React from 'react';
import { ShieldCheck, Clock, UserCheck, RefreshCw, Play, Sparkles } from 'lucide-react';
import { User, NavigationTab } from '../types.js';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onResetDemo: () => void;
  onTriggerDemoStep: (stepNumber: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSelectUser,
  activeTab,
  onSelectTab,
  onResetDemo,
  onTriggerDemoStep
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">AICTE VerifyLoop</span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SIH 2026 PS26261
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                AICTE Regulation Bureau
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evidence-Grounded Regulatory Scrutiny & Deterministic Compliance Engine
            </p>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Statutory SLA Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SLA: <strong>28 Days Left</strong></span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] uppercase font-bold text-emerald-400">ON TRACK</span>
          </div>

          {/* User Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={currentUser.id}
              onChange={(e) => {
                const u = users.find(x => x.id === e.target.value);
                if (u) onSelectUser(u);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Sync System Registry Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
            title="Refresh database registry and synchronize status"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Sync Registry</span>
          </button>
        </div>
      </div>

      {/* Statutory Scrutiny Lifecycle Stepper */}
      <div className="bg-slate-950/80 border-t border-slate-800/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">Scrutiny Lifecycle Stages:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onTriggerDemoStep(1)}
              className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 flex items-center gap-1 transition"
            >
              <Play className="w-2.5 h-2.5 text-amber-400" />
              <span>1. Application Ingestion</span>
            </button>
            <button
              onClick={() => onTriggerDemoStep(2)}
              className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 flex items-center gap-1 transition"
            >
              <Play className="w-2.5 h-2.5 text-rose-400" />
              <span>2. Coordinate Red-Highlighting</span>
            </button>
            <button
              onClick={() => onTriggerDemoStep(3)}
              className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 flex items-center gap-1 transition"
            >
              <Play className="w-2.5 h-2.5 text-purple-400" />
              <span>3. Ghost Faculty & Vision-CAD</span>
            </button>
            <button
              onClick={() => onTriggerDemoStep(4)}
              className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 flex items-center gap-1 transition"
            >
              <Play className="w-2.5 h-2.5 text-cyan-400" />
              <span>4. Rectification & Time Machine</span>
            </button>
            <button
              onClick={() => onTriggerDemoStep(5)}
              className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 flex items-center gap-1 transition"
            >
              <Play className="w-2.5 h-2.5 text-emerald-400" />
              <span>5. Court Dossier & Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav className="border-t border-slate-800 bg-slate-900/60 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: 'DASHBOARD', label: 'Review Queue & Queue SLAs' },
            { id: 'INGESTION_PORTAL', label: 'Upload & Ingestion Portal' },
            { id: 'FINDINGS_VIEWER', label: 'PDF Red-Highlighting & Triage' },
            { id: 'GHOST_FACULTY', label: 'Ghost Faculty Graph (Moat 1)' },
            { id: 'CAD_BLUEPRINTS', label: 'Vision-CAD Floor Plans (Moat 2)' },
            { id: 'VERNACULAR_STAMPS', label: 'E-Stamp & Deeds (Moat 3)' },
            { id: 'REGULATORY_DELTA', label: 'APH Regulatory Delta (Moat 4)' },
            { id: 'TIME_MACHINE', label: 'Compliance Time Machine' },
            { id: 'COURT_PACKET', label: 'Court-Admissible Dossier' },
            { id: 'AUDIT_LEDGER', label: 'SHA-256 Audit Ledger' },
            { id: 'BENCHMARKS', label: 'Empirical Benchmarks' },
            { id: 'DEMO_RUNNER', label: 'Scrutiny Workflow Guide' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as NavigationTab)}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
