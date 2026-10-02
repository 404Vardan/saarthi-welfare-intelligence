import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Sliders, 
  Layers, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight,
  ExternalLink,
  Building,
  Activity
} from 'lucide-react';

/**
 * SECTION 07 — FROM CITIZEN INTELLIGENCE TO NWIS
 * "FROM CITIZEN INTELLIGENCE TO POLICY INTELLIGENCE."
 * 
 * Macro Architecture:
 * CITIZENS → DISTRICTS → SCHEMES → WELFARE GAPS → NATIONAL INSIGHTS
 * 
 * Capabilities:
 * - Welfare Coverage
 * - District Insights
 * - Welfare Gap Analysis
 * - Scheme Performance
 * - Population Analysis
 * - Policy Simulation
 * 
 * Described as platform capabilities / proposed intelligence architecture.
 */

const NWIS_CAPABILITIES = [
  {
    id: 'coverage',
    title: 'WELFARE COVERAGE',
    icon: Users,
    desc: 'Aggregates multi-department scheme entitlements across socio-economic strata, revealing composite coverage densities.',
    metric: 'Composite Entitlement Mapping'
  },
  {
    id: 'districts',
    title: 'DISTRICT INSIGHTS',
    icon: MapPin,
    desc: 'Pinpoints geographic delivery disparities across taluks and blocks to direct targeted administrative outreach.',
    metric: 'Sub-District Disparity Tracking'
  },
  {
    id: 'gaps',
    title: 'WELFARE GAPS',
    icon: ShieldAlert,
    desc: 'Identifies the structural drop-off between statutory eligibility and finalized scheme disbursement.',
    metric: 'Real-Time Bottleneck Auditing'
  },
  {
    id: 'performance',
    title: 'SCHEME PERFORMANCE',
    icon: TrendingUp,
    desc: 'Compares application throughput, turnaround times, and document rejection patterns across participating programmes.',
    metric: 'Comparative Lifecycle Velocity'
  },
  {
    id: 'simulation',
    title: 'POLICY SIMULATION',
    icon: Sliders,
    desc: 'Enables administrators to test prospective eligibility threshold revisions and estimate fiscal outlay before notification.',
    metric: 'Deterministic What-If Modelling'
  }
];

