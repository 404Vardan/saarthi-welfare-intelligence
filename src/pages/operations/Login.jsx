import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OpsLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

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

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to Saarthi Homepage
          </Link>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          🔒 Authorized platform administrators only.
        </div>
      </div>
    </div>
  );
}
