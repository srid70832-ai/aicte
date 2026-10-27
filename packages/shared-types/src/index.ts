export type ApplicationStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'REVIEW_READY'
  | 'DEFICIENCY_OPEN'
  | 'DEFICIENCY_DEADLINE_EXCEEDED'
  | 'RESOLVED_PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export type TrustState =
  | 'VERIFIED_OFFICIAL'
  | 'MISMATCH_DETECTED'
  | 'SOURCE_UNAVAILABLE'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'UNGROUNDED_NEEDS_REVIEW';

export type SLAStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED';

export interface BoundingCoords {
  page: number;
  x: number;      // percentage 0..100
  y: number;      // percentage 0..100
  width: number;  // percentage 0..100
  height: number; // percentage 0..100
}

export interface FindingDTO {
  id: string;
  ruleId: string;
  ruleTitle: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  trustState: TrustState;
  explanation: string;
  suggestion: string;
  aphClause: string;
  pageNumber?: number;
  boundingCoords?: BoundingCoords;
  isResolved: boolean;
  quote?: string;
  grounded: boolean;
  status: 'OPEN' | 'CONFIRMED' | 'DISMISSED' | 'RESOLVED';
  dismissReason?: string;
  documentId?: string;
  documentTitle?: string;
}

export interface GhostFacultyMatch {
  facultyName: string;
  facultyDesignation: string;
  facultyPanHash: string;
  facultyAadhaarHash: string;
  detectionTimestamp: string;
  institutions: {
    institutionId: string;
    institutionName: string;
    state: string;
    role: string;
    academicYear: string;
    overlapDates: string;
  }[];
  severity: 'CRITICAL';
  status: 'FRAUD_CONFIRMED' | 'PENDING_EXPLANATION';
}

export interface CADRoomPolygon {
  roomId: string;
  roomName: string;
  roomType: 'LAB' | 'CLASSROOM' | 'WORKSHOP' | 'LIBRARY' | 'ADMIN';
  dimensionsText: string;
  calculatedAreaSqM: number;
  aphMinimumSqM: number;
  status: 'PASS' | 'FAIL';
  polygonPoints: [number, number][]; // scaled 0..100 coordinates
}

export interface CADBlueprintAnalysis {
  documentId: string;
  blueprintTitle: string;
  drawingScale: string;
  totalBuiltupAreaSqM: number;
  rooms: CADRoomPolygon[];
  divyangjanRamp: { present: boolean; gradient: string; compliant: boolean };
  fireExits: { count: number; minimumRequired: number; compliant: boolean };
  elevators: { present: boolean; capacity: string; compliant: boolean };
  overallCompliance: boolean;
}

export interface VernacularStampResult {
  certificateNumber: string;
  stampPurchaseDate: string;
  deedExecutionDate: string;
  isBackdated: boolean;
  detectedLanguage: 'Tamil' | 'Hindi' | 'Marathi' | 'English';
  khasraSurveyNumbers: string[];
  lessor: string;
  lessee: string;
  stampDutyAmountINR: number;
  trustState: TrustState;
  riskNotice: string;
}

export interface RegulatoryDeltaMatrixItem {
  institutionId: string;
  institutionName: string;
  applicationCategory: string;
  previousComplianceStatus: 'COMPLIANT';
  newDeficiency: string;
  affectedRuleId: string;
  gapMetric: string;
  urgency: 'HIGH' | 'MEDIUM';
}

export interface CryptographicBlock {
  blockIndex: number;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  previousHash: string;
  blockHash: string;
  payloadSummary: string;
}

export interface EmpiricalBenchmarkResult {
  metric: string;
  targetBenchmark: string;
  achievedScore: string;
  datasetSize: string;
  status: 'EXCEEDED' | 'PASSED';
  details: string;
}
