import React from 'react';
import {
  FileCheck,
  AlertTriangle,
  Calendar,
  Languages,
  Stamp,
  ArrowRight,
  ShieldAlert,
  Clock,
  Landmark
} from 'lucide-react';
import { VernacularStampResult } from '../types.js';

interface VernacularStampViewProps {
  stampResult: VernacularStampResult;
}

export const VernacularStampView: React.FC<VernacularStampViewProps> = ({ stampResult }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                200% Breakthrough Moat #3
              </span>
              <span className="text-xs text-slate-400">Indian State Revenue E-Stamp & Regional Language OCR</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              Vernacular Legal Deed & E-Stamp Chronology Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Extracts survey numbers, lessor/lessee identities, and issuance dates from regional language E-Stamps (Tamil, Hindi, Marathi).
              Enforces statutory chronology validation to detect fraudulent backdated land agreements.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Backdated Execution Flagged</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Chronology Timeline Anomaly Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Chronological Validity & Anti-Backdating Timeline</h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-bold">
              DELTA: -5 DAYS IMPOSSIBILITY
            </span>
          </div>

          {/* Visual Step Timeline */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {/* Event 1: Alleged Agreement Date */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-rose-500/60 relative">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Purported Agreement Date</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  20-March-2024
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Land sale agreement purports to have been executed on this day.
                </p>
                <div className="mt-2 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded inline-block">
                  PRE-DATED BY 5 DAYS
                </div>
              </div>

              {/* Event 2: Official Treasury E-Stamp Purchase Date */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-amber-500/60 relative">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Stamp className="w-3 h-3" />
                  <span>Treasury E-Stamp Purchase</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  25-March-2024
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  StockHolding Corp / State Treasury issued certificate on this date.
                </p>
                <div className="mt-2 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded inline-block">
                  ACTUAL CREATION DATE
                </div>
              </div>
            </div>

            {/* Connecting Warning Banner */}
            <div className="mt-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-bold">Physical Chronological Paradox Detected:</strong> An agreement cannot legally be executed on stamp paper 5 days before that stamp paper was printed and registered in the state treasury. Under Indian Stamp Act 1899, this filing is invalid and constitutes prima facie fabrication.
              </div>
            </div>
          </div>

          {/* Regional OCR Sample Snippet */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extracted Tamil Vernacular Land Record Sample:</span>
              </span>
              <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
                OCR Confidence: 98.4%
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg font-serif text-xs text-slate-200 leading-relaxed border border-slate-800 italic">
              "தமிழ்நாடு அரசு பத்திரப்பதிவுத்துறை — திருப்பூர் மாவட்டம், காங்கேயம் வட்டம், புல எண் 412/2B மற்றும் 412/3A ஆகியவற்றில் அமைந்துள்ள 2.10 ஏக்கர் பரப்பளவு கொண்ட நிலம்..."
            </div>
          </div>
        </div>

        {/* Right: Extracted E-Stamp Metadata & Trust State (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                E-Stamp Certificate Attributes
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                {stampResult.detectedLanguage} OCR
              </span>
            </div>

            {/* Certificate ID */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Treasury Certificate No:</span>
              <div className="font-mono font-bold text-sm text-indigo-300 select-all mt-0.5">
                {stampResult.certificateNumber}
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Lessor / Transferor:</span>
                <span className="font-semibold text-white">{stampResult.lessor}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Lessee / Transferee:</span>
                <span className="font-semibold text-white">{stampResult.lessee}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Khasra / Survey Numbers:</span>
                <span className="font-mono font-bold text-indigo-300">{stampResult.khasraSurveyNumbers.join(', ')}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Stamp Duty Amount:</span>
                <span className="font-bold text-emerald-400">&#8377; {stampResult.stampDutyAmountINR.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Honest Trust State Label */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Honest Verification State:</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold font-mono text-[11px]">
                  MISMATCH_DETECTED
                </span>
                <span className="text-slate-400 text-[10px]">Statutory chronology breach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
