import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  GitBranch, 
  FileCode, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  AlertCircle,
  Hash
} from 'lucide-react';

/**
 * SECTION 04 — THE VERIFIED INTELLIGENCE ENGINE
 * Highlights deterministic eligibility evaluation, decision traces, explainability, and rule provenance.
 * Core Principle: "AI assists with understanding. Verified rules decide eligibility."
 */

export default function VerifiedEngineSection() {
  const [showTraceDetail, setShowTraceDetail] = useState(true);
  const [activeTab, setActiveTab] = useState('trace'); // 'trace' | 'architecture' | 'provenance'

  return (
    <section className="verified-engine-section-wrapper" id="verified-engine" aria-label="Verified Eligibility Engine">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-centered">
          <div className="section-eyebrow">
            <span>SECTION 04 // THE VERIFICATION ARCHITECTURE</span>
          </div>
          <h2 className="section-heading-primary">
            DETERMINISTIC ELIGIBILITY. ZERO BLACK-BOX GUESSWORK.
          </h2>
          <p className="section-lead-paragraph">
            Saarthi does not use generative AI to guess who qualifies for government welfare. Every decision is computed deterministically against codified gazette rules, producing an explainable audit trail for citizens and administrators.
          </p>
        </div>

        {/* Core Principle Banner */}
        <div className="engine-principle-banner">
          <div className="principle-banner-inner">
            <div className="principle-badge">CORE ARCHITECTURAL PRINCIPLE</div>
            <div className="principle-slogan">
              <span className="slogan-ai">AI assists with natural discovery and document clarity.</span>
              <span className="slogan-rule">Verified statutory rules remain authoritative for eligibility.</span>
            </div>
          </div>
        </div>

        {/* Architectural Flow Diagram */}
        <div className="engine-pipeline-diagram" aria-label="Rule Engine Architecture Flow">
          <div className="diagram-node">
            <span className="d-step">INPUT</span>
            <span className="d-title">CITIZEN PROFILE</span>
            <span className="d-sub">Validated attributes</span>
          </div>
          <div className="diagram-connector">──▶</div>

          <div className="diagram-node node-highlight">
            <span className="d-step">CORE ENGINE</span>
            <span className="d-title">RULE ENGINE</span>
            <span className="d-sub">AST & Boolean solver</span>
          </div>
          <div className="diagram-connector">──▶</div>

          <div className="diagram-node">
            <span className="d-step">COMPUTATION</span>
            <span className="d-title">ELIGIBILITY MATRIX</span>
            <span className="d-sub">Deterministic verdict</span>
          </div>
          <div className="diagram-connector">──▶</div>

          <div className="diagram-node">
            <span className="d-step">AUDIT TRAIL</span>
            <span className="d-title">DECISION TRACE</span>
            <span className="d-sub">Clause-by-clause log</span>
          </div>
          <div className="diagram-connector">──▶</div>

          <div className="diagram-node node-success">
            <span className="d-step">OUTPUT</span>
            <span className="d-title">EXPLANATION</span>
            <span className="d-sub">Actionable transparency</span>
          </div>
        </div>

        {/* Verification Terminal & Inspector Card */}
        <div className="verification-terminal-card">
          {/* Terminal Titlebar */}
          <div className="terminal-titlebar">
            <div className="terminal-title-left">
              <span className="terminal-status-light light-green" />
              <span className="terminal-filename">saarthi://eligibility-engine/decision-trace/DEC-2026-TL-8402.trace</span>
            </div>
            <div className="terminal-tags">
              <span className="term-badge badge-rule">RULE v2.4 (GAZETTE VERIFIED)</span>
              <span className="term-badge badge-eval">DETERMINISTIC · 0% HALLUCINATION</span>
            </div>
          </div>

          <div className="terminal-body-grid">
            {/* Left: Summary Evaluation Card */}
            <div className="eval-summary-column">
              <div className="eval-result-badge-wrap">
                <span className="eval-verdict-tag">RESULT STATUS</span>
                <div className="eval-verdict-text">
                  <CheckCircle2 size={24} style={{ color: 'var(--ledger-green)' }} />
                  <span>ELIGIBLE</span>
                </div>
                <div className="eval-meta-id">
                  <span>DECISION ID:</span>
                  <code>DEC-2026-TL-8402</code>
                </div>
              </div>

              <div className="eval-checklist-box">
                <div className="box-header">STATUTORY CLAUSE EVALUATION</div>
                <div className="clause-item passed">
                  <div className="clause-indicator">✓</div>
                  <div className="clause-body">
                    <span className="clause-name">Age Requirement</span>
                    <span className="clause-eval">Age 24 falls within statutory [18, 28] window</span>
                  </div>
                </div>

                <div className="clause-item passed">
                  <div className="clause-indicator">✓</div>
                  <div className="clause-body">
                    <span className="clause-name">Income Requirement</span>
                    <span className="clause-eval">Annual ₹1,80,000 ≤ statutory ₹2,50,000 ceiling</span>
                  </div>
                </div>

                <div className="clause-item passed">
                  <div className="clause-indicator">✓</div>
                  <div className="clause-body">
                    <span className="clause-name">Domicile & Residence</span>
                    <span className="clause-eval">Resident in Telangana confirmed via domicile record</span>
                  </div>
                </div>

                <div className="clause-item passed">
                  <div className="clause-indicator">✓</div>
                  <div className="clause-body">
                    <span className="clause-name">Enrollment Status</span>
                    <span className="clause-eval">Full-time post-graduate course at recognized university</span>
                  </div>
                </div>

                <div className="clause-item warning">
                  <div className="clause-indicator">◐</div>
                  <div className="clause-body">
                    <span className="clause-name">Supporting Proofs</span>
                    <span className="clause-eval">Identity & Income verified; Bonafide proof pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Deep "WHY?" Decision Trace Inspector */}
            <div className="eval-trace-column">
              <div className="trace-header-row">
                <div className="trace-heading-group">
                  <Terminal size={17} style={{ color: 'var(--brass-gold)' }} />
                  <span className="trace-heading-title">DECISION REASONING TRACE</span>
                </div>
                <span className="trace-notice">Auditable JSON AST Evaluation</span>
              </div>

              <div className="trace-code-viewport">
                <pre className="trace-code-block">
{`{
  "decisionId": "DEC-2026-TL-8402",
  "schemeId": "SCH-EDU-POSTMATRIC-2026",
  "schemeName": "National Post-Matric Scholarship",
  "evaluationTimestamp": "2026-09-24T10:48:22Z",
  "ruleVersion": "v2.4",
  "provenanceGazette": "Ministry of Social Justice Notification 14/2025",
  "authoritativeEngine": "DeterministicBooleanEngine_v2",
  "verdict": "ELIGIBLE",
  "clauses": [
    {
      "clauseId": "SEC_3_AGE_LIMIT",
      "expression": "citizen.age >= 18 && citizen.age <= 28",
      "parameters": { "citizen.age": 24 },
      "evaluation": "PASSED"
    },
    {
      "clauseId": "SEC_4_INCOME_CEILING",
      "expression": "citizen.householdIncome <= 250000",
      "parameters": { "citizen.householdIncome": 180000 },
      "evaluation": "PASSED"
    },
    {
      "clauseId": "SEC_7_STATE_DOMICILE",
      "expression": "citizen.state == scheme.jurisdictionState || scheme.isPanIndia == true",
      "parameters": { "citizen.state": "Telangana", "isPanIndia": true },
      "evaluation": "PASSED"
    }
  ],
  "documentReadinessAudit": {
    "requiredCount": 5,
    "availableCount": 4,
    "missingDocuments": ["Current Academic Year Bonafide Certificate"],
    "readinessStatus": "READY_FOR_PREPARATION"
  }
}`}
                </pre>
              </div>

              {/* Takeaway statement */}
              <div className="trace-footer-banner">
                <strong>SAARTHI DOES NOT JUST TELL YOU WHAT MAY MATCH.</strong>
                <span> IT SHOWS YOU THE STATUTORY CLAUSES THAT VERIFY IT.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
