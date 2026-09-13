import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Filter, Search, Award } from 'lucide-react';

export default function GovPerformance() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const schemes = [
    {
      code: 'PM-KISAN',
      name: 'Pradhan Mantri Kisan Samman Nidhi',
      ministry: 'Ministry of Agriculture',
      category: 'agriculture',
      budget: '₹60,000 Cr',
      disbursed: '₹58,400 Cr',
      saturation: '94.2%',
      processingDays: 14,
      slaTarget: 21,
      satisfaction: '94%',
      status: 'optimal'
    },
    {
      code: 'PM-JAY',
      name: 'Ayushman Bharat PM-JAY',
      ministry: 'Ministry of Health & Family Welfare',
      category: 'health',
      budget: '₹7,500 Cr',
      disbursed: '₹6,980 Cr',
      saturation: '88.6%',
      processingDays: 6,
      slaTarget: 10,
      satisfaction: '96%',
      status: 'optimal'
    },
    {
      code: 'PMAY-G',
      name: 'Pradhan Mantri Awas Yojana (Gramin)',
      ministry: 'Ministry of Rural Development',
      category: 'housing',
      budget: '₹54,000 Cr',
      disbursed: '₹41,200 Cr',
      saturation: '76.3%',
      processingDays: 42,
      slaTarget: 45,
      satisfaction: '82%',
      status: 'moderate'
    },
    {
      code: 'PM-VISHWAKARMA',
      name: 'PM Vishwakarma Kaushal Samman',
      ministry: 'Ministry of MSME',
      category: 'credit',
      budget: '₹13,000 Cr',
      disbursed: '₹8,900 Cr',
      saturation: '68.5%',
      processingDays: 16,
      slaTarget: 21,
      satisfaction: '90%',
      status: 'moderate'
    },
    {
      code: 'PM-SVANIDHI',
      name: 'PM SVANidhi (Street Vendors)',
      ministry: 'Ministry of Housing & Urban Affairs',
      category: 'credit',
      budget: '₹4,500 Cr',
      disbursed: '₹4,120 Cr',
      saturation: '91.5%',
      processingDays: 7,
      slaTarget: 14,
      satisfaction: '93%',
      status: 'optimal'
    },
    {
      code: 'GUJ-MA',
      name: 'Mukhyamantri Amrutam (Gujarat)',
      ministry: 'Health Department, Gujarat',
      category: 'health',
      budget: '₹2,200 Cr',
      disbursed: '₹2,050 Cr',
      saturation: '93.2%',
      processingDays: 5,
      slaTarget: 7,
      satisfaction: '95%',
      status: 'optimal'
    },
    {
      code: 'PMS-SC',
      name: 'Post-Matric Scholarship for SC Students',
      ministry: 'Ministry of Social Justice',
      category: 'education',
      budget: '₹6,200 Cr',
      disbursed: '₹5,100 Cr',
      saturation: '82.3%',
      processingDays: 28,
      slaTarget: 30,
      satisfaction: '86%',
      status: 'optimal'
    },
    {
      code: 'APY',
      name: 'Atal Pension Yojana',
      ministry: 'Ministry of Finance',
      category: 'social_security',
      budget: '₹3,800 Cr',
      disbursed: '₹3,650 Cr',
      saturation: '96.0%',
      processingDays: 3,
      slaTarget: 7,
      satisfaction: '92%',
      status: 'optimal'
    }
  ];

  const filtered = schemes.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <header className="gov-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="gov-page-title">Scheme Performance & Delivery Scorecard</h1>
          <p className="gov-page-subtitle">
            Cross-ministry disbursement velocity, turnaround SLAs, and target saturation analytics.
          </p>
        </div>
      </header>

      {/* KPI Overview Strip */}
      <div className="gov-kpi-strip" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-stat-card">
          <div className="stat-label">Total Outlay Disbursed</div>
          <div className="stat-value text-ledger-green">₹1,42,800 Cr</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>91.4% of Annual Budget</span>
        </div>

        <div className="gov-stat-card">
          <div className="stat-label">Avg. Processing SLA</div>
          <div className="stat-value text-brass-gold">14.2 Days</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Target: &lt;21 Days</span>
        </div>

        <div className="gov-stat-card">
          <div className="stat-label">National Saturation Index</div>
          <div className="stat-value text-white">83.4%</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Eligible Population Reached</span>
        </div>

        <div className="gov-stat-card">
          <div className="stat-label">Citizen Satisfaction Rating</div>
          <div className="stat-value text-brass-gold">91.2% ★</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Direct Citizen Feedback</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.15)' }}
            placeholder="Search programme, ministry, or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['ALL', 'agriculture', 'health', 'housing', 'credit', 'education', 'social_security'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              style={{
                textTransform: 'capitalize',
                background: selectedCategory === cat ? 'var(--seal-vermillion)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                borderColor: selectedCategory === cat ? 'var(--seal-vermillion)' : 'rgba(255,255,255,0.1)'
              }}
            >
              {cat === 'ALL' ? 'All Sectors' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Scorecard Table */}
      <div className="gov-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="gov-table" style={{ width: '100%', minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={{ padding: '14px 16px' }}>Programme</th>
              <th style={{ padding: '14px 16px' }}>Nodal Ministry</th>
              <th style={{ padding: '14px 16px' }}>Annual Budget Outlay</th>
              <th style={{ padding: '14px 16px' }}>Disbursed Volume</th>
              <th style={{ padding: '14px 16px' }}>Saturation Rate</th>
              <th style={{ padding: '14px 16px' }}>Avg SLA</th>
              <th style={{ padding: '14px 16px' }}>Citizen Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.code}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{s.code}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{s.name}</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{s.ministry}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'white' }}>{s.budget}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 600 }}>{s.disbursed}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: s.saturation, background: parseInt(s.saturation) >= 85 ? 'var(--ledger-green)' : 'var(--brass-gold)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: parseInt(s.saturation) >= 85 ? 'var(--ledger-green)' : 'var(--brass-gold)' }}>
                      {s.saturation}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  <span style={{ color: s.processingDays <= s.slaTarget ? 'var(--ledger-green)' : 'var(--seal-vermillion)' }}>
                    {s.processingDays}d
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}> / {s.slaTarget}d target</span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>
                  ★ {s.satisfaction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
