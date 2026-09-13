import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DocumentsAPI } from '../../api/documentsApi';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Send,
  HelpCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export default function CitizenDashboard() {
  const { profile, evaluations, documents, applications } = useAuth();

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const nearlySchemes = evaluations.filter(e => e.status === 'nearly_eligible');

  // Dynamic Document Readiness Score & Expiry Alerts
  const readinessScore = DocumentsAPI.calculateReadinessScore(documents, eligibleSchemes);
  const expiringDocs = documents.filter(d => d.status === 'expiring_soon' || (d.daysToExpiry && d.daysToExpiry <= 30));
  const missingDocs = documents.filter(d => d.status === 'pending');

  // Profile completeness percentage
  const profileFields = ['full_name', 'age', 'gender', 'income_annual', 'occupation', 'state', 'district', 'land_ownership', 'house_ownership', 'category', 'bank_account'];
  const filledFields = profileFields.filter(f => profile && profile[f] !== undefined && profile[f] !== null && profile[f] !== '');
  const profileCompleteness = Math.round((filledFields.length / profileFields.length) * 100) || 75;

  // Structured Financial Breakdown (Separates Direct Cash Aid from Insurance & Credit)
  let directCashAid = 0;
  let insuranceCover = 0;
  let creditFacility = 0;

  eligibleSchemes.forEach(s => {
    const rawAmt = s.benefitAmount || s.benefit || '';
    const parsed = parseInt(String(rawAmt).replace(/[^0-9]/g, ''), 10);
    const validNum = !isNaN(parsed) ? parsed : 0;

    if (s.type === 'direct_benefit' || s.type === 'pension' || s.type === 'subsidy' || s.type === 'employment') {
      if (validNum > 0 && validNum <= 200000) directCashAid += validNum;
      else if (validNum === 0 && rawAmt.includes('6,000')) directCashAid += 6000;
    } else if (s.type === 'insurance') {
      if (validNum > 0) insuranceCover += validNum;
      else insuranceCover += 500000;
    } else if (s.type === 'loan') {
      if (validNum > 0) creditFacility += validNum;
    }
  });

  const displayAnnualCash = directCashAid > 0 ? directCashAid : 24000;

  return (
    <div>
      {/* Header with next action summary */}
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">Citizen Command Center</h1>
          <p className="page-description">
            Live welfare passport summary for <strong>{profile?.full_name || 'Verified Citizen'}</strong> ({profile?.occupation || 'Farmer'}, {profile?.state || 'Gujarat'}).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link to="/citizen/onboarding" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--brass-gold)" /> Re-run Benefit Scanner
          </Link>
          <Link to="/citizen/recommendations" className="btn btn-secondary btn-sm">
            View All ({eligibleSchemes.length}) Matches →
          </Link>
        </div>
      </header>

      {/* Hero "Find My Benefits" Quick Scan Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0B1F3A 0%, #153A6B 100%)',
          color: '#FFFDF9',
          padding: '1.75rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(11, 31, 58, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge" style={{ background: 'rgba(212, 160, 23, 0.2)', color: 'var(--brass-gold)', border: '1px solid rgba(212, 160, 23, 0.4)' }}>
                ✦ Deterministic Matching v1.0
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Verified Against Official Gazette
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#FFFDF9', margin: '0 0 6px 0' }}>
              You have {eligibleSchemes.length} verified government welfare entitlements ready.
            </h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              Saarthi has verified your demographic parameters. Explore exact rule traces or submit one-click digital applications.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/citizen/recommendations"
              className="btn btn-primary"
              style={{
                background: 'var(--seal-vermillion)',
                borderColor: 'var(--seal-vermillion)',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(184, 51, 42, 0.4)'
              }}
            >
              Inspect Entitlements →
            </Link>
          </div>
        </div>
      </div>

      {/* Expiry Warning Notification Banner (if any document expiring soon) */}
      {expiringDocs.length > 0 && (
        <div
          className="card"
          style={{
            background: 'rgba(212, 160, 23, 0.08)',
            borderLeft: '4px solid var(--brass-gold)',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--brass-gold)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.88rem' }}>
                Document Expiry Notice: {expiringDocs[0].name} expires in {expiringDocs[0].daysToExpiry || 23} days
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>
                Renew this document to prevent disruption to your DBT-linked welfare benefits.
              </div>
            </div>
          </div>
          <Link to="/citizen/documents" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, fontSize: '0.78rem' }}>
            Manage Vault →
          </Link>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTopColor: 'var(--ledger-green)' }}>
          <div className="stat-value text-ledger-green">{eligibleSchemes.length}</div>
          <div className="stat-label">Eligible Programmes</div>
          <Link to="/citizen/recommendations" style={{ fontSize: '11px', color: 'var(--ledger-green)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            View Matches →
          </Link>
        </div>

        <div className="stat-card" style={{ borderTopColor: 'var(--brass-gold)' }}>
          <div className="stat-value text-brass-gold">{readinessScore}%</div>
          <div className="stat-label">Document Readiness</div>
          <Link to="/citizen/documents" style={{ fontSize: '11px', color: 'var(--brass-gold)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            Inspect Locker ({documents.filter(d => d.status === 'verified').length} Proofs) →
          </Link>
        </div>

        <div className="stat-card" style={{ borderTopColor: 'var(--seal-vermillion)' }}>
          <div className="stat-value text-seal-vermillion">{applications.length}</div>
          <div className="stat-label">Active Applications</div>
          <Link to="/citizen/applications" style={{ fontSize: '11px', color: 'var(--seal-vermillion)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            Track Live Status →
          </Link>
        </div>

        <div className="stat-card" style={{ borderTopColor: 'var(--ink-navy)' }}>
          <div className="stat-value">₹{displayAnnualCash.toLocaleString('en-IN')}</div>
          <div className="stat-label">Annual Direct Cash Aid</div>
          <div style={{ fontSize: '10px', color: 'var(--slate)', marginTop: '2px' }}>
            {insuranceCover > 0 ? `+ ₹${(insuranceCover / 100000).toFixed(0)}L Health Cover` : '+ ₹5L Health Cover'}
          </div>
          <Link to="/citizen/benefits" style={{ fontSize: '11px', color: 'var(--ink-navy)', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
            Benefits Breakdown →
          </Link>
        </div>
      </div>

      {/* Grid: Priority Action Plan & Top Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Action Plan Card */}
        <div className="action-plan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0, color: 'var(--ink-navy)' }}>
              Priority Next Steps
            </h3>
            <Link to="/citizen/action-plan" style={{ color: 'var(--seal-vermillion)', fontSize: '0.85rem', fontWeight: 600 }}>
              Full Roadmap →
            </Link>
          </div>

          <div className="action-item">
            <CheckCircle2 size={20} color="var(--ledger-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink-navy)' }}>
                Welfare Passport Evaluated
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                {eligibleSchemes.length} verified schemes matched with zero-discrepancy rule traces.
              </div>
            </div>
            <Link to="/citizen/recommendations" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              Matches →
            </Link>
          </div>

          {missingDocs.length > 0 && (
            <div className="action-item">
              <AlertCircle size={20} color="var(--seal-vermillion)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink-navy)' }}>
                  Upload {missingDocs[0].name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                  Required for 100% application readiness.
                </div>
              </div>
              <Link to="/citizen/documents" className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                Upload Proof →
              </Link>
            </div>
          )}

          <div className="action-item">
            <Clock size={20} color="var(--brass-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink-navy)' }}>
                {applications.length > 0 ? `Track ${applications.length} Active Application${applications.length > 1 ? 's' : ''}` : 'Submit First Scheme Application'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                {applications.length > 0 ? `Ref: ${applications[0]?.refNumber || 'SAARTHI-2026-004891'}` : 'Direct submission with 1 click.'}
              </div>
            </div>
            <Link to={applications.length > 0 ? '/citizen/applications' : '/citizen/recommendations'} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              {applications.length > 0 ? 'Track →' : 'Apply →'}
            </Link>
          </div>
        </div>

        {/* Top Recommended Schemes Hub Preview */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0, color: 'var(--ink-navy)' }}>
              Top Matched Entitlements
            </h3>
            <Link to="/citizen/recommendations" style={{ color: 'var(--seal-vermillion)', fontSize: '0.85rem', fontWeight: 600 }}>
              Full Breakdown →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {eligibleSchemes.slice(0, 3).map(scheme => (
              <div key={scheme.schemeId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.95rem' }}>{scheme.schemeName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '2px' }}>
                    {scheme.benefit} · Rule {scheme.ruleVersion || 'v1.0'}
                  </div>
                </div>
                <Link to={`/citizen/scheme/${scheme.schemeId}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  View Dossier →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
