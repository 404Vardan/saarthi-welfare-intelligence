import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function GovLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/government/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await signIn(email.trim(), password);
    setLoading(false);

    if (res.success) {
      // Verify the user has government or admin role
      if (res.role === 'government' || res.role === 'admin') {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMsg('Access denied. This portal is restricted to authorized government officials. Your account has a "citizen" role.');
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your official email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const res = await forgotPassword(email.trim());
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password reset link sent to your email.');
    } else {
      setErrorMsg(res.error || 'Failed to send reset email.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0B1F3A' }}>
      <div className="gov-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto', background: 'var(--brass-gold)' }}>G</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0 }}>
            Government Intelligence Console
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '4px' }}>
            Authorized District & Ministry Officers Access
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(193,68,45,0.15)', color: '#FF6B6B', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(193,68,45,0.3)' }}>
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ background: 'rgba(34,139,34,0.15)', color: '#90EE90', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(34,139,34,0.3)' }}>
            ✓ {successMsg}
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Official Email Address</label>
              <input
                type="email"
                className="ops-input"
                placeholder="officer@gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="ops-btn ops-btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--brass-gold)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Official Email (.gov.in / .nic.in)</label>
              <input
                type="email"
                className="ops-input"
                placeholder="officer@collectorate.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Security Key / Password</label>
              <input
                type="password"
                className="ops-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--brass-gold)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="ops-btn ops-btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Government Console →'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            ← Back to Homepage
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
          🔒 This portal requires a government-authorized Saarthi account.
        </div>
      </div>
    </div>
  );
}
