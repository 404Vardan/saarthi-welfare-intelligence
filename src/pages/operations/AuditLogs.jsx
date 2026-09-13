import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, FileText, Lock, User, GitCommit } from 'lucide-react';

export default function OpsAuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const auditEvents = [
    {
      id: 'aud-9941',
      actor: 'ADMIN Vardan',
      actorRole: 'admin',
      action: 'RULE_VERSION_INCREMENT',
      target: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      details: 'Updated annual household income ceiling from ₹2,00,000 ➔ ₹2,50,000 (Rule v3.1 ➔ v3.2)',
      timestamp: '13 Sep 2026, 16:42 IST',
      ip: '10.14.88.19',
      hash: 'sha256:7f8a91c0e44b912...'
    },
    {
      id: 'aud-9940',
      actor: 'VERIFIER Dr. Anand Verma',
      actorRole: 'verifier',
      action: 'SCHEME_VERIFICATION_APPROVED',
      target: 'GUJ-MA-YOJANA (Mukhyamantri Amrutam)',
      details: 'Gazette provenance verified against Gujarat Extraordinary Notification No. 114/2026',
      timestamp: '13 Sep 2026, 14:15 IST',
      ip: '10.14.88.22',
      hash: 'sha256:3a91b8f1c01e544...'
    },
    {
      id: 'aud-9939',
      actor: 'ADMIN Vardan',
      actorRole: 'admin',
      action: 'USER_ROLE_REASSIGNMENT',
      target: 'dm-varanasi@up.gov.in',
      details: 'Assigned GOVERNMENT role with District Officer privileges for Varanasi Jurisdiction',
      timestamp: '13 Sep 2026, 11:30 IST',
      ip: '10.14.88.19',
      hash: 'sha256:88bc91a01ff492a...'
    },
    {
      id: 'aud-9938',
      actor: 'SYSTEM EDGE PROXY',
      actorRole: 'system',
      action: 'SECRETS_ROTATION',
      target: 'Supabase Edge Function ask-saarthi',
      details: 'Gemini 2.5 API token rotated with zero downtime',
      timestamp: '12 Sep 2026, 23:59 IST',
      ip: '127.0.0.1',
      hash: 'sha256:55ef819a00b8411...'
    },
    {
      id: 'aud-9937',
      actor: 'ADMIN Vardan',
      actorRole: 'admin',
      action: 'SCHEME_INGESTION_PUBLISHED',
      target: 'PM-VISHWAKARMA (PM Vishwakarma Kaushal Samman)',
      details: 'Ingested 18 traditional artisan trade rules and ₹15,000 toolkit voucher parameter (Rule v1.0)',
      timestamp: '12 Sep 2026, 18:20 IST',
      ip: '10.14.88.19',
      hash: 'sha256:12c09f8e411b99a...'
    }
  ];

  const filtered = auditEvents.filter(ev => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      ev.actor.toLowerCase().includes(q) ||
      ev.target.toLowerCase().includes(q) ||
      ev.details.toLowerCase().includes(q) ||
      ev.action.toLowerCase().includes(q);

    const matchAction = actionFilter === 'ALL' || ev.action === actionFilter;

    return matchSearch && matchAction;
  });

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="ops-page-title">Immutable Security & Governance Audit Logs</h1>
          <p className="ops-page-subtitle">
            Cryptographically sealed audit trail capturing every privileged policy modification, role escalation, and system event.
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by actor, scheme target, action type, or hash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '240px' }}
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
        >
          <option value="ALL">All Event Types</option>
          <option value="RULE_VERSION_INCREMENT">Rule Version Increments</option>
          <option value="SCHEME_VERIFICATION_APPROVED">Scheme Verifications</option>
          <option value="USER_ROLE_REASSIGNMENT">User Role Escalations</option>
          <option value="SCHEME_INGESTION_PUBLISHED">Scheme Ingestion</option>
          <option value="SECRETS_ROTATION">System Secrets Events</option>
        </select>
      </div>

      {/* Audit Log Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(ev => (
          <div
            key={ev.id}
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              borderLeft: '4px solid var(--ink-navy)',
              background: '#FFFDF9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: 'var(--paper)', color: 'var(--ink-navy)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px' }}>
                  {ev.action}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--ink-navy)', fontSize: '0.92rem' }}>
                  {ev.actor}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--slate)' }}>
                  ({ev.ip})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={13} /> {ev.timestamp}
              </div>
            </div>

            <div style={{ fontWeight: 600, color: 'var(--seal-vermillion)', fontSize: '0.88rem', marginBottom: '4px' }}>
              Target: {ev.target}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.5, marginBottom: '8px' }}>
              {ev.details}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--slate)' }}>
              <span>Event ID: <strong>{ev.id}</strong></span>
              <span>Integrity Hash: <code>{ev.hash}</code></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
