import express from 'express';
import cors from 'cors';
import path from 'path';
import QRCode from 'qrcode';
import multer from 'multer';
import { dbStore, SYSTEM_USERS } from './server/dbStore.js';
import { evaluateHandbookRules } from './packages/rules-engine/src/index.js';
import { parsePdfBuffer, parseDocxBuffer } from './server/documentParser.js';
import { extractDocumentFactsWithGemini } from './server/documentIntelligence.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

async function bootstrap() {
  const app = express();
  const PORT = Number(process.env.PORT || 5000);

  app.use(cors());
  app.use(express.json());

  // API Routes

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AICTE VerifyLoop Regulatory Compliance Engine',
      applicationsCount: dbStore.applications.length,
      auditBlocksCount: dbStore.auditLedger.length,
      demoActive: dbStore.isDemoActive
    });
  });

  // Auth Users
  app.get('/api/auth/users', (req, res) => {
    res.json({ users: dbStore.users });
  });

  // Applications
  app.get('/api/applications', (req, res) => {
    res.json({ applications: dbStore.applications });
  });

  app.get('/api/applications/:id', (req, res) => {
    const appRecord = dbStore.applications.find(a => a.id === req.params.id);
    if (!appRecord) return res.status(404).json({ error: 'Application not found' });
    res.json({ application: appRecord });
  });

  // Create new Application filing
  app.post('/api/applications/create', (req, res) => {
    const { institutionName, category, state, intakeTotal, facultyTotal, landAreaAcres, userId } = req.body;
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[1];

    const appId = `APP-2026-${(state || 'IN').slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const intake = Number(intakeTotal) || 600;
    const faculty = Number(facultyTotal) || 28;
    const land = Number(landAreaAcres) || 2.4;

    const newApp: any = {
      id: appId,
      institutionId: `INST-${(state || 'IN').slice(0, 2).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      institutionName: institutionName || 'National Institute of Technology & Applied Research',
      state: state || 'New Delhi',
      academicYear: '2026-27',
      category: category || 'EXTENSION_OF_APPROVAL',
      status: 'REVIEW_READY',
      submittedAt: new Date().toISOString(),
      reviewerDeadline: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
      slaStatus: 'ON_TRACK',
      documents: [],
      findings: [],
      metrics: {
        totalStudents: intake,
        totalFaculty: faculty,
        calculatedFsr: Number((intake / Math.max(1, faculty)).toFixed(2)),
        landAreaAcres: land,
        labAreaSqM: 52.0,
        nocValidUntil: '2024-03-31'
      },
      deficiencyNotices: []
    };

    // Evaluate rules
    newApp.findings = evaluateHandbookRules({
      institutionId: newApp.id,
      institutionName: newApp.institutionName,
      totalStudents: intake,
      totalFaculty: faculty,
      landAreaAcres: land,
      nocExpiryDate: newApp.metrics.nocValidUntil,
      ghostMatches: dbStore.ghostFacultyCatalog
    });

    dbStore.applications.unshift(newApp);

    dbStore.addAuditBlock(
      'APPLICATION_CREATED',
      user.name,
      user.role,
      `New application ${appId} created for ${newApp.institutionName}. Intake: ${intake}, Faculty: ${faculty}, Land: ${land} Acres.`
    );

    res.json({ success: true, application: newApp });
  });

  // Live Multipart Document Upload & Instant Intelligence Extraction
  app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const {
        applicationId,
        institutionName,
        category,
        docType,
        intakeTotal,
        facultyTotal,
        landAreaAcres,
        fireSafetyExpiry,
        userId
      } = req.body;

      const user = dbStore.users.find(u => u.id === userId) || dbStore.users[1];

      let rawText = '';
      let pageCount = 1;
      let pages: { pageNumber: number; text: string }[] = [];

      if (file) {
        const isPdf = file.mimetype.includes('pdf') || file.originalname.endsWith('.pdf');
        const isDocx = file.mimetype.includes('word') || file.originalname.endsWith('.docx');

        if (isPdf) {
          const parsed = await parsePdfBuffer(file.buffer, file.originalname);
          rawText = parsed.text;
          pageCount = parsed.pageCount;
          pages = parsed.pages;
        } else if (isDocx) {
          const parsed = await parseDocxBuffer(file.buffer);
          rawText = parsed.text;
          pageCount = parsed.pageCount;
          pages = parsed.pages;
        } else {
          // Plain text / other
          rawText = file.buffer.toString('utf-8');
          pageCount = Math.max(1, Math.ceil(rawText.length / 1800));
          pages = [{ pageNumber: 1, text: rawText }];
        }
      } else {
        rawText = `Manual Document Submission for ${institutionName || 'Engineering Institution'}\n\nSanctioned student intake: ${intakeTotal || 600} students.\nTotal regular approved faculty: ${facultyTotal || 28}.\nCampus contiguous land parcel: ${landAreaAcres || 2.4} Acres.\nFire Safety Certificate validity until: ${fireSafetyExpiry || '2024-03-31'}.`;
        pages = [{ pageNumber: 1, text: rawText }];
      }

      // Perform intelligent fact extraction using connected Gemini AI
      const aiExtractedFacts = await extractDocumentFactsWithGemini(rawText, docType);

      // Merge AI extracted facts with form inputs (form inputs act as manual override if specified)
      const finalInstName = institutionName || aiExtractedFacts.institutionName || 'Engineering Institution';
      const finalIntake = intakeTotal || aiExtractedFacts.intakeTotal || 600;
      const finalFaculty = facultyTotal || aiExtractedFacts.facultyTotal || 28;
      const finalLand = landAreaAcres || aiExtractedFacts.landAreaAcres || 2.4;
      const finalNoc = fireSafetyExpiry || aiExtractedFacts.fireSafetyExpiry || '2024-03-31';

      const fileInfo = {
        filename: file?.originalname || 'Institutional_Filing_Declaration.pdf',
        mimeType: file?.mimetype || 'application/pdf',
        size: file?.size || rawText.length
      };

      const result = dbStore.addUploadedDocument(
        applicationId,
        fileInfo,
        rawText,
        pageCount,
        pages,
        {
          institutionName: finalInstName,
          category,
          docType: docType || 'APPLICATION_FORM',
          intakeTotal: finalIntake,
          facultyTotal: finalFaculty,
          landAreaAcres: finalLand,
          fireSafetyExpiry: finalNoc,
          cadRooms: aiExtractedFacts.cadRooms,
          stampCheck: aiExtractedFacts.stampCheck
        },
        user
      );

      res.json({
        success: true,
        message: 'Document successfully parsed, SHA-256 hashed, and evaluated through Disambiguation Firewall.',
        application: result.application,
        document: result.document,
        findingsCount: result.application.findings.length
      });
    } catch (err: any) {
      console.error('Upload handling error:', err);
      res.status(500).json({ error: err.message || 'Error processing uploaded document' });
    }
  });

  // Triage finding (Confirm or Dismiss)
  app.post('/api/applications/:id/triage-finding', (req, res) => {
    const { findingId, action, reason, userId } = req.body;
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
    const result = dbStore.triageFinding(req.params.id, findingId, action, reason || '', user);
    if (!result) return res.status(400).json({ error: 'Unable to triage finding' });
    res.json({ success: true, finding: result });
  });

  // Issue Deficiency Notice
  app.post('/api/applications/:id/issue-deficiency', (req, res) => {
    const { instructions, userId } = req.body;
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
    const updatedApp = dbStore.issueDeficiencyNotice(req.params.id, instructions, user);
    if (!updatedApp) return res.status(400).json({ error: 'Unable to issue notice' });
    res.json({ success: true, application: updatedApp });
  });

  // Resubmit v2 Rectified Bundle
  app.post('/api/applications/:id/resubmit-v2', (req, res) => {
    const { userId } = req.body;
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[1];
    const updatedApp = dbStore.submitRectifiedV2Bundle(req.params.id, user);
    if (!updatedApp) return res.status(400).json({ error: 'Unable to resubmit v2' });
    res.json({ success: true, application: updatedApp });
  });

  // Statutory Sign-Off (Final Decision)
  app.post('/api/applications/:id/statutory-sign-off', (req, res) => {
    const { decision, remarks, userId } = req.body;
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[2];
    const updatedApp = dbStore.statutorySignOff(req.params.id, decision, remarks || 'Statutory sign-off verified.', user);
    if (!updatedApp) return res.status(400).json({ error: 'Unable to sign-off' });
    res.json({ success: true, application: updatedApp });
  });

  // Ghost Faculty Catalog & Live Scanner
  app.get('/api/ghost-faculty', (req, res) => {
    res.json({ ghostFaculty: dbStore.ghostFacultyCatalog });
  });

  app.post('/api/ghost-faculty/scan', (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query identifier is required' });
    const scanResult = dbStore.scanGhostFacultyLive(query);
    res.json(scanResult);
  });

  // CAD Blueprint Spatial Analysis
  app.get('/api/cad-blueprints/:appId', (req, res) => {
    const blueprint = dbStore.cadBlueprints[req.params.appId] || dbStore.cadBlueprints['APP-2026-TN-089'];
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    res.json({ blueprint });
  });

  // Vernacular Stamp & Land Deed Analysis
  app.get('/api/vernacular-stamps/:appId', (req, res) => {
    const stamp = dbStore.vernacularStamps[req.params.appId] || dbStore.vernacularStamps['APP-2026-TN-089'];
    if (!stamp) return res.status(404).json({ error: 'Stamp record not found' });
    res.json({ stamp });
  });

  // Regulatory Delta & Impact Matrix
  app.get('/api/regulatory-delta', (req, res) => {
    res.json({ deltaMatrix: dbStore.regulatoryDeltaCatalog });
  });

  app.post('/api/regulatory-delta/simulate', (req, res) => {
    const { amendmentTitle, fsrRequirement, labCarpetArea } = req.body;
    dbStore.addAuditBlock(
      'REGULATORY_DELTA_SIMULATED',
      'ADMIN_POLICY_BUREAU',
      'POLICY_MAKER',
      `Simulated amendment: "${amendmentTitle}". New FSR target: 1:${fsrRequirement || 15}, Lab min: ${labCarpetArea || 75} sq.m.`
    );
    res.json({
      success: true,
      affectedApplicationsCount: dbStore.regulatoryDeltaCatalog.length,
      deltaMatrix: dbStore.regulatoryDeltaCatalog
    });
  });

  // Cryptographic Audit Ledger
  app.get('/api/audit-ledger', (req, res) => {
    res.json({ ledger: dbStore.auditLedger });
  });

  // Benchmark Metrics
  app.get('/api/benchmarks', (req, res) => {
    res.json({ benchmarks: dbStore.benchmarks });
  });

  // Reset demo state
  app.post('/api/demo/reset', (req, res) => {
    dbStore.resetToInitialDemoState();
    res.json({ success: true, message: 'VerifyLoop reset to pristine initial demo state.' });
  });

  // Generate QR Code for Court-Admissible Dossier
  app.get('/api/court-packet/:appId/qr', async (req, res) => {
    try {
      const appRecord = dbStore.applications.find(a => a.id === req.params.appId);
      const verifyUrl = `https://aicte-verifyloop.gov.in/legal-verify?appId=${req.params.appId}&hash=${appRecord?.documents[0]?.sha256Hash?.slice(0, 16) || '8a7f9b2c3d'}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
      res.json({ qrDataUrl, verifyUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite middleware for live development SPA preview
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` AICTE VerifyLoop Master Platform running on port ${PORT}`);
    console.log(` Local UI & API available at: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

bootstrap().catch(err => {
  console.error('Fatal bootstrapping error:', err);
  process.exit(1);
});
