import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OpsLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, activateDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/operations/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !passphrase.trim()) {
      setError('Please enter both email and passphrase.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signIn(email.trim(), passphrase);
    setLoading(false);

    if (result.success) {
      // Verify the user has admin role
      if (result.role === 'admin') {
        navigate(redirectPath, { replace: true });
      } else {
        setError('Access denied. This portal is restricted to platform administrators. Your role: ' + (result.role || 'citizen'));
      }
    } else {
      setError(result.error || 'Authentication failed. Please check your credentials.');
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
              placeholder="admin@saarthi.gov.in"
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
              placeholder="Enter your passphrase"
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

          <button type="submit" className="ops-btn ops-btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Operations'}
          </button>
        </form>

        {/* 1-Click Evaluator Access for Review III */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#e8c547', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center', fontWeight: 700 }}>
            ⚡ Evaluator 1-Click Access (Viva & Review Mode)
          </div>
          <button
            type="button"
            onClick={async () => {
              await activateDemoAdmin();
              navigate(redirectPath, { replace: true });
            }}
            className="ops-btn"
            style={{
              width: '100%',
              background: 'rgba(232, 197, 71, 0.15)',
              border: '1px solid rgba(232, 197, 71, 0.4)',
              color: '#fef08a',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              padding: '10px 14px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>⚙️ Launch as Operations Lead (Vardan)</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>Registry & Rules →</span>
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to Saarthi Homepage
          </Link>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          🔒 Authorized platform administrators only.
        </div>
      </div>
    </div>
  );
}
