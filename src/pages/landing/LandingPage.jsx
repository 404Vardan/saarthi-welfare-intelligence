import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroLedger3D from '../../components/3d/HeroLedger3D';
import ExtrudedMap3D from '../../components/3d/ExtrudedMap3D';

export default function LandingPage() {
  // 1. Hero interactive prompt state
  const promptData = {
    farmer: {
      occupation: 'Farmer',
      state: 'Gujarat',
      income: '₹1,80,000',
      profile: "✓ Farmer · Gujarat · ₹1,80,000 Annual Income · Landowner (3.5 acres)",
      matches: 6,
      preview: "PM-KISAN (₹6,000/yr), PM Fasal Bima (Crop Cover), Kisan Credit Card (₹3L @ 4%), PM Kusum (Solar Subsidy)...",
      url: "/citizen/explorer?type=direct_benefit"
    },
    artisan: {
      occupation: 'Artisan',
      state: 'Rajasthan',
      income: '₹1,20,000',
      profile: "✓ Artisan / Carpenter · Rajasthan · Self-employed · ₹1,20,000 Income",
      matches: 5,
      preview: "PM Vishwakarma (₹3L Loan + Toolkit), MUDRA Loan (Shishu), National Artisan Welfare Scheme...",
      url: "/citizen/explorer?type=skill_training"
    },
    student: {
      occupation: 'Student',
      state: 'Uttar Pradesh',
      income: '₹1,60,000',
      profile: "✓ Higher Secondary Student · SC Category · Uttar Pradesh · Household ₹1.6L",
      matches: 4,
      preview: "National Post-Matric Scholarship (Full Tuition + ₹1,200/mo), UP State Scholarship, Free Coaching Assistance...",
      url: "/citizen/explorer?type=direct_benefit"
    },
    senior: {
      occupation: 'Retired',
      state: 'Bihar',
      income: '₹90,000',
      profile: "✓ 64-Year-Old Retired Daily Wage Worker · BPL Card Holder · Bihar",
      matches: 5,
      preview: "Indira Gandhi National Old Age Pension (IGNOAPS), Ayushman Bharat (₹5 Lakh Insurance), NFBS...",
      url: "/citizen/explorer?type=pension"
    }
  };

  const [activePromptKey, setActivePromptKey] = useState('farmer');
  const [stampKey, setStampKey] = useState(1);

  const handlePersonaSelect = (key) => {
    setActivePromptKey(key);
    // Trigger stamp recoil thump animation!
    setStampKey(prev => prev + 1);
  };

  // 2. Welfare Graph state (Brass Pins & Inked Threads)
  const graphData = {
    farmer: {
      center: "FARMER (Landowning)",
      nodes: [
        { name: "PM-KISAN", benefit: "₹6,000/yr Direct Transfer", tag: "Cash Support" },
        { name: "PM Fasal Bima", benefit: "1.5-5% Premium Crop Insurance", tag: "Risk Cover" },
        { name: "Kisan Credit Card", benefit: "₹3,00,000 @ 4% Concessional Interest", tag: "Credit" },
        { name: "PM KUSUM", benefit: "60% Solar Pump Subsidy", tag: "Energy" }
      ]
    },
    artisan: {
      center: "TRADITIONAL ARTISAN",
      nodes: [
        { name: "PM Vishwakarma", benefit: "₹15,000 Toolkit + Skill Stipend", tag: "Training" },
        { name: "Vishwakarma Credit", benefit: "₹3,00,000 Collateral-Free @ 5%", tag: "Credit" },
        { name: "MUDRA Scheme", benefit: "Up to ₹10 Lakhs Business Expansion", tag: "Capital" },
        { name: "Ayushman Bharat", benefit: "₹5,00,000 Free Family Healthcare", tag: "Health" }
      ]
    },
    woman: {
      center: "RURAL WOMAN HOMEMAKER",
      nodes: [
        { name: "PM Ujjwala Yojana", benefit: "Free LPG Connection + Refill", tag: "Energy" },
        { name: "Sukanya Samriddhi", benefit: "8.2% Sovereign Interest for Daughter", tag: "Savings" },
        { name: "Stand-Up India", benefit: "₹10L - ₹1Cr SC/ST/Women Enterprise", tag: "Credit" },
        { name: "PMAY-Gramin", benefit: "₹1.2 - ₹1.5 Lakh Housing Subsidy", tag: "Shelter" }
      ]
    },
    senior: {
      center: "SENIOR CITIZEN (60+)",
      nodes: [
        { name: "IGNOAPS Pension", benefit: "Monthly Direct Pension Transfer", tag: "Social Security" },
        { name: "Atal Pension Yojana", benefit: "Guaranteed ₹1,000-₹5,000/mo", tag: "Retirement" },
        { name: "Ayushman PMJAY", benefit: "Complete Cashless Hospitalization", tag: "Health" },
        { name: "National Family Benefit", benefit: "Lump sum family bereavement aid", tag: "Support" }
      ]
    }
  };

  const [activePersona, setActivePersona] = useState('farmer');

  // 3. Policy Simulation Control Room state
  const [incomeThreshold, setIncomeThreshold] = useState(250000);
  const baseline = 200000;
  const diffRatio = (incomeThreshold - baseline) / baseline;
  const popDelta = (diffRatio * 36.8).toFixed(1);
  const benDelta = Math.round(diffRatio * 25680);
  const budgetDelta = (diffRatio * 15.4).toFixed(1);
  const sign = diffRatio >= 0 ? '+' : '';

  return (
    <div className="living-ledger-bg">
      {/* Registration Marks */}
      <div className="registration-mark top-left">+</div>
      <div className="registration-mark top-right">+</div>

      {/* ============================================================
           1. HERO SECTION — 3D LIVING WELFARE PASSPORT
           ============================================================ */}
      <section className="hero-wrapper">
        <div className="hero-inner">
          {/* Left Hero Typography */}
          <div className="hero-left">
            <h1 className="hero-main-title">
              The benefits meant for you shouldn't be this hard to find.
            </h1>
            <p className="hero-support-text">
              India has thousands of government welfare schemes. Saarthi connects your profile to the schemes you may be entitled to, explains every eligibility decision, and guides you from discovery to application.
            </p>

            <div className="hero-cta-strip">
              <Link to="/citizen/login" className="btn-hero-primary">
                Find My Schemes →
              </Link>
              <Link to="/citizen/login" className="btn-hero-secondary">
                Explore Schemes
              </Link>
            </div>

            {/* Metrics Strip */}
            <div className="hero-metrics-strip">
              <div className="hero-metric-item">
                <span className="hero-metric-num">15,000+*</span>
                <span className="hero-metric-label">Schemes & programmes</span>
              </div>
              <div className="hero-metric-item">
                <span className="hero-metric-num">Rule-Based</span>
                <span className="hero-metric-label">Verified eligibility criteria</span>
              </div>
              <div className="hero-metric-item">
                <span className="hero-metric-num">Personalized</span>
                <span className="hero-metric-label">Actionable step-by-step path</span>
              </div>
            </div>
            <div className="hero-coverage-note">
              *Catalogue coverage varies by state and source. Availability is continuously ingested and verified.
            </div>

            {/* Interactive Hero Prompt Box */}
            <div className="hero-interactive-box">
              <div className="hero-interactive-header">
                <span>✨ Try asking Saarthi (Select a Persona):</span>
              </div>
              <div className="hero-prompt-chips">
                <button
                  className={`prompt-chip ${activePromptKey === 'farmer' ? 'active' : ''}`}
                  onClick={() => handlePersonaSelect('farmer')}
                >
                  "I'm a farmer from Gujarat..."
                </button>
                <button
                  className={`prompt-chip ${activePromptKey === 'artisan' ? 'active' : ''}`}
                  onClick={() => handlePersonaSelect('artisan')}
                >
                  "Small artisan in Rajasthan..."
                </button>
                <button
                  className={`prompt-chip ${activePromptKey === 'student' ? 'active' : ''}`}
                  onClick={() => handlePersonaSelect('student')}
                >
                  "SC student in Uttar Pradesh..."
                </button>
                <button
                  className={`prompt-chip ${activePromptKey === 'senior' ? 'active' : ''}`}
                  onClick={() => handlePersonaSelect('senior')}
                >
                  "Senior citizen with BPL card..."
                </button>
              </div>

              {promptData[activePromptKey] && (
                <div className="hero-prompt-result">
                  <div style={{ color: 'var(--ink-navy)', lineHeight: 1.45 }}>
                    <strong>Profile understood:</strong> {promptData[activePromptKey].profile}
                    <div style={{ color: 'var(--slate)', fontSize: '12.5px', marginTop: '4px' }}>
                      {promptData[activePromptKey].preview}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #DDD6C6' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ledger-green)', fontFamily: 'var(--font-mono)' }}>
                      {promptData[activePromptKey].matches} potential matches found
                    </span>
                    <Link
                      to={promptData[activePromptKey].url}
                      style={{ color: 'var(--seal-vermillion)', fontWeight: 600, textDecoration: 'none', fontSize: '13.5px' }}
                    >
                      See full results →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Hero: 3D Living Physical Welfare Ledger Object */}
          <div className="hero-right">
            <HeroLedger3D
              activeProfile={promptData[activePromptKey]}
              stampKey={stampKey}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
           2. TRUST STRIP (Embossed Plate System)
           ============================================================ */}
      <section className="trust-strip-section">
        <div className="trust-strip-inner">
          <div className="trust-strip-headline">Built Around Verified Information</div>
          <div className="trust-pillars-grid">
            <div className="trust-pillar-card">
              <span className="trust-pillar-label">Eligibility decisions</span>
              <span className="trust-pillar-value">→ Rule-based evaluation</span>
            </div>
            <div className="trust-pillar-card">
              <span className="trust-pillar-label">AI assistance</span>
              <span className="trust-pillar-value">→ Clearly separated advisory</span>
            </div>
            <div className="trust-pillar-card">
              <span className="trust-pillar-label">Government analytics</span>
              <span className="trust-pillar-value">→ Anonymized aggregate data</span>
            </div>
            <div className="trust-pillar-card">
              <span className="trust-pillar-label">Personal data</span>
              <span className="trust-pillar-value">→ User-controlled & encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           3. THE HUMAN STORY (Meera) — Visual Branching Tree
           ============================================================ */}
      <section className="problem-story-section">
        <div className="problem-story-inner">
          <h2 className="story-heading">
            The problem isn't that benefits don't exist.
          </h2>

          <div className="story-narrative-card">
            <p className="story-text">
              <strong>Meet Meera.</strong><br />
              Meera is a 54-year-old tailor in Gujarat. She supports her household, has a modest annual income, and has never used a government welfare portal.
            </p>
            <p className="story-text">
              She may qualify for multiple central and state schemes. But she doesn't know their names. She doesn't know which documents she needs. And she doesn't know which one she should apply for first.
            </p>

            <div className="story-tree-visual">
              <div className="tree-root">Meera (54, Tailor, Gujarat)</div>
              <div>├── <span className="tree-highlight" style={{ color: 'var(--ledger-green)' }}>Eligible for 5 schemes</span> (Vishwakarma, PMJAY, Ujjwala, Pension, MUDRA)</div>
              <div>├── <span className="tree-highlight" style={{ color: 'var(--seal-vermillion)' }}>Knows about 0</span> official programs</div>
              <div>├── Missing 2 supporting documents (Income & Artisan cert)</div>
              <div>└── <span className="tree-highlight" style={{ color: 'var(--slate)' }}>Has never applied</span> due to procedural friction</div>
            </div>
          </div>

          <div className="statement-callout">
            "Saarthi exists between eligibility and access."
          </div>
        </div>
      </section>

      {/* ============================================================
           4. SCROLL-DRIVEN DOCUMENT DECONSTRUCTION (STEP 10)
           ============================================================ */}
      <section className="document-journey-section">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
            From Fragmented Information → One Connected Journey
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: 'var(--ink-navy)', margin: 0 }}>
            How The Dossiers Connect
          </h2>
        </div>

        <div className="document-stack-flow">
          <div className="dossier-slide-card">
            <div className="dossier-tab-tag">01 // DOSSIER</div>
            <div className="dossier-slide-title">Citizen Profile</div>
            <div className="dossier-slide-desc">Demographics, income, location & household composition securely recorded.</div>
          </div>

          <div className="dossier-slide-card">
            <div className="dossier-tab-tag">02 // CLAUSE</div>
            <div className="dossier-slide-title">Eligibility Engine</div>
            <div className="dossier-slide-desc">Deterministic rule evaluation against verified central and state gazettes.</div>
          </div>

          <div className="dossier-slide-card">
            <div className="dossier-tab-tag">03 // CATALOGUE</div>
            <div className="dossier-slide-title">Scheme Matches</div>
            <div className="dossier-slide-desc">Accurate match percentages and compounding entitlement opportunities.</div>
          </div>

          <div className="dossier-slide-card">
            <div className="dossier-tab-tag">04 // LOCKER</div>
            <div className="dossier-slide-title">Document Audit</div>
            <div className="dossier-slide-desc">Document readiness gauge and identification of missing proofs.</div>
          </div>

          <div className="dossier-slide-card" style={{ borderLeft: '3px solid var(--ledger-green)' }}>
            <div className="dossier-tab-tag" style={{ color: 'var(--ledger-green)' }}>05 // LEDGER</div>
            <div className="dossier-slide-title">Verified Benefit</div>
            <div className="dossier-slide-desc">End-to-end application guidance and direct DBT disbursement.</div>
          </div>
        </div>
      </section>

      {/* ============================================================
           5. SCHEME DOSSIER PANELS (WHY SAARTHI)
           ============================================================ */}
      <section className="editorial-panels-section">
        <div className="panels-container">
          
          {/* Dossier Panel 1: Explainable Eligibility */}
          <div className="dossier-file-panel">
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
                Explainable Eligibility
              </div>
              <h2 className="panel-title">Know why.</h2>
              <p className="panel-desc">
                We never give opaque "Yes/No" answers. Saarthi breaks down every government gazette clause into readable, verifiable criteria so you know exactly which rule passed, which missed, and why.
              </p>
            </div>
            <div className="panel-visual-box">
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink-navy)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6C6', paddingBottom: '8px' }}>
                <span>PM-KISAN Dossier Audit</span>
                <span style={{ color: 'var(--ledger-green)', fontFamily: 'var(--font-mono)' }}>100% MATCH</span>
              </div>
              <div className="checklist-item">
                <span className="checklist-check">✓</span>
                <span><strong>Income requirement:</strong> ₹1,80,000 ≤ ₹2,00,000 ceiling</span>
              </div>
              <div className="checklist-item">
                <span className="checklist-check">✓</span>
                <span><strong>Occupation:</strong> Small/Marginal Farmer confirmed</span>
              </div>
              <div className="checklist-item">
                <span className="checklist-check">✓</span>
                <span><strong>Landholding:</strong> Cultivable land below 5 acres</span>
              </div>
              <div className="checklist-item">
                <span className="checklist-check">✓</span>
                <span><strong>Bank Linkage:</strong> DBT-enabled active bank passbook</span>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <span className="ops-badge ops-badge-verified" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  VERIFIED ELIGIBLE · RULE v1.0
                </span>
              </div>
            </div>
          </div>

          {/* Dossier Panel 2: Document Readiness */}
          <div className="dossier-file-panel">
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
                Document Readiness
              </div>
              <h2 className="panel-title">Know what's missing.</h2>
              <p className="panel-desc">
                Rejection happens when paperwork is incomplete. Saarthi audits your document locker against the required proofs for all your matched schemes before you submit.
              </p>
            </div>
            <div className="panel-visual-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--slate)', textTransform: 'uppercase' }}>Application Readiness</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '30px', fontWeight: 700, color: 'var(--brass-gold)' }}>84%</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--seal-vermillion)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>2 documents needed</div>
              </div>
              <div className="checklist-item">
                <span style={{ color: 'var(--ledger-green)', fontWeight: 700 }}>✓</span>
                <span>Aadhaar Card (Verified e-KYC)</span>
              </div>
              <div className="checklist-item">
                <span style={{ color: 'var(--ledger-green)', fontWeight: 700 }}>✓</span>
                <span>Bank Passbook (Verified DBT)</span>
              </div>
              <div className="checklist-item" style={{ background: 'rgba(193,68,45,0.06)', padding: '8px 12px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--seal-vermillion)', fontWeight: 700 }}>→</span>
                <span><strong>Income Certificate:</strong> Tehsildar attestation required</span>
              </div>
              <div className="checklist-item" style={{ background: 'rgba(193,68,45,0.06)', padding: '8px 12px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--seal-vermillion)', fontWeight: 700 }}>→</span>
                <span><strong>Land Record (7/12 RoR):</strong> Certified mutation copy</span>
              </div>
            </div>
          </div>

          {/* Dossier Panel 3: Action Plan */}
          <div className="dossier-file-panel">
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
                Action Plan
              </div>
              <h2 className="panel-title">Know what comes next.</h2>
              <p className="panel-desc">
                A linear, prioritized sequence of actions. No bureaucratic confusion—just clear steps to unlock your entitlements.
              </p>
            </div>
            <div className="panel-visual-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderLeft: '3.5px solid var(--seal-vermillion)', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--seal-vermillion)', fontWeight: 700 }}>Today</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-navy)' }}>Upload Income Certificate to unlock 3 schemes</div>
                </div>
                <div style={{ borderLeft: '3.5px solid var(--brass-gold)', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--brass-gold)', fontWeight: 700 }}>Next</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-navy)' }}>Submit Direct Application for PM-KISAN (₹6,000/yr)</div>
                </div>
                <div style={{ borderLeft: '3.5px solid var(--slate)', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--slate)', fontWeight: 700 }}>After</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-navy)' }}>Complete biometric e-KYC for Ayushman Bharat Card</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
           6. 3D WELFARE GRAPH (BRASS PINS & INKED THREADS ON DOCKET BOARD)
           ============================================================ */}
      <section id="welfare-graph" className="welfare-graph-section">
        <div className="welfare-graph-inner">
          <h2 className="graph-heading">One benefit rarely exists alone.</h2>
          <p className="graph-subtext">
            Welfare programmes overlap. A citizen eligible for one programme may be relevant to several others. Saarthi maps these relationships to uncover compounding entitlements.
          </p>

          {/* Persona Selector Bar */}
          <div className="graph-persona-bar">
            <button
              className={`graph-persona-btn ${activePersona === 'farmer' ? 'active' : ''}`}
              onClick={() => setActivePersona('farmer')}
            >
              👨‍🌾 Farmer with Land
            </button>
            <button
              className={`graph-persona-btn ${activePersona === 'artisan' ? 'active' : ''}`}
              onClick={() => setActivePersona('artisan')}
            >
              🪵 Traditional Artisan
            </button>
            <button
              className={`graph-persona-btn ${activePersona === 'woman' ? 'active' : ''}`}
              onClick={() => setActivePersona('woman')}
            >
              👩 Rural Woman
            </button>
            <button
              className={`graph-persona-btn ${activePersona === 'senior' ? 'active' : ''}`}
              onClick={() => setActivePersona('senior')}
            >
              👴 Senior Citizen
            </button>
          </div>

          {/* 3D Pinned Docket Board */}
          <div className="graph-canvas-container">
            <div className="interactive-graph-nodes">
              <div className="graph-node-center">
                <div className="brass-pin-marker"></div>
                {graphData[activePersona].center}
              </div>

              <div className="graph-branches-row">
                {graphData[activePersona].nodes.map((node, i) => (
                  <div key={i} className="graph-leaf-node highlighted">
                    <div className="brass-pin-marker" style={{ top: '-7px' }}></div>
                    <div className="graph-leaf-name">{node.name}</div>
                    <div className="graph-leaf-benefit">{node.benefit}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                      ● {node.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           7. 3D EXTENDED INDIA MAP & GOVERNMENT GAP SECTION
           ============================================================ */}
      <section id="government" className="gov-gap-section">
        <div className="gov-gap-inner">
          <h2 className="gov-main-heading">
            For citizens, Saarthi finds opportunities.<br />
            For governments, it finds gaps.
          </h2>

          <div className="gov-gap-grid">
            {/* Left: 3D Topography Elevation Map */}
            <div>
              <ExtrudedMap3D />
            </div>

            {/* Right: Gap Analysis Breakdown */}
            <div className="gov-reasons-panel">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'white', marginBottom: '8px' }}>
                Why Are Legally Entitled Citizens Dropping Off?
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Saarthi identifies programmatic friction points in real-time across districts before application cycles close.
              </p>
              
              <div className="gov-reason-item">
                <div className="gov-reason-header">
                  <span>Missing Supporting Documentation</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>41%</span>
                </div>
                <div className="gov-reason-bar-bg">
                  <div className="gov-reason-bar-fill" style={{ width: '41%' }}></div>
                </div>
              </div>

              <div className="gov-reason-item">
                <div className="gov-reason-header">
                  <span>Information & Discovery Asymmetry</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>27%</span>
                </div>
                <div className="gov-reason-bar-bg">
                  <div className="gov-reason-bar-fill" style={{ width: '27%', background: 'var(--brass-gold)' }}></div>
                </div>
              </div>

              <div className="gov-reason-item">
                <div className="gov-reason-header">
                  <span>Complex Multi-Portal Filing</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>18%</span>
                </div>
                <div className="gov-reason-bar-bg">
                  <div className="gov-reason-bar-fill" style={{ width: '18%', background: 'var(--slate)' }}></div>
                </div>
              </div>

              <div className="gov-reason-item">
                <div className="gov-reason-header">
                  <span>Verification Delays & Logistics</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>14%</span>
                </div>
                <div className="gov-reason-bar-bg">
                  <div className="gov-reason-bar-fill" style={{ width: '14%', background: '#6c757d' }}></div>
                </div>
              </div>

              <div style={{ marginTop: '28px' }}>
                <Link to="/government/login" className="btn-hero-primary" style={{ display: 'inline-block' }}>
                  Explore Government Intelligence Console →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           8. POLICY CONTROL ROOM SIMULATION
           ============================================================ */}
      <section className="policy-sim-section">
        <div className="policy-sim-inner">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
              National Policy Lab
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--ink-navy)', margin: 0 }}>
              What happens if a policy changes?
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '16.5px', marginTop: '8px' }}>
              Administrators can simulate eligibility threshold revisions and instantly forecast budget and beneficiary impact across districts.
            </p>
          </div>

          <div className="policy-control-panel">
            <div className="control-panel-heading">
              <span>Policy Control Terminal // Simulation Mode</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--seal-vermillion)' }}>
                ₹{(incomeThreshold / 100000).toFixed(1)} Lakhs Threshold
              </span>
            </div>

            <div className="sim-slider-container">
              <input
                type="range"
                className="sim-slider"
                min="100000"
                max="500000"
                step="25000"
                value={incomeThreshold}
                onChange={(e) => setIncomeThreshold(parseInt(e.target.value, 10))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--slate)', marginTop: '10px' }}>
                <span>₹1.0L</span>
                <span>₹2.0L (National Baseline)</span>
                <span>₹3.0L</span>
                <span>₹4.0L</span>
                <span>₹5.0L</span>
              </div>
            </div>

            <div className="sim-results-grid">
              <div>
                <div className="sim-result-val">{sign}{popDelta}%</div>
                <div className="sim-result-label">Eligible Population</div>
              </div>
              <div>
                <div className="sim-result-val">{sign}{benDelta.toLocaleString('en-IN')}</div>
                <div className="sim-result-label">Projected Beneficiaries</div>
              </div>
              <div>
                <div className="sim-result-val">{sign}₹{budgetDelta} Cr</div>
                <div className="sim-result-label">Estimated Fiscal Outlay</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--slate)', textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
              *Illustrative simulation — calculated via deterministic rule engines over representative synthetic demographic micro-samples.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           9. TRUST & VERIFICATION PHILOSOPHY (3-TIER EXPLICIT STANDARDS)
           ============================================================ */}
      <section className="trust-philosophy-section">
        <div className="trust-phil-inner">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px auto' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--brass-gold)', marginBottom: '8px' }}>
              Accountability & Provenance
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--ink-navy)', margin: 0 }}>
              Not everything Saarthi says is equally authoritative.
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '16.5px', marginTop: '8px' }}>
              Most platforms blur the line between verified law and AI speculation. Saarthi makes the provenance of every data point explicit.
            </p>
          </div>

          <div className="trust-columns-grid">
            <div className="trust-col-card">
              <div className="trust-badge-large badge-verified-style">
                <span>🟢</span> VERIFIED
              </div>
              <p className="trust-col-desc">
                Evaluated strictly against published government gazettes, ministry notifications, and deterministic rule algorithms. Zero hallucinations.
              </p>
            </div>

            <div className="trust-col-card">
              <div className="trust-badge-large badge-ai-style">
                <span>✎</span> AI-ASSISTED
              </div>
              <p className="trust-col-desc">
                Natural language summaries, document readiness guidance, and conversational assistant advice. Clearly flagged as advisory.
              </p>
            </div>

            <div className="trust-col-card">
              <div className="trust-badge-large badge-synthetic-style">
                <span>◇</span> SYNTHETIC
              </div>
              <p className="trust-col-desc">
                Demonstration statistics, simulated population datasets, and policy lab estimates used exclusively in the development sandbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           10. FINAL CALL TO ACTION
           ============================================================ */}
      <section className="final-cta-section">
        <div className="final-cta-inner">
          <h2 className="final-cta-headline">
            You shouldn't need to know the name of a scheme to discover that it exists for you.
          </h2>
          <div>
            <Link to="/citizen/login" className="btn-hero-primary" style={{ fontSize: '18px', padding: '18px 44px' }}>
              Find My Schemes →
            </Link>
          </div>
          <p style={{ color: 'var(--slate)', fontSize: '14px', marginTop: '18px', fontFamily: 'var(--font-mono)' }}>
            Create your Saarthi Welfare Passport in minutes. No paperwork needed to check.
          </p>
        </div>
      </section>
    </div>
  );
}
