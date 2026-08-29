import React, { useState } from 'react';
import { GovAnalyticsAPI } from '../../api/govAnalyticsApi';
import { Search, UserCheck, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function GovAudit() {
  const [query, setQuery] = useState('SAARTHI-2026-004891');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const record = await GovAnalyticsAPI.fetchCitizenAuditRecord(query.trim());
    setResult(record);
    setHasSearched(true);
  };

  return (
    <div>
      <h1 className="gov-page-title">Citizen Entitlement Audit</h1>
      <p className="gov-page-subtitle">
        Inspect an individual citizen's welfare ledger across all departments with verified provenance.
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input
          type="text"
          className="ops-input"
          placeholder="Search by Citizen ID, Name (e.g. Ramesh Yadav), or Reference No (e.g. SAARTHI-2026-004891)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px 16px' }}
        />
        <button type="submit" className="ops-btn ops-btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={16} /> Audit Dossier
        </button>
      </form>

      {result ? (
        <div className="gov-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase' }}>
                Audited Beneficiary Dossier
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: '2px 0 4px 0', fontSize: '1.5rem' }}>
                {result.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                Citizen ID: <strong style={{ color: 'white' }}>{result.citizenId}</strong> · {result.occupation} · {result.district}
              </div>
            </div>
            <span className="badge badge-eligible" style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)' }}>
              ✓ Biometric & DBT Verified
            </span>
          </div>

          {/* Demographic Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Annual Income</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'white', fontWeight: 600 }}>{result.annualIncome}</div>
            </div>
            <div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Social Category</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'white', fontWeight: 600 }}>{result.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Locker Proofs</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 600 }}>{result.verifiedProofs.length} Verified</div>
            </div>
          </div>

          {/* Active Disbursed Entitlements */}
          <h4 style={{ color: 'var(--brass-gold)', marginBottom: '0.75rem', fontSize: '14px' }}>Active Disbursed Entitlements:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
            {result.schemesReceived.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    Ref: {s.refNumber} · Benefit: {s.amount}
                  </div>
                </div>
                <span style={{ color: 'var(--ledger-green)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ {s.status} ({s.date})
                </span>
              </div>
            ))}
          </div>

          {/* Unclaimed Eligible Opportunities */}
          <h4 style={{ color: 'var(--seal-vermillion)', marginBottom: '0.75rem', fontSize: '14px' }}>Unclaimed Eligible Opportunities:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.eligibleUnclaimed.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(193,68,45,0.05)', borderRadius: '4px', border: '1px solid rgba(193,68,45,0.15)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    Potential Benefit: {s.amount}
                  </div>
                </div>
                <span style={{ color: 'var(--seal-vermillion)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  {s.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={40} color="var(--seal-vermillion)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'white' }}>No Citizen Record Found</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Verify the Citizen ID or Reference Number and search again.
          </p>
        </div>
      ) : null}
    </div>
  );
}
