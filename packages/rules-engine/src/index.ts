import type { FindingDTO, CADRoomPolygon, VernacularStampResult, GhostFacultyMatch } from '../../shared-types/src/index.js';

export interface InstitutionMetricsInput {
  institutionId: string;
  institutionName: string;
  totalStudents: number;
  totalFaculty: number;
  landAreaAcres: number;
  nocExpiryDate: string;
  currentDate?: string;
  cadRooms?: CADRoomPolygon[];
  stampCheck?: VernacularStampResult;
  ghostMatches?: GhostFacultyMatch[];
}

export function evaluateHandbookRules(input: InstitutionMetricsInput): FindingDTO[] {
  const findings: FindingDTO[] = [];

  // Rule 1: Deterministic Faculty-Student Ratio (APH-CH2-FSR-001)
  const fsr = input.totalFaculty > 0 ? Number((input.totalStudents / input.totalFaculty).toFixed(2)) : 999;
  if (fsr > 20.0) {
    const requiredFaculty = Math.ceil(input.totalStudents / 20);
    const deficit = requiredFaculty - input.totalFaculty;
    findings.push({
      id: `FND-${input.institutionId}-FSR-001`,
      ruleId: 'APH-CH2-FSR-001',
      ruleTitle: 'Faculty-to-Student Ratio (FSR) Non-Compliance',
      severity: 'CRITICAL',
      trustState: 'MISMATCH_DETECTED',
      aphClause: 'AICTE Approval Process Handbook (APH) 2024–27, Chapter II, Clause 2.14.1',
      explanation: `Calculated FSR is 1:${fsr}, which breaches the statutory ceiling of 1:20 for undergraduate technical programmes. Total students: ${input.totalStudents}, total approved faculty: ${input.totalFaculty}.`,
      suggestion: `Declare a minimum of ${deficit} additional qualified faculty member${deficit > 1 ? 's' : ''} in the Faculty Register for this programme, or reduce the sanctioned intake by ${deficit * 20} seats.`,
      pageNumber: 4,
      boundingCoords: { page: 4, x: 12, y: 38, width: 76, height: 14 },
      quote: `Total approved faculty strength: ${input.totalFaculty} against sanctioned intake of ${input.totalStudents} students`,
      grounded: true,
      isResolved: false,
      status: 'OPEN'
    });
  }

  // Rule 2: Minimum Land Requirement (APH-CH2-LAND-002)
  if (input.landAreaAcres < 2.5) {
    findings.push({
      id: `FND-${input.institutionId}-LAND-002`,
      ruleId: 'APH-CH2-LAND-002',
      ruleTitle: 'Sub-Minimum Contiguous Campus Land Area',
      severity: 'CRITICAL',
      trustState: 'MISMATCH_DETECTED',
      aphClause: 'AICTE Approval Process Handbook (APH) 2024–27, Chapter II, Clause 2.3.2',
      explanation: `Declared campus contiguous land is ${input.landAreaAcres} Acres (${(input.landAreaAcres * 4046.86).toFixed(1)} sq.m), below the statutory minimum of 2.5 Acres for non-mega urban clusters.`,
      suggestion: 'Submit supplementary registered title deed or long-term lease deed (>30 years) for contiguous land parcel fulfilling the 2.5 Acre minimum mandate.',
      pageNumber: 2,
      boundingCoords: { page: 2, x: 10, y: 52, width: 80, height: 12 },
      quote: `Contiguous campus land parcel: ${input.landAreaAcres} Acres registered under Document No. 2024/481`,
      grounded: true,
      isResolved: false,
      status: 'OPEN'
    });
  }

  // Rule 3: NOC / Fire Safety Certificate Validity (APH-CH2-NOC-003)
  const now = input.currentDate ? new Date(input.currentDate) : new Date('2026-10-27');
  const expiry = new Date(input.nocExpiryDate);
  if (expiry < now) {
    findings.push({
      id: `FND-${input.institutionId}-NOC-003`,
      ruleId: 'APH-CH2-NOC-003',
      ruleTitle: 'Expired Fire Safety & Environmental NOC',
      severity: 'CRITICAL',
      trustState: 'MISMATCH_DETECTED',
      aphClause: 'AICTE Approval Process Handbook (APH) 2024–27, Chapter II, Clause 2.9.4',
      explanation: `State Fire & Rescue Services Department NOC expired on ${input.nocExpiryDate}. Statutory regulations mandate a valid certificate covering the entire upcoming academic cycle.`,
      suggestion: 'Upload a renewed Fire Safety Certificate / NOC issued by the Competent Fire & Rescue Authority with validity extending through 2027.',
      pageNumber: 1,
      boundingCoords: { page: 1, x: 14, y: 68, width: 72, height: 11 },
      quote: `Fire Safety NOC Certificate valid up to: ${input.nocExpiryDate}`,
      grounded: true,
      isResolved: false,
      status: 'OPEN'
    });
  }

  // Rule 4: CAD Blueprint Lab Area (APH-CH2-LAB-004)
  if (input.cadRooms) {
    for (const room of input.cadRooms) {
      if (room.roomType === 'LAB' && room.calculatedAreaSqM < room.aphMinimumSqM) {
        findings.push({
          id: `FND-${input.institutionId}-CAD-${room.roomId}`,
          ruleId: 'APH-CH2-LAB-004',
          ruleTitle: `Undersized Laboratory: ${room.roomName}`,
          severity: 'CRITICAL',
          trustState: 'MISMATCH_DETECTED',
          aphClause: 'AICTE Approval Process Handbook (APH) 2024–27, Chapter II, Clause 2.16.2',
          explanation: `Architectural blueprint spatial calculation detects net area of ${room.calculatedAreaSqM} sq.m (${room.dimensionsText}), which fails the mandatory minimum threshold of ${room.aphMinimumSqM} sq.m.`,
          suggestion: `Modify laboratory boundary partitions on revised architectural layout plan to satisfy $\\ge ${room.aphMinimumSqM}\\text{ sq.m}$ net carpet area, certified by a Council of Architecture (CoA) registered architect.`,
          pageNumber: 3,
          boundingCoords: { page: 3, x: 25, y: 30, width: 50, height: 28 },
          quote: `${room.roomName} [${room.roomId}] Dimensions: ${room.dimensionsText} = ${room.calculatedAreaSqM} sq.m`,
          grounded: true,
          isResolved: false,
          status: 'OPEN'
        });
      }
    }
  }

  // Rule 5: E-Stamp Chronology Integrity (APH-CH2-STAMP-007)
  if (input.stampCheck && input.stampCheck.isBackdated) {
    findings.push({
      id: `FND-${input.institutionId}-STAMP-007`,
      ruleId: 'APH-CH2-STAMP-007',
      ruleTitle: 'Backdated Land Deed Execution Detected',
      severity: 'CRITICAL',
      trustState: 'MISMATCH_DETECTED',
      aphClause: 'Indian Stamp Act, 1899 read with AICTE APH Chapter II Mandatory Land Criteria',
      explanation: `E-Stamp Certificate (${input.stampCheck.certificateNumber}) was purchased on ${input.stampCheck.stampPurchaseDate}, but the agreement purports to be executed on ${input.stampCheck.deedExecutionDate}. Execution prior to stamp issuance constitutes an invalid, fraudulent filing.`,
      suggestion: 'Re-submit legally executed title agreement with verifiable State Treasury E-Stamp registration certificate and registrar endorsement seal.',
      pageNumber: 2,
      boundingCoords: { page: 2, x: 8, y: 18, width: 84, height: 16 },
      quote: `Certificate Issued: ${input.stampCheck.stampPurchaseDate} | Agreement Execution: ${input.stampCheck.deedExecutionDate}`,
      grounded: true,
      isResolved: false,
      status: 'OPEN'
    });
  }

  // Rule 6: Ghost Faculty Multi-Institution Registration (APH-CH2-GHOST-008)
  if (input.ghostMatches && input.ghostMatches.length > 0) {
    for (const match of input.ghostMatches) {
      const otherInsts = match.institutions
        .filter(inst => inst.institutionId !== input.institutionId)
        .map(i => `${i.institutionName} (${i.state})`)
        .join(', ');

      findings.push({
        id: `FND-${input.institutionId}-GHOST-${match.facultyPanHash.slice(0, 6)}`,
        ruleId: 'APH-CH2-GHOST-008',
        ruleTitle: `Cross-Institution Ghost Faculty Collision: ${match.facultyName}`,
        severity: 'CRITICAL',
        trustState: 'MISMATCH_DETECTED',
        aphClause: 'AICTE Approval Process Handbook (APH) 2024–27, Annexure 14 (Faculty Authentication & Fraud Deterrence)',
        explanation: `Faculty member ${match.facultyName} (${match.facultyDesignation}, PAN Hash: ${match.facultyPanHash.slice(0, 12)}...) is concurrently registered as active full-time faculty at: ${otherInsts}.`,
        suggestion: `Provide biometric attendance proof, Form 16, and EPFO contribution statements for the last 12 months, or de-register the duplicate faculty member immediately.`,
        pageNumber: 5,
        boundingCoords: { page: 5, x: 10, y: 44, width: 80, height: 15 },
        quote: `Full-time Faculty Declaration: ${match.facultyName}, Designation: ${match.facultyDesignation}`,
        grounded: true,
        isResolved: false,
        status: 'OPEN'
      });
    }
  }

  return findings;
}
