import React, { useState } from 'react';
import {
  FileDiff,
  AlertTriangle,
  Play,
  CheckCircle2,
  Building,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { RegulatoryDeltaMatrixItem } from '../types.js';

interface RegulatoryDeltaViewProps {
  deltaMatrix: RegulatoryDeltaMatrixItem[];
  onSimulateAmendment: (amendmentTitle: string, fsr: number, lab: number) => void;
}

export const RegulatoryDeltaView: React.FC<RegulatoryDeltaViewProps> = ({
  deltaMatrix,
  onSimulateAmendment
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'FSR' | 'LAB' | 'SOLAR'>('FSR');
  const [isSimulating, setIsSimulating] = useState(false);

  const presets = {
    FSR: {
      title: 'APH Amendment #04: Faculty Ratio tightened to 1:15 for Tier-1 Institutions',
      fsr: 15,
      lab: 66,
      desc: 'Mandates higher faculty density for NAAC A+ accredited technical campuses.'
    },
    LAB: {
      title: 'APH Amendment #09: Computing & AI Laboratories carpet area raised to 75 sq.m',
      fsr: 20,
      lab: 75,
      desc: 'Upgrades minimum physical space to accommodate high-density GPU server clusters.'
    },
    SOLAR: {
      title: 'APH Amendment #15: Rooftop Renewable Solar Power mandate raised to 25% peak load',
      fsr: 20,
      lab: 66,
      desc: 'Enforces Green Campus Sustainability norms under National Education Policy (NEP 2020).'
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const p = presets[selectedPreset];
      onSimulateAmendment(p.title, p.fsr, p.lab);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                200% Breakthrough Moat #4
              </span>
              <span className="text-xs text-slate-400">Zero-Manual Re-Scrutiny Engine</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              APH Regulatory Delta & Retroactive Impact Matrix
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              When AICTE issues mid-cycle Approval Process Handbook (APH) amendments, this engine automatically runs a background schema diff across thousands of submitted college filings within seconds, flagging newly deficient institutions without human delays.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
              Active Database: 3,420 Filings Indexed
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Trigger Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Select Candidate Regulatory Amendment:</h2>
          </div>
          <span className="text-xs text-slate-400">Simulates real AICTE Council Gazette Notification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['FSR', 'LAB', 'SOLAR'] as const).map(key => {
            const p = presets[key];
            const isSelected = selectedPreset === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Preset {key}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{p.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Executing Schema Diff...' : 'Run Retroactive Background Diff (All Colleges)'}</span>
          </button>
        </div>
      </div>

      {/* Delta Impact Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDiff className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Instant Delta Impact Matrix: Newly Non-Compliant Institutions ({deltaMatrix.length})
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Diff Runtime: 0.84 seconds</span>
        </div>

        <div className="divide-y divide-slate-800">
          {deltaMatrix.map((item, index) => (
            <div key={index} className="p-4 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {item.institutionId}
                  </span>
                  <span className="font-bold text-white text-sm">{item.institutionName}</span>
                  <span className="text-slate-400">({item.applicationCategory})</span>
                </div>

                <div className="text-slate-300 text-xs">
                  <span className="text-rose-400 font-semibold">New Deficiency: </span>
                  {item.newDeficiency}
                </div>

                <div className="text-slate-400 text-[11px] font-mono">
                  {item.gapMetric}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Previous Status</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {item.previousComplianceStatus}
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  item.urgency === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.urgency} URGENCY
                </span>

                <button
                  onClick={() => alert(`Automated regulatory amendment alert dispatched to ${item.institutionName}.`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs"
                >
                  Dispatch Advisory Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
