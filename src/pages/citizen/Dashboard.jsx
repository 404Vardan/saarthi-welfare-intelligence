import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DocumentsAPI } from '../../api/documentsApi';
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight, Bot, ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function CitizenDashboard() {
  const { profile, evaluations, documents, applications } = useAuth();

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const nearlySchemes = evaluations.filter(e => e.status === 'nearly_eligible');

  // Dynamic Readiness Score
  const readinessScore = DocumentsAPI.calculateReadinessScore(documents, eligibleSchemes);
  const missingDocs = documents.filter(d => d.status === 'pending');

  // Dynamic profile completeness
  const profileFields = ['full_name', 'age', 'gender', 'income_annual', 'occupation', 'state', 'district', 'land_ownership', 'house_ownership', 'category', 'bank_account'];
  const filledFields = profileFields.filter(f => profile[f] !== undefined && profile[f] !== null && profile[f] !== '');
  const profileCompleteness = Math.round((filledFields.length / profileFields.length) * 100);

  // Annualized Direct Aid calculation
  let totalAnnualBenefit = 0;
  eligibleSchemes.forEach(s => {
    if (s.benefitAmount) {
      const parsed = parseInt(s.benefitAmount.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed < 1000000) totalAnnualBenefit += parsed;
    }
  });

  return (
    <div>
      {/* Header with next action summary */}
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">Citizen Command Center</h1>
          <p className="page-description">
            Live welfare passport summary for <strong>{profile?.full_name}</strong> ({profile?.occupation}, {profile?.state}).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/citizen/explorer" className="btn btn-secondary btn-sm">
            Explore All Schemes
          </Link>
          <Link to="/citizen/recommendations" className="btn btn-primary btn-sm">
            View Matched Entitlements ({eligibleSchemes.length}) →
          </Link>
        </div>
      </header>

      {/* Passport Completeness Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFDF8', borderLeft: '4px solid var(--brass-gold)', padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={24} color="var(--brass-gold)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.95rem' }}>
                Welfare Passport Identity Completeness: {profileCompleteness}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>
                {profileCompleteness === 100 ? 'All primary demographic attributes verified.' : 'Add your land records and family composition to unlock 100% of matched programmes.'}
              </div>
            </div>
          </div>
          <Link to="/citizen/profile" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            Complete Profile →
          </Link>
        </div>
      </div>

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
            Upload Missing Proofs →
          </Link>
        </div>

        <div className="stat-card" style={{ borderTopColor: 'var(--seal-vermillion)' }}>
          <div className="stat-value text-seal-vermillion">{applications.length}</div>
          <div className="stat-label">Active Applications</div>
          <Link to="/citizen/applications" style={{ fontSize: '11px', color: 'var(--seal-vermillion)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            Track Application →
          </Link>
        </div>

        <div className="stat-card" style={{ borderTopColor: 'var(--ink-navy)' }}>
          <div className="stat-value">₹{(totalAnnualBenefit || 24000).toLocaleString('en-IN')}</div>
          <div className="stat-label">Annual Entitlement Aid</div>
          <Link to="/citizen/benefits" style={{ fontSize: '11px', color: 'var(--ink-navy)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            View Benefits Wallet →
          </Link>
        </div>
      </div>

      {/* Grid: Priority Action Plan & Top Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Action Plan Card */}
        <div className="action-plan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0, color: 'var(--ink-navy)' }}>
              Next Recommended Actions
            </h3>
            <Link to="/citizen/action-plan" style={{ color: 'var(--seal-vermillion)', fontSize: '0.85rem', fontWeight: 600 }}>
              View Action Plan →
            </Link>
          </div>

          <div className="action-item">
            <CheckCircle2 size={20} color="var(--ledger-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink-navy)' }}>
                Welfare Passport Evaluated
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                {eligibleSchemes.length} verified schemes unlocked under gazette rules v1.0.
              </div>
            </div>
            <Link to="/citizen/recommendations" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              View Matches →
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
                {applications.length > 0 ? `Track ${applications.length} Active Applications` : 'Submit First Scheme Application'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                {applications.length > 0 ? 'Milestones updating in real time.' : 'Direct submission with 1 click.'}
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
                    {scheme.benefit} · Rule {scheme.ruleVersion}
                  </div>
                </div>
                <Link to={`/citizen/scheme/${scheme.schemeId}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  View Hub →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
