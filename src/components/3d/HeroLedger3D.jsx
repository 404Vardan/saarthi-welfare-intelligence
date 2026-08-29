import React, { useState, useRef } from 'react';

export default function HeroLedger3D({ activeProfile, stampKey }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Damped 3–5° tilt
    const rotateX = -(y / (rect.height / 2)) * 4.5;
    const rotateY = (x / (rect.width / 2)) * 4.5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="hero-3d-scene-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="hero-physical-ledger"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
        }}
      >
        {/* Brass binder eyelet */}
        <div className="ledger-binder-eyelet" title="Official Binding Fastener"></div>

        {/* Ledger Header */}
        <div className="ledger-card-header" style={{ paddingLeft: '24px' }}>
          <div>
            <div className="ledger-card-title">National Welfare Register</div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--slate)', marginTop: '2px' }}>
              SAARTHI PROFILE LEDGER // 2026
            </div>
          </div>
          <div className="ledger-reg-id">SAARTHI-2026-000482</div>
        </div>

        {/* Beneficiary Profile Matrix */}
        <div className="ledger-section-title">Beneficiary Matrix</div>
        <div className="ledger-profile-grid">
          <div>
            <div className="ledger-field-label">Occupation</div>
            <div className="ledger-field-val">
              {activeProfile?.occupation?.toUpperCase() || 'FARMER'}
            </div>
          </div>
          <div>
            <div className="ledger-field-label">State</div>
            <div className="ledger-field-val">
              {activeProfile?.state?.toUpperCase() || 'GUJARAT'}
            </div>
          </div>
          <div>
            <div className="ledger-field-label">Income Slab</div>
            <div className="ledger-field-val">
              {activeProfile?.income || '₹1,80,000'}
            </div>
          </div>
        </div>

        {/* Matched Programmes */}
        <div className="ledger-section-title">Verified Matching Programmes</div>
        <div className="ledger-schemes-list">
          <div className="ledger-scheme-row">
            <div>
              <div className="ledger-scheme-name">PM-KISAN (Samman Nidhi)</div>
              <div className="ledger-scheme-benefit">₹6,000 / year in 3 direct DBT transfers</div>
            </div>
            <div className="ledger-scheme-match">✓ 96%</div>
          </div>

          <div className="ledger-scheme-row">
            <div>
              <div className="ledger-scheme-name">Pradhan Mantri Fasal Bima</div>
              <div className="ledger-scheme-benefit">Comprehensive subsidized crop loss cover</div>
            </div>
            <div className="ledger-scheme-match">✓ 91%</div>
          </div>

          <div className="ledger-scheme-row">
            <div>
              <div className="ledger-scheme-name">Kisan Credit Card (KCC)</div>
              <div className="ledger-scheme-benefit">Revolving credit up to ₹3,00,000 @ 4%</div>
            </div>
            <div className="ledger-scheme-match" style={{ color: 'var(--brass-gold)' }}>◐ 74%</div>
          </div>

          <div className="ledger-scheme-row">
            <div>
              <div className="ledger-scheme-name">PM Surya Ghar Yojana</div>
              <div className="ledger-scheme-benefit">Rooftop solar capital subsidy</div>
            </div>
            <div className="ledger-scheme-match">✓ 88%</div>
          </div>
        </div>

        {/* Bottom Relationship Map line */}
        <div style={{ fontSize: '11px', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
          <span>Provenance trail:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-navy)', fontWeight: 600 }}>
            Profile → Eligibility → Proof → Disbursement
          </span>
        </div>

        {/* Authentic 3D Rubber Stamp */}
        <div key={stampKey} className="realistic-rubber-stamp">
          <div className="stamp-inner-ring">
            <span className="stamp-text-small">GOVT OF INDIA</span>
            <span className="stamp-text-large">VERIFIED</span>
            <span className="stamp-text-small">RULE v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
