import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOpsAuth } from '../../context/OpsAuthContext';

export default function OpsLogin() {
  const navigate = useNavigate();
  const { login } = useOpsAuth();
  const [email, setEmail] = useState('ops@saarthi.gov.in');
  const [passphrase, setPassphrase] = useState('saarthi-ops-2026');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, passphrase);
    if (result.success) {
      navigate('/operations/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="ops-login-page">
      <div className="ops-login-card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#e8c547', marginBottom: '4px' }}>
          Saarthi
        </div>
        <h1>Scheme Operations</h1>
        <div className="subtitle">
          Maintain, verify, and manage the Saarthi scheme knowledge base.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ops-form-group">
            <label>Email</label>
            <input
              type="email"
              className="ops-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="ops-form-group">
            <label>Passphrase</label>
            <input
              type="password"
              className="ops-input"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <button type="submit" className="ops-btn ops-btn-primary">
            Sign In to Operations
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to Saarthi Homepage
          </Link>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          🔒 Authorized Saarthi operators only.<br />
          Demo credentials pre-filled for prototype access.
        </div>
      </div>
    </div>
  );
}
