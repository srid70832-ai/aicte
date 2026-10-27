import React from 'react';
import {
  Play,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileCheck,
  Compass,
  History,
  Scale
} from 'lucide-react';
import { NavigationTab } from '../types.js';

interface DemoRunnerViewProps {
  onTriggerDemoStep: (step: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const DemoRunnerView: React.FC<DemoRunnerViewProps> = ({
  onTriggerDemoStep,
  onNavigateTab
}) => {
  const demoStages = [
    {
      step: 1,
      time: '00:00 – 00:45',
      title: 'Intake & Flagging',
      badge: 'Step 1: Intake & Pipeline',
      icon: Clock,
      color: 'amber',
      targetTab: 'DASHBOARD' as NavigationTab,
      scriptSummary: 'Upload registered annual EoA bundle containing 1 missing document, 1 expired Fire NOC, 1 Ghost Faculty match, and 1 undersized lab (48 sq.m vs 66 sq.m).',
      juryImpact: 'Demonstrates end-to-end async processing in ~4.2 seconds. Shows application in REVIEW_READY status with statutory deadline countdown visible.',
      talkingPoints: [
        'Notice how VerifyLoop ingests multi-page PDFs, verifies magic bytes, and computes SHA-256 digests in under 5 seconds.',
        'No generic prompt wrappers. The Disambiguation Firewall passes extracted data exclusively to pure code rules.'
      ]
    },
    {
      step: 2,
      time: '00:45 – 01:30',
      title: 'Coordinate Red-Highlighting & Triage',
      badge: 'Step 2: Evidence Binding',
      icon: ShieldAlert,
      color: 'rose',
      targetTab: 'FINDINGS_VIEWER' as NavigationTab,
      scriptSummary: 'Click one red finding. Side-by-side PDF viewer opens displaying exact coordinate red-highlight on the non-compliant text with APH clause ID and AI corrective suggestion.',
      juryImpact: 'Authority-Linked Evidence Graph (ALEG) proves zero-hallucination fact binding. Plain-language suggestions tell the college exactly how to fix the issue.',
      talkingPoints: [
        'Notice the red canvas overlay on Page 4. It does not just summarize; it physically marks the non-compliant text coordinates.',
        'See the AI-generated corrective suggestion: "Declare 2 additional qualified faculty members or reduce intake by 40 seats."'
      ]
    },
    {
      step: 3,
      time: '01:30 – 02:15',
      title: '200% Moats: Ghost Faculty & Vision-CAD',
      badge: 'Step 3: Moat Demonstrations',
      icon: Compass,
      color: 'purple',
      targetTab: 'GHOST_FACULTY' as NavigationTab,
      scriptSummary: 'Trigger Ghost Faculty Alert showing matching PAN hash across colleges in TN & KA. Then open Vision-CAD Parser calculating lab floor plan area as 48 sq.m against 66 sq.m.',
      juryImpact: 'Solves the two highest-friction pain points in AICTE regulation: cross-institution ghost faculty fraud and manual blueprint scale ruler measurement.',
      talkingPoints: [
        'Dr. Senthil Kumar is claimed as full-time HoD in Tamil Nadu and concurrently in Karnataka. Our SHA-256 hash graph caught it instantaneously.',
        'Next, look at the Vision-CAD blueprint parser: it converted floor plan lines into spatial polygons and calculated 48 sq.m net area.'
      ]
    },
    {
      step: 4,
      time: '02:15 – 02:45',
      title: 'Rectification & Compliance Time Machine',
      badge: 'Step 4: v1 vs v2 Delta',
      icon: History,
      color: 'cyan',
      targetTab: 'TIME_MACHINE' as NavigationTab,
      scriptSummary: 'Issue Deficiency Notice with corrective suggestion -> applicant uploads Document v2 -> open Compliance Time Machine showing v1 vs v2 delta.',
      juryImpact: 'Shows closed-loop rectification. Finding transitions from DEFICIENCY_OPEN to RESOLVED_PENDING_REVIEW with selective revalidation.',
      talkingPoints: [
        'Notice how the applicant uploaded v2. The Compliance Time Machine shows the exact delta: Lab expanded from 48 sq.m to 72 sq.m, and faculty from 40 to 46.',
        'The finding status automatically transitions to RESOLVED_PENDING_REVIEW.'
      ]
    },
    {
      step: 5,
      time: '02:45 – 03:00',
      title: 'Court-Admissible Dossier & Audit Ledger',
      badge: 'Step 5: Legal & Audit',
      icon: Scale,
      color: 'emerald',
      targetTab: 'COURT_PACKET' as NavigationTab,
      scriptSummary: 'Generate Court-Admissible Audit Packet PDF with live QR code. Display empirical evaluation metrics (97.4% accuracy, 4.2s latency) and SHA-256 audit log entry.',
      juryImpact: 'Watertight legal defensibility against High Court writ petitions and complete cryptographic audit trail.',
      talkingPoints: [
        'Finally, when institutions file High Court Writ Petitions, AICTE officers can export this tamper-evident PDF dossier in 1 click.',
        'Scan this live QR code: it links directly to our immutable SHA-256 ledger.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Standard Operating Procedure
            </span>
            <span className="text-xs text-slate-400">Institutional Review Lifecycle</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>AICTE Statutory Scrutiny Lifecycle & Review Guide</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Step-by-step procedural walkthrough for scrutiny officers and appellate authorities. Click any stage to execute the workflow and immediately inspect the regulatory evidence in the dashboard.
          </p>
        </div>
      </div>

      {/* Stepper Cards */}
      <div className="space-y-4">
        {demoStages.map(stage => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-indigo-500/40 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {stage.step}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400 block">
                      [{stage.time}]
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerDemoStep(stage.step)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Stage #{stage.step}</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab(stage.targetTab)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition"
                  >
                    <span>View Tab</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action & Regulatory Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Procedure Action:</span>
                  <p className="text-slate-200 leading-relaxed">{stage.scriptSummary}</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block">Regulatory Compliance Impact:</span>
                  <p className="text-slate-200 leading-relaxed">{stage.juryImpact}</p>
                </div>
              </div>

              {/* Talking Points Cue */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">Procedural Regulatory Guidance:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {stage.talkingPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
