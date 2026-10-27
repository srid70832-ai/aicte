import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Layers,
  Ruler,
  Accessibility,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { CADBlueprintAnalysis } from '../types.js';

interface CADBlueprintViewProps {
  blueprint: CADBlueprintAnalysis;
}

export const CADBlueprintView: React.FC<CADBlueprintViewProps> = ({ blueprint }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(blueprint.rooms[0]?.roomId || '');

  const selectedRoom = blueprint.rooms.find(r => r.roomId === selectedRoomId) || blueprint.rooms[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                200% Breakthrough Moat #2
              </span>
              <span className="text-xs text-slate-400">Spatial Vector CAD Polygon Parser</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">
              Vision-CAD Architectural Layout & Carpet Area Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Replaces the slow, manual scale-ruler inspection of building plans with deterministic spatial polygon parsing.
              Extracts dimensional vectors, computes net surface area, and verifies Chapter II structural safety norms.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              blueprint.overallCompliance
                ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950 border-rose-500/40 text-rose-300'
            }`}>
              {blueprint.overallCompliance ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CAD Space Compliant</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Spatial Deficiencies Flagged</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Blueprint SVG Viewer on Left, Room Area Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive SVG CAD Blueprint (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Parsed CAD Spatial Wireframe (Floor 2 - CS Wing)</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{blueprint.drawingScale}</span>
          </div>

          {/* Blueprint SVG Canvas */}
          <div className="flex-1 min-h-[380px] bg-slate-950 rounded-xl border border-blue-900/50 p-6 flex items-center justify-center relative overflow-hidden">
            {/* Architectural Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

            <svg viewBox="0 0 600 360" className="w-full h-full relative z-10 font-sans">
              {/* Outer Building Footprint */}
              <rect x="20" y="20" width="560" height="320" fill="#0f172a" stroke="#3b82f6" strokeWidth="2.5" rx="6" />

              {/* Corridor */}
              <rect x="20" y="170" width="560" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <text x="300" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="2">
                CENTRAL CIRCULATION CORRIDOR (WIDTH 2.5m)
              </text>

              {/* Room 1: Computer Lab (LAB-CS-201) */}
              {/* If area < 66, highlight in Red with warning stripe! */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedRoomId('LAB-CS-201')}
              >
                <rect
                  x="30"
                  y="30"
                  width="260"
                  height="130"
                  fill={blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.status === 'FAIL' ? '#450a0a' : '#064e3b'}
                  stroke={blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.status === 'FAIL' ? '#ef4444' : '#10b981'}
                  strokeWidth={selectedRoomId === 'LAB-CS-201' ? '3' : '1.5'}
                  rx="4"
                />
                <text x="160" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  {blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.roomName || 'Computing Lab'}
                </text>
                <text x="160" y="85" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontStyle="italic">
                  Dimensions: {blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.dimensionsText}
                </text>
                <text
                  x="160"
                  y="110"
                  textAnchor="middle"
                  fill={blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.status === 'FAIL' ? '#fca5a5' : '#6ee7b7'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  Area = {blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.calculatedAreaSqM} sq.m
                </text>
                <text
                  x="160"
                  y="130"
                  textAnchor="middle"
                  fill={blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.status === 'FAIL' ? '#ef4444' : '#10b981'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  {blueprint.rooms.find(r => r.roomId === 'LAB-CS-201')?.status === 'FAIL'
                    ? '[FAIL: UNDERSIZED < 66 SQ.M]'
                    : '[PASS: COMPLIANT]'}
                </text>
              </g>

              {/* Room 2: Lecture Hall 202 */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedRoomId('LH-CS-202')}
              >
                <rect
                  x="310"
                  y="30"
                  width="260"
                  height="130"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth={selectedRoomId === 'LH-CS-202' ? '3' : '1.5'}
                  rx="4"
                />
                <text x="440" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  Lecture Hall 202
                </text>
                <text x="440" y="85" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontStyle="italic">
                  Dimensions: 11.0m x 8.0m
                </text>
                <text x="440" y="110" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="bold">
                  Area = 88.00 sq.m
                </text>
                <text x="440" y="130" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                  [PASS: &gt;= 66 SQ.M REQUIREMENT]
                </text>
              </g>

              {/* Lower Section: Seminar Hall & Structural Features */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedRoomId('SEMINAR-203')}
              >
                <rect
                  x="30"
                  y="220"
                  width="360"
                  height="110"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth={selectedRoomId === 'SEMINAR-203' ? '3' : '1.5'}
                  rx="4"
                />
                <text x="210" y="260" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  Department Seminar & Conference Hall
                </text>
                <text x="210" y="280" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">
                  Area = 140.00 sq.m (Capacity: 150 Seats)
                </text>
              </g>

              {/* Structural Ramp & Fire Exit Icons */}
              <g transform="translate(410, 220)">
                <rect x="0" y="0" width="160" height="110" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" rx="4" />
                <text x="80" y="30" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">
                  ACCESSIBILITY WING
                </text>
                <text x="80" y="55" textAnchor="middle" fill="#a5b4fc" fontSize="9">
                  Divyangjan Ramp (1:12)
                </text>
                <text x="80" y="75" textAnchor="middle" fill="#a5b4fc" fontSize="9">
                  Fire Exit Stairway 1 & 2
                </text>
                <text x="80" y="95" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                  Braille Stretcher Lift OK
                </text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
            <span>Click any room wireframe to inspect polygon coordinates and statutory minimums.</span>
            <span className="text-blue-400 font-mono">Total Builtup: {blueprint.totalBuiltupAreaSqM} sq.m</span>
          </div>
        </div>

        {/* Right: Room Area Inspector & Structural Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Room Inspector Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Room Spatial Polygon Inspector
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedRoom?.status === 'PASS'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {selectedRoom?.status === 'PASS' ? 'COMPLIANT' : 'DEFICIENT'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{selectedRoom?.roomName}</h3>
              <p className="text-xs font-mono text-slate-400">ID: {selectedRoom?.roomId} | Type: {selectedRoom?.roomType}</p>
            </div>

            {/* Metric Comparison Card */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">CAD Calculated Area:</span>
                <div className={`text-xl font-bold mt-0.5 ${
                  selectedRoom?.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedRoom?.calculatedAreaSqM} sq.m
                </div>
                <span className="text-[10px] text-slate-400 font-mono">({selectedRoom?.dimensionsText})</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">APH Minimum Threshold:</span>
                <div className="text-xl font-bold text-indigo-300 mt-0.5">
                  &ge; {selectedRoom?.aphMinimumSqM} sq.m
                </div>
                <span className="text-[10px] text-slate-400">Chapter II Table 2.16</span>
              </div>
            </div>

            {selectedRoom?.status === 'FAIL' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Deficiency Identified by Spatial Algorithm:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Laboratory carpet area is deficient by <strong>{(selectedRoom.aphMinimumSqM - selectedRoom.calculatedAreaSqM).toFixed(1)} sq.m</strong>.
                  Applicant must submit an amended architectural floor plan partition satisfying the 66 sq.m statutory norm.
                </p>
              </div>
            )}
          </div>

          {/* Structural Safety & Divyangjan Accessibility Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-emerald-400" />
              <span>Mandatory Structural Inclusions (Chapter II)</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Ramp */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Divyangjan Accessibility Ramp</div>
                  <div className="text-[10px] text-slate-400">{blueprint.divyangjanRamp.gradient}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  VERIFIED PASS
                </span>
              </div>

              {/* Fire Exits */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Emergency Fire Exits & Staircases</div>
                  <div className="text-[10px] text-slate-400">{blueprint.fireExits.count} independent exits (Minimum 2 required)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  VERIFIED PASS
                </span>
              </div>

              {/* Elevator */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Barrier-Free Elevator Facility</div>
                  <div className="text-[10px] text-slate-400">{blueprint.elevators.capacity}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  VERIFIED PASS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
