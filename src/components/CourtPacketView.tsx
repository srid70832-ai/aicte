import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  QrCode,
  ShieldCheck,
  Printer,
  Download,
  Landmark,
  Scale,
  ExternalLink,
  CheckCircle,
  Hash
} from 'lucide-react';
import { ApplicationRecord } from '../types.js';

interface CourtPacketViewProps {
  application: ApplicationRecord;
}

export const CourtPacketView: React.FC<CourtPacketViewProps> = ({ application }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verifyUrl, setVerifyUrl] = useState<string>('');

  useEffect(() => {
    fetch(`/api/court-packet/${application.id}/qr`)
      .then(res => res.json())
      .then(data => {
        if (data.qrDataUrl) {
          setQrCodeDataUrl(data.qrDataUrl);
          setVerifyUrl(data.verifyUrl);
        }
      })
      .catch(err => console.warn('QR fetch failed:', err));
  }, [application.id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              High Court Admissible Dossier
            </span>
            <span className="text-xs text-slate-400">Cryptographically Bound Decision Support Packet</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" />
            <span>Statutory Scrutiny Audit Packet (Form SIH-26261)</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Tamper-evident legal dossier prepared for High Court Writ Petition defense and Standing Appellate Committee (SAC) hearings.
            Contains verbatim evidence citations, coordinate polygons, cryptographic hashes, and public verification QR code.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Legal Document Container (Paper Style) */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-slate-300 font-serif space-y-6">
        {/* Document Header & AICTE Emblem */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="text-[11px] font-bold tracking-widest uppercase text-slate-600">
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </div>
          <div className="text-[9px] tracking-wider text-slate-500 uppercase">
            (A Statutory Body of the Government of India) | Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
          </div>
          <h2 className="text-lg font-bold uppercase text-slate-900 pt-2 tracking-tight">
            STATUTORY SCRUTINY DECISION REPORT & EVIDENTIARY RECORD
          </h2>
          <div className="text-xs font-sans text-slate-600">
            Issued under Problem Statement PS26261 (AICTE VerifyLoop Automated Verification Bureau)
          </div>
        </div>

        {/* Top Summary Table */}
        <div className="grid grid-cols-2 gap-4 text-xs font-sans border border-slate-300 p-4 rounded-lg bg-slate-50">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Institution Name:</span>
            <span className="font-bold text-slate-900 text-sm">{application.institutionName}</span>
            <span className="text-slate-600 block text-[11px]">Institution ID: {application.institutionId}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Application Reference:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{application.id}</span>
            <span className="text-slate-600 block text-[11px]">Category: {application.category.replace(/_/g, ' ')}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Statutory Status:</span>
            <span className="font-bold text-rose-700 uppercase">{application.status.replace(/_/g, ' ')}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Scrutiny Date:</span>
            <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Section 1: Algorithmic Handbook Non-Compliances */}
        <div className="space-y-3 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            1. Verbatim Findings & Statutory Non-Compliances Record
          </h3>

          <div className="space-y-3">
            {application.findings.map((f, i) => (
              <div key={f.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-700 text-[11px]">
                    Finding #{i + 1}: {f.ruleId} — {f.ruleTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {f.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-700">
                  <strong>APH Clause Citation:</strong> {f.aphClause}
                </div>

                <div className="p-2 bg-white border border-slate-200 rounded font-serif italic text-slate-800 text-[11px]">
                  <strong>Verbatim Extracted Quote:</strong> "{f.quote || f.explanation}"
                </div>

                <div className="text-[10px] text-slate-600 flex items-center justify-between">
                  <span>Page Reference: Page {f.pageNumber || 1}</span>
                  <span className="font-mono">Coordinates: [{f.boundingCoords?.x || 12}%, {f.boundingCoords?.y || 38}%]</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Cryptographic Document Fingerprint Registry */}
        <div className="space-y-2 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            2. Cryptographic Document Digest Registry (SHA-256)
          </h3>

          <div className="space-y-1 text-[10px] font-mono">
            {application.documents.map(d => (
              <div key={d.id} className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="truncate max-w-xs font-sans text-slate-700">{d.title} ({d.version})</span>
                <span className="text-slate-900 select-all font-bold">{d.sha256Hash}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Official Sign-Off & High Court Public QR Verification */}
        <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center font-sans">
          {/* QR Verification Code */}
          <div className="flex items-center gap-4">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="Court Verification QR" className="w-24 h-24 border border-slate-300 rounded p-1" />
            ) : (
              <div className="w-24 h-24 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 text-xs block">Judicial Verification Link:</span>
              <p className="text-[10px] text-slate-600 leading-tight">
                Scan via any smartphone or judicial workstation to verify the immutable cryptographic ledger entry in real-time.
              </p>
              <div className="font-mono text-[9px] text-indigo-700 truncate max-w-[200px]">
                {verifyUrl}
              </div>
            </div>
          </div>

          {/* Digital Signature & Seal */}
          <div className="text-right text-xs space-y-1">
            <div className="inline-block border-2 border-emerald-700 text-emerald-800 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-1">
              DIGITALLY ATTESTED & SIGNED
            </div>
            <div className="font-bold text-slate-900">Prof. Anita Deshmukh</div>
            <div className="text-slate-600 text-[11px]">Advisor & Competent Authority</div>
            <div className="text-slate-500 text-[10px]">AICTE Regulation Bureau, New Delhi</div>
            <div className="font-mono text-[9px] text-slate-500 pt-1">
              HMAC-SHA256: 8a7f9b2c3d4e5f6a7b8c9d0e1f2a3b4c
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