export default function NationalIntelligenceSection() {
  const [selectedCap, setSelectedCap] = useState('simulation');
  
  // Interactive Policy Lab Simulation state
  const [incomeCeiling, setIncomeCeiling] = useState(250000);
  const baseline = 200000;
  const ratio = (incomeCeiling - baseline) / baseline;
  const popDelta = (ratio * 34.2).toFixed(1);
  const benDelta = Math.round(ratio * 24200);
  const budgetDelta = (ratio * 14.8).toFixed(1);
  const sign = ratio >= 0 ? '+' : '';

  return (
    <section className="nwis-section-wrapper" id="government" aria-label="National Welfare Intelligence System (NWIS)">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-centered">
          <div className="section-eyebrow">
            <span>SECTION 07 // MACRO SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="section-heading-primary">
            FROM CITIZEN INTELLIGENCE TO POLICY INTELLIGENCE.
          </h2>
          <p className="section-lead-paragraph">
            When citizen-level intelligence connects at national scale, NWIS enables evidence-based governance. Administrators can identify welfare delivery gaps, analyze district variance, and simulate policy modifications before implementation.
          </p>
        </div>

        {/* Macro Architecture Hierarchy Ribbon */}
        <div className="macro-hierarchy-ribbon">
          <div className="hierarchy-step">
            <span className="h-step-tag">LEVEL 01</span>
            <span className="h-step-name">CITIZENS</span>
          </div>
          <div className="h-arrow">──▶</div>

          <div className="hierarchy-step">
            <span className="h-step-tag">LEVEL 02</span>
            <span className="h-step-name">DISTRICTS</span>
          </div>
          <div className="h-arrow">──▶</div>

          <div className="hierarchy-step">
            <span className="h-step-tag">LEVEL 03</span>
            <span className="h-step-name">SCHEMES</span>
          </div>
          <div className="h-arrow">──▶</div>

          <div className="hierarchy-step">
            <span className="h-step-tag">LEVEL 04</span>
            <span className="h-step-name">WELFARE GAPS</span>
          </div>
          <div className="h-arrow">──▶</div>

          <div className="hierarchy-step hierarchy-step-peak">
            <span className="h-step-tag">LEVEL 05</span>
            <span className="h-step-name">NATIONAL INSIGHTS</span>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="capabilities-card-grid">
          {NWIS_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isSelected = selectedCap === cap.id;
            return (
              <button
                key={cap.id}
                type="button"
                className={`capability-item-card ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCap(cap.id)}
              >
                <div className="cap-card-top">
                  <div className="cap-icon-box">
                    <Icon size={18} />
                  </div>
                  <span className="cap-metric-tag">{cap.metric}</span>
                </div>
                <h3 className="cap-card-title">{cap.title}</h3>
                <p className="cap-card-desc">{cap.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Interactive Capability Showcase: Policy Simulation Terminal */}
        <div className="policy-sim-terminal-card">
          <div className="sim-titlebar">
            <div className="sim-title-left">
              <Sliders size={16} style={{ color: 'var(--brass-gold)' }} />
              <span className="sim-title-text">NWIS POLICY LAB // SYNTHETIC IMPACT SIMULATOR</span>
            </div>
            <div className="sim-status-tag">
              <span>DEMONSTRATION SIMULATION ENGINE</span>
            </div>
          </div>

          <div className="sim-body-grid">
            {/* Control Column */}
            <div className="sim-ctrl-column">
              <div className="sim-ctrl-label-row">
                <span className="ctrl-heading">Income Eligibility Threshold</span>
                <span className="ctrl-value">₹{(incomeCeiling / 100000).toFixed(2)} Lakhs</span>
              </div>
              <p className="ctrl-sub">
                Adjust eligibility ceiling to simulate aggregate population eligibility shifts against synthetic demographic samples.
              </p>

              <div className="sim-slider-wrap">
                <input
                  type="range"
                  min="100000"
                  max="500000"
                  step="25000"
                  value={incomeCeiling}
                  onChange={(e) => setIncomeCeiling(parseInt(e.target.value, 10))}
                  className="interactive-sim-slider"
                  aria-label="Adjust income eligibility threshold"
                />
                <div className="slider-ticks">
                  <span>₹1.0L</span>
                  <span>₹2.0L (Baseline)</span>
                  <span>₹3.0L</span>
                  <span>₹4.0L</span>
                  <span>₹5.0L</span>
                </div>
              </div>

              <div className="sim-admin-link-row">
                <Link to="/government/login" className="btn-admin-console">
                  <span>Open Government Console</span>
                  <ExternalLink size={14} />
                </Link>
                <span className="admin-console-sub">Government credentials required</span>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="sim-metrics-column">
              <div className="sim-kpi-card">
                <span className="kpi-label">Projected Population Delta</span>
                <div className="kpi-val" style={{ color: ratio >= 0 ? 'var(--ledger-green)' : 'var(--seal-vermillion)' }}>
                  {sign}{popDelta}%
                </div>
                <span className="kpi-sub">Simulated eligible population change</span>
              </div>

              <div className="sim-kpi-card">
                <span className="kpi-label">Beneficiary Shift</span>
                <div className="kpi-val">
                  {sign}{benDelta.toLocaleString('en-IN')}
                </div>
                <span className="kpi-sub">Estimated net household volume</span>
              </div>

              <div className="sim-kpi-card">
                <span className="kpi-label">Estimated Fiscal Outlay</span>
                <div className="kpi-val" style={{ color: 'var(--brass-gold)' }}>
                  {sign}₹{budgetDelta} Cr
                </div>
                <span className="kpi-sub">Projected annual budget reallocation</span>
              </div>
            </div>
          </div>

          <div className="sim-disclaimer-strip">
            <span>*Illustrative simulation computed via deterministic rule algorithms over synthetic representative demographic models. No live citizen records are exposed.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
