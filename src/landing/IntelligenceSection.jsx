import React, { useState } from 'react';
import { 
  User, 
  Cpu, 
  Scale, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

/**
 * SECTION 03 — THE SAARTHI DIFFERENCE
 * "FROM FRAGMENTED INFORMATION TO PERSONALIZED WELFARE INTELLIGENCE."
 * Demonstrates the structural reorganization of welfare data around an illustrative citizen profile.
 */

const DEMO_PERSONAS = {
  student: {
    id: 'student',
    title: 'Student (Higher Education)',
    icon: '🎓',
    attributes: {
      age: 24,
      location: 'Telangana',
      occupation: 'Post-Graduate Student',
      income: '₹1,80,000 / year',
      category: 'General / EWS'
    },
    matchedCount: 4,
    topSchemes: [
      {
        name: 'National Post-Matric Scholarship',
        type: 'Education Support',
        benefit: 'Tuition support + monthly maintenance allowance',
        fit: '98% Deterministic Match',
        keyClause: 'Income ceiling ≤ ₹2.5L · Full-time accredited enrolment'
      },
      {
        name: 'State Epas Higher Studies Grant',
        type: 'State Welfare',
        benefit: 'Post-graduate fee reimbursement',
        fit: '92% Deterministic Match',
        keyClause: 'Telangana domicile confirmed · Zero institutional arrears'
      },
      {
        name: 'National Digital Skill Stipend',
        type: 'Skill Training',
        benefit: 'Free certification voucher + device subsidy',
        fit: '88% Deterministic Match',
        keyClause: 'Age 18-28 · Enrolled in recognized STEM course'
      }
    ],
    readiness: '4 / 5 Documents Verified',
    nextAction: 'Obtain current college bonafide certificate'
  },
  farmer: {
    id: 'farmer',
    title: 'Small Farmer (Landowner)',
    icon: '🌾',
    attributes: {
      age: 46,
      location: 'Gujarat',
      occupation: 'Agricultural Cultivator',
      income: '₹1,60,000 / year',
      category: 'OBC · 3.2 Acres Cultivable Land'
    },
    matchedCount: 5,
    topSchemes: [
      {
        name: 'PM-KISAN (Samman Nidhi)',
        type: 'Income Support',
        benefit: '₹6,000 per year via three direct DBT tranches',
        fit: '100% Deterministic Match',
        keyClause: 'Landholding ≤ 5 acres · Aadhaar-seeded bank account'
      },
      {
        name: 'Pradhan Mantri Fasal Bima Yojana',
        type: 'Crop Protection',
        benefit: 'Comprehensive seasonal yield loss cover',
        fit: '94% Deterministic Match',
        keyClause: 'Notified crop sown in current season · 7/12 RoR attached'
      },
      {
        name: 'Kisan Credit Card (Concessional)',
        type: 'Credit Support',
        benefit: 'Revolving working capital credit @ 4% net interest',
        fit: '89% Deterministic Match',
        keyClause: 'Active land title · Satisfactory credit history'
      }
    ],
    readiness: '3 / 4 Documents Verified',
    nextAction: 'Obtain certified 7/12 land record mutation copy'
  },
  artisan: {
    id: 'artisan',
    title: 'Traditional Artisan / Carpenter',
    icon: '🪵',
    attributes: {
      age: 38,
      location: 'Rajasthan',
      occupation: 'Self-employed Woodcraft Artisan',
      income: '₹1,20,000 / year',
      category: 'Artisan / Vishwakarma Class'
    },
    matchedCount: 4,
    topSchemes: [
      {
        name: 'PM Vishwakarma Scheme',
        type: 'Enterprise & Skill',
        benefit: '₹15,000 toolkit incentive + ₹3L collateral-free credit @ 5%',
        fit: '96% Deterministic Match',
        keyClause: 'Traditional trade verification · Gram Panchayat endorsement'
      },
      {
        name: 'Ayushman Bharat (PM-JAY)',
        type: 'Healthcare',
        benefit: '₹5,00,000 annual secondary & tertiary health cover',
        fit: '92% Deterministic Match',
        keyClause: 'SECC occupational criteria match · Deprivation index'
      },
      {
        name: 'Pradhan Mantri Mudra Yojana (Shishu)',
        type: 'Micro-Credit',
        benefit: 'Up to ₹50,000 working capital loan without collateral',
        fit: '90% Deterministic Match',
        keyClause: 'Active workshop unit · Proof of business identity'
      }
    ],
    readiness: '3 / 4 Documents Verified',
    nextAction: 'Gram Panchayat artisan trade endorsement form'
  },
  senior: {
    id: 'senior',
    title: 'Senior Citizen (Pensioner)',
    icon: '👵',
    attributes: {
      age: 67,
      location: 'Bihar',
      occupation: 'Retired Agricultural Worker',
      income: '₹85,000 / year',
      category: 'BPL Card Holder'
    },
    matchedCount: 4,
    topSchemes: [
      {
        name: 'Indira Gandhi National Old Age Pension (IGNOAPS)',
        type: 'Social Security',
        benefit: 'Direct monthly pension deposited to DBT bank account',
        fit: '98% Deterministic Match',
        keyClause: 'Age ≥ 60 years · Verified BPL family status'
      },
      {
        name: 'Ayushman Bharat Senior Extension',
        type: 'Healthcare',
        benefit: '₹5,00,000 top-up cashless hospital cover',
        fit: '95% Deterministic Match',
        keyClause: 'Senior age verification · Universal coverage tier'
      },
      {
        name: 'Rashtriya Vayoshri Yojana',
        type: 'Assisted Living',
        benefit: 'Free physical aids and assisted-living mobility devices',
        fit: '87% Deterministic Match',
        keyClause: 'Medical assessment certificate · Senior citizen proof'
      }
    ],
    readiness: '4 / 4 Documents Verified',
    nextAction: 'Ready to submit on official state social welfare portal'
  }
};

const PIPELINE_STAGES = [
  { label: 'CITIZEN PROFILE', desc: 'Verified attributes' },
  { label: 'WELFARE INTELLIGENCE', desc: 'Rules & relations' },
  { label: 'ELIGIBILITY ANALYSIS', desc: 'Deterministic check' },
  { label: 'MATCHED SCHEMES', desc: 'High-fit entitlements' },
  { label: 'DOCUMENT READINESS', desc: 'Audit before apply' },
  { label: 'APPLICATION GUIDANCE', desc: 'Official portal link' }
];

export default function IntelligenceSection() {
  const [activePersonaKey, setActivePersonaKey] = useState('student');
  const persona = DEMO_PERSONAS[activePersonaKey] || DEMO_PERSONAS.student;

  return (
    <section className="intelligence-section-wrapper" id="how-it-works" aria-label="The Saarthi Intelligence Pipeline">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-centered">
          <div className="section-eyebrow">
            <span>SECTION 03 // THE SAARTHI TRANSFORMATION</span>
          </div>
          <h2 className="section-heading-primary">
            FROM FRAGMENTED INFORMATION TO PERSONALIZED WELFARE INTELLIGENCE.
          </h2>
          <p className="section-lead-paragraph">
            Saarthi reorganizes the welfare ecosystem around the individual citizen. Instead of searching through endless catalogues, your attributes connect to verified statutory criteria in real time.
          </p>
        </div>

        {/* The 6-Stage Transformation Pipeline Bar */}
        <div className="transformation-pipeline-strip" aria-label="Transformation sequence">
          {PIPELINE_STAGES.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              <div className="pipe-stage-block">
                <span className="pipe-stage-num">0{idx + 1}</span>
                <span className="pipe-stage-title">{stage.label}</span>
                <span className="pipe-stage-sub">{stage.desc}</span>
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="pipe-stage-arrow" aria-hidden="true">
                  <ChevronRight size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Demo Persona Switcher Bar */}
        <div className="persona-switch-bar">
          <div className="persona-bar-header">
            <span className="persona-bar-label">SELECT DEMO PERSONA FOR EVALUATION:</span>
            <span className="demo-data-badge">DEMO DATA · ILLUSTRATIVE PROFILES</span>
          </div>
          <div className="persona-pill-group" role="tablist">
            {Object.values(DEMO_PERSONAS).map((p) => {
              const isSelected = activePersonaKey === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`persona-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActivePersonaKey(p.id)}
                >
                  <span className="persona-btn-icon">{p.icon}</span>
                  <span className="persona-btn-title">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Reorganized Intelligence Viewport */}
        <div className="intelligence-viewport-grid">
          {/* Left Column: Sample Profile Dossier */}
          <div className="profile-dossier-card">
            <div className="dossier-top-badge">
              <span>ILLUSTRATIVE CITIZEN DOSSIER</span>
              <span className="badge-demo-tag">DEMO</span>
            </div>

            <div className="dossier-user-header">
              <div className="dossier-avatar">
                <User size={24} style={{ color: 'var(--ink-navy)' }} />
              </div>
              <div>
                <h3 className="dossier-name">{persona.title}</h3>
                <span className="dossier-loc">Primary Domicile: {persona.attributes.location}</span>
              </div>
            </div>

            {/* Profile Attributes Table */}
            <div className="dossier-attributes-grid">
              <div className="attr-field">
                <span className="attr-label">Age</span>
                <span className="attr-value">{persona.attributes.age} Years</span>
              </div>
              <div className="attr-field">
                <span className="attr-label">Location / State</span>
                <span className="attr-value">{persona.attributes.location}</span>
              </div>
              <div className="attr-field">
                <span className="attr-label">Occupation</span>
                <span className="attr-value">{persona.attributes.occupation}</span>
              </div>
              <div className="attr-field">
                <span className="attr-label">Household Income</span>
                <span className="attr-value">{persona.attributes.income}</span>
              </div>
              <div className="attr-field full-span">
                <span className="attr-label">Social / Economic Category</span>
                <span className="attr-value">{persona.attributes.category}</span>
              </div>
            </div>

            <div className="dossier-system-note">
              <ShieldCheck size={14} style={{ color: 'var(--brass-gold)', flexShrink: 0 }} />
              <span>Attributes evaluated deterministically against versioned central & state welfare rules.</span>
            </div>
          </div>

          {/* Right Column: Synthesized Intelligence & Scheme Matches */}
          <div className="intelligence-output-card">
            <div className="output-header-bar">
              <div className="output-stats-cluster">
                <span className="output-count">{persona.matchedCount}</span>
                <span className="output-label">VERIFIED PROGRAMMES IDENTIFIED</span>
              </div>
              <div className="output-readiness-pill">
                <FileCheck2 size={14} />
                <span>{persona.readiness}</span>
              </div>
            </div>

            {/* Scheme Cards Stream */}
            <div className="matched-schemes-stream">
              {persona.topSchemes.map((scheme, idx) => (
                <div key={idx} className="scheme-stream-card">
                  <div className="scheme-card-top">
                    <div>
                      <span className="scheme-type-tag">{scheme.type}</span>
                      <h4 className="scheme-card-name">{scheme.name}</h4>
                    </div>
                    <span className="scheme-match-badge">
                      <CheckCircle2 size={13} />
                      {scheme.fit}
                    </span>
                  </div>

                  <p className="scheme-card-benefit">{scheme.benefit}</p>

                  <div className="scheme-rule-provenance">
                    <span className="rule-label">VERIFIED CLAUSE:</span>
                    <span className="rule-text">{scheme.keyClause}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Action Callout */}
            <div className="action-recommendation-bar">
              <div className="action-rec-content">
                <span className="action-rec-kicker">RECOMMENDED NEXT STEP:</span>
                <span className="action-rec-desc">{persona.nextAction}</span>
              </div>
              <a href="#action-journey" className="action-rec-btn">
                <span>View Action Plan</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
