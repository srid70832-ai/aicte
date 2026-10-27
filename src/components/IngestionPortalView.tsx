import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  FileCheck,
  Building,
  Hash,
  Clock
} from 'lucide-react';
import { ApplicationRecord, User, NavigationTab } from '../types.js';

interface IngestionPortalViewProps {
  applications: ApplicationRecord[];
  currentUser: User;
  onDocumentUploaded: (appId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const IngestionPortalView: React.FC<IngestionPortalViewProps> = ({
  applications,
  currentUser,
  onDocumentUploaded,
  onNavigateTab
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || 'NEW');
  const [newInstName, setNewInstName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('EXTENSION_OF_APPROVAL');
  const [docType, setDocType] = useState<string>('APPLICATION_FORM');
  const [intakeTotal, setIntakeTotal] = useState<string>('840');
  const [facultyTotal, setFacultyTotal] = useState<string>('38');
  const [landAreaAcres, setLandAreaAcres] = useState<string>('2.2');
  const [fireSafetyExpiry, setFireSafetyExpiry] = useState<string>('2024-04-30');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setUploadSuccess(null);

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    formData.append('applicationId', selectedAppId === 'NEW' ? '' : selectedAppId);
    formData.append('institutionName', newInstName || 'National Engineering & Technology Institute');
    formData.append('category', newCategory);
    formData.append('docType', docType);
    formData.append('intakeTotal', intakeTotal);
    formData.append('facultyTotal', facultyTotal);
    formData.append('landAreaAcres', landAreaAcres);
    formData.append('fireSafetyExpiry', fireSafetyExpiry);
    formData.append('userId', currentUser.id);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        setUploadSuccess(data);
        onDocumentUploaded(data.application.id);
      } else {
        alert(data.error || 'Upload error');
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Error communicating with ingestion server');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Step 1: Document Ingestion & Dual-Stage Parser
            </span>
            <span className="text-xs text-slate-400">Section 3: Disambiguation Firewall Pipeline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Upload className="w-6 h-6 text-indigo-400" />
            <span>Applicant Intake & Document Upload Portal</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Upload institutional regulatory filings (PDF/DOCX). The backend validates magic-bytes, computes an immutable SHA-256 fingerprint, performs OCR/text extraction, and passes structured data through the zero-hallucination deterministic compliance engine.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Magic Bytes & SHA-256 Ready</span>
          </span>
        </div>
      </div>

      {/* Upload Form and Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload Form (7 Cols) */}
        <form onSubmit={handleUploadSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Institutional Document Filing Specifications</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Max 50MB</span>
          </div>

          {/* Application Selection */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-semibold uppercase text-[10px]">Target Application Filing:</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="NEW">+ Register New Institutional Application Filing</option>
              {applications.map(a => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.institutionName} ({a.category.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* If New Application, show Institute Name */}
          {selectedAppId === 'NEW' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold uppercase text-[10px]">Institution Name:</label>
                <input
                  type="text"
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  placeholder="e.g. Kongu Engineering College"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold uppercase text-[10px]">Application Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="EXTENSION_OF_APPROVAL">Extension of Approval (EoA)</option>
                  <option value="NEW_INSTITUTION">New Technical Institution Proposal</option>
                  <option value="INCREASE_INTAKE">Increase in Sanctioned Intake</option>
                </select>
              </div>
            </div>
          )}

          {/* Document Type Selection */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-semibold uppercase text-[10px]">Document Filing Type:</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="APPLICATION_FORM">Annual Institutional EoA Application Form</option>
              <option value="FACULTY_DATA">Faculty Register & Biometric Declarations (FSR & Ghost Check)</option>
              <option value="CAD_BLUEPRINT">Architectural Floor Plan Blueprint (Vision-CAD Polygon Analysis)</option>
              <option value="FIRE_SAFETY_CERTIFICATE">Fire Safety & Rescue Dept NOC Certificate</option>
              <option value="VERNACULAR_DEED">Campus Land Title Deed & State Revenue E-Stamp</option>
              <option value="AFFIDAVIT">Statutory Anti-Ragging & Infrastructure Affidavit</option>
            </select>
          </div>

          {/* Drag & Drop File Upload Input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-semibold uppercase text-[10px]">Select or Drop Document File (PDF / DOCX):</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-950/60 relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-indigo-400" />
                <div className="text-slate-200 font-medium">
                  {selectedFile ? (
                    <span className="text-emerald-400 font-bold">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  ) : (
                    <span>Click to browse or drag file here</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Supports multi-page digital PDFs, scanned image PDFs, and Word DOCX files</p>
              </div>
            </div>
          </div>

          {/* Extracted or User-Configured Parameters */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Handbook Rule Parameters for Instant Verification:</span>
              <span className="text-indigo-400 font-normal">Auto-extracted or customized</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block text-[10px]">Intake Total:</label>
                <input
                  type="number"
                  value={intakeTotal}
                  onChange={(e) => setIntakeTotal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono mt-0.5"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px]">Faculty Total:</label>
                <input
                  type="number"
                  value={facultyTotal}
                  onChange={(e) => setFacultyTotal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono mt-0.5"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px]">Land Area (Acres):</label>
                <input
                  type="number"
                  step="0.1"
                  value={landAreaAcres}
                  onChange={(e) => setLandAreaAcres(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono mt-0.5"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px]">Fire NOC Expiry:</label>
                <input
                  type="date"
                  value={fireSafetyExpiry}
                  onChange={(e) => setFireSafetyExpiry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Submit Ingestion Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Dual-Stage Extraction & Rules...' : 'Ingest Document & Execute Disambiguation Pipeline'}</span>
          </button>
        </form>

        {/* Right: Live Ingestion Pipeline & Success Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pipeline Stage Architecture Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Asynchronous Ingestion Pipeline Stages</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">1. Magic-Byte & Hash Seal</span>
                  <span className="text-[10px] text-slate-400">Verifies header (%PDF-) & computes SHA-256</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">READY</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">2. Dual-Stage OCR / Parser</span>
                  <span className="text-[10px] text-slate-400">PyMuPDF native text + Gemini Multimodal fallback</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">ACTIVE</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">3. Disambiguation Firewall</span>
                  <span className="text-[10px] text-slate-400">Restricts AI to schema fact extraction only</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">ENFORCED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">4. Deterministic Rule Engine</span>
                  <span className="text-[10px] text-slate-400">Pure code evaluates FSR, Land, CAD & NOC math</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">ZERO-AI VERDICT</span>
              </div>
            </div>
          </div>

          {/* Success Result Box */}
          {uploadSuccess && (
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">Document Analyzed Successfully!</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ingested into filing <strong>{uploadSuccess.application.id}</strong> ({uploadSuccess.application.institutionName}).
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-slate-400">Doc ID: {uploadSuccess.document.id}</div>
                <div className="text-emerald-400 truncate">SHA-256: {uploadSuccess.document.sha256Hash}</div>
                <div className="text-amber-400 font-bold">
                  Violations Raised: {uploadSuccess.findingsCount} Non-Compliances
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('FINDINGS_VIEWER')}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
                >
                  <span>Open Red-Highlight Viewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateTab('COURT_PACKET')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
                >
                  Court Packet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
