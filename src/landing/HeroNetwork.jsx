import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileCheck, 
  Layers, 
  ChevronRight,
  Compass
} from 'lucide-react';

/**
 * THE LIVING WELFARE NETWORK
 * 
 * Visual story:
 * 1. Fragmented welfare nodes appear.
 * 2. Subtle relationships begin forming.
 * 3. Citizen node becomes active.
 * 4. Profile attributes appear.
 * 5. Relevant scheme relationships illuminate.
 * 6. Clean pathway forms: Citizen -> Profile -> Eligibility -> Scheme -> Action.
 * 7. System settles into a calm, breathing state.
 */

const SEQUENCE_STEPS = [
  {
    step: 1,
    title: 'Fragmented Information',
    desc: 'Welfare data scattered across disconnected ministries, schemes, rules, and gazettes.',
    badge: 'STATE 01 · DISCONNECTED'
  },
  {
    step: 2,
    title: 'Relationships Forming',
    desc: 'Saarthi maps underlying relationships between department mandates and statutory schemes.',
    badge: 'STATE 02 · MAPPING'
  },
  {
    step: 3,
    title: 'Citizen Node Active',
    desc: 'A citizen profile is anchored at the center of the intelligence architecture.',
    badge: 'STATE 03 · CITIZEN-CENTRIC'
  },
  {
    step: 4,
    title: 'Profile Synthesis',
    desc: 'Demographic attributes—age, location, income, occupation—are structured.',
    badge: 'STATE 04 · ATTRIBUTE STRUCTURING'
  },
  {
    step: 5,
    title: 'Scheme Illumination',
    desc: 'Deterministic eligibility algorithms evaluate against verified government rules.',
    badge: 'STATE 05 · RELEVANCE ILLUMINATION'
  },
  {
    step: 6,
    title: 'Verified Pathway',
    desc: 'Citizen → Profile → Eligibility → Scheme → Official Portal pathway finalized.',
    badge: 'STATE 06 · PATHWAY COMPLETE'
  },
  {
    step: 7,
    title: 'Living Intelligence',
    desc: 'The network settles into a continuous, calm institutional state.',
    badge: 'STATE 07 · ACTIVE SYSTEM'
  }
];

