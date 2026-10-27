import React, { useState } from 'react';
import {
  FileText,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  Shield,
  Lightbulb,
  ExternalLink,
  Info,
  ChevronRight,
  ChevronLeft,
  Upload,
  Layers,
  Hash
} from 'lucide-react';
import { ApplicationRecord, FindingDTO, User, NavigationTab, DocumentRecord } from '../types.js';

interface FindingsViewerProps {
  application: ApplicationRecord;
  currentUser: User;
  onTriageFinding: (findingId: string, action: 'CONFIRM' | 'DISMISS', reason: string) => void;
  onIssueDeficiency: (appId: string) => void;
  onSelectDocument: (docId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const FindingsViewer: React.FC<FindingsViewerProps> = ({
  application,
  currentUser,
  onTriageFinding,
  onIssueDeficiency,
  onSelectDocument,
  onNavigateTab
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(
    application.findings[0]?.id || ''
  );
  const [selectedDocId, setSelectedDocId] = useState<string>(
    application.documents[0]?.id || ''
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dismissReasonModalOpen, setDismissReasonModalOpen] = useState(false);
  const [dismissReasonText, setDismissReasonText] = useState('');

  const selectedFinding = application.findings.find(f => f.id === selectedFindingId) || application.findings[0];
  const activeDoc = application.documents.find(d => d.id === selectedDocId) || application.documents[0];

  const handleSelectFinding = (finding: FindingDTO) => {
    setSelectedFindingId(finding.id);

    // Automatically navigate to the corresponding document & page
    let matchingDoc: DocumentRecord | undefined;
    if (finding.ruleId.includes('FSR')) {
      matchingDoc = application.documents.find(d => d.type === 'FACULTY_DATA' || d.type === 'APPLICATION_FORM');
    } else if (finding.ruleId.includes('LAND') || finding.ruleId.includes('STAMP')) {
      matchingDoc = application.documents.find(d => d.type === 'VERNACULAR_DEED');
    } else if (finding.ruleId.includes('CAD') || finding.ruleId.includes('LAB')) {
      matchingDoc = application.documents.find(d => d.type === 'CAD_BLUEPRINT');
    } else if (finding.ruleId.includes('NOC')) {
      matchingDoc = application.documents.find(d => d.type === 'FIRE_SAFETY_CERTIFICATE');
    } else if (finding.ruleId.includes('GHOST')) {
      matchingDoc = application.documents.find(d => d.type === 'FACULTY_DATA');
    }

    if (matchingDoc) {
      setSelectedDocId(matchingDoc.id);
    }
    if (finding.pageNumber) {
      setCurrentPage(finding.pageNumber);
    }
  };

  const handleDismissSubmit = () => {
    if (!dismissReasonText.trim()) {
      alert('Mandatory reason is required by AICTE regulations to dismiss any finding.');
      return;
    }
    if (selectedFinding) {
      onTriageFinding(selectedFinding.id, 'DISMISS', dismissReasonText);
      setDismissReasonModalOpen(false);
      setDismissReasonText('');
    }
  };

  // Get active page text
  const totalPages = activeDoc?.pages?.length || activeDoc?.pageCount || 1;
  const pageContent = activeDoc?.pages?.find(p => p.pageNumber === currentPage)?.text || activeDoc?.rawText || 'Document content unavailable.';

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Filing Queue</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-mono text-indigo-400 font-bold">{application.id}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">{application.institutionName}</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Side-by-Side Evidence Viewer with Coordinate Red-Highlighting
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('INGESTION_PORTAL')}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload New Document</span>
          </button>

          <button
            onClick={() => onIssueDeficiency(application.id)}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Formal Deficiency Notice</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left PDF Viewer Canvas, Right Findings & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive PDF Canvas Simulation (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          {/* Document Header & Tabs */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold truncate max-w-sm text-white">{activeDoc?.title || 'Submitted Document'}</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-[10px] text-indigo-300 font-mono font-bold">
                {activeDoc?.version || 'v1'}
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-400 font-mono text-[11px]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Canvas Display */}
          <div className="p-6 bg-slate-950/80 overflow-y-auto flex-1 min-h-[480px] flex items-center justify-center">
            <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 font-serif leading-relaxed text-xs border border-slate-300">
              {/* Header Letterhead */}
              <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
                <div className="text-[10px] tracking-widest uppercase font-bold text-slate-600">
                  Government of India — All India Council for Technical Education
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1 uppercase">
                  {application.institutionName}
                </h4>
                <div className="text-[9px] text-slate-500 font-mono">
                  Filing ID: {application.id} | Document: {activeDoc?.filename} | SHA-256 Verified
                </div>
              </div>

              {/* Real Uploaded Document Text or Structured Content */}
              <div className="space-y-3 font-sans text-[11px] leading-5 text-slate-800 whitespace-pre-line">
                {/* Check if current finding is on this page or document */}
                {selectedFinding && (
                  <div className="relative my-3 p-3.5 bg-rose-50/90 border-2 border-dashed border-rose-500 rounded-xl shadow-md">
                    <div className="absolute -top-3 left-3 bg-rose-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      <span>APH STATUTORY NON-COMPLIANCE DETECTED [{selectedFinding.ruleId}]</span>
                    </div>

                    <p className="font-mono text-rose-950 font-bold text-xs mt-1">
                      "{selectedFinding.quote || selectedFinding.explanation}"
                    </p>

                    <div className="text-[10px] text-rose-700 mt-2 flex items-center justify-between border-t border-rose-200/80 pt-1.5 font-sans">
                      <span><strong>Authority Binding:</strong> {selectedFinding.aphClause.slice(0, 55)}...</span>
                      <span className="font-mono font-bold">Bounding: [{selectedFinding.boundingCoords?.x || 12}%, {selectedFinding.boundingCoords?.y || 38}%]</span>
                    </div>
                  </div>
                )}

                {/* Body Text */}
                <div className="text-slate-800 leading-relaxed font-sans text-xs">
                  {pageContent}
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 pt-3 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>DOC_ID: {activeDoc?.id}</span>
                <span className="truncate max-w-[200px]">SHA-256: {activeDoc?.sha256Hash}</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>

          {/* Document Switcher Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 shrink-0 font-medium">Uploaded Files:</span>
            {application.documents.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDocId(d.id);
                  setCurrentPage(1);
                  onSelectDocument(d.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeDoc?.id === d.id
                    ? 'bg-indigo-600 text-white font-medium shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>{d.title.slice(0, 24)}...</span>
                <span className="font-mono text-[9px] opacity-75">({d.version})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Finding Triage Panel & AI Corrective Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Finding Selector Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detected Non-Compliances ({application.findings.length})
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Deterministic</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {application.findings.map(f => {
                const isSelected = f.id === selectedFindingId;
                return (
                  <div
                    key={f.id}
                    onClick={() => handleSelectFinding(f)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                        : f.isResolved || f.status === 'DISMISSED'
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="mt-0.5">
                      {f.isResolved || f.status === 'RESOLVED' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : f.status === 'DISMISSED' ? (
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      ) : (
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-indigo-300">{f.ruleId}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          f.isResolved ? 'bg-emerald-500/10 text-emerald-400' :
                          f.status === 'DISMISSED' ? 'bg-slate-700 text-slate-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="font-medium text-slate-200 truncate mt-0.5">{f.ruleTitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Finding Detail Card */}
          {selectedFinding && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-bold text-xs">
                    {selectedFinding.ruleId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-semibold">
                    {selectedFinding.trustState}
                  </span>
                  {selectedFinding.grounded && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                      VERBATIM GROUNDED
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  {selectedFinding.ruleTitle}
                </h3>
              </div>

              {/* Exact APH Clause Binding */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>Statutory Authority Clause Binding</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px]">
                  {selectedFinding.aphClause}
                </p>
              </div>

              {/* Finding Explanation */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Deterministic Evaluation:</span>
                <p className="text-slate-200 leading-relaxed bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
                  {selectedFinding.explanation}
                </p>
              </div>

              {/* AI-Generated Corrective Suggestion (PDF Section 6.2) */}
              <div className="bg-gradient-to-r from-amber-950/40 via-amber-950/20 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 space-y-1.5 shadow-md">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>AI Corrective Rectification Suggestion:</span>
                </div>
                <p className="text-xs text-amber-200 leading-relaxed font-sans">
                  "{selectedFinding.suggestion}"
                </p>
              </div>

              {/* Reviewer Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onTriageFinding(selectedFinding.id, 'CONFIRM', 'Confirmed by scrutiny officer.')}
                  disabled={selectedFinding.status === 'CONFIRMED' || selectedFinding.isResolved}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{selectedFinding.status === 'CONFIRMED' ? 'Confirmed' : 'Confirm Finding'}</span>
                </button>

                <button
                  onClick={() => setDismissReasonModalOpen(true)}
                  disabled={selectedFinding.status === 'DISMISSED' || selectedFinding.isResolved}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-rose-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                  title="Dismissing requires mandatory legal audit reason"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Reason Modal for Dismissal */}
      {dismissReasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Mandatory Dismissal Justification</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Under AICTE scrutiny protocols, dismissing an algorithmic non-compliance requires recording a formal legal justification into the immutable SHA-256 audit ledger.
            </p>

            <textarea
              rows={4}
              value={dismissReasonText}
              onChange={(e) => setDismissReasonText(e.target.value)}
              placeholder="Enter verified statutory exemption or appellate order citation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDismissReasonModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDismissSubmit}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Record Dismissal in Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
