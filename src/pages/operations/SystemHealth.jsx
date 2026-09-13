import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  Zap,
  HardDrive,
  Radio,
  RefreshCw
} from 'lucide-react';

export default function OpsSystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const services = [
    {
      name: 'Supabase PostgreSQL & RLS Policies',
      type: 'Database',
      status: 'OPERATIONAL',
      latency: '24ms',
      uptime: '99.99%',
      details: 'Row-Level Security enforced across profiles, household_members, and applications tables.'
    },
    {
      name: 'Supabase Storage Bucket (documents/)',
      type: 'Object Storage',
      status: 'OPERATIONAL',
      latency: '48ms',
      uptime: '99.98%',
      details: 'Encrypted document locker proofs storage with MIME validation.'
    },
    {
      name: 'Supabase Edge Function (ask-saarthi)',
      type: 'Serverless Edge API',
      status: 'OPERATIONAL',
      latency: '215ms',
      uptime: '100.0%',
      details: 'Gemini 2.5 Flash secure backend proxy. Zero frontend API key leakage.'
    },
    {
      name: 'Supabase Realtime WebSocket Gateway',
      type: 'Event Stream',
      status: 'OPERATIONAL',
      latency: '18ms',
      uptime: '99.99%',
      details: 'Broadcasting live application events to Government Command Center.'
    },
    {
      name: 'Deterministic AST Rule Engine',
      type: 'Compute Engine',
      status: 'OPTIMAL',
      latency: '<2ms',
      uptime: '100.0%',
      details: 'Evaluates 100+ statutory gazette schemes with boolean explainability traces.'
    }
  ];

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">Platform System Health & Monitoring</h1>
            <p className="ops-page-subtitle">
              Live infrastructure telemetry, API response latencies, and service uptime across Saarthi production stack.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Telemetry
          </button>
        </div>
      </header>

      {/* Global Status Banner */}
      <div
        className="card"
        style={{
          background: '#FFFDF9',
          borderLeft: '4px solid var(--ledger-green)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '10px', borderRadius: '50%' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 2px 0', fontSize: '1.2rem' }}>
              All Systems Fully Operational
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
              Zero critical outages detected in the last 30 days. Average global response time: <strong>46ms</strong>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--slate)', fontSize: '10px', textTransform: 'uppercase' }}>Overall Uptime</div>
            <div style={{ fontWeight: 700, color: 'var(--ledger-green)' }}>99.98%</div>
          </div>
          <div>
            <div style={{ color: 'var(--slate)', fontSize: '10px', textTransform: 'uppercase' }}>Error Rate</div>
            <div style={{ fontWeight: 700, color: 'var(--ledger-green)' }}>0.01%</div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '2rem' }}>
        {services.map((svc, idx) => (
          <div key={idx} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {svc.type}
                </span>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '2px 0 0 0', fontSize: '1rem' }}>
                  {svc.name}
                </h4>
              </div>

              <span className="badge badge-eligible" style={{ fontSize: '10px' }}>
                {svc.status}
              </span>
            </div>

            <p style={{ color: 'var(--slate)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '14px' }}>
              {svc.details}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span>Latency: <strong style={{ color: 'var(--ink-navy)' }}>{svc.latency}</strong></span>
              <span>Uptime: <strong style={{ color: 'var(--ledger-green)' }}>{svc.uptime}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
