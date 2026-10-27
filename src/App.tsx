import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.js';
import { DashboardView } from './components/DashboardView.js';
import { FindingsViewer } from './components/FindingsViewer.js';
import { IngestionPortalView } from './components/IngestionPortalView.js';
import { GhostFacultyView } from './components/GhostFacultyView.js';
import { CADBlueprintView } from './components/CADBlueprintView.js';
import { VernacularStampView } from './components/VernacularStampView.js';
import { RegulatoryDeltaView } from './components/RegulatoryDeltaView.js';
import { TimeMachineView } from './components/TimeMachineView.js';
import { CourtPacketView } from './components/CourtPacketView.js';
import { AuditLedgerView } from './components/AuditLedgerView.js';
import { BenchmarkView } from './components/BenchmarkView.js';
import { DemoRunnerView } from './components/DemoRunnerView.js';
import {
  ApplicationRecord,
  GhostFacultyMatch,
  CADBlueprintAnalysis,
  VernacularStampResult,
  RegulatoryDeltaMatrixItem,
  CryptographicBlock,
  EmpiricalBenchmarkResult,
  NavigationTab,
  User
} from './types.js';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-scrutiny-01',
    email: 'scrutiny.officer@aicte-india.org',
    name: 'Dr. Ramesh Sharma (Scrutiny Officer)',
    role: 'REVIEWER',
    department: 'AICTE Southern Regional Bureau',
    assignedProjects: ['EoA Scrutiny 2026-27']
  },
  {
    id: 'usr-applicant-01',
    email: 'principal@svit.ac.in',
    name: 'Dr. Arunkumar V. (Principal / Applicant)',
    role: 'SUBMITTER',
    department: 'Sri Venkateswara Institute of Technology',
    assignedProjects: ['EoA 2026-27 Submission']
  },
  {
    id: 'usr-authority-01',
    email: 'advisor.approval@aicte-india.org',
    name: 'Prof. Anita Deshmukh (Competent Authority / Advisor)',
    role: 'COMPETENT_AUTHORITY',
    department: 'AICTE Regulation Bureau, New Delhi',
    assignedProjects: ['Statutory Committee Sign-off']
  },
  {
    id: 'usr-analyst-01',
    email: 'auditor.sac@aicte-india.org',
    name: 'Standing Appellate Committee (SAC Auditor)',
    role: 'ANALYST',
    department: 'Legal & Audit Directorate',
    assignedProjects: ['High Court Dossier Review']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [selectedAppId, setSelectedAppId] = useState<string>('APP-2026-TN-089');
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0]);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [ghostFaculty, setGhostFaculty] = useState<GhostFacultyMatch[]>([]);
  const [blueprint, setBlueprint] = useState<CADBlueprintAnalysis | null>(null);
  const [stampResult, setStampResult] = useState<VernacularStampResult | null>(null);
  const [deltaMatrix, setDeltaMatrix] = useState<RegulatoryDeltaMatrixItem[]>([]);
  const [auditLedger, setAuditLedger] = useState<CryptographicBlock[]>([]);
  const [benchmarks, setBenchmarks] = useState<EmpiricalBenchmarkResult[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = useCallback(async () => {
    try {
      const [appsRes, ghostRes, cadRes, stampRes, deltaRes, ledgerRes, benchRes] = await Promise.all([
        fetch('/api/applications').then(r => r.json()),
        fetch('/api/ghost-faculty').then(r => r.json()),
        fetch('/api/cad-blueprints/APP-2026-TN-089').then(r => r.json()),
        fetch('/api/vernacular-stamps/APP-2026-TN-089').then(r => r.json()),
        fetch('/api/regulatory-delta').then(r => r.json()),
        fetch('/api/audit-ledger').then(r => r.json()),
        fetch('/api/benchmarks').then(r => r.json())
      ]);

      if (appsRes.applications) setApplications(appsRes.applications);
      if (ghostRes.ghostFaculty) setGhostFaculty(ghostRes.ghostFaculty);
      if (cadRes.blueprint) setBlueprint(cadRes.blueprint);
      if (stampRes.stamp) setStampResult(stampRes.stamp);
      if (deltaRes.deltaMatrix) setDeltaMatrix(deltaRes.deltaMatrix);
      if (ledgerRes.ledger) setAuditLedger(ledgerRes.ledger);
      if (benchRes.benchmarks) setBenchmarks(benchRes.benchmarks);
    } catch (err) {
      console.warn('Failed to fetch from backend:', err);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Actions
  const handleTriageFinding = async (findingId: string, action: 'CONFIRM' | 'DISMISS', reason: string) => {
    try {
      const res = await fetch(`/api/applications/${currentApp.id}/triage-finding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findingId, action, reason, userId: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Finding ${findingId} successfully ${action}ed.`);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIssueDeficiency = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/issue-deficiency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: 'Address all highlighted APH non-compliances by uploading revised Document v2 files within 14 days.',
          userId: currentUser.id
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Official AICTE Deficiency Notice dispatched to applicant.', 'info');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResubmitV2 = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/resubmit-v2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Document v2 bundle ingested. Selective revalidation executed successfully!');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatutorySignOff = async (appId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/applications/${appId}/statutory-sign-off`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          remarks: 'Statutory approval granted following verified v2 rectification.',
          userId: currentUser.id
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Statutory Sign-Off recorded: ${decision}. Court dossier updated.`, 'success');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateAmendment = async (amendmentTitle: string, fsr: number, lab: number) => {
    try {
      const res = await fetch('/api/regulatory-delta/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amendmentTitle, fsrRequirement: fsr, labCarpetArea: lab })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Background schema diff completed: ${data.affectedApplicationsCount} colleges affected.`);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('System registry re-synchronized and database cache updated.', 'info');
        loadAllData();
        setActiveTab('DASHBOARD');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerDemoStep = (stepNumber: number) => {
    if (stepNumber === 1) {
      setActiveTab('DASHBOARD');
      showToast('Stage 1: Institutional Application Ingestion & Automated Flagging.', 'info');
    } else if (stepNumber === 2) {
      setActiveTab('FINDINGS_VIEWER');
      showToast('Stage 2: Side-by-Side PDF Coordinate Red-Highlighting & Triage.', 'info');
    } else if (stepNumber === 3) {
      setActiveTab('GHOST_FACULTY');
      showToast('Stage 3: Multi-Institution Ghost Faculty Fraud Graph & CAD Blueprint Analysis.', 'info');
    } else if (stepNumber === 4) {
      handleResubmitV2(currentApp.id);
      setActiveTab('TIME_MACHINE');
      showToast('Stage 4: Closed-Loop Rectification & Compliance Time Machine (v1 vs v2).', 'info');
    } else if (stepNumber === 5) {
      setActiveTab('COURT_PACKET');
      showToast('Stage 5: Court-Admissible Dossier with QR Code & Cryptographic Audit Ledger.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border animate-bounce ${
          toast.type === 'success'
            ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50'
            : toast.type === 'info'
            ? 'bg-indigo-950 text-indigo-200 border-indigo-500/50'
            : 'bg-amber-950 text-amber-200 border-amber-500/50'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onResetDemo={handleResetDemo}
        onTriggerDemoStep={handleTriggerDemoStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'DASHBOARD' && (
          <DashboardView
            applications={applications}
            currentUser={currentUser}
            onSelectApplication={(id) => {
              setSelectedAppId(id);
              setActiveTab('FINDINGS_VIEWER');
            }}
            onNavigateTab={setActiveTab}
            onIssueDeficiency={handleIssueDeficiency}
            onStatutorySignOff={handleStatutorySignOff}
          />
        )}

        {activeTab === 'INGESTION_PORTAL' && (
          <IngestionPortalView
            applications={applications}
            currentUser={currentUser}
            onDocumentUploaded={(newAppId) => {
              setSelectedAppId(newAppId);
              loadAllData();
              showToast('Document analyzed! Opening in Red-Highlighting Viewer...', 'success');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'FINDINGS_VIEWER' && currentApp && (
          <FindingsViewer
            application={currentApp}
            currentUser={currentUser}
            onTriageFinding={handleTriageFinding}
            onIssueDeficiency={handleIssueDeficiency}
            onSelectDocument={(docId) => console.log('Selected doc:', docId)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'GHOST_FACULTY' && (
          <GhostFacultyView
            ghostFaculty={ghostFaculty}
            onTriggerAuditAlert={(name) => showToast(`Subpoena issued for ${name}.`)}
          />
        )}

        {activeTab === 'CAD_BLUEPRINTS' && blueprint && (
          <CADBlueprintView blueprint={blueprint} />
        )}

        {activeTab === 'VERNACULAR_STAMPS' && stampResult && (
          <VernacularStampView stampResult={stampResult} />
        )}

        {activeTab === 'REGULATORY_DELTA' && (
          <RegulatoryDeltaView
            deltaMatrix={deltaMatrix}
            onSimulateAmendment={handleSimulateAmendment}
          />
        )}

        {activeTab === 'TIME_MACHINE' && currentApp && (
          <TimeMachineView
            application={currentApp}
            currentUser={currentUser}
            onResubmitV2={handleResubmitV2}
          />
        )}

        {activeTab === 'COURT_PACKET' && currentApp && (
          <CourtPacketView application={currentApp} />
        )}

        {activeTab === 'AUDIT_LEDGER' && (
          <AuditLedgerView ledger={auditLedger} />
        )}

        {activeTab === 'BENCHMARKS' && (
          <BenchmarkView benchmarks={benchmarks} />
        )}

        {activeTab === 'DEMO_RUNNER' && (
          <DemoRunnerView
            onTriggerDemoStep={handleTriggerDemoStep}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        AICTE VerifyLoop — SIH 2026 Problem Statement PS26261 | AICTE Regulation Bureau & Standing Appellate Committee (SAC)
      </footer>
    </div>
  );
}
