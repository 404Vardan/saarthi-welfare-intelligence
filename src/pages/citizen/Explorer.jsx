import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchemes } from '../../context/SchemeContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Bookmark, Layers, Send, ArrowRight, Check } from 'lucide-react';

export default function CitizenExplorer() {
  const { schemes } = useSchemes();
  const { applications, applyForScheme } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedSchemes, setSavedSchemes] = useState(new Set());

  const toggleSave = (id) => {
    setSavedSchemes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'direct_benefit', label: 'Direct Benefit (DBT)' },
    { id: 'subsidy', label: 'Housing & Subsidies' },
    { id: 'insurance', label: 'Health & Insurance' },
    { id: 'pension', label: 'Social Security & Pension' },
    { id: 'loan', label: 'Credit & Concessions' }
  ];

  const appliedSchemeIds = new Set(applications.map(a => a.schemeId));

  const filteredSchemes = schemes.filter(scheme => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (scheme.name || scheme.official_name || '').toLowerCase().includes(term) ||
      (scheme.description || scheme.benefits_summary || '').toLowerCase().includes(term) ||
      (scheme.scheme_code || '').toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'all' ||
      scheme.type === selectedCategory ||
      scheme.scheme_type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Explore Welfare Catalogues</h1>
          <p className="page-description">
            Search and inspect official government programmes indexed across Central and State ministries.
          </p>
        </div>
      </header>

      {/* Search Bar & Category Chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={18} color="var(--brass-gold)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by keywords, crops, housing, health, or scheme code (e.g. Kisan, PMJAY, Solar)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                background: selectedCategory === c.id ? 'var(--ink-navy)' : 'var(--paper)',
                color: selectedCategory === c.id ? 'white' : 'var(--ink-navy)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredSchemes.map(scheme => {
          const isSaved = savedSchemes.has(scheme.id);
          const hasApplied = appliedSchemeIds.has(scheme.id);

          return (
            <div key={scheme.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                    {scheme.scheme_code || 'CENTRAL-SCHEME'}
                  </span>
                  <button
                    onClick={() => toggleSave(scheme.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isSaved ? 'var(--seal-vermillion)' : 'var(--slate)' }}
                    title="Bookmark Scheme"
                  >
                    <Bookmark size={16} fill={isSaved ? 'var(--seal-vermillion)' : 'none'} />
                  </button>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--ink-navy)', margin: '0 0 6px 0' }}>
                  {scheme.name || scheme.official_name}
                </h3>

                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.45, marginBottom: '1rem', minHeight: '38px' }}>
                  {scheme.description || scheme.benefits_summary}
                </p>

                <div style={{ background: 'var(--paper)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                  <div style={{ color: 'var(--slate)', fontSize: '10.5px', textTransform: 'uppercase' }}>Financial Entitlement</div>
                  <div style={{ fontWeight: 700, color: 'var(--ink-navy)', marginTop: '2px' }}>
                    {scheme.benefit || scheme.benefit_amount || 'Direct Financial Aid'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', gap: '8px' }}>
                <Link
                  to="/citizen/compare"
                  style={{ color: 'var(--slate)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 500 }}
                >
                  <Layers size={14} /> Compare
                </Link>

                <Link
                  to={`/citizen/scheme/${scheme.id}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  View Scheme Hub →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
