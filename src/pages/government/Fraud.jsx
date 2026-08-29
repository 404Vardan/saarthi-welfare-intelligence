import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';

export default function GovFraud() {
  const [filter, setFilter] = useState('ALL');
  const [anomalies, setAnomalies] = useState([
    {
      id: 'SIG-8812',
      type: 'Duplicate Household Claim Sequence',
      risk: 'CRITICAL',
      district: 'Jodhpur, Rajasthan',
      description: 'Multiple applications for PMAY-Gramin originating from identical Aadhaar ration sequence within 48 hours.',
      evidence: 'Matched Aadhaar UID hashes: xxxx-xxxx-4092 and xxxx-xxxx-4093 sharing identical ration card PHH-88219.',
      flaggedAt: '28 Aug 2026',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'SIG-7703',
      type: 'Income Slab Discrepancy (ITR vs DBT)',
      risk: 'HIGH',
      district: 'Varanasi, Uttar Pradesh',
      description: 'ITR-1 filings report taxable income exceeding ₹4,50,000 while claiming marginal farmer exemption under PM-KISAN.',
      evidence: 'CBDT income tax telemetry mismatch: Declared ₹1,20,000, Actual Form 26AS ₹4,80,000.',
      flaggedAt: '27 Aug 2026',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'SIG-6519',
      type: 'Deceased Beneficiary Pension Drawdown',
      risk: 'HIGH',
      district: 'Gwalior, Madhya Pradesh',
      description: 'Civil registration death certificate recorded on 12 May 2026 while IGNOAPS pension credits continued for July 2026.',
      evidence: 'Birth & Death Registry certificate #BDR-MP-88192 matching bank account ending in 9102.',
      flaggedAt: '24 Aug 2026',
      status: 'PENDING_REVIEW'
    }
  ]);

  const [toast, setToast] = useState('');

  const handleFlagVerification = (id) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: 'FLAGGED_FOR_FIELD_CHECK' } : a));
    setToast(`✓ Signal #${id} flagged for Field Verification by District Collectorate.`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDismiss = (id) => {
    setAnomalies(prev => prev.filter(a => a.id !== id));
    setToast(`Signal #${id} dismissed as verified exception.`);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = filter === 'ALL' ? anomalies : anomalies.filter(a => a.risk === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="gov-page-title" style={{ margin: 0 }}>Welfare Integrity & Risk Signals</h1>
          <p className="gov-page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Algorithmic anomaly detection identifying duplicate claims, ghost beneficiaries, and income slab discrepancies.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="ops-tabs" style={{ margin: 0 }}>
          <button className={`ops-tab ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All ({anomalies.length})</button>
          <button className={`ops-tab ${filter === 'CRITICAL' ? 'active' : ''}`} onClick={() => setFilter('CRITICAL')}>Critical</button>
          <button className={`ops-tab ${filter === 'HIGH' ? 'active' : ''}`} onClick={() => setFilter('HIGH')}>High</button>
        </div>
      </div>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)', border: '1px solid rgba(31,122,77,0.4)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {filtered.map(a => {
          const isCritical = a.risk === 'CRITICAL';
          const isFlagged = a.status === 'FLAGGED_FOR_FIELD_CHECK';

          return (
            <div key={a.id} className="gov-card" style={{ borderLeft: `4px solid ${isCritical ? 'var(--seal-vermillion)' : 'var(--brass-gold)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
                      #{a.id}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0, fontSize: '1.15rem' }}>
                      {a.type}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    Location: <strong style={{ color: 'white' }}>{a.district}</strong> · Flagged: {a.flaggedAt}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge" style={{ background: isCritical ? 'rgba(193,68,45,0.2)' : 'rgba(166, 135, 61, 0.2)', color: isCritical ? 'var(--seal-vermillion)' : 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>
                    {a.risk} RISK
                  </span>
                  {isFlagged && (
                    <span className="badge badge-eligible" style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)' }}>
                      ✓ Flagged for Inspection
                    </span>
                  )}
                </div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '12px' }}>
                {a.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                  Cross-Departmental Evidence Trace:
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                  {a.evidence}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDismiss(a.id)}
                  className="ops-btn ops-btn-ghost ops-btn-sm"
                >
                  Dismiss Signal
                </button>
                <button
                  type="button"
                  onClick={() => handleFlagVerification(a.id)}
                  className="ops-btn ops-btn-primary ops-btn-sm"
                  disabled={isFlagged}
                >
                  {isFlagged ? '✓ In Inspection Queue' : 'Flag for Field Inspection →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
