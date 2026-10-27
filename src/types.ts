export * from '../packages/shared-types/src/index.js';

export type NavigationTab = 
  | 'DASHBOARD'
  | 'INGESTION_PORTAL'
  | 'DOCUMENTS'
  | 'FINDINGS_VIEWER'
  | 'GHOST_FACULTY'
  | 'CAD_BLUEPRINTS'
  | 'VERNACULAR_STAMPS'
  | 'REGULATORY_DELTA'
  | 'TIME_MACHINE'
  | 'COURT_PACKET'
  | 'AUDIT_LEDGER'
  | 'BENCHMARKS'
  | 'DEMO_RUNNER'
  | 'COPILOT';

export type UserRole = 'SUBMITTER' | 'REVIEWER' | 'ANALYST' | 'VIEWER' | 'COMPETENT_AUTHORITY';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  assignedProjects: string[];
}

export type DocumentType = 
  | 'APPLICATION_FORM'
  | 'AFFIDAVIT'
  | 'FIRE_SAFETY_CERTIFICATE'
  | 'PRINCIPAL_QUALIFICATIONS'
  | 'LAND_BUILTUP_DETAILS'
  | 'FACULTY_DATA'
  | 'STUDENT_DATA'
  | 'DIGITAL_PAYMENT_PROOF'
  | 'NOC_CERTIFICATE'
  | 'CAD_BLUEPRINT'
  | 'VERNACULAR_DEED'
  | 'APPROVAL_LETTER'
  | 'OTHER';

export type ProcessingStatus = 
  | 'IDLE'
  | 'INGESTING'
  | 'OCR_READING'
  | 'EXTRACTING'
  | 'EVALUATING_RULES'
  | 'INDEXED'
  | 'ERROR';

export interface DocumentPipelineStep {
  id: string;
  label: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR';
  detail?: string;
  durationMs?: number;
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  title: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  type: DocumentType;
  department: string;
  version: 'v1' | 'v2' | string;
  sha256Hash: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  status: ProcessingStatus;
  processingProgress?: number;
  pipelineSteps?: DocumentPipelineStep[];
  rawText: string;
  pageCount: number;
  pages?: { pageNumber: number; text: string }[];
  isArchived: boolean;
  isSyntheticDemo?: boolean;
  metadata: {
    vendor?: string;
    contractValue?: string;
    effectiveDate?: string;
    expiryDate?: string;
    institutionName?: string;
    intakeTotal?: number;
    facultyTotal?: number;
    calculatedFsr?: number;
    landAreaAcres?: number;
    fireSafetyExpiry?: string;
    stampCertificateNumber?: string;
    architectCoA?: string;
    fireSafetyCertificate?: boolean;
    principalQualified?: boolean;
    affidavitSigned?: boolean;
    nocProvided?: boolean;
    digitalPaymentProof?: boolean;
  };
}

export interface ApplicationRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  state: string;
  academicYear: string;
  category: 'EXTENSION_OF_APPROVAL' | 'NEW_INSTITUTION' | 'INCREASE_INTAKE';
  status: import('../packages/shared-types/src/index.js').ApplicationStatus;
  submittedAt: string;
  reviewerDeadline: string;
  applicantResponseDeadline?: string;
  slaStatus: import('../packages/shared-types/src/index.js').SLAStatus;
  documents: DocumentRecord[];
  findings: import('../packages/shared-types/src/index.js').FindingDTO[];
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    calculatedFsr: number;
    landAreaAcres: number;
    labAreaSqM: number;
    nocValidUntil: string;
  };
  deficiencyNotices: {
    id: string;
    issuedAt: string;
    dueDate: string;
    findingsCount: number;
    status: 'OPEN' | 'RESOLVED_BY_V2' | 'EXPIRED';
    instructions: string;
  }[];
  statutorySignOff?: {
    decision: 'APPROVED' | 'REJECTED';
    officerName: string;
    officerDesignation: string;
    timestamp: string;
    remarks: string;
    digitalSignatureHash: string;
  };
}

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskCategory = 'DEADLINE' | 'CONTRACT' | 'COMPLIANCE' | 'FINANCIAL' | 'SLA' | 'DEPENDENCY';

export interface RiskItem {
  id: string;
  title: string;
  reason: string;
  category: RiskCategory;
  severity: RiskSeverity;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  evidence: string;
  recommendedAction: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  isSyntheticDemo?: boolean;
}

export type ConflictType = 
  | 'CLAUSE_INCONSISTENCY'
  | 'DATE_DISCREPANCY'
  | 'AMOUNT_DISCREPANCY'
  | 'SLA_MISMATCH'
  | 'OBLIGATION_MISMATCH'
  | 'VERSION_INCONSISTENCY';

export type ConflictStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'RESOLVED';

