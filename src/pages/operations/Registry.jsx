import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemesData } from '../../api/schemesData';
import { PlusCircle, Search, Filter, CheckCircle2, AlertCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function OpsRegistry() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await SchemesData.fetchAllSchemes();
      setSchemes(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = schemes.filter(s => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      s.official_name?.toLowerCase().includes(q) ||
      s.name?.toLowerCase().includes(q) ||
      s.short_name?.toLowerCase().includes(q) ||
      s.scheme_code?.toLowerCase().includes(q) ||
      s.ministry?.toLowerCase().includes(q) ||
      s.state?.toLowerCase().includes(q);

    const matchLevel = levelFilter === 'ALL' ||
      (levelFilter === 'CENTRAL' && s.government_level === 'central') ||
      (levelFilter === 'STATE' && s.government_level === 'state');

    const matchCategory = !categoryFilter || s.category === categoryFilter;

    return matchSearch && matchLevel && matchCategory;
  });

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">Master Scheme Registry</h1>
            <p className="ops-page-subtitle">
              Centralized repository of continuously ingested, versioned, and verified government welfare programmes ({schemes.length} Active Policies).
            </p>
          </div>
          <Link to="/operations/add-scheme" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <PlusCircle size={16} /> Ingest New Scheme
          </Link>
        </div>
      </header>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Level Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          className={`filter-chip ${levelFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setLevelFilter('ALL')}
          style={{ cursor: 'pointer' }}
        >
          All Programmes ({schemes.length})
        </button>
        <button
          className={`filter-chip ${levelFilter === 'CENTRAL' ? 'active' : ''}`}
          onClick={() => setLevelFilter('CENTRAL')}
          style={{ cursor: 'pointer' }}
        >
          Central Schemes ({schemes.filter(s => s.government_level === 'central').length})
        </button>
        <button
          className={`filter-chip ${levelFilter === 'STATE' ? 'active' : ''}`}
          onClick={() => setLevelFilter('STATE')}
          style={{ cursor: 'pointer' }}
        >
          State Schemes ({schemes.filter(s => s.government_level === 'state').length})
        </button>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search 100+ schemes by code, official name, state, or nodal ministry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ width: '220px' }}
        >
          <option value="">All Categories</option>
          <option value="agriculture">Agriculture & Allied</option>
          <option value="health">Healthcare & Nutrition</option>
          <option value="housing">Housing & Sanitation</option>
          <option value="social_security">Social Security & Pensions</option>
          <option value="credit">Financial Inclusion & MSME</option>
          <option value="education">Education & Scholarships</option>
          <option value="women">Women & Child</option>
        </select>
      </div>

      {/* Registry Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', boxShadow: '0 4px 16px rgba(11, 31, 58, 0.05)' }}>
        <table className="table" style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFFDF9', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Code & Version</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Official Programme Name</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Nodal Ministry / State</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Entitlement Benefit</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
                    {s.scheme_code}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>
                    Rule {s.rule_version || s.version || 'v1.0'}
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.9rem' }}>
                    {s.official_name || s.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'capitalize' }}>
                    {s.category} · {s.type?.replace(/_/g, ' ') || 'Direct Benefit'}
                  </div>
                </td>

                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--slate)' }}>
                  <div>{s.ministry || 'Government of India'}</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.75rem' }}>
                    {s.state === 'All-India' ? 'Pan-India Central' : `${s.state} State`}
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ledger-green)', fontSize: '0.85rem' }}>
                    {s.benefit}
                  </span>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link
                      to={`/operations/scheme/${s.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      Inspect / Edit →
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
