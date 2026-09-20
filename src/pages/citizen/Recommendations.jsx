import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Send, Check, ExternalLink, FileText } from 'lucide-react';
import FeedbackWidget from '../../components/common/FeedbackWidget';

const OFFICIAL_PORTAL_REGISTRY = {
  'pm-kisan': {
    name: 'PM-KISAN National Portal',
    url: 'https://pmkisan.gov.in',
    authority: 'Ministry of Agriculture & Farmers Welfare',
    docsRequired: ['Aadhaar Card', 'Land Record (7/12 RoR)', 'Bank Passbook']
  },
  'pmjay': {
    name: 'Ayushman Bharat PM-JAY Beneficiary Portal',
    url: 'https://beneficiary.nha.gov.in',
    authority: 'National Health Authority',
    docsRequired: ['Aadhaar Card', 'Ration Card']
  },
  'post-matric-sc': {
    name: 'National Scholarship Portal (NSP)',
    url: 'https://scholarships.gov.in',
    authority: 'Ministry of Social Justice & Empowerment',
    docsRequired: ['Aadhaar Card', 'Caste Certificate', 'College Enrollment & Fee Receipt']
  },
  'pm-vishwakarma': {
    name: 'PM Vishwakarma Portal',
    url: 'https://pmvishwakarma.gov.in',
    authority: 'Ministry of MSME',
    docsRequired: ['Aadhaar Card', 'Artisan Trade Verification', 'Bank Passbook']
  },
  'pm-svanidhi': {
    name: 'PM SVANidhi Portal',
    url: 'https://pmsvanidhi.mohua.gov.in',
    authority: 'Ministry of Housing & Urban Affairs',
    docsRequired: ['Aadhaar Card', 'Vending Certificate / ULB Letter', 'Bank Passbook']
  },
  'pmmvy': {
    name: 'PMMVY Direct Portal',
    url: 'https://pmmvy.wcd.gov.in',
    authority: 'Ministry of Women & Child Development',
    docsRequired: ['Aadhaar Card', 'Mother Child Protection (MCP) Card', 'Bank Passbook']
  },
  'pm-ujjwala': {
    name: 'PM Ujjwala Yojana 2.0',
    url: 'https://www.pmuy.gov.in',
    authority: 'Ministry of Petroleum & Natural Gas',
    docsRequired: ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook']
  },
  'ignoaps': {
    name: 'NSAP National Social Assistance Portal',
    url: 'https://nsap.nic.in',
    authority: 'Ministry of Rural Development',
    docsRequired: ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook']
  }
};

