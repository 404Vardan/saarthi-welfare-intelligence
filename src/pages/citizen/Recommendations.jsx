import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Send, Check } from 'lucide-react';

export default function CitizenRecommendations() {
  const navigate = useNavigate();
  const { evaluations, profile, applyForScheme, applications } = useAuth();
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);
  const [applyingScheme, setApplyingScheme] = useState(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(null);

  const toggleExpand = (id) => {
    setExpandedSchemeId(prev => (prev === id ? null : id));
  };

  const handleOpenApplyModal = (scheme) => {
    setApplyingScheme(scheme);
    setApplicationNotes('');
    setAppliedSuccess(null);
  };

  const handleConfirmApplication = async () => {
    if (!applyingScheme) return;
    const newApp = await applyForScheme(applyingScheme.schemeId, applyingScheme.schemeName, applicationNotes);
    setAppliedSuccess(newApp);
  };

  const eligible = evaluations.filter(e => e.status === 'eligible');
  const nearly = evaluations.filter(e => e.status === 'nearly_eligible');

  const appliedSchemeIds = new Set(applications.map(a => a.schemeId));

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Personalized Recommendations</h1>
          <p className="page-description">
            Explainable rule breakdowns evaluated against verified gazettes for {profile?.full_name}.
          </p>
        </div>
      </header>

      {/* Eligible Section */}
      <div className="eligibility-section">
        <h3>Eligible Entitlements ({eligible.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {eligible.map(item => {
            const isExpanded = expandedSchemeId === item.schemeId;
            const hasApplied = appliedSchemeIds.has(item.schemeId);

            return (
              <div key={item.schemeId} className="card eligibility-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>
                      {item.schemeCode} · Rule {item.ruleVersion}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '4px 0 8px 0', color: 'var(--ink-navy)' }}>
                      {item.schemeName}
                    </h2>
                    <div style={{ color: 'var(--slate)', fontSize: '0.9rem' }}>
                      {item.benefit}
                    </div>
                  </div>

                  <div className="stamp stamp-eligible" style={{ width: '90px', height: '90px', fontSize: '11px', flexShrink: 0 }}>
                    VERIFIED<br />ELIGIBLE
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
                  <button
                    onClick={() => toggleExpand(item.schemeId)}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Hide Rule Breakdown' : 'View Rule Breakdown (Explainability)'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 700 }}>
                      100% Match
                    </div>
                    {hasApplied ? (
                      <span className="badge badge-eligible" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(item)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Send size={14} /> Apply via Saarthi
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="rule-breakdown">
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
                      Deterministic Gazette Criteria Check:
                    </div>
                    {item.ruleBreakdown.map((rule, idx) => (
                      <div key={idx} className="rule-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {rule.status === 'passed' ? (
                            <CheckCircle size={14} color="var(--ledger-green)" />
                          ) : (
                            <XCircle size={14} color="var(--error-red)" />
                          )}
                          <span><strong>{rule.rule}:</strong> {rule.requiredValue}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate)' }}>
                          Your value: {rule.citizenValue}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearly Eligible Section */}
      {nearly.length > 0 && (
        <div className="eligibility-section" style={{ marginTop: 'var(--space-12)' }}>
          <h3>Nearly Eligible / Action Required ({nearly.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {nearly.map(item => (
              <div key={item.schemeId} className="card eligibility-card" style={{ borderLeftColor: 'var(--brass-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>
                      {item.schemeCode} · Rule {item.ruleVersion}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '4px 0 8px 0', color: 'var(--ink-navy)' }}>
                      {item.schemeName}
                    </h2>
                    <div style={{ color: 'var(--slate)', fontSize: '0.9rem' }}>
                      {item.benefit}
                    </div>
                  </div>

                  <div className="stamp stamp-nearly" style={{ width: '90px', height: '90px', fontSize: '11px', flexShrink: 0 }}>
                    NEARLY<br />ELIGIBLE
                  </div>
                </div>

                <div className="rule-breakdown" style={{ marginTop: '1rem' }}>
                  {item.ruleBreakdown.map((rule, idx) => (
                    <div key={idx} className="rule-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {rule.status === 'passed' ? (
                          <CheckCircle size={14} color="var(--ledger-green)" />
                        ) : (
                          <AlertTriangle size={14} color="var(--amber)" />
                        )}
                        <span><strong>{rule.rule}:</strong> {rule.requiredValue}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: rule.status === 'passed' ? 'var(--slate)' : 'var(--amber)' }}>
                        Your value: {rule.citizenValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Application Modal */}
      {applyingScheme && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 31, 58, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            {!appliedSuccess ? (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Official Welfare Application
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '4px 0 12px 0' }}>
                  Apply for {applyingScheme.schemeName}
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Saarthi will bundle your verified Welfare Passport ({profile.full_name}, {profile.occupation} in {profile.state}) and attach required document proofs.
                </p>

                <div className="form-group">
                  <label className="form-label">Application Notes / Declaration</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '80px' }}
                    placeholder="Optional details or specific sub-district preferences..."
                    value={applicationNotes}
                    onChange={e => setApplicationNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setApplyingScheme(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmApplication}
                    className="btn btn-primary btn-sm"
                  >
                    Confirm & Submit Application →
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto', background: 'var(--ledger-green)' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 8px 0' }}>
                  Application Successfully Logged!
                </h3>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', padding: '12px', borderRadius: '4px', margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Official Reference Number</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink-navy)', marginTop: '4px' }}>
                    {appliedSuccess.refNumber}
                  </div>
                </div>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>
                  Your application has entered the official review pipeline. You can track milestone progression in the Application Tracker.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => { setApplyingScheme(null); navigate('/citizen/applications'); }}
                    className="btn btn-primary btn-sm"
                  >
                    Go to My Applications →
                  </button>
                  <button
                    onClick={() => setApplyingScheme(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
