import React, { useState, useEffect } from 'react';
import { SchemeRegistryAPI } from '../../api/registryApi';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Eye } from 'lucide-react';

export default function OpsVerification() {
  const [queue, setQueue] = useState([]);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    async function load() {
      const items = await SchemeRegistryAPI.fetchVerificationQueue(filter || null);
      setQueue(items);
    }
    load();
  }, [filter]);

  const handleApprove = async (id) => {
    await SchemeRegistryAPI.approveVerification(id, 'Approved by operator', 'Demo Operator');
    setToast('✓ Verification item approved, promoted to VERIFIED, and published to v_active_schemes!');
    setQueue(prev => prev.filter(i => i.id !== id));
    setTimeout(() => setToast(''), 3500);
  };

  const handleRejectSubmit = async () => {
    if (!rejectingId) return;
    await SchemeRegistryAPI.rejectVerification(rejectingId, rejectNotes || 'Rejected by operator', 'Demo Operator');
    setToast('Verification item rejected with operator review notes.');
    setQueue(prev => prev.filter(i => i.id !== rejectingId));
    setRejectingId(null);
    setRejectNotes('');
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div>
      <header className="ops-page-header">
        <h1 className="ops-page-title">Verification & Ingestion Review Queue</h1>
        <p className="ops-page-subtitle">
          Side-by-side rule diff inspection. Approved rules take effect immediately across all citizen recommendation engines.
        </p>
      </header>

      {toast && (
        <div className="ops-toast success" style={{ position: 'static', marginBottom: '20px' }}>
          {toast}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="ops-tabs">
        <button className={`ops-tab ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
        <button className={`ops-tab ${filter === 'PENDING' ? 'active' : ''}`} onClick={() => setFilter('PENDING')}>Pending Review</button>
        <button className={`ops-tab ${filter === 'APPROVED' ? 'active' : ''}`} onClick={() => setFilter('APPROVED')}>Approved</button>
        <button className={`ops-tab ${filter === 'REJECTED' ? 'active' : ''}`} onClick={() => setFilter('REJECTED')}>Rejected</button>
      </div>

      {queue.length === 0 ? (
        <div className="ops-empty-state">
          <div className="empty-icon">✅</div>
          <h4>Verification Queue is Clear</h4>
          <p>All newly discovered schemes and proposed rule revisions have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {queue.map(item => (
            <div key={item.id} className="ops-verification-card">
              <div className="ops-verification-header">
                <div>
                  <div className="ops-verification-title">{item.title}</div>
                  <div className="ops-verification-scheme" style={{ marginTop: '2px' }}>
                    Scheme: <strong style={{ color: 'var(--brass-gold)' }}>{item.scheme_registry?.scheme_code}</strong> · {item.scheme_registry?.official_name}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="ops-badge ops-priority-high">{item.priority}</span>
                  <span className="ops-badge ops-badge-pending">{item.status}</span>
                </div>
              </div>

              <div className="ops-verification-body">
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                  Source: <strong style={{ color: 'white' }}>{item.detection_source}</strong> · Gazette URL: <a href={item.detection_url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>{item.detection_url}</a>
                </div>

                {/* Side-by-Side Visual Diff Container */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Left: Previous Active State */}
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Current Active Rules (v1.0 Baseline)
                    </div>
                    <div className="ops-json" style={{ background: 'rgba(193,68,45,0.08)', borderColor: 'rgba(193,68,45,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                      {JSON.stringify({
                        income_limit: item.proposed_changes?.income_limit?.old || 200000,
                        occupation: ['farmer'],
                        land_ownership: ['below_2_acres', '2_to_5_acres']
                      }, null, 2)}
                    </div>
                  </div>

                  {/* Right: Proposed Revision */}
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                      Proposed Revision ({item.proposed_changes?.version || 'v1.1'})
                    </div>
                    <div className="ops-json" style={{ background: 'rgba(31,122,77,0.1)', borderColor: 'rgba(31,122,77,0.3)', color: '#86efac' }}>
                      {JSON.stringify(item.proposed_changes?.rules || item.proposed_changes, null, 2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ops-verification-actions">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="ops-btn ops-btn-success ops-btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={14} /> Approve & Publish Rule
                </button>
                <button
                  onClick={() => setRejectingId(item.id)}
                  className="ops-btn ops-btn-danger ops-btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <XCircle size={14} /> Reject Revision
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="ops-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>Reject Verification Item</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px' }}>
              Please state the reason for rejection (e.g. invalid gazette citation or conflicting ministry clause).
            </p>
            <div className="ops-form-group">
              <textarea
                className="ops-textarea"
                placeholder="Enter review notes..."
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="ops-btn ops-btn-ghost ops-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="ops-btn ops-btn-danger ops-btn-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
