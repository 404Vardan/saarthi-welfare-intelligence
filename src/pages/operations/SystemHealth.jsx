import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import { EligibilityEngine } from '../../engine/eligibilityEngine';
import { SchemesData } from '../../api/schemesData';
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
  const [liveDbLatency, setLiveDbLatency] = useState('Measuring...');
  const [liveDbStatus, setLiveDbStatus] = useState('PROBING');
  const [liveEngineLatency, setLiveEngineLatency] = useState('Measuring...');
  const [lastCheckedTime, setLastCheckedTime] = useState('Just now');

  const checkTelemetry = async () => {
    setIsRefreshing(true);

    // 1. Measure real Supabase DB Ping Latency
    const t0 = performance.now();
    try {
      const { error } = await supabase.from('schemes').select('id').limit(1);
      const dbElapsed = Math.round(performance.now() - t0);
      if (!error) {
        setLiveDbLatency(`${dbElapsed}ms`);
        setLiveDbStatus('OPERATIONAL');
      } else {
        setLiveDbLatency('Offline / Error');
        setLiveDbStatus('DEGRADED');
      }
    } catch {
      setLiveDbLatency('Network Unreachable');
      setLiveDbStatus('OFFLINE');
    }

    // 2. Measure real AST Rule Engine compute latency
    const t1 = performance.now();
    try {
      const sampleProfile = { income_annual: 120000, age: 45, occupation: 'farmer', state: 'UP', land_ownership: 'below_2_acres' };
      const sampleSchemes = SchemesData.canonicalSchemes.slice(0, 50);
      EligibilityEngine.evaluateEligibility(sampleProfile, [], sampleSchemes);
      const engineElapsed = (performance.now() - t1).toFixed(1);
      setLiveEngineLatency(`${engineElapsed}ms`);
    } catch {
      setLiveEngineLatency('Evaluation Error');
    }

    setLastCheckedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkTelemetry();
  }, []);

  const services = [
    {
      name: 'Supabase PostgreSQL & RLS Policies',
      type: 'Database',
      monitoring: 'LIVE PROBE',
      status: liveDbStatus,
      latency: liveDbLatency,
      monitoringDetail: 'Active query round-trip probe via Supabase JS client.',
      details: 'Authoritative Row-Level Security policies enforced across profiles, user_roles, documents, and applications.'
    },
    {
      name: 'Deterministic AST Rule Engine',
      type: 'Compute Engine',
      monitoring: 'LIVE BENCHMARK',
      status: 'OPTIMAL',
      latency: liveEngineLatency,
      monitoringDetail: 'In-memory 3-valued AST rule evaluation across 50 statutory schemes.',
      details: 'Deterministic AST rule evaluator executing client-side eligibility logic without external cloud dependencies.'
    },
    {
      name: 'Supabase Storage Bucket (documents/)',
      type: 'Object Storage (Private)',
      monitoring: 'NOT MONITORED CLIENT-SIDE',
      status: 'MANAGED INFRASTRUCTURE',
      latency: 'External SLA',
      monitoringDetail: 'Supabase S3-compatible managed private object storage.',
      details: 'Encrypted document vault with 1-hour time-limited signed URLs and folder-level RLS.'
    },
    {
      name: 'Supabase Edge Functions',
      type: 'Serverless Edge API',
      monitoring: 'ON-DEMAND INVOCATION',
      status: 'MANAGED INFRASTRUCTURE',
      latency: 'Per-Request SLA',
      monitoringDetail: 'Deno edge runtime invoked on-demand with caller JWT verification.',
      details: 'Isolated serverless edge functions for server-side eligibility evaluation and AI proxying.'
    },
    {
      name: 'Supabase Realtime Gateway',
      type: 'Event Stream',
      monitoring: 'NOT MONITORED CLIENT-SIDE',
      status: 'MANAGED INFRASTRUCTURE',
      latency: 'WebSocket Stream',
      monitoringDetail: 'Postgres CDC WebSocket replication channel.',
      details: 'Broadcasting live application events to Government Command Center.'
    }
  ];

  const allOperational = liveDbStatus === 'OPERATIONAL';

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">Platform System Health & Monitoring</h1>
            <p className="ops-page-subtitle">
              Live operational telemetry and component status. Probed at {lastCheckedTime}.
            </p>
          </div>
          <button
            type="button"
            onClick={checkTelemetry}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Telemetry
          </button>
        </div>
      </header>

      {/* Live Status Banner */}
      <div
        className="card"
        style={{
          background: '#FFFDF9',
          borderLeft: `4px solid ${allOperational ? 'var(--ledger-green)' : 'var(--seal-vermillion)'}`,
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
          <div style={{
            background: allOperational ? 'rgba(31,122,77,0.1)' : 'rgba(193,68,45,0.1)',
            color: allOperational ? 'var(--ledger-green)' : 'var(--seal-vermillion)',
            padding: '10px',
            borderRadius: '50%'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 2px 0', fontSize: '1.2rem' }}>
              {allOperational ? 'Core Systems Responding' : 'Degraded Connectivity Detected'}
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
              Live telemetry is measured directly from your browser session to the cloud database and local compute engines.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--slate)', fontSize: '10px', textTransform: 'uppercase' }}>Database Latency</div>
            <div style={{ fontWeight: 700, color: 'var(--ink-navy)' }}>{liveDbLatency}</div>
          </div>
          <div>
            <div style={{ color: 'var(--slate)', fontSize: '10px', textTransform: 'uppercase' }}>AST Engine Latency</div>
            <div style={{ fontWeight: 700, color: 'var(--ledger-green)' }}>{liveEngineLatency}</div>
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

              <span className={`badge ${svc.status === 'OPERATIONAL' || svc.status === 'OPTIMAL' ? 'badge-eligible' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                {svc.status}
              </span>
            </div>

            <p style={{ color: 'var(--slate)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '14px' }}>
              {svc.details}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span>Latency: <strong style={{ color: 'var(--ink-navy)' }}>{svc.latency}</strong></span>
              <span style={{ color: 'var(--slate)', fontSize: '11px' }}>{svc.monitoring}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
