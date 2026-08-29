import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CitizenActionPlan() {
  const { profile, documents, applications, evaluations } = useAuth();

  const missingDocs = documents.filter(d => d.status === 'pending');
  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Personalized Action Plan</h1>
          <p className="page-description">
            Prioritized sequence of steps to unlock, prepare, and claim your verified entitlements.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Stage 1: Today / Urgent */}
        <div className="card" style={{ borderLeft: '4px solid var(--seal-vermillion)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--seal-vermillion)', fontWeight: 700, textTransform: 'uppercase' }}>
              Stage 1 // Action Required
            </span>
            <span className="badge badge-nearly">High Priority</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {missingDocs.length > 0 ? (
              missingDocs.map(doc => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={18} color="var(--seal-vermillion)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>Upload {doc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Required to complete readiness for top eligible entitlements.</div>
                    </div>
                  </div>
                  <Link to="/citizen/documents" className="btn btn-primary btn-sm">
                    Upload Proof →
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ledger-green)', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> All primary document proofs are verified in your Locker!
              </div>
            )}
          </div>
        </div>

        {/* Stage 2: Applications to Submit */}
        <div className="card" style={{ borderLeft: '4px solid var(--brass-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
              Stage 2 // Submit Matched Entitlements
            </span>
            <span className="badge badge-eligible">{eligibleSchemes.length} Matched</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {eligibleSchemes.slice(0, 3).map(scheme => (
              <div key={scheme.schemeId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>{scheme.schemeName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>{scheme.benefit} · 100% Rule Match</div>
                </div>
                <Link to={`/citizen/scheme/${scheme.schemeId}`} className="btn btn-secondary btn-sm">
                  View Scheme Hub →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 3: Active Application Milestones */}
        <div className="card" style={{ borderLeft: '4px solid var(--ledger-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 700, textTransform: 'uppercase' }}>
              Stage 3 // Track Active Applications
            </span>
            <span className="badge badge-eligible">{applications.length} In Progress</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map(app => (
              <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>{app.schemeName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                    Ref: <strong>{app.refNumber}</strong> · Status: {app.status}
                  </div>
                </div>
                <Link to="/citizen/applications" className="btn btn-secondary btn-sm">
                  View Milestone Timeline →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
