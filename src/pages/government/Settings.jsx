import React, { useState } from 'react';
import { Settings, Shield, Bell, Database } from 'lucide-react';

export default function GovSettings() {
  const [alertThreshold, setAlertThreshold] = useState('25');
  const [autoFlagFraud, setAutoFlagFraud] = useState(true);
  const [toast, setToast] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToast('✓ Administrative alert thresholds & telemetry policies updated.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <h1 className="gov-page-title">Administrative Settings & Telemetry Controls</h1>
      <p className="gov-page-subtitle">
        Configure departmental anomaly thresholds, district gap alerts, and inter-ministry data sync.
      </p>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)', border: '1px solid rgba(31,122,77,0.4)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {toast}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem' }}>
            District Delivery Alert Thresholds
          </h3>
          <div className="ops-form-group">
            <label>Flag District Delivery Gap when Unreached Population exceeds (%):</label>
            <select
              className="ops-select"
              value={alertThreshold}
              onChange={e => setAlertThreshold(e.target.value)}
              style={{ width: '240px' }}
            >
              <option value="15">15% Unreached Gap</option>
              <option value="20">20% Unreached Gap</option>
              <option value="25">25% Unreached Gap (Default)</option>
              <option value="30">30% Unreached Gap (Critical Only)</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoFlagFraud}
              onChange={e => setAutoFlagFraud(e.target.checked)}
              className="form-checkbox"
            />
            <span style={{ color: 'white', fontSize: '0.85rem' }}>
              Automatically route high-confidence duplicate Aadhaar sequences to District Collectorate inspection queue.
            </span>
          </label>
        </div>

        <button type="submit" className="ops-btn ops-btn-primary" style={{ padding: '12px 28px' }}>
          Save Administrative Policy →
        </button>
      </form>
    </div>
  );
}
