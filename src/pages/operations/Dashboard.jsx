import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemeRegistryAPI } from '../../api/registryApi';

export default function OpsDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingQueue, setPendingQueue] = useState([]);

  useEffect(() => {
    async function load() {
      const s = await SchemeRegistryAPI.getSchemeStats();
      const q = await SchemeRegistryAPI.fetchVerificationQueue('PENDING');
      setStats(s);
      setPendingQueue(q);
    }
    load();
  }, []);

  return (
    <div>
      <header className="ops-page-header">
        <h1 className="ops-page-title">Operations Dashboard</h1>
        <p className="ops-page-subtitle">
          Scheme registry health, verification queue, and recent gazette ingestion activity.
        </p>
      </header>

      {/* KPI Strip */}
      <div className="ops-kpi-strip">
        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Total Schemes</div>
          <div className="ops-kpi-value">{stats?.total || 18}</div>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Published / Active</div>
          <div className="ops-kpi-value text-green">{stats?.published || 15}</div>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Under Review</div>
          <div className="ops-kpi-value text-amber">{stats?.underReview || 2}</div>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Pending Verification</div>
          <div className="ops-kpi-value text-amber">{stats?.pendingVerifications || pendingQueue.length}</div>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">7-Day Change Feed</div>
          <div className="ops-kpi-value text-blue">{stats?.recentChanges || 8}</div>
        </div>
      </div>

      {/* Grid 2 */}
      <div className="ops-grid-2">
        {/* Verification Queue Preview */}
        <div className="ops-card">
          <h3>⏳ Pending Verifications</h3>
          {pendingQueue.length === 0 ? (
            <div className="ops-empty-state" style={{ padding: '24px' }}>
              <div className="empty-icon">✅</div>
              <h4>No pending verifications</h4>
              <p>All items have been verified.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingQueue.slice(0, 4).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f0f0f0' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {item.scheme_registry?.scheme_code} · {item.detection_source}
                    </div>
                  </div>
                  <Link to="/operations/verification" className="ops-btn ops-btn-ghost ops-btn-sm">
                    Review →
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link to="/operations/verification" className="ops-btn ops-btn-ghost ops-btn-sm">
              View All in Queue →
            </Link>
          </div>
        </div>

        {/* Quick Ingestion Actions */}
        <div className="ops-card">
          <h3>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/operations/add-scheme" className="ops-btn ops-btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ➕ Add New Scheme (Under Review)
            </Link>
            <Link to="/operations/registry" className="ops-btn ops-btn-ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
              📋 Browse Full Scheme Registry
            </Link>
            <Link to="/operations/verification" className="ops-btn ops-btn-ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ✅ Process Verification Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