export default function CitizenRecommendations() {
  const navigate = useNavigate();
  const { evaluations, profile, applyForScheme, applications, documents = [] } = useAuth();
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' | 'nearly' | 'missing_data' | 'all'
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
  const missingData = evaluations.filter(e => e.status === 'insufficient_data');

  const appliedSchemeIds = new Set(applications.map(a => a.schemeId));

  return (
    <div>
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">Personalized Entitlements & Decision Traces</h1>
          <p className="page-description">
            Statutory rule evaluations computed deterministically against gazette criteria for <strong>{profile?.full_name || 'Citizen'}</strong>.
          </p>
        </div>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: 'var(--paper)', padding: '4px', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border)', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('eligible')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'eligible' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'eligible' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: activeTab === 'eligible' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          ✓ Eligible Entitlements ({eligible.length})
        </button>
        <button
          onClick={() => setActiveTab('nearly')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'nearly' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'nearly' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: activeTab === 'nearly' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          ⚡ Near-Miss Advisory ({nearly.length})
        </button>
        <button
          onClick={() => setActiveTab('missing_data')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'missing_data' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'missing_data' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: activeTab === 'missing_data' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          ⚠️ Missing Profile Info ({missingData.length})
        </button>
      </div>

      {/* 1. Eligible Entitlements Tab */}
      {activeTab === 'eligible' && (
        <div className="eligibility-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ink-navy)' }}>Verified Statutory Entitlements ({eligible.length})</h3>
            <span className="badge badge-eligible">100% Criteria Matched</span>
          </div>

          {eligible.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <p style={{ color: 'var(--slate)', margin: 0 }}>No fully matched schemes based on your current demographic parameters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {eligible.map(item => {
                const isExpanded = expandedSchemeId === item.schemeId;
                const hasApplied = appliedSchemeIds.has(item.schemeId);
                const portalInfo = OFFICIAL_PORTAL_REGISTRY[item.schemeId] || null;

                return (
                  <div key={item.schemeId} className="card eligibility-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>
                          {item.schemeCode} · Rule {item.ruleVersion || 'v1.0'} · Ref: {item.decisionId || 'DEC-VERIFIED'}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '4px 0 8px 0', color: 'var(--ink-navy)' }}>
                          {item.schemeName}
                        </h2>
                        <div style={{ color: 'var(--slate)', fontSize: '0.9rem' }}>
                          {item.benefit}
                        </div>
                      </div>

                      <div className="stamp stamp-eligible" style={{ width: '90px', height: '90px', fontSize: '11px', flexShrink: 0 }}>
                        STATUTORY<br />ELIGIBLE
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
                      <button
                        onClick={() => toggleExpand(item.schemeId)}
                        style={{ background: 'none', border: 'none', color: 'var(--ink-navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'Hide Rule Trace' : 'Inspect Rule Breakdown (Decision Trace)'}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 700 }}>
                          100% Match
                        </div>
                        {portalInfo && (
                          <a
                            href={portalInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontSize: '0.78rem' }}
                            title={`Open official portal: ${portalInfo.name}`}
                          >
                            <ExternalLink size={13} /> Official Portal ↗
                          </a>
                        )}
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
                          Deterministic Gazette Criteria Check ({item.ruleBreakdown?.length || 0} Rules):
                        </div>
                        {item.ruleBreakdown?.map((rule, idx) => (
                          <div key={idx} className="rule-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle size={14} color="var(--ledger-green)" />
                              <span><strong>{rule.rule}:</strong> {rule.requiredValue}</span>
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate)' }}>
                              Your value: {rule.citizenValue}
                            </span>
                          </div>
                        ))}

                        {portalInfo?.docsRequired && (
                          <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-navy)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <FileText size={13} color="var(--brass-gold)" /> Pre-Application Document Checklist:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {portalInfo.docsRequired.map((docReq, dIdx) => {
                                const hasInLocker = documents.some(d => d.name?.toLowerCase().includes(docReq.toLowerCase().split(' ')[0]) || docReq.toLowerCase().includes(d.category || ''));
                                return (
                                  <span
                                    key={dIdx}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.72rem',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      background: hasInLocker ? 'rgba(31,122,77,0.1)' : 'rgba(212,160,23,0.1)',
                                      color: hasInLocker ? 'var(--ledger-green)' : 'var(--slate)',
                                      border: `1px solid ${hasInLocker ? 'rgba(31,122,77,0.3)' : 'var(--border)'}`,
                                      fontWeight: 500
                                    }}
                                  >
                                    {hasInLocker ? '✓ Ready in Locker' : '○ Prepare'}: {docReq}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                      <FeedbackWidget
                        contextType="recommendation"
                        contextId={item.schemeId}
                        contextTitle={item.schemeName}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Near-Miss Advisory Tab */}
      {activeTab === 'nearly' && (
        <div className="eligibility-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ink-navy)' }}>Near-Miss Advisory Matches ({nearly.length})</h3>
            <span className="badge" style={{ background: 'rgba(212,160,23,0.15)', color: 'var(--brass-gold)' }}>Informational / Boundary Guidance</span>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(212,160,23,0.08)', borderLeft: '4px solid var(--brass-gold)', borderRadius: '4px', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
            ⚠️ <strong>Advisory Note:</strong> These programmes have not been formally matched because one threshold boundary is marginally exceeded. Near-miss guidance does not confer legal entitlement.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {nearly.map(item => (
              <div key={item.schemeId} className="card eligibility-card" style={{ borderLeftColor: 'var(--brass-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>
                      {item.schemeCode} · Rule {item.ruleVersion || 'v1.0'}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '4px 0 8px 0', color: 'var(--ink-navy)' }}>
                      {item.schemeName}
                    </h2>
                    <div style={{ color: 'var(--slate)', fontSize: '0.9rem' }}>
                      {item.benefit}
                    </div>
                  </div>

                  <div className="stamp stamp-nearly" style={{ width: '90px', height: '90px', fontSize: '11px', flexShrink: 0 }}>
                    NEAR-MISS<br />ADVISORY
                  </div>
                </div>

                <div className="rule-breakdown" style={{ marginTop: '1rem' }}>
                  {item.ruleBreakdown?.map((rule, idx) => (
                    <div key={idx} className="rule-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {rule.status === 'passed' ? (
                          <CheckCircle size={14} color="var(--ledger-green)" />
                        ) : (
                          <AlertTriangle size={14} color="var(--amber)" />
                        )}
                        <span><strong>{rule.rule}:</strong> {rule.requiredValue}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: rule.status === 'passed' ? 'var(--slate)' : 'var(--amber)' }}>
                          {rule.citizenValue}
                        </span>
                        {rule.nearMiss && (
                          <div style={{ fontSize: '10px', color: 'var(--brass-gold)', fontWeight: 600 }}>
                            {rule.delta}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Missing Profile Info Tab */}
      {activeTab === 'missing_data' && (
        <div className="eligibility-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ink-navy)' }}>Programmes Requiring More Information ({missingData.length})</h3>
            <span className="badge" style={{ background: 'rgba(100,116,139,0.15)', color: 'var(--slate)' }}>Incomplete Attributes</span>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(100,116,139,0.08)', borderLeft: '4px solid var(--slate)', borderRadius: '4px', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
            ℹ️ <strong>Missing Demographic Data:</strong> Complete your Welfare Passport profile to enable deterministic evaluation for these statutory schemes.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {missingData.map(item => (
              <div key={item.schemeId} className="card eligibility-card" style={{ borderLeftColor: 'var(--slate)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--slate)', fontWeight: 600 }}>
                      {item.schemeCode} · Rule {item.ruleVersion || 'v1.0'}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '4px 0 8px 0', color: 'var(--ink-navy)' }}>
                      {item.schemeName}
                    </h2>
                    <div style={{ color: 'var(--slate)', fontSize: '0.9rem' }}>
                      {item.benefit}
                    </div>
                  </div>

                  <button onClick={() => navigate('/citizen/profile')} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                    Update Profile →
                  </button>
                </div>

                <div className="rule-breakdown" style={{ marginTop: '1rem' }}>
                  {item.ruleBreakdown?.filter(r => r.status === 'insufficient_data').map((rule, idx) => (
                    <div key={idx} className="rule-item" style={{ background: 'rgba(100,116,139,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} color="var(--slate)" />
                        <span><strong>Missing Parameter:</strong> {rule.rule} ({rule.requiredValue})</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate)' }}>
                        Not Provided
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
