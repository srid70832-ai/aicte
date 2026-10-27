import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Hash,
  Building,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  ExternalLink,
  Lock,
  Search,
  Zap
} from 'lucide-react';
import { GhostFacultyMatch } from '../types.js';

interface GhostFacultyViewProps {
  ghostFaculty: GhostFacultyMatch[];
  onTriggerAuditAlert?: (facultyName: string) => void;
}

export const GhostFacultyView: React.FC<GhostFacultyViewProps> = ({
  ghostFaculty,
  onTriggerAuditAlert
}) => {
  const [selectedMatch, setSelectedMatch] = useState<GhostFacultyMatch>(
    ghostFaculty[0] || null
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveScanResult, setLiveScanResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLiveScanResult(null);

    try {
      const res = await fetch('/api/ghost-faculty/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setIsSearching(false);
      setLiveScanResult(data);

      if (data.matchFound && data.result) {
        setSelectedMatch(data.result);
      }
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Moat Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                200% Breakthrough Moat #1
              </span>
              <span className="text-xs text-slate-400">Zero-Knowledge SHA-256 Cross-College Faculty Graph</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              Cross-Institutional Ghost Faculty Resolution Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Prevents the rampant regulatory fraud where faculty credentials are simultaneously registered across multiple technical colleges in different states to satisfy AICTE mandatory faculty-to-student ratios.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Privacy-Preserving (Zero Plaintext Stored)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live PAN / Aadhaar Scanner Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Live Cross-Institutional Identity Collision Scanner:</span>
          </div>
          <span className="text-[10px] text-slate-400">Query by Faculty Name, PAN (e.g. ABCPS1234F) or Aadhaar</span>
        </div>

        <form onSubmit={handleScanSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Faculty Name or PAN (Try: ABCPS1234F or Senthil Kumar)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            {isSearching ? 'Hashing & Scanning...' : 'Scan Database'}
          </button>
        </form>

        {/* Live Scan Status Banner */}
        {liveScanResult && (
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            liveScanResult.matchFound
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {liveScanResult.matchFound ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {liveScanResult.matchFound
                  ? `COLLISION CONFIRMED: ${liveScanResult.result.facultyName} is multi-registered across 2 institutions!`
                  : liveScanResult.message}
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              Query Hash: {liveScanResult.queryHash?.slice(0, 16)}...
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Visual Graph on Left, Collision Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive SVG Network Diagram (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Cross-State Institutional Collision Topology</h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30 animate-pulse">
              100% Deterministic Match
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="flex-1 min-h-[380px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

            <svg viewBox="0 0 600 340" className="w-full h-full relative z-10">
              {/* Connecting Edges with Animated Dash */}
              <line
                x1="300"
                y1="170"
                x2="120"
                y2="90"
                stroke="#ec4899"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <line
                x1="300"
                y1="170"
                x2="480"
                y2="250"
                stroke="#ec4899"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />

              {/* Center Node: Ghost Faculty */}
              <g transform="translate(300, 170)" className="cursor-pointer">
                <circle r="46" fill="#1e1b4b" stroke="#a855f7" strokeWidth="3" />
                <circle r="40" fill="#2e1065" />
                <text textAnchor="middle" y="-6" fill="#f3e8ff" fontSize="11" fontWeight="bold">
                  {selectedMatch?.facultyName.split(' ')[0] || 'Dr. K.'}
                </text>
                <text textAnchor="middle" y="10" fill="#d8b4fe" fontSize="10">
                  {selectedMatch?.facultyName.split(' ').slice(1).join(' ') || 'Senthil Kumar'}
                </text>
                <text textAnchor="middle" y="24" fill="#ec4899" fontSize="8" fontWeight="bold">
                  [PAN COLLISION]
                </text>
              </g>

              {/* Institution 1 Node */}
              <g transform="translate(120, 90)">
                <rect x="-90" y="-35" width="180" height="70" rx="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <text textAnchor="middle" y="-12" fill="#60a5fa" fontSize="10" fontWeight="bold">
                  {selectedMatch?.institutions[0]?.institutionId || 'INST-TN-2026-089'}
                </text>
                <text textAnchor="middle" y="4" fill="#f8fafc" fontSize="10" fontWeight="600">
                  {selectedMatch?.institutions[0]?.institutionName.slice(0, 22) || 'Sri Venkateswara Inst'}
                </text>
                <text textAnchor="middle" y="18" fill="#94a3b8" fontSize="8">
                  {selectedMatch?.institutions[0]?.state} (Full-Time)
                </text>
              </g>

              {/* Institution 2 Node */}
              <g transform="translate(480, 250)">
                <rect x="-90" y="-35" width="180" height="70" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text textAnchor="middle" y="-12" fill="#fbbf24" fontSize="10" fontWeight="bold">
                  {selectedMatch?.institutions[1]?.institutionId || 'INST-KA-2026-314'}
                </text>
                <text textAnchor="middle" y="4" fill="#f8fafc" fontSize="10" fontWeight="600">
                  {selectedMatch?.institutions[1]?.institutionName.slice(0, 22) || 'Apex Tech Campus'}
                </text>
                <text textAnchor="middle" y="18" fill="#94a3b8" fontSize="8">
                  {selectedMatch?.institutions[1]?.state} (Full-Time)
                </text>
              </g>

              {/* Badge Overlay */}
              <g transform="translate(300, 40)">
                <rect x="-120" y="-14" width="240" height="28" rx="8" fill="#881337" opacity="0.9" />
                <text textAnchor="middle" y="4" fill="#fecdd3" fontSize="10" fontWeight="bold">
                  CRITICAL FRAUD: CONCURRENT ENROLLMENT
                </text>
              </g>
            </svg>
          </div>

          <p className="text-xs text-slate-400 mt-3 italic">
            Network graph maps real-time bipartite links between educational societies sharing the same SHA-256 identity credential during the active academic scrutiny window.
          </p>
        </div>

        {/* Right: Hashed Credential Table & Action Triage (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Matched Faculty Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Flagged Faculty Record
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                MULTI-INSTITUTION
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{selectedMatch?.facultyName}</h3>
              <p className="text-xs text-slate-400">{selectedMatch?.facultyDesignation}</p>
            </div>

            {/* Cryptographic SHA-256 Hashes Display */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2.5 font-mono">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>SHA-256 (Faculty PAN Hash):</span>
                  <span className="text-emerald-400">Match 100%</span>
                </div>
                <div className="text-purple-300 truncate bg-slate-900 px-2 py-1 rounded mt-0.5 text-[11px] select-all">
                  {selectedMatch?.facultyPanHash}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>SHA-256 (Aadhaar UID Hash):</span>
                  <span className="text-emerald-400">Match 100%</span>
                </div>
                <div className="text-purple-300 truncate bg-slate-900 px-2 py-1 rounded mt-0.5 text-[11px] select-all">
                  {selectedMatch?.facultyAadhaarHash}
                </div>
              </div>
            </div>

            {/* Concurrent Institution Overlap List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Overlapping Full-Time Employment Filings:
              </span>

              {selectedMatch?.institutions.map((inst, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{inst.institutionName}</span>
                    <span className="text-[10px] font-mono text-indigo-300 font-bold">{inst.institutionId}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Role: <strong>{inst.role}</strong>
                  </div>
                  <div className="text-slate-400 text-[10px] flex items-center justify-between">
                    <span>Academic Cycle: {inst.academicYear}</span>
                    <span className="text-amber-400 font-semibold">{inst.overlapDates}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Action Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  alert(`Biometric attendance audit subpoena initiated for ${selectedMatch?.facultyName}. Notices dispatched to both institutions.`);
                  if (onTriggerAuditAlert) onTriggerAuditAlert(selectedMatch?.facultyName);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Issue Biometric & Tax Audit Subpoena</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
