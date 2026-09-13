import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Send,
  Eye,
  Download,
  X
} from 'lucide-react';

export default function CitizenApplications() {
  const { applications, profile } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <span className="badge badge-eligible" style={{ textTransform: 'uppercase' }}>Approved & Disbursed</span>;
      case 'under_review':
      case 'under_verification':
        return <span className="badge badge-nearly" style={{ textTransform: 'uppercase' }}>Under Verification</span>;
      case 'submitted':
        return <span className="badge" style={{ background: 'rgba(11, 31, 58, 0.08)', color: 'var(--ink-navy)', textTransform: 'uppercase' }}>Submitted</span>;
      case 'rejected':
        return <span className="badge" style={{ background: 'rgba(184, 51, 42, 0.1)', color: 'var(--seal-vermillion)', textTransform: 'uppercase' }}>Requires Revision</span>;
      default:
        return <span className="badge" style={{ textTransform: 'uppercase' }}>{status.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Welfare Application Tracker</h1>
          <p className="page-description">
            End-to-end milestone tracking across your submitted welfare entitlements.
          </p>
        </div>
        <Link to="/citizen/recommendations" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Send size={14} /> Apply for New Scheme
        </Link>
      </header>

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <FolderOpen size={52} color="var(--brass-gold)" style={{ margin: '0 auto 14px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 6px 0', fontSize: '1.3rem' }}>
            No Active Applications Yet
          </h3>
          <p style={{ color: 'var(--slate)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            Review your matched eligible schemes and submit your first application with auto-attached verified proofs.
          </p>
          <Link to="/citizen/recommendations" className="btn btn-primary btn-sm">
            Explore Recommended Schemes →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {applications.map(app => (
            <div key={app.id} className="card application-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                      {app.refNumber || 'SAARTHI-2026-004891'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--slate)' }}>
                      · Applied: {app.appliedAt}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink-navy)', margin: 0 }}>
                    {app.schemeName}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getStatusBadge(app.status)}
                  <button
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                  >
                    <Eye size={13} /> View Dossier
                  </button>
                </div>
              </div>

              {/* 6-Stage Timeline */}
              <div className="timeline">
                {(app.timeline || [
                  { label: 'Eligibility Verified', date: app.appliedAt, done: true },
                  { label: 'Proofs Assembled', date: app.appliedAt, done: true },
                  { label: 'Application Submitted', date: app.appliedAt, done: true },
                  { label: 'District Verification', date: 'In Progress', active: true },
                  { label: 'Sanction Order', date: 'Pending' },
                  { label: 'DBT Direct Disbursal', date: 'Pending' }
                ]).map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className={`timeline-dot ${step.done ? 'active' : (step.active ? 'pending' : '')}`}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
                      {step.label}
                    </div>
                    <div className="timeline-ref" style={{ fontSize: '0.75rem' }}>{step.date}</div>
                  </div>
                ))}
              </div>

              {/* Actionable Next Step Alert */}
              <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>
                  <strong>Next Action:</strong> Revenue Department verification in progress. Keep your 7/12 RoR and Aadhaar handy for spot inspection.
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-navy)', fontFamily: 'var(--font-mono)' }}>
                  SLA: ~14 Business Days
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED DOSSIER MODAL */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '620px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button
              onClick={() => setSelectedApp(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div className="brand-seal-mark" style={{ background: 'var(--ink-navy)' }}>✦</div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                  REFERENCE: {selectedApp.refNumber}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '2px 0 0 0', fontSize: '1.3rem' }}>
                  {selectedApp.schemeName}
                </h3>
              </div>
            </div>

            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px 0', color: 'var(--ink-navy)' }}>
                Application Metadata
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><strong>Applicant Name:</strong> {profile?.full_name || 'Verified Citizen'}</div>
                <div><strong>Submission Date:</strong> {selectedApp.appliedAt}</div>
                <div><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedApp.status.replace(/_/g, ' ')}</span></div>
                <div><strong>Disbursement Mode:</strong> Direct Benefit Transfer (DBT)</div>
                <div><strong>District Authority:</strong> {profile?.district || 'Surat'}, {profile?.state || 'Gujarat'}</div>
                <div><strong>Attached Proofs:</strong> 3 Verified Documents</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px 0', color: 'var(--ink-navy)' }}>
                Attached Verification Dossier
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Aadhaar e-KYC Proof (UIDAI Verified)',
                  'Income Certificate (INC/2025/SUR/88412)',
                  'Land Record 7/12 RoR (AnyRoR Gujarat)'
                ].map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={14} color="var(--seal-vermillion)" />
                      <span>{doc}</span>
                    </div>
                    <span className="badge badge-eligible" style={{ fontSize: '10px' }}>Attached</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => alert(`Receipt downloaded for ${selectedApp.refNumber}`)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Download Ack Slip (.PDF)
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn btn-primary btn-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
