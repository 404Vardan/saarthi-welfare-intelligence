import React, { useState } from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  Scale, 
  Files, 
  ExternalLink, 
  Coins, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

/**
 * SECTION 02 — THE PROBLEM
 * "WELFARE IS EVERYWHERE. DISCOVERY IS NOT."
 * Communicates structural fragmentation across departments, schemes, eligibility rules, documents, and portals.
 */

const FRAGMENTED_SILOS = [
  {
    id: 'departments',
    title: 'DEPARTMENTS',
    icon: Building2,
    issue: 'Administrative Silos',
    desc: 'Each ministry and state directorate operates separate welfare guidelines, circulars, and independent notifications.',
    status: 'Isolated Mandates'
  },
  {
    id: 'schemes',
    title: 'SCHEMES',
    icon: FileSpreadsheet,
    issue: 'Dispersed Catalogues',
    desc: 'Hundreds of central, centrally-sponsored, and state-specific schemes with overlapping criteria and varying lifecycles.',
    status: 'Scattered Rules'
  },
  {
    id: 'eligibility',
    title: 'ELIGIBILITY',
    icon: Scale,
    issue: 'Complex Clauses',
    desc: 'Stringent age bands, income ceilings, landholding thresholds, and category definitions buried in bureaucratic legal jargon.',
    status: 'Opaque Conditions'
  },
  {
    id: 'documents',
    title: 'DOCUMENTS',
    icon: Files,
    issue: 'Unclear Proofs',
    desc: 'Different departments require different proofs—tehsildar certificates, land records, domicile papers—with little advance notice.',
    status: 'Late Rejections'
  },
  {
    id: 'channels',
    title: 'APPLICATION',
    icon: ExternalLink,
    issue: 'Multi-Portal Friction',
    desc: 'Applications require navigating fragmented state portals, Common Service Centres, or department counters.',
    status: 'Procedural Drop-Off'
  },
  {
    id: 'benefits',
    title: 'BENEFIT',
    icon: Coins,
    issue: 'Delayed Entitlement',
    desc: 'Without end-to-end guidance, eligible families fail to claim direct benefit transfers (DBT) they legally qualify for.',
    status: 'Unclaimed Welfare'
  }
];

export default function ProblemSection() {
  const [selectedSilo, setSelectedSilo] = useState('eligibility');

  const activeSilo = FRAGMENTED_SILOS.find((s) => s.id === selectedSilo) || FRAGMENTED_SILOS[2];

  return (
    <section className="problem-section-wrapper" id="problem" aria-label="The Welfare Discovery Problem">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-centered">
          <div className="section-eyebrow">
            <span>SECTION 02 // THE DISCOVERY GAP</span>
          </div>
          <h2 className="section-heading-primary">
            WELFARE IS EVERYWHERE. DISCOVERY IS NOT.
          </h2>
          <p className="section-lead-paragraph">
            The information exists. The connection is difficult. Citizens often have to navigate different schemes, eligibility conditions, documents, and application channels without knowing which path is relevant to them.
          </p>
        </div>

        {/* Visual Fragmentation Ecosystem Map */}
        <div className="fragmentation-architecture-card">
          <div className="fragmentation-top-bar">
            <div className="frag-bar-left">
              <AlertCircle size={15} style={{ color: 'var(--seal-vermillion)' }} />
              <span className="frag-bar-title">THE FRAGMENTED WELFARE ECOSYSTEM // DISCONNECTED REALITY</span>
            </div>
            <div className="frag-bar-right">
              <span>ZERO CENTRALIZED TRACEABILITY</span>
            </div>
          </div>

          {/* Interactive Silo Row */}
          <div className="silos-horizontal-grid" role="tablist" aria-label="Welfare Silos">
            {FRAGMENTED_SILOS.map((silo, index) => {
              const Icon = silo.icon;
              const isSelected = selectedSilo === silo.id;
              return (
                <div key={silo.id} className="silo-node-wrapper">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`silo-node-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedSilo(silo.id)}
                  >
                    <div className="silo-icon-box">
                      <Icon size={20} />
                    </div>
                    <div className="silo-node-name">{silo.title}</div>
                    <div className="silo-node-issue">{silo.issue}</div>
                    <span className="silo-status-pill">{silo.status}</span>
                  </button>

                  {/* Disconnection marker between cards */}
                  {index < FRAGMENTED_SILOS.length - 1 && (
                    <div className="silo-gap-connector" aria-hidden="true">
                      <div className="gap-line" />
                      <div className="gap-break-symbol">⚡</div>
                      <div className="gap-line" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector Box */}
          <div className="fragmentation-detail-panel">
            <div className="detail-panel-grid">
              <div className="detail-panel-left">
                <div className="detail-kicker">INSPECTING FRICTION POINT:</div>
                <h3 className="detail-title">{activeSilo.title} — {activeSilo.issue}</h3>
                <p className="detail-desc">{activeSilo.desc}</p>
              </div>

              <div className="detail-panel-right">
                <div className="detail-insight-box">
                  <div className="insight-label">THE CITIZEN REALITY:</div>
                  <div className="insight-quote">
                    "Citizens spend weeks visiting multiple offices or asking local intermediaries, often learning about an eligibility disqualifier only at the final submission counter."
                  </div>
                  <div className="insight-solution-hook">
                    <span>How Saarthi solves this →</span>
                    <strong>Structured deterministic rule evaluation before application.</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Core Contrast Bar */}
        <div className="problem-contrast-banner">
          <div className="contrast-item">
            <span className="contrast-tag tag-traditional">WITHOUT SAARTHI</span>
            <div className="contrast-text">
              Guessing scheme names · Navigating 20+ portal circulars · Discovering missing documents post-rejection
            </div>
          </div>
          <div className="contrast-divider" />
          <div className="contrast-item">
            <span className="contrast-tag tag-saarthi">WITH SAARTHI</span>
            <div className="contrast-text">
              Profile-first discovery · Explainable rule verification · Pre-application document readiness checklist
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
