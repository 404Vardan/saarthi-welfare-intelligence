import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertTriangle, ArrowRight, Layers, Send } from 'lucide-react';

export default function CitizenCompare() {
  const { evaluations } = useAuth();
  const [selectedIds, setSelectedIds] = useState(() => {
    if (evaluations && evaluations.length >= 2) {
      return [evaluations[0].schemeId, evaluations[1].schemeId];
    }
    return ['pm-kisan-001', 'pmjay-002'];
  });

  const selectedSchemes = evaluations.filter(e => selectedIds.includes(e.schemeId));

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Compare Welfare Entitlements</h1>
          <p className="page-description">
            Side-by-side entitlement values, gazette criteria, mandatory document proofs, and turnaround times. Select up to 3 schemes.
          </p>
        </div>
        <Link to="/citizen/recommendations" className="btn btn-secondary btn-sm">
          ← Back to Matched Schemes
        </Link>
      </header>

      {/* Select Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-navy)' }}>Select Schemes:</span>
        {evaluations.slice(0, 8).map(e => {
          const isSelected = selectedIds.includes(e.schemeId);
          return (
            <button
              key={e.schemeId}
              type="button"
              onClick={() => toggleSelect(e.schemeId)}
              className={`filter-chip ${isSelected ? 'active' : ''}`}
              style={{
                cursor: 'pointer',
                background: isSelected ? 'var(--seal-vermillion)' : 'var(--paper)',
                color: isSelected ? 'white' : 'var(--ink-navy)',
                borderColor: isSelected ? 'var(--seal-vermillion)' : 'var(--border)'
              }}
            >
              {isSelected ? '✓ ' : '+ '}{e.schemeShortName || e.schemeCode || e.schemeName?.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Compare Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', boxShadow: '0 4px 20px rgba(11, 31, 58, 0.05)' }}>
        <table className="table" style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFFDF9', borderBottom: '2px solid var(--border)' }}>
              <th style={{ width: '200px', padding: '16px', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--slate)' }}>Criteria</th>
              {selectedSchemes.map(s => (
                <th key={s.schemeId} style={{ padding: '16px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                    {s.schemeCode}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink-navy)', marginTop: '2px' }}>
                    {s.schemeName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Annual Benefit Value</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ledger-green)', fontSize: '1.05rem' }}>
                  {s.benefit}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Entitlement Classification</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px', textTransform: 'capitalize', color: 'var(--slate)' }}>
                  {(s.type || s.scheme_type || 'Direct Benefit Transfer').replace(/_/g, ' ')}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Eligibility Status</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px' }}>
                  <span className={`badge ${s.status === 'eligible' ? 'badge-eligible' : 'badge-nearly'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                    {s.status === 'eligible' ? '✓ 100% Eligible' : 'Action Required'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Target Beneficiary</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--slate)' }}>
                  {s.target_group || 'Marginal / Small Farmers & Vulnerable Households'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Mandatory Verification Proofs</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px' }}>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--slate)' }}>
                    {(s.documents || ['Aadhaar Card', 'Bank Passbook', 'Income Proof']).map((doc, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{doc}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink-navy)' }}>Action</td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ padding: '14px 16px' }}>
                  <Link to={`/citizen/scheme/${s.schemeId}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    View Dossier →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