export default function HeroNetwork() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const isVisibleRef = useRef(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Step advancement timer
  useEffect(() => {
    if (!isPlaying || isReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev >= 7 ? 1 : prev + 1));
    }, 4200);
    return () => clearInterval(timer);
  }, [isPlaying, isReducedMotion]);

  // Pause when off-screen via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Canvas drawing & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Node definitions relative to center (0.0 to 1.0)
    const baseNodes = [
      // Central Citizen
      { id: 'citizen', label: 'Citizen', sub: 'Demographic Profile', x: 0.50, y: 0.50, type: 'citizen', radius: 18 },

      // Departments (North & Northwest)
      { id: 'dept_agri', label: 'Min. Agriculture', sub: 'PM-KISAN Mandate', x: 0.32, y: 0.22, type: 'department', radius: 9 },
      { id: 'dept_soc', label: 'Min. Social Justice', sub: 'Scholarships & Welfare', x: 0.68, y: 0.20, type: 'department', radius: 9 },
      { id: 'dept_rural', label: 'Rural Development', sub: 'PMAY-G / MGNREGS', x: 0.18, y: 0.40, type: 'department', radius: 9 },
      { id: 'dept_health', label: 'Health & Family Welfare', sub: 'Ayushman Bharat', x: 0.82, y: 0.38, type: 'department', radius: 9 },

      // Schemes (Orbiting)
      { id: 'sch_kisan', label: 'PM-KISAN', sub: 'Income Support · ₹6,000/yr', x: 0.36, y: 0.36, type: 'scheme', radius: 12, matched: true },
      { id: 'sch_postmatric', label: 'Post-Matric Scholarship', sub: 'Higher Education Support', x: 0.64, y: 0.36, type: 'scheme', radius: 12, matched: true },
      { id: 'sch_ayushman', label: 'Ayushman Bharat', sub: 'Healthcare Cover · ₹5 Lakh', x: 0.70, y: 0.58, type: 'scheme', radius: 12, matched: true },
      { id: 'sch_vishwakarma', label: 'PM Vishwakarma', sub: 'Artisan Credit & Toolkit', x: 0.30, y: 0.64, type: 'scheme', radius: 11, matched: false },

      // Eligibility Rules (Intermediate nodes)
      { id: 'rule_income', label: 'Income Ceiling', sub: '≤ ₹2,50,000 / yr', x: 0.42, y: 0.42, type: 'rule', radius: 7 },
      { id: 'rule_domicile', label: 'State Domicile', sub: 'Telangana Resident', x: 0.58, y: 0.44, type: 'rule', radius: 7 },
      { id: 'rule_age', label: 'Age Criteria', sub: '18 – 28 Years', x: 0.50, y: 0.37, type: 'rule', radius: 7 },

      // Documents
      { id: 'doc_aadhaar', label: 'Aadhaar e-KYC', sub: 'Identity & DBT Seeded', x: 0.42, y: 0.62, type: 'doc', radius: 8 },
      { id: 'doc_income', label: 'Income Certificate', sub: 'Tehsildar Attested', x: 0.58, y: 0.62, type: 'doc', radius: 8 },
      { id: 'doc_bonafide', label: 'College Bonafide', sub: 'Current Academic Year', x: 0.50, y: 0.67, type: 'doc', radius: 8 },

      // Official Portal (Terminal Action)
      { id: 'portal_official', label: 'Official Portal', sub: 'State / Central Portal', x: 0.50, y: 0.84, type: 'action', radius: 13 },

      // Geographic Regional Nodes (Subtle India constellation points)
      { id: 'reg_north', label: 'North Hub', sub: 'Delhi / UP', x: 0.48, y: 0.12, type: 'topo', radius: 5 },
      { id: 'reg_west', label: 'West Hub', sub: 'Gujarat / MH', x: 0.15, y: 0.58, type: 'topo', radius: 5 },
      { id: 'reg_east', label: 'East Hub', sub: 'WB / Odisha', x: 0.84, y: 0.50, type: 'topo', radius: 5 },
      { id: 'reg_south', label: 'South Hub', sub: 'Telangana / TN', x: 0.52, y: 0.94, type: 'topo', radius: 5 }
    ];

    // Links connecting nodes
    const links = [
      { from: 'dept_agri', to: 'sch_kisan' },
      { from: 'dept_soc', to: 'sch_postmatric' },
      { from: 'dept_rural', to: 'sch_vishwakarma' },
      { from: 'dept_health', to: 'sch_ayushman' },

      { from: 'citizen', to: 'rule_age' },
      { from: 'citizen', to: 'rule_income' },
      { from: 'citizen', to: 'rule_domicile' },

      { from: 'rule_income', to: 'sch_kisan' },
      { from: 'rule_domicile', to: 'sch_postmatric' },
      { from: 'rule_age', to: 'sch_postmatric' },
      { from: 'rule_income', to: 'sch_ayushman' },

      { from: 'citizen', to: 'doc_aadhaar' },
      { from: 'citizen', to: 'doc_income' },
      { from: 'citizen', to: 'doc_bonafide' },

      { from: 'doc_aadhaar', to: 'portal_official' },
      { from: 'doc_income', to: 'portal_official' },
      { from: 'sch_postmatric', to: 'portal_official' },
      { from: 'sch_kisan', to: 'portal_official' },

      // Subtle background topology links
      { from: 'reg_north', to: 'dept_agri' },
      { from: 'reg_north', to: 'dept_soc' },
      { from: 'reg_west', to: 'dept_rural' },
      { from: 'reg_east', to: 'dept_health' },
      { from: 'portal_official', to: 'reg_south' }
    ];

    let pulse = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      pulse += 0.025;

      const step = currentStep;

      // 1. Draw subtle India Topographic Grid Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(166, 135, 61, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = Math.max(36, width / 24);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Relationships / Links
      links.forEach((link) => {
        const source = baseNodes.find((n) => n.id === link.from);
        const target = baseNodes.find((n) => n.id === link.to);
        if (!source || !target) return;

        const x1 = source.x * width;
        const y1 = source.y * height;
        const x2 = target.x * width;
        const y2 = target.y * height;

        // Visibility rules based on step
        let alpha = 0.04;
        let isPathway = false;

        if (step >= 2) {
          alpha = 0.12;
        }

        // Highlight verified pathway in step 5, 6, 7
        const inVerifiedPath = 
          (link.from === 'citizen' || link.to === 'citizen') ||
          (link.from === 'sch_postmatric' || link.to === 'sch_postmatric') ||
          (link.from === 'rule_income' || link.to === 'rule_income') ||
          (link.from === 'rule_domicile' || link.to === 'rule_domicile') ||
          (link.from === 'portal_official' || link.to === 'portal_official');

        if (step >= 5 && inVerifiedPath) {
          alpha = 0.45;
          isPathway = true;
        }

        if (step >= 6 && isPathway) {
          alpha = 0.75;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (isPathway && step >= 5) {
          // Warm gold or emerald verified thread
          ctx.strokeStyle = step >= 6 ? 'rgba(31, 122, 77, 0.85)' : 'rgba(196, 162, 82, 0.7)';
          ctx.lineWidth = step >= 6 ? 2.2 : 1.6;
          ctx.setLineDash(step === 5 ? [4, 4] : []);
        } else {
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
        }

        ctx.stroke();

        // Animated pulse particle along verified path in step 6 & 7
        if (isPathway && step >= 6 && !isReducedMotion) {
          const t = ((pulse * 0.4) + (link.from.charCodeAt(0) * 0.1)) % 1;
          const px = x1 + (x2 - x1) * t;
          const py = y1 + (y2 - y1) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#10B981';
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      });

      // 3. Draw Nodes
      baseNodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        let r = node.radius;

        // Visual properties based on node type & current step
        let fillColor = 'rgba(255, 255, 255, 0.08)';
        let strokeColor = 'rgba(255, 255, 255, 0.2)';
        let textColor = 'rgba(226, 232, 240, 0.85)';
        let showLabel = width > 520 || node.type === 'citizen' || node.type === 'action';

        if (node.type === 'citizen') {
          // Central citizen node
          const activeCitizen = step >= 3;
          fillColor = activeCitizen ? '#0B1F3A' : '#152E52';
          strokeColor = activeCitizen ? '#C4A252' : 'rgba(255, 255, 255, 0.3)';
          r = activeCitizen ? 22 : 18;

          // Citizen breathing ring
          if (activeCitizen) {
            ctx.save();
            const ringR = r + 6 + Math.sin(pulse * 2) * 3;
            ctx.beginPath();
            ctx.arc(nx, ny, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(196, 162, 82, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
        } else if (node.type === 'scheme') {
          if (step >= 5 && node.matched) {
            fillColor = 'rgba(31, 122, 77, 0.9)';
            strokeColor = '#10B981';
            textColor = '#FFFFFF';
          } else {
            fillColor = 'rgba(15, 23, 42, 0.7)';
            strokeColor = 'rgba(148, 163, 184, 0.3)';
          }
        } else if (node.type === 'rule') {
          if (step >= 4) {
            fillColor = '#A6873D';
            strokeColor = '#C4A252';
          } else {
            fillColor = 'rgba(100, 116, 139, 0.4)';
            strokeColor = 'rgba(148, 163, 184, 0.2)';
          }
        } else if (node.type === 'doc') {
          if (step >= 5) {
            fillColor = '#1E293B';
            strokeColor = '#94A3B8';
          } else {
            fillColor = 'rgba(30, 41, 59, 0.5)';
            strokeColor = 'rgba(100, 116, 139, 0.2)';
          }
        } else if (node.type === 'action') {
          if (step >= 6) {
            fillColor = '#C1442D';
            strokeColor = '#E05D44';
            textColor = '#FFFFFF';
            // Action alert ring
            ctx.save();
            ctx.beginPath();
            ctx.arc(nx, ny, r + 4 + Math.sin(pulse * 3) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(193, 68, 45, 0.4)';
            ctx.stroke();
            ctx.restore();
          } else {
            fillColor = 'rgba(30, 41, 59, 0.7)';
            strokeColor = 'rgba(148, 163, 184, 0.3)';
          }
        } else if (node.type === 'topo') {
          fillColor = 'rgba(166, 135, 61, 0.25)';
          strokeColor = 'rgba(166, 135, 61, 0.4)';
        }

        // Draw Node Circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Draw central icon or symbol
        if (node.type === 'citizen') {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('YOU', nx, ny);
        } else if (node.type === 'action' && step >= 6) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('APPLY', nx, ny);
        }

        // Draw Labels
        if (showLabel && node.type !== 'topo') {
          ctx.font = node.type === 'citizen' ? '600 12px "IBM Plex Mono", monospace' : '500 11px Inter, sans-serif';
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(node.label, nx, ny + r + 6);

          if (width > 680 && (node.type === 'citizen' || node.type === 'scheme' || node.type === 'action')) {
            ctx.font = '400 9.5px "IBM Plex Mono", monospace';
            ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
            ctx.fillText(node.sub, nx, ny + r + 20);
          }
        }
        ctx.restore();
      });

      // 4. In Step 4 (Profile Attributes): draw attribute badges emanating from citizen
      if (step === 4 && width > 480) {
        ctx.save();
        const cx = 0.50 * width;
        const cy = 0.50 * height;
        const badges = [
          { text: 'Age: 24', dx: -90, dy: -42 },
          { text: 'Telangana', dx: 90, dy: -42 },
          { text: 'Student', dx: -90, dy: 42 },
          { text: 'Income: ₹1.8L', dx: 90, dy: 42 }
        ];
        badges.forEach((b) => {
          ctx.fillStyle = 'rgba(11, 31, 58, 0.9)';
          ctx.strokeStyle = '#C4A252';
          ctx.lineWidth = 1;
          const bx = cx + b.dx - 36;
          const by = cy + b.dy - 10;
          ctx.fillRect(bx, by, 76, 20);
          ctx.strokeRect(bx, by, 76, 20);
          ctx.fillStyle = '#F8FAFC';
          ctx.font = '600 10px "IBM Plex Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.text, cx + b.dx + 2, cy + b.dy);
        });
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', resize);
    };
  }, [currentStep, isReducedMotion]);

  const activeStepMeta = SEQUENCE_STEPS[currentStep - 1] || SEQUENCE_STEPS[0];

  return (
    <section className="hero-network-section" id="welfare-graph" ref={containerRef} aria-label="Saarthi Welfare Network Hero">
      {/* Top Technical Metadata Bar */}
      <div className="hero-tech-strip">
        <div className="hero-tech-tag">
          <span className="tech-dot" aria-hidden="true" />
          <span>NWIS // NATIONAL WELFARE INTELLIGENCE SYSTEM</span>
        </div>
        <div className="hero-tech-engine">
          <span>DETERMINISTIC RULE ENGINE · 100% EXPLAINABLE PROVENANCE</span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="hero-network-grid">
        {/* Left Column: Authoritative Editorial Copy */}
        <div className="hero-content-column">
          <div className="hero-kicker-wrap">
            <span className="hero-kicker-badge">CITIZEN WELFARE PLATFORM</span>
            <span className="hero-kicker-sub">NO INFORMATION ASYMMETRY</span>
          </div>

          <h1 className="hero-brand-headline">
            <span className="hero-title-main">SAARTHI</span>
            <span className="hero-title-accent">WELFARE INTELLIGENCE, BUILT AROUND PEOPLE.</span>
          </h1>

          <p className="hero-lead-statement">
            One intelligent layer between citizens and the welfare they need to navigate. Saarthi connects your verified profile to statutory entitlements, computes explainable eligibility, and audits document readiness before you apply.
          </p>

          {/* Principle callout */}
          <div className="hero-principle-quote">
            <span className="principle-mark">"</span>
            <div>
              <strong>AI assists with natural understanding.</strong>
              <span> Verified government rules remain authoritative for eligibility.</span>
            </div>
          </div>

          {/* CTA Group */}
          <div className="hero-cta-actions">
            <Link to="/citizen/login" className="btn-hero-primary" id="hero-primary-cta">
              <span>EXPLORE SAARTHI</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#problem" className="btn-hero-secondary" id="hero-secondary-cta">
              <Compass size={17} aria-hidden="true" />
              <span>SEE HOW IT WORKS</span>
            </a>
          </div>

          {/* Live System State Indicators */}
          <div className="hero-status-strip">
            <div className="status-item">
              <span className="status-label">Ingested Schemes</span>
              <span className="status-val">Verified Gazettes</span>
            </div>
            <div className="status-divider" />
            <div className="status-item">
              <span className="status-label">Evaluation Logic</span>
              <span className="status-val">Deterministic Rules</span>
            </div>
            <div className="status-divider" />
            <div className="status-item">
              <span className="status-label">Official Portals</span>
              <span className="status-val">Direct Redirection</span>
            </div>
          </div>
        </div>

        {/* Right Column: The Living Welfare Network Canvas & Sequence Machine */}
        <div className="hero-visual-column">
          <div className="network-viewport-card">
            {/* Header / Network State Bar */}
            <div className="network-card-header">
              <div className="network-state-badge">
                <span className="state-pulse" aria-hidden="true" />
                <span>{activeStepMeta.badge}</span>
              </div>
              <div className="network-stepper-ctrls">
                <button
                  type="button"
                  className="network-ctrl-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause auto-sequence' : 'Play auto-sequence'}
                  aria-label={isPlaying ? 'Pause sequence' : 'Play sequence'}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                  type="button"
                  className="network-ctrl-btn"
                  onClick={() => setCurrentStep(1)}
                  title="Restart Sequence"
                  aria-label="Restart network sequence"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Interactive Canvas Rendering Area */}
            <div className="network-canvas-holder">
              <canvas
                ref={canvasRef}
                className="living-network-canvas"
                aria-label="Abstract interactive network visualization connecting citizen to welfare schemes"
              />
            </div>

            {/* Bottom Sequence Narration & Interactive Step Pills */}
            <div className="network-sequence-footer">
              <div className="sequence-text-box">
                <div className="sequence-step-num">STAGE 0{currentStep} // {activeStepMeta.title}</div>
                <div className="sequence-step-desc">{activeStepMeta.desc}</div>
              </div>

              {/* Step selector pills */}
              <div className="sequence-pills-row" role="tablist" aria-label="Network transformation steps">
                {SEQUENCE_STEPS.map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    role="tab"
                    aria-selected={currentStep === s.step}
                    className={`step-pill ${currentStep === s.step ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentStep(s.step);
                      setIsPlaying(false);
                    }}
                  >
                    <span>0{s.step}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footnote on official application boundaries */}
          <div className="hero-caveat-note">
            <ShieldCheck size={13} style={{ color: 'var(--ledger-green)', flexShrink: 0 }} />
            <span>Saarthi is an independent intelligence layer. Applications are completed directly on official state & central portals.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
