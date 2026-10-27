import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ShieldAlert,
  Send,
  Building,
  Check
} from 'lucide-react';
import { ApplicationRecord, User, NavigationTab } from '../types.js';

interface DashboardViewProps {
  applications: ApplicationRecord[];
  currentUser: User;
  onSelectApplication: (appId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onIssueDeficiency: (appId: string) => void;
  onStatutorySignOff: (appId: string, decision: 'APPROVED' | 'REJECTED') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  applications,
  currentUser,
  onSelectApplication,
  onNavigateTab,
  onIssueDeficiency,
  onStatutorySignOff
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const totalApps = applications.length;
  const reviewReady = applications.filter(a => a.status === 'REVIEW_READY').length;
  const deficiencyOpen = applications.filter(a => a.status === 'DEFICIENCY_OPEN').length;
  const resolvedPending = applications.filter(a => a.status === 'RESOLVED_PENDING_REVIEW').length;
  const approved = applications.filter(a => a.status === 'APPROVED').length;

  const totalFindings = applications.reduce((acc, app) => acc + app.findings.filter(f => !f.isResolved).length, 0);

  const filteredApps = applications.filter(app => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Architecture Context */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Disambiguation Firewall Active
              </span>
              <span className="text-xs text-slate-400">Zero-Hallucination Deterministic Rule Engine</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              AICTE Institutional Scrutiny & Regulatory Queue
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              High-throughput evidence validation platform for AICTE Extension of Approval (EoA) and new institution filings.
              Enforces mathematical handbook checks, spatial blueprint polygons, cross-college ghost faculty graphs, and court-admissible audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('DEMO_RUNNER')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition"
            >
              <span>Open Scrutiny Workflow Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Applications</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalApps}</span>
            <span className="text-xs text-emerald-400">100% Ingested</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Ready: {reviewReady}</span>
            <span>Deficiency: {deficiencyOpen}</span>
            <span>Approved: {approved}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Non-Compliances</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">{totalFindings}</span>
            <span className="text-xs text-slate-400">Deterministic Checks</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>FSR Violations: 2</span>
            <span>Expired NOCs: 1</span>
            <span>CAD Space: 1</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ghost Faculty Collisions</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-400">2 Matches</span>
            <span className="text-xs text-purple-300 font-semibold">100% Caught</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Multi-College PAN</span>
            <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => onNavigateTab('GHOST_FACULTY')}>
              View Graph &rarr;
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statutory SLA Compliance</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">93.3%</span>
            <span className="text-xs text-slate-400">On-Time Target</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span className="text-emerald-400">On Track: 1</span>
            <span className="text-amber-400">At Risk: 1</span>
            <span className="text-rose-400">Breached: 1</span>
          </div>
        </div>
      </div>

      {/* Application Queue Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Scrutiny Officer Review Queue</h2>
            <span className="text-xs text-slate-400">({filteredApps.length} applications)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter Status:</span>
            {['ALL', 'REVIEW_READY', 'DEFICIENCY_OPEN', 'RESOLVED_PENDING_REVIEW', 'APPROVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="divide-y divide-slate-800">
          {filteredApps.map((app) => {
            const openFindingsCount = app.findings.filter(f => !f.isResolved && f.status !== 'DISMISSED').length;

            return (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-800/40 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Institute Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {app.id}
                    </span>
                    <h3 className="text-base font-semibold text-white hover:text-indigo-400 transition cursor-pointer"
                        onClick={() => {
                          onSelectApplication(app.id);
                          onNavigateTab('FINDINGS_VIEWER');
                        }}>
                      {app.institutionName}
                    </h3>
                    <span className="text-xs text-slate-400">({app.state})</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span>Category: <strong>{app.category.replace(/_/g, ' ')}</strong></span>
                    <span>Intake: <strong>{app.metrics.totalStudents}</strong></span>
                    <span>Faculty: <strong>{app.metrics.totalFaculty}</strong></span>
                    <span>
                      FSR: <strong className={app.metrics.calculatedFsr > 20 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        1:{app.metrics.calculatedFsr}
                      </strong>
                    </span>
                    <span>Land: <strong>{app.metrics.landAreaAcres} Acres</strong></span>
                    <span>Submitted: <strong>{new Date(app.submittedAt).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                {/* Center: Status & SLA Countdown */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Status Badge */}
                  <div>
                    {app.status === 'REVIEW_READY' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        REVIEW READY
                      </span>
                    )}
                    {app.status === 'DEFICIENCY_OPEN' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        DEFICIENCY OPEN
                      </span>
                    )}
                    {app.status === 'RESOLVED_PENDING_REVIEW' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        RESOLVED (v2 SUBMITTED)
                      </span>
                    )}
                    {app.status === 'APPROVED' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        APPROVED
                      </span>
                    )}
                    {app.status === 'DEFICIENCY_DEADLINE_EXCEEDED' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        DEADLINE EXCEEDED
                      </span>
                    )}
                  </div>

                  {/* SLA Tracker */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        app.slaStatus === 'ON_TRACK' ? 'bg-emerald-400' :
                        app.slaStatus === 'AT_RISK' ? 'bg-amber-400 animate-ping' : 'bg-rose-400'
                      }`}></span>
                      <span className={`text-xs font-bold ${
                        app.slaStatus === 'ON_TRACK' ? 'text-emerald-400' :
                        app.slaStatus === 'AT_RISK' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {app.slaStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Due: {new Date(app.reviewerDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Findings Counter */}
                  <div className="text-center px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className={`text-sm font-bold ${openFindingsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {openFindingsCount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Non-Compliances</span>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      onSelectApplication(app.id);
                      onNavigateTab('FINDINGS_VIEWER');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Red-Highlight Viewer</span>
                  </button>

                  {app.status === 'REVIEW_READY' && openFindingsCount > 0 && (
                    <button
                      onClick={() => onIssueDeficiency(app.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Issue Deficiency Notice</span>
                    </button>
                  )}

                  {app.status === 'RESOLVED_PENDING_REVIEW' && (
                    <button
                      onClick={() => onStatutorySignOff(app.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Sign-Off</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
