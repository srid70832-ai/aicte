import React, { useState } from 'react';
import {
  History,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ApplicationRecord, User } from '../types.js';

interface TimeMachineViewProps {
  application: ApplicationRecord;
  currentUser: User;
  onResubmitV2: (appId: string) => void;
}

export const TimeMachineView: React.FC<TimeMachineViewProps> = ({
  application,
  currentUser,
  onResubmitV2
}) => {
  const [activeVersion, setActiveVersion] = useState<'v1' | 'v2'>('v2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasV2 = application.documents.some(d => d.version === 'v2');

  const handleTriggerV2 = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onResubmitV2(application.id);
      setIsSubmitting(false);
      setActiveVersion('v2');
    }, 700);
  };

  const v1Docs = application.documents.filter(d => d.version === 'v1');
  const v2Docs = application.documents.filter(d => d.version === 'v2');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Closed-Loop Rectification
              </span>
              <span className="text-xs text-slate-400">Section 8: Compliance Time Machine</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              Compliance Time Machine: Version Diffing & Audit Delta
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Eliminates the ambiguity of resubmissions by computing atomic deltas between Document v1 (initial filing with deficiencies) and Document v2 (applicant corrective upload). Re-evaluates only modified documents to save regulatory compute.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!hasV2 ? (
              <button
                onClick={handleTriggerV2}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Processing v2 Ingestion...' : 'Process Resubmitted Document Bundle (v2)'}</span>
              </button>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>v2 Rectification Bundle Active</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Version Comparison Selector Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Time Machine Snapshot View:
          </span>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveVersion('v1')}
            className={`px-4 py-1.5 rounded-lg font-medium transition ${
              activeVersion === 'v1'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Filing Snapshot v1 (Deficient)
          </button>
          <button
            onClick={() => setActiveVersion('v2')}
            disabled={!hasV2}
            className={`px-4 py-1.5 rounded-lg font-medium transition ${
              activeVersion === 'v2'
                ? 'bg-emerald-600 text-white shadow'
                : !hasV2
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Filing Snapshot v2 (Rectified)
          </button>
        </div>
      </div>

      {/* Delta Metrics Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Laboratory Net Carpet Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Computer Lab Net Area
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              hasV2 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {hasV2 ? 'RESOLVED' : 'DEFICIENT'}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v1:</span>
              <span className="text-xl font-bold text-rose-400">48.0 sq.m</span>
              <span className="text-[10px] text-rose-400 block font-semibold">&lt; 66 sq.m minimum</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v2:</span>
              <span className="text-xl font-bold text-emerald-400">{hasV2 ? '72.0 sq.m' : '—'}</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">{hasV2 ? '+24 sq.m enlarged' : 'Pending v2'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Faculty-to-Student Ratio (FSR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Faculty Ratio (FSR)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              hasV2 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {hasV2 ? 'COMPLIANT' : 'BREACH'}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v1:</span>
              <span className="text-xl font-bold text-rose-400">1:22.5</span>
              <span className="text-[10px] text-rose-400 block font-semibold">40 Faculty / 900 Intake</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v2:</span>
              <span className="text-xl font-bold text-emerald-400">{hasV2 ? '1:19.56' : '—'}</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">{hasV2 ? '46 Faculty (<= 1:20)' : 'Pending v2'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Fire Safety NOC Renewal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fire Safety NOC
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              hasV2 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {hasV2 ? 'VALID' : 'EXPIRED'}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v1:</span>
              <span className="text-sm font-bold text-rose-400">31-Mar-2024</span>
              <span className="text-[10px] text-rose-400 block font-semibold">Expired validity</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Snapshot v2:</span>
              <span className="text-sm font-bold text-emerald-400">{hasV2 ? '31-May-2027' : '—'}</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">{hasV2 ? 'Renewed Statutory NOC' : 'Pending v2'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Document Bundle Delta Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* v1 Document Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Document Bundle v1 (Initial Intake)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Uploaded 25-Oct-2026</span>
          </div>

          <div className="space-y-2">
            {v1Docs.map(d => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-xs">{d.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 text-[10px] font-mono">v1</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  SHA-256: {d.sha256Hash.slice(0, 32)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* v2 Document Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Document Bundle v2 (Rectification Resubmission)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {hasV2 ? 'Selective Revalidation: 3 Docs' : 'Awaiting Applicant Action'}
            </span>
          </div>

          {hasV2 ? (
            <div className="space-y-2">
              {v2Docs.map(d => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-950 border border-emerald-900/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate max-w-xs">{d.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">v2 RECTIFIED</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono truncate">
                    SHA-256: {d.sha256Hash.slice(0, 32)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/60 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2">
              <RotateCcw className="w-6 h-6 text-slate-600 animate-spin" />
              <span>Deficiency notice dispatched to institution. Click button above to process incoming v2 resubmission.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
