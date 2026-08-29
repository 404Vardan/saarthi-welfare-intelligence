import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemeRegistryAPI } from '../../api/registryApi';
import { PlusCircle, Search, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function OpsRegistry() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await SchemeRegistryAPI.fetchAllRegistrySchemes();
      setSchemes(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await SchemeRegistryAPI.updateSchemeStatus(id, newStatus);
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, lifecycle_status: newStatus } : s));
    setToast(`✓ Scheme status updated to ${newStatus}`);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = schemes.filter(s => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      s.official_name?.toLowerCase().includes(q) ||
      s.short_name?.toLowerCase().includes(q) ||
      s.scheme_code?.toLowerCase().includes(q) ||
      s.ministry?.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || s.lifecycle_status === statusFilter;
    const matchType = !typeFilter || s.scheme_type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  return (
    <div>
      <header className="ops-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">Master Scheme Registry</h1>
            <p className="ops-page-subtitle">
              Centralized repository of continuously ingested, versioned, and verified government welfare programmes.
            </p>
          </div>
          <Link to="/operations/add-scheme" className="ops-btn ops-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <PlusCircle size={16} /> Ingest New Scheme
          </Link>
        </div>
      </header>

      {toast && (
        <div className="ops-toast success" style={{ position: 'static', marginBottom: '20px' }}>
          {toast}
        </div>
      )}

      {/* Lifecycle Status Tabs */}
      <div className="ops-tabs">
        <button className={`ops-tab ${statusFilter === 'ALL' ? 'active' : ''}`} onClick={() => setStatusFilter('ALL')}>
          All Schemes ({schemes.length})
        </button>
        <button className={`ops-tab ${statusFilter === 'PUBLISHED' ? 'active' : ''}`} onClick={() => setStatusFilter('PUBLISHED')}>
          Published ({schemes.filter(s => s.lifecycle_status === 'PUBLISHED').length})
        </button>
        <button className={`ops-tab ${statusFilter === 'UNDER_REVIEW' ? 'active' : ''}`} onClick={() => setStatusFilter('UNDER_REVIEW')}>
          Under Review ({schemes.filter(s => s.lifecycle_status === 'UNDER_REVIEW').length})
        </button>
        <button className={`ops-tab ${statusFilter === 'EXPIRED' ? 'active' : ''}`} onClick={() => setStatusFilter('EXPIRED')}>
          Expired / Closed ({schemes.filter(s => s.lifecycle_status === 'EXPIRED').length})
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }} className="ops-search-bar">
          <input
            type="text"
            placeholder="Search by scheme code, official title, or ministry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="ops-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="">All Types</option>
          <option value="direct_benefit">Direct Benefit (DBT)</option>
          <option value="subsidy">Subsidy</option>
          <option value="insurance">Insurance</option>
          <option value="pension">Pension</option>
          <option value="loan">Credit & Loan</option>
          <option value="skill_training">Skill Training</option>
        </select>
      </div>

      {/* Master Table */}
      <div className="ops-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Official Gazette Title</th>
              <th>Type</th>
              <th>Level</th>
              <th>Status</th>
              <th>Quick Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>Loading registry...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>No schemes match criteria.</td></tr>
            ) : (
              filtered.map(s => {
                const statusClass = `ops-badge-${(s.lifecycle_status || 'published').toLowerCase().replace('_', '-')}`;
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#e8c547', fontWeight: 700 }}>
                      {s.scheme_code}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{s.official_name}</div>
                      {s.ministry && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.ministry}</div>}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{(s.scheme_type || '').replace(/_/g, ' ')}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.gov_level}</td>
                    <td>
                      <span className={`ops-badge ${statusClass}`}>
                        {s.lifecycle_status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="ops-select"
                        value={s.lifecycle_status}
                        onChange={e => handleStatusChange(s.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '11px', height: 'auto', background: 'rgba(255,255,255,0.06)' }}
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="EXPIRED">Expired</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/operations/scheme/${s.id}`} className="ops-btn ops-btn-ghost ops-btn-sm" style={{ textDecoration: 'none' }}>
                        Timeline →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
