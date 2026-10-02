import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  FileCheck2, 
  Send, 
  Activity, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText
} from 'lucide-react';

/**
 * SECTION 05 — FROM DISCOVERY TO ACTION
 * & SECTION 06 — DOCUMENT READINESS
 * 
 * Journey: DISCOVER → UNDERSTAND → PREPARE → APPLY → TRACK
 * Concept: "ELIGIBLE DOES NOT NECESSARILY MEAN READY."
 * Saarthi turns complex eligibility conditions into an actionable checklist.
 */

const JOURNEY_STEPS = [
  {
    step: '01',
    id: 'discover',
    name: 'DISCOVER',
    icon: Compass,
    headline: 'Unified Entitlement Discovery',
    detail: 'Profile-driven matching finds schemes across central ministries and state directorates without needing to search multiple portals.'
  },
  {
    step: '02',
    id: 'understand',
    name: 'UNDERSTAND',
    icon: BookOpen,
    headline: 'Plain-Language Explanations',
    detail: 'Complex statutory legal jargon is broken down into simple, transparent criteria and actionable benefit breakdowns.'
  },
  {
    step: '03',
    id: 'prepare',
    name: 'PREPARE',
    icon: FileCheck2,
    headline: 'Pre-Submission Document Audit',
    detail: 'Saarthi evaluates your uploaded records against mandatory verification guidelines to identify missing proofs before you apply.'
  },
  {
    step: '04',
    id: 'apply',
    name: 'APPLY',
    icon: Send,
    headline: 'Direct Official Portal Guidance',
    detail: 'Saarthi guides you directly to the verified government portal with pre-organized document packages ready for upload.'
  },
  {
    step: '05',
    id: 'track',
    name: 'TRACK',
    icon: Activity,
    headline: 'End-to-End Application Ledger',
    detail: 'Log application reference numbers, track processing milestones, and receive notifications when renewal dates approach.'
  }
];

