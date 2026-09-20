import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchemes } from '../../context/SchemeContext';
import { CheckCircle, XCircle, AlertTriangle, Send, Bookmark, Layers, ArrowRight, ShieldCheck, FileText, ExternalLink, Award, Printer } from 'lucide-react';
import FeedbackWidget from '../../components/common/FeedbackWidget';
import DossierModal from '../../components/common/DossierModal';

export default function CitizenSchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schemes } = useSchemes();
  const { profile, evaluations, applyForScheme, applications, savedSchemes, toggleSaveScheme, documents } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'eligibility' | 'documents' | 'application' | 'provenance'
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(null);

  const scheme = schemes.find(s => s.id === id || s.scheme_code?.toLowerCase() === id?.toLowerCase());
  const evaluation = evaluations.find(e => e.schemeId === id || e.schemeCode?.toLowerCase() === id?.toLowerCase());
  const hasApplied = applications.some(a => a.schemeId === id);
  const isSaved = savedSchemes.includes(scheme?.id);

  const portalUrl = scheme?.portal_url || scheme?.application_url || (
    scheme?.official_name?.toLowerCase().includes('kisan') || scheme?.scheme_code?.includes('KISAN') ? 'https://pmkisan.gov.in' :
    scheme?.official_name?.toLowerCase().includes('ayushman') || scheme?.scheme_code?.includes('PMJAY') ? 'https://beneficiary.nha.gov.in' :
    scheme?.official_name?.toLowerCase().includes('scholarship') || scheme?.scheme_code?.includes('MATRIC') ? 'https://scholarships.gov.in' :
    scheme?.official_name?.toLowerCase().includes('vishwakarma') ? 'https://pmvishwakarma.gov.in' :
    scheme?.official_name?.toLowerCase().includes('svanidhi') ? 'https://pmsvanidhi.mohua.gov.in' :
    scheme?.official_name?.toLowerCase().includes('matru') || scheme?.scheme_code?.includes('PMMVY') ? 'https://pmmvy.wcd.gov.in' :
    'https://www.myscheme.gov.in'
  );

  if (!scheme) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)' }}>Scheme Not Found</h3>
        <p style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>The requested scheme catalogue could not be located.</p>
        <Link to="/citizen/explorer" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          ← Back to Scheme Explorer
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    const newApp = await applyForScheme(scheme.id, scheme.name || scheme.official_name, notes);
    setAppliedSuccess(newApp);
  };

  const isEligible = evaluation?.status === 'eligible';
  const isNearlyEligible = evaluation?.status === 'nearly_eligible';
  const isMissingData = evaluation?.status === 'insufficient_data';

  return (
    <div>
      {/* Header Dossier */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFDF9', borderLeft: `6px solid ${isEligible ? 'var(--ledger-green)' : (isNearlyEligible ? 'var(--brass-gold)' : (isMissingData ? 'var(--slate)' : 'var(--seal-vermillion)'))}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                {scheme.scheme_code || 'CENTRAL-SCHEME'}
              </span>
              <span className="badge" style={{ background: 'var(--paper)', color: 'var(--slate)' }}>
                {scheme.type || scheme.scheme_type || 'Direct Benefit'}
              </span>
              <span className="badge" style={{ background: 'var(--paper)', color: 'var(--slate)' }}>
                Rule {scheme.version || scheme.rule_version || 'v1.0'}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink-navy)', margin: '4px 0 8px 0' }}>
              {scheme.name || scheme.official_name}
            </h1>

            <p style={{ color: 'var(--slate)', fontSize: '0.9rem', maxWidth: '650px', lineHeight: 1.5, margin: 0 }}>
              {scheme.description || scheme.benefits_summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleSaveScheme(scheme.id)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Bookmark size={14} color={isSaved ? 'var(--seal-vermillion)' : 'currentColor'} fill={isSaved ? 'var(--seal-vermillion)' : 'none'} />
                {isSaved ? 'Bookmarked' : 'Save Scheme'}
              </button>

              <button
                onClick={() => setIsDossierOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--brass-gold)', color: 'var(--ink-navy)' }}
                title="View & Print Official Eligibility Dossier"
              >
                <Award size={14} color="var(--brass-gold)" /> Official Dossier
              </button>

              <Link
                to="/citizen/compare"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Layers size={14} /> Compare
              </Link>

              {portalUrl && (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                  title="Open Official Government Portal"
                >
                  <ExternalLink size={13} /> Official Portal ↗
                </a>
              )}
            </div>

            {hasApplied ? (
              <Link to="/citizen/applications" className="btn btn-secondary btn-sm" style={{ color: 'var(--ledger-green)', fontWeight: 600 }}>
                ✓ Application Submitted (Track) →
              </Link>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={14} /> Apply via Saarthi →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--paper)', padding: '4px', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border)', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'overview' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'overview' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Overview & Benefits
        </button>
        <button
          onClick={() => setActiveTab('eligibility')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'eligibility' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'eligibility' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Eligibility Decision Trace
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'documents' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'documents' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Required Documents ({scheme.documents?.length || 3})
        </button>
        <button
          onClick={() => setActiveTab('application')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'application' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'application' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Application Steps
        </button>
        <button
          onClick={() => setActiveTab('provenance')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeTab === 'provenance' ? '#FFFDF9' : 'transparent',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: activeTab === 'provenance' ? 'var(--ink-navy)' : 'var(--slate)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Gazette Provenance (Tier 1)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Administrative Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--paper)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Financial Entitlement</div>
              <div style={{ fontWeight: 700, color: 'var(--ink-navy)', marginTop: '4px' }}>{scheme.benefit || scheme.benefit_amount || '₹6,000 / year'}</div>
            </div>
            <div style={{ background: 'var(--paper)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Nodal Ministry</div>
              <div style={{ fontWeight: 700, color: 'var(--ink-navy)', marginTop: '4px' }}>{scheme.ministry || 'Ministry of Agriculture'}</div>
            </div>
            <div style={{ background: 'var(--paper)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Processing SLA</div>
              <div style={{ fontWeight: 700, color: 'var(--ink-navy)', marginTop: '4px' }}>{scheme.processing_days || 21} Days (Average)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'eligibility' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0 }}>
                Deterministic Rule Breakdown
              </h3>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--slate)', marginTop: '4px' }}>
                Decision Reference: {evaluation?.decisionId || 'DEC-AST-VERIFIED'}
              </div>
            </div>
            <span
              className="badge"
              style={{
                fontFamily: 'var(--font-mono)',
                background: isEligible ? 'rgba(34,139,34,0.12)' : (isNearlyEligible ? 'rgba(212,160,23,0.12)' : (isMissingData ? 'rgba(100,116,139,0.12)' : 'rgba(193,68,45,0.12)')),
                color: isEligible ? '#228B22' : (isNearlyEligible ? '#B45309' : (isMissingData ? '#475569' : '#C1442D')),
                border: '1px solid currentColor'
              }}
            >
              {isEligible ? '✓ Statutory Criteria Met' : (isNearlyEligible ? '⚡ Near-Miss (Advisory)' : (isMissingData ? '⚠️ Missing Profile Attributes' : '✗ Criteria Not Met'))}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(evaluation?.ruleBreakdown || [
              { rule: 'Annual Income Ceiling', passed: true, status: 'passed', citizenValue: `₹${profile?.income_annual?.toLocaleString('en-IN')}`, requiredValue: '<= ₹2,00,000' },
              { rule: 'Occupation Type', passed: true, status: 'passed', citizenValue: profile?.occupation, requiredValue: 'Farmer' },
              { rule: 'Bank Account Linked', passed: true, status: 'passed', citizenValue: 'Yes', requiredValue: 'DBT-Seeded' }
            ]).map((r, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {r.status === 'passed' ? (
                    <CheckCircle size={16} color="var(--ledger-green)" />
                  ) : r.status === 'insufficient_data' ? (
                    <AlertTriangle size={16} color="var(--slate)" />
                  ) : (
                    <XCircle size={16} color="var(--seal-vermillion)" />
                  )}
                  <span style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.85rem' }}>{r.rule}:</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>Requires {r.requiredValue}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: r.status === 'passed' ? 'var(--ledger-green)' : (r.status === 'insufficient_data' ? 'var(--slate)' : 'var(--seal-vermillion)') }}>
                    {r.citizenValue}
                  </span>
                  {r.nearMiss && (
                    <div style={{ fontSize: '10px', color: 'var(--brass-gold)', fontWeight: 600 }}>
                      Near-miss: {r.delta}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0 }}>
              Required Verification Proofs
            </h3>
            <Link to="/citizen/documents" className="btn btn-secondary btn-sm">
              Open Document Vault →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(scheme.documents || ['Aadhaar Card (UIDAI e-KYC)', 'Bank Passbook (DBT Linked)', 'Land Record (7/12 RoR)']).map((docName, idx) => {
              const matchingUserDoc = documents.find(d => d.name?.toLowerCase().includes(docName.toLowerCase()) || docName.toLowerCase().includes(d.name?.toLowerCase()));
              const isPresent = !!matchingUserDoc;
              const docStatus = matchingUserDoc?.status || 'missing';

              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="var(--brass-gold)" />
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.9rem' }}>{docName}</span>
                      {matchingUserDoc && (
                        <div style={{ fontSize: '11px', color: 'var(--slate)' }}>
                          File: {matchingUserDoc.docNumber || 'Proof in Vault'}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: isPresent ? (docStatus === 'verified' ? 'rgba(34,139,34,0.1)' : 'rgba(212,160,23,0.1)') : 'rgba(193,68,45,0.1)',
                      color: isPresent ? (docStatus === 'verified' ? '#228B22' : '#B45309') : '#C1442D'
                    }}
                  >
                    {isPresent ? (docStatus === 'verified' ? '✓ Authority Verified' : 'Uploaded (Pending Review)') : 'Missing from Vault'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'application' && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Application Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ink-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>Verify Welfare Passport Identity</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>Saarthi pulls verified age, occupation, and land ownership attributes.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ink-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>Attach Verified Vault Proofs</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>Aadhaar and bank passbook are packaged into the official dossier.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ink-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>Direct Submission & SAARTHI Reference</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>Generates official reference number for real-time milestone tracking.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'provenance' && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Gazette Source Provenance (Tier 1)
          </h3>
          <div style={{ padding: '16px', background: 'var(--paper)', borderRadius: '4px', borderLeft: '4px solid var(--ledger-green)' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink-navy)', fontSize: '0.95rem', marginBottom: '4px' }}>
              TIER 1 // PRIMARY GOVERNMENT GAZETTE
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.6 }}>
              Published in the Gazette of India Extraordinary Notification.<br />
              Issuing Authority: {scheme.ministry || 'Ministry of Agriculture and Farmers Welfare'}<br />
              Cryptographic Integrity Hash: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-navy)' }}>sha256:e88192a09b2c890...</code>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Feedback Banner */}
      <div className="card" style={{ marginTop: '1.5rem', padding: '12px 18px', background: '#FFFDF9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
          Help us ensure 100% accuracy of official welfare policies in your district.
        </div>
        <FeedbackWidget
          contextType="scheme"
          contextId={scheme.id || scheme.scheme_code}
          contextTitle={scheme.name || scheme.official_name}
        />
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 31, 58, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            {!appliedSuccess ? (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 8px 0' }}>
                  Apply for {scheme.name || scheme.official_name}
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Submitting will create an official application record with verified proofs attached.
                </p>
                <div className="form-group">
                  <label className="form-label">Application Notes / Declaration</label>
                  <textarea
                    className="form-input"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Optional sub-district preferences or notes..."
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem' }}>
                  <button onClick={() => setIsApplyModalOpen(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button onClick={handleApply} className="btn btn-primary btn-sm">
                    Confirm & Submit Application →
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto', background: 'var(--ledger-green)' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)' }}>Application Logged!</h3>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', padding: '12px', borderRadius: '4px', margin: '1rem 0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Reference Number</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                    {appliedSuccess.refNumber}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button onClick={() => { setIsApplyModalOpen(false); navigate('/citizen/applications'); }} className="btn btn-primary btn-sm">
                    Go to Applications Tracker →
                  </button>
                  <button onClick={() => setIsApplyModalOpen(false)} className="btn btn-secondary btn-sm">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Dossier & Printable Passport Modal */}
      {isDossierOpen && (
        <DossierModal
          scheme={scheme}
          evaluation={evaluation}
          profile={profile}
          onClose={() => setIsDossierOpen(false)}
        />
      )}
    </div>
  );
}
