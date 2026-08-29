import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CitizenCompare() {
  const { evaluations } = useAuth();
  const [selectedIds, setSelectedIds] = useState(['pm-kisan-001', 'pmjay-002']);

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
          <h1 className="page-title">Compare Welfare Programmes</h1>
          <p className="page-description">
            Side-by-side entitlement benefits, requirements, and disbursement timelines.
          </p>
        </div>
      </header>

      {/* Select Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {evaluations.slice(0, 6).map(e => (
          <button
            key={e.schemeId}
            onClick={() => toggleSelect(e.schemeId)}
            className={`filter-chip ${selectedIds.includes(e.schemeId) ? 'active' : ''}`}
          >
            {e.schemeShortName || e.schemeCode}
          </button>
        ))}
      </div>

      {/* Compare Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '220px' }}>Criteria</th>
              {selectedSchemes.map(s => (
                <th key={s.schemeId}>{s.schemeName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Benefit Value</strong></td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink-navy)' }}>
                  {s.benefit}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Disbursement Type</strong></td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId} style={{ textTransform: 'capitalize' }}>
                  {(s.type || '').replace(/_/g, ' ')}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Eligibility Status</strong></td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId}>
                  <span className={`badge ${s.status === 'eligible' ? 'badge-eligible' : 'badge-nearly'}`}>
                    {s.status === 'eligible' ? 'Eligible (100%)' : 'Action Required'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Mandatory Proofs</strong></td>
              {selectedSchemes.map(s => (
                <td key={s.schemeId}>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                    {(s.documents || []).map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
