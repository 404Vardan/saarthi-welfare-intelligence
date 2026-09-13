import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SchemesData } from '../../api/schemesData';
import {
  Users,
  ShieldCheck,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function OpsDashboard() {
  const [schemeCount, setSchemeCount] = useState(105);

  useEffect(() => {
    async function load() {
      const all = await SchemesData.fetchAllSchemes();
      if (all) setSchemeCount(all.length);
    }
    load();
  }, []);

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">Platform Operator Command Center</h1>
            <p className="ops-page-subtitle">
              Live governance of policy registries, RBAC permissions, system health, and citizen conversion funnels.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/operations/add-scheme" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={14} /> Ingest Scheme
            </Link>
            <Link to="/operations/system-health" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} /> System Health (99.98%)
            </Link>
          </div>
        </div>
      </header>

      {/* KPI Overview Strip */}
      <div className="ops-kpi-strip" style={{ marginBottom: '1.5rem' }}>
        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Active Schemes Ingested</div>
          <div className="ops-kpi-value text-green">{schemeCount}</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>100+ Verified Gazette Rules</span>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Registered Citizens</div>
          <div className="ops-kpi-value text-blue">8,450</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>81.5% Profile Activation</span>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Applications Routed</div>
          <div className="ops-kpi-value text-amber">4,120</div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Across 28 States & UTs</span>
        </div>

        <div className="ops-kpi-card">
          <div className="ops-kpi-label">Platform Health Score</div>
          <div className="ops-kpi-value text-green">99.98%</div>
          <span style={{ fontSize: '10px', color: 'var(--ledger-green)', fontFamily: 'var(--font-mono)' }}>All APIs Operational</span>
        </div>
      </div>

      {/* Grid 2 */}
      <div className="ops-grid-2">
        {/* Recent Audit Stream */}
        <div className="ops-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>🛡️ Recent Privileged Audit Actions</h3>
            <Link to="/operations/audit-logs" style={{ color: '#e8c547', fontSize: '0.8rem', textDecoration: 'none' }}>
              Full Audit Trail →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { actor: 'ADMIN Vardan', action: 'PM-KISAN rule version 3.1 ➔ 3.2 incremented', time: '16:42 IST' },
              { actor: 'VERIFIER Dr. Verma', action: 'Approved Gujarat MA Yojana revision v1.2', time: '14:15 IST' },
              { actor: 'ADMIN Vardan', action: 'Assigned GOVERNMENT role to dm-varanasi@up.gov.in', time: '11:30 IST' },
              { actor: 'SYSTEM EDGE', action: 'Rotated Gemini AI proxy secrets token', time: 'Yesterday' }
            ].map((ev, idx) => (
              <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '2px' }}>
                  <strong style={{ color: '#e8c547' }}>{ev.actor}</strong>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{ev.time}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{ev.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Administrative Modules */}
        <div className="ops-card">
          <h3 style={{ margin: '0 0 1rem 0' }}>⚡ Quick Management Hubs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link to="/operations/users" className="ops-btn ops-btn-ghost" style={{ textAlign: 'left', textDecoration: 'none', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'white' }}>👥 Users & Roles</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>RBAC Management</div>
            </Link>

            <Link to="/operations/registry" className="ops-btn ops-btn-ghost" style={{ textAlign: 'left', textDecoration: 'none', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'white' }}>📋 Scheme Registry</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>100+ Active Policies</div>
            </Link>

            <Link to="/operations/analytics" className="ops-btn ops-btn-ghost" style={{ textAlign: 'left', textDecoration: 'none', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'white' }}>📊 Telemetry Funnel</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Startup Conversion</div>
            </Link>

            <Link to="/operations/system-health" className="ops-btn ops-btn-ghost" style={{ textAlign: 'left', textDecoration: 'none', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'white' }}>🖥️ System Health</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Latency & Uptime</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
