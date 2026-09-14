import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="public-layout">
      {/* Academic Banner */}
      <div className="academic-banner">
        ⚠️ Conceptual Academic & Startup Architecture Prototype — Demonstrating Continuous Welfare Ingestion & Intelligence.
      </div>

      {/* Header / Navbar */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <Link to="/" className="brand-logo">
            <div className="brand-seal-mark">S</div>
            <div className="brand-text-wrap">
              <span className="brand-title">SAARTHI</span>
              <span className="brand-subtitle">सारथी · WELFARE INTELLIGENCE</span>
            </div>
          </Link>

          <nav className="nav-links">
            <a href="/#how-it-works" className="nav-link">How It Works</a>
            <a href="/#welfare-graph" className="nav-link">Welfare Graph</a>
            <a href="/#government" className="nav-link">For Government</a>
          </nav>

          <div className="nav-actions">
            <Link to="/citizen/login" className="btn-nav-primary">Citizen Portal →</Link>
            <Link to="/government/login" className="btn-nav-outline">Government Console</Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top-grid">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                SAARTHI
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, maxWidth: '320px' }}>
                National Welfare Intelligence Platform. Connecting 1.4 billion citizens to verified entitlements with zero information asymmetry.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Citizen</div>
              <ul className="footer-link-list">
                <li><Link to="/citizen/profile">Welfare Passport</Link></li>
                <li><Link to="/citizen/explorer">Explore Schemes</Link></li>
                <li><Link to="/citizen/recommendations">Recommendations</Link></li>
                <li><Link to="/citizen/documents">Document Locker</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Government</div>
              <ul className="footer-link-list">
                <li><Link to="/government/dashboard">National Overview</Link></li>
                <li><Link to="/government/districts">District Intelligence</Link></li>
                <li><Link to="/government/policy-lab">Policy Lab</Link></li>
                <li><Link to="/government/gap-analysis">Welfare Gap Analysis</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Operations</div>
              <ul className="footer-link-list">
                <li><Link to="/operations/dashboard">Operations Dashboard</Link></li>
                <li><Link to="/operations/registry">Scheme Registry</Link></li>
                <li><Link to="/operations/verification">Verification Queue</Link></li>
                <li><Link to="/operations/add-scheme">Ingest Scheme</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Platform & Trust</div>
              <ul className="footer-link-list">
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><a href="/#welfare-graph">Welfare Graph</a></li>
                <li><Link to="/beta-guide">Beta Testing Guide 🧪</Link></li>
                <li><Link to="/privacy">Privacy & DPDP Policy 🔒</Link></li>
                <li><Link to="/terms">Terms of Service 📜</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>Saarthi is an independent welfare intelligence platform. Government affiliation or endorsement is not implied.</div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Terms</Link>
              <span>·</span>
              <Link to="/beta-guide" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Beta Guide</Link>
              <span>·</span>
              <span>© 2026 Saarthi · Continuous Scheme Knowledge Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