export default function ActionJourneySection() {
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(2); // 'PREPARE' active by default

  const currentJourney = JOURNEY_STEPS[activeJourneyIndex];

  return (
    <section className="action-journey-section-wrapper" id="action-journey" aria-label="From Discovery to Action">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-centered">
          <div className="section-eyebrow">
            <span>SECTION 05 & 06 // FROM DISCOVERY TO ACTION</span>
          </div>
          <h2 className="section-heading-primary">
            KNOWING YOU QUALIFY IS ONLY THE BEGINNING.
          </h2>
          <p className="section-lead-paragraph">
            Most government applications are delayed or rejected not because the citizen is ineligible, but because documents are missing or instructions are unclear. Saarthi turns passive eligibility into an actionable, completed application.
          </p>
        </div>

        {/* 5-Step Linear Journey Progression Navigation */}
        <div className="journey-stepper-bar" role="tablist" aria-label="Journey stages">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeJourneyIndex;
            const isCompleted = idx < activeJourneyIndex;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`journey-step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setActiveJourneyIndex(idx)}
              >
                <div className="step-btn-top">
                  <span className="step-num">{step.step}</span>
                  <div className="step-indicator-dot" />
                </div>
                <div className="step-btn-title">{step.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active Journey Stage Highlight Banner */}
        <div className="active-journey-banner">
          <div className="journey-banner-left">
            <span className="journey-stage-badge">CURRENT STAGE: {currentJourney.name}</span>
            <h3 className="journey-banner-title">{currentJourney.headline}</h3>
          </div>
          <p className="journey-banner-desc">{currentJourney.detail}</p>
        </div>

        {/* Two-Column Action Grid: Premium Scheme Card vs Document Readiness Locker */}
        <div className="action-interactive-grid">
          {/* Left Column: Premium Matched Scheme Card */}
          <div className="scheme-action-card">
            <div className="scheme-action-card-header">
              <div>
                <span className="demo-label-pill">DEMO DATA // ILLUSTRATIVE SCHEME</span>
                <h3 className="scheme-action-title">National Post-Matric Higher Education Scholarship</h3>
                <span className="scheme-ministry-tag">Ministry of Social Justice & Empowerment</span>
              </div>
              <div className="scheme-matched-badge">
                <CheckCircle2 size={16} />
                <span>MATCHED (98%)</span>
              </div>
            </div>

            {/* Why You Match Checklist */}
            <div className="action-card-section">
              <span className="card-section-label">WHY YOU MATCH STATUTORY CRITERIA:</span>
              <div className="criteria-checklist">
                <div className="criteria-row">
                  <span className="criteria-check">✓</span>
                  <span className="criteria-text"><strong>Income Criterion:</strong> Household income ₹1.8L is below ₹2.5L limit</span>
                </div>
                <div className="criteria-row">
                  <span className="criteria-check">✓</span>
                  <span className="criteria-text"><strong>Location Criterion:</strong> Domicile verified within Telangana jurisdiction</span>
                </div>
                <div className="criteria-row">
                  <span className="criteria-check">✓</span>
                  <span className="criteria-text"><strong>Academic Criterion:</strong> Admitted to accredited full-time PG curriculum</span>
                </div>
              </div>
            </div>

            {/* Document Readiness Gauge Bar */}
            <div className="action-card-section">
              <div className="gauge-header">
                <span className="card-section-label">DOCUMENT READINESS SCORE:</span>
                <span className="gauge-score">4 / 5 PROOFS READY (80%)</span>
              </div>
              <div className="gauge-progress-track">
                <div className="gauge-progress-fill" style={{ width: '80%' }} />
              </div>
              <div className="gauge-caption">
                <AlertCircle size={13} style={{ color: 'var(--brass-gold)' }} />
                <span>1 missing certificate required before official portal submission.</span>
              </div>
            </div>

            {/* Next Step & Official Government Portal Button */}
            <div className="scheme-action-footer">
              <div className="next-action-info">
                <span className="next-action-kicker">NEXT STEP:</span>
                <span className="next-action-val">Obtain certified College Bonafide Certificate</span>
              </div>

              <div className="portal-cta-wrap">
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-official-portal"
                >
                  <span>OFFICIAL PORTAL</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {/* Crucial Institutional Disclaimer */}
            <div className="portal-disclaimer-note">
              <ShieldCheck size={14} style={{ color: 'var(--brass-gold)', flexShrink: 0 }} />
              <span>Application continues on the official government portal. Saarthi provides readiness auditing and verification guidance.</span>
            </div>
          </div>

          {/* Right Column: SECTION 06 — Document Readiness Module */}
          <div className="document-readiness-card">
            <div className="readiness-card-header">
              <div>
                <span className="readiness-kicker">SECTION 06 // DOCUMENT READINESS</span>
                <h3 className="readiness-title">ELIGIBLE DOES NOT MEAN READY.</h3>
              </div>
              <div className="readiness-score-box">
                <div className="score-num">3 / 4</div>
                <div className="score-sub">PROOFS</div>
              </div>
            </div>

            <p className="readiness-desc">
              Saarthi audits your documents against departmental checklist rules so you know what is ready, what is expired, and what needs issuance.
            </p>

            {/* Interactive Document Checklist */}
            <div className="document-checklist-stack">
              <div className="doc-check-row ready">
                <div className="doc-status-icon">✓</div>
                <div className="doc-info">
                  <div className="doc-name">Aadhaar Card (e-KYC Verified)</div>
                  <div className="doc-sub">DBT active · Mobile linked · UIDAI verified</div>
                </div>
                <span className="doc-pill ready-pill">READY</span>
              </div>

              <div className="doc-check-row ready">
                <div className="doc-status-icon">✓</div>
                <div className="doc-info">
                  <div className="doc-name">Annual Income Certificate</div>
                  <div className="doc-sub">Tehsildar issued · Valid through March 2027</div>
                </div>
                <span className="doc-pill ready-pill">READY</span>
              </div>

              <div className="doc-check-row ready">
                <div className="doc-status-icon">✓</div>
                <div className="doc-info">
                  <div className="doc-name">State Domicile / Residence Proof</div>
                  <div className="doc-sub">MeeSeva / Revenue record confirmed</div>
                </div>
                <span className="doc-pill ready-pill">READY</span>
              </div>

              <div className="doc-check-row missing">
                <div className="doc-status-icon warning">○</div>
                <div className="doc-info">
                  <div className="doc-name">Institution Bonafide Certificate</div>
                  <div className="doc-sub">Pending upload from academic registrar</div>
                </div>
                <span className="doc-pill action-pill">ACTION NEEDED</span>
              </div>
            </div>

            {/* Action Advice Box */}
            <div className="readiness-action-box">
              <div className="action-box-icon">
                <FileText size={18} style={{ color: 'var(--seal-vermillion)' }} />
              </div>
              <div>
                <div className="action-box-title">NEXT ACTION: Upload College Bonafide</div>
                <div className="action-box-desc">
                  Download the official 1-page institution template directly from Saarthi's document guidance locker to get attested.
                </div>
              </div>
            </div>

            <div className="readiness-footer-quote">
              "Saarthi turns opaque administrative rejection risks into a clear, completed checklist."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
