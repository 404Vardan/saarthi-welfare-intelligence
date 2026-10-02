import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

/**
 * SECTION 08 — FINAL CALL TO ACTION
 * Visual closure: Return to the connected, organized welfare network.
 * "WELFARE SHOULD NOT DEPEND ON KNOWING WHERE TO LOOK. SAARTHI MAKES THE CONNECTION."
 */

export default function FinalCTA() {
  return (
    <section className="final-cta-section-wrapper" aria-label="Begin using Saarthi">
      <div className="section-container">
        <div className="final-cta-billboard-card">
          {/* Subtle connected constellation background lines */}
          <div className="cta-connected-network-art" aria-hidden="true">
            <svg viewBox="0 0 800 240" fill="none" className="cta-svg-network">
              <path d="M 50 120 Q 200 40 400 120 T 750 120" stroke="rgba(196,162,82,0.18)" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 100 180 Q 300 220 500 120 T 700 80" stroke="rgba(31,122,77,0.2)" strokeWidth="1.5" />
              <circle cx="400" cy="120" r="8" fill="#0B1F3A" stroke="#C4A252" strokeWidth="2" />
              <circle cx="200" cy="80" r="5" fill="#1F7A4D" />
              <circle cx="600" cy="120" r="5" fill="#1F7A4D" />
              <circle cx="300" cy="170" r="4" fill="#C4A252" />
              <circle cx="500" cy="70" r="4" fill="#C4A252" />
            </svg>
          </div>

          <div className="cta-content-inner">
            <div className="cta-brand-tag">
              <span className="cta-tag-dot" />
              <span>THE LIVING WELFARE NETWORK // CONNECTED & VERIFIED</span>
            </div>

            <h2 className="cta-main-title">
              WELFARE SHOULD NOT DEPEND ON KNOWING WHERE TO LOOK.
            </h2>

            <p className="cta-secondary-title">
              SAARTHI MAKES THE CONNECTION.
            </p>

            <p className="cta-description">
              Start with your verified profile. Uncover every statutory scheme you qualify for, understand the exact legal clauses behind each match, and prepare your documents with zero bureaucratic guesswork.
            </p>

            {/* Action buttons */}
            <div className="cta-button-strip">
              <Link to="/citizen/login" className="btn-final-primary" id="final-cta-primary">
                <span>ENTER SAARTHI</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link to="/citizen/explorer" className="btn-final-secondary" id="final-cta-secondary">
                <Compass size={18} aria-hidden="true" />
                <span>EXPLORE SCHEMES</span>
              </Link>
            </div>

            {/* Trust & Provenance Checklist */}
            <div className="cta-trust-row">
              <div className="cta-trust-item">
                <CheckCircle2 size={14} style={{ color: 'var(--ledger-green)' }} />
                <span>Zero Hallucination Eligibility</span>
              </div>
              <div className="cta-trust-item">
                <CheckCircle2 size={14} style={{ color: 'var(--ledger-green)' }} />
                <span>Encrypted Citizen Vault</span>
              </div>
              <div className="cta-trust-item">
                <CheckCircle2 size={14} style={{ color: 'var(--ledger-green)' }} />
                <span>Official Government Portal Redirection</span>
              </div>
            </div>

            {/* Sub-system signature */}
            <div className="cta-system-signoff">
              <span>SAARTHI · A citizen-facing welfare intelligence layer of NWIS (National Welfare Intelligence System)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
