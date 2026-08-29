import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Shield, KeyRound, Smartphone, Check } from 'lucide-react';

export default function CitizenSettings() {
  const { profile } = useAuth();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToast('✓ Notification & Security preferences updated successfully.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Account & Passport Settings</h1>
          <p className="page-description">
            Manage your notifications, e-KYC telemetry preferences, and privacy controls.
          </p>
        </div>
      </header>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Notification Preferences */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Entitlement & Deadline Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>WhatsApp Entitlement Alerts</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Receive proactive notices when newly gazetted schemes match your passport.</div>
              </div>
              <input type="checkbox" checked={whatsappAlerts} onChange={e => setWhatsappAlerts(e.target.checked)} className="form-checkbox" />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>SMS Milestone Updates</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Receive SMS alerts on DBT installment disbursements and e-KYC verifications.</div>
              </div>
              <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} className="form-checkbox" />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>Official Email Digest</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Monthly summary of welfare entitlements and scheme revisions.</div>
              </div>
              <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="form-checkbox" />
            </label>
          </div>
        </div>

        {/* Data Privacy & Consent */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Consent & Provenance Guarantee
          </h3>
          <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Saarthi operates on deterministic, verifiable rules. Your demographic attributes are strictly evaluated against public government gazette criteria and never sold or shared with commercial entities.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span className="badge badge-eligible">✓ Consent Token Active (DPDP Act 2023 Compliant)</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          Save Preferences →
        </button>
      </form>
    </div>
  );
}
