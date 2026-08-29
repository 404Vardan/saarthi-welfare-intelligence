import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CitizenNotifications() {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Missing Income Certificate in Locker',
      message: 'An income certificate issued by your local Tehsildar is required to finalize application readiness for top agricultural subsidies.',
      date: 'Today, 10:30 AM',
      type: 'warning',
      actionText: 'Upload Proof Now →',
      actionLink: '/citizen/documents'
    },
    {
      id: 'notif-2',
      title: 'PM-KISAN Samman Nidhi Matched (100%)',
      message: 'Your verified landholding between 2–5 acres satisfies all eligibility criteria under gazette rule v1.0.',
      date: 'Yesterday, 04:15 PM',
      type: 'success',
      actionText: 'View Scheme Hub →',
      actionLink: '/citizen/scheme/pm-kisan-001'
    },
    {
      id: 'notif-3',
      title: 'Application Ref SAARTHI-2026-004891 In Review',
      message: 'Your application has passed automated e-KYC and is currently being audited by the State Revenue Department.',
      date: '24 Aug 2026',
      type: 'info',
      actionText: 'Track Application →',
      actionLink: '/citizen/applications'
    }
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Actionable Notifications</h1>
          <p className="page-description">
            Important entitlement alerts, milestone updates, and deadline reminders.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderLeft: `4px solid ${n.type === 'warning' ? 'var(--seal-vermillion)' : (n.type === 'success' ? 'var(--ledger-green)' : 'var(--brass-gold)')}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '700px' }}>
              <div style={{ marginTop: '2px' }}>
                {n.type === 'warning' && <AlertTriangle size={20} color="var(--seal-vermillion)" />}
                {n.type === 'success' && <CheckCircle2 size={20} color="var(--ledger-green)" />}
                {n.type === 'info' && <Bell size={20} color="var(--brass-gold)" />}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.95rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate)', marginTop: '2px', lineHeight: 1.45 }}>{n.message}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--slate)', marginTop: '6px' }}>{n.date}</div>
              </div>
            </div>

            <Link to={n.actionLink} className="btn btn-secondary btn-sm" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {n.actionText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
