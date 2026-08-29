import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function GovLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/government/dashboard');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="gov-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto', background: 'var(--brass-gold)' }}>G</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0 }}>
            Government Intelligence Login
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '4px' }}>
            Authorized District & Ministry Officers Access.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Official Email (.gov.in / .nic.in)</label>
            <input
              type="email"
              className="ops-input"
              defaultValue="officer@collectorate.gov.in"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Security Key / Passcode</label>
            <input
              type="password"
              className="ops-input"
              defaultValue="gov-secure-2026"
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', display: 'block' }}>
              Demo credentials pre-filled for evaluation.
            </span>
          </div>

          <button type="submit" className="ops-btn ops-btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
            Sign In to Government Console →
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