export interface ConflictItem {
  id: string;
  title: string;
  type: ConflictType;
  severity: RiskSeverity;
  status: ConflictStatus;
  documentA: {
    id: string;
    title: string;
    page: number;
    clause: string;
    evidence: string;
  };
  documentB: {
    id: string;
    title: string;
    page: number;
    clause: string;
    evidence: string;
  };
  impactSummary: string;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  isSyntheticDemo?: boolean;
}

export interface ActionItem {
  id: string;
  action: string;
  responsibleRole: string;
  assignedTo?: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  deadline?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  evidence: string;
  createdAt: string;
  completedAt?: string;
  isSyntheticDemo?: boolean;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  status: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  responsibleRole: string;
  category: string;
  evidence: string;
  isSyntheticDemo?: boolean;
}

export type ComplianceStatus = 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'INSUFFICIENT_EVIDENCE';

export interface ComplianceItem {
  id: string;
  standard: string;
  clauseReference: string;
  requirement: string;
  status: ComplianceStatus;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  evidence: string;
  riskAssessment: string;
  verifiedBy?: string;
  lastChecked: string;
  isSyntheticDemo?: boolean;
}

export interface ClauseDiff {
  id: string;
  section: string;
  oldText: string;
  newText: string;
  changeType: 'MODIFIED' | 'ADDED' | 'DELETED' | 'UNCHANGED';
  riskLevel: RiskSeverity;
  impactDescription: string;
}

export interface ChangeImpactAnalysis {
  id: string;
  documentId: string;
  documentTitle: string;
  baseVersion: string;
  targetVersion: string;
  summaryOfChange: string;
  changedClauses: ClauseDiff[];
  affectedDocuments: {
    id: string;
    title: string;
    relationshipType: string;
    impactSeverity: RiskSeverity;
    impactReason: string;
    evidence: string;
  }[];
  affectedRelationships: {
    source: string;
    relation: string;
    target: string;
    impact: string;
  }[];
  potentialRisks: {
    category: RiskCategory;
    severity: RiskSeverity;
    risk: string;
    evidence: string;
  }[];
  recommendedActions: {
    action: string;
    role: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    deadlineDays: number;
  }[];
  humanVerificationStatus: 'PENDING_REVIEW' | 'VERIFIED_APPROVED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  isSyntheticDemo?: boolean;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  pageNumber: number;
  text: string;
  tokenCount: number;
  embedding?: number[];
}

export interface ExtractedEntity {
  id: string;
  documentId: string;
  documentTitle: string;
  name: string;
  type: string;
  pageNumber: number;
  evidence: string;
  confidence: number;
}

export interface ExtractedRelationship {
  id: string;
  sourceEntity: string;
  targetEntity: string;
  relationType: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  evidence: string;
  confidence: number;
}

export type WorkflowStage = 
  | 'INGEST' 
  | 'UNDERSTANDING' 
  | 'CONNECTION' 
  | 'RISK' 
  | 'IMPACT' 
  | 'ACTION' 
  | 'DECISION' 
  | 'APPROVAL' 
  | 'AUDIT'
  | 'OCR' 
  | 'CLASSIFY' 
  | 'ROUTE' 
  | 'PRIORITIZE' 
  | 'DEADLINE' 
  | 'ASSIGN' 
  | 'RESOLUTION';

export interface WorkflowItem {
  id: string;
  documentId: string;
  documentTitle: string;
  title: string;
  department: string;
  currentStage: WorkflowStage;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  aiRecommendation: string;
  humanAssignee?: string;
  history: {
    stage: string;
    timestamp: string;
    actor: string;
    note: string;
  }[];
  createdAt: string;
  isSyntheticDemo?: boolean;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  type: 'CRITICAL_ACTION' | 'CONFLICT_RESOLUTION' | 'RISK_ACCEPTANCE' | 'COMPLIANCE_DECISION' | 'WORKFLOW_COMPLETION';
  documentId: string;
  documentTitle: string;
  requestedBy: string;
  roleRequired: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  aiRecommendationSummary: string;
  evidence: string;
  decisionNote?: string;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
  isSyntheticDemo?: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  previousValue?: string;
  newValue?: string;
  decision?: string;
  evidenceSource?: string;
  ipAddress?: string;
  timestamp: string;
  isSyntheticDemo?: boolean;
}

export interface SearchResultChunk {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  documentType: DocumentType;
  department: string;
  pageNumber: number;
  text: string;
  similarityScore: number;
  matchedKeywords: string[];
  evidenceQuote: string;
}

export interface CitationItem {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  quote: string;
  confidence: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: CitationItem[];
  confidenceScore?: number;
  noEvidenceFound?: boolean;
  processingTimeMs?: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  documentId: string;
  documentTitle: string;
  evidence: string;
  pageNumber: number;
  properties: Record<string, string | number>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  evidence: string;
  confidence: number;
}
