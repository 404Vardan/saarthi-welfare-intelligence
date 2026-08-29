import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FolderOpen, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export default function CitizenApplications() {
  const { applications } = useAuth();

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Application Tracker</h1>
          <p className="page-description">
            Live lifecycle tracking across all your submitted welfare requests.
          </p>
        </div>
        <Link to="/citizen/recommendations" className="btn btn-primary btn-sm">
          + New Application
        </Link>
      </header>

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FolderOpen size={48} color="var(--brass-gold)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 6px 0' }}>
            No Active Applications Yet
          </h3>
          <p style={{ color: 'var(--slate)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Review your matched eligible schemes and submit your first application directly through Saarthi.
          </p>
          <Link to="/citizen/recommendations" className="btn btn-primary btn-sm">
            Explore Recommended Schemes →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {applications.map(app => (
            <div key={app.id} className="card application-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink-navy)', margin: 0 }}>
                    {app.schemeName}
                  </h3>
                  <div className="application-ref" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    Ref: <strong>{app.refNumber}</strong> · Applied: {app.appliedAt}
                  </div>
                </div>

                <span className={`badge ${app.status === 'approved' ? 'badge-eligible' : 'badge-pending'}`} style={{ textTransform: 'uppercase' }}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              {/* Timeline */}
              <div className="timeline">
                {(app.timeline || []).map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className={`timeline-dot ${step.done ? 'active' : (step.active ? 'pending' : '')}`}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>
                      {step.label}
                    </div>
                    <div className="timeline-ref">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
