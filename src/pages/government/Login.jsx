import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function GovLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, forgotPassword, user, role, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/government/dashboard';

  // Auto-redirect if already authenticated as government/admin
  useEffect(() => {
    if (!authLoading && user && (role === 'government' || role === 'admin')) {
      navigate(redirectPath, { replace: true });
    }
  }, [authLoading, user, role, navigate, redirectPath]);

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

  // Standalone full-page dark institutional layout
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #050D1A 0%, #0B1F3A 50%, #0F2847 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(166,135,61,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(166,135,61,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Glowing accent orb */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(166,135,61,0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        pointerEvents: 'none',
        animation: 'orbFloat 10s ease-in-out infinite alternate'
      }} />
      <style>{`@keyframes orbFloat { 0% { transform: translate(0,0); } 100% { transform: translate(-40px,40px); } }`}</style>

      {/* Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(26, 50, 84, 0.6)',
        border: '1px solid rgba(166, 135, 61, 0.2)',
        borderRadius: '8px',
        padding: '3rem 2rem',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏛️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 0 0.25rem 0', letterSpacing: '0.5px' }}>
            Saarthi Gov Console
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Authorized Government Personnel Only
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(166,135,61,0.3), transparent)', marginBottom: '1.5rem' }} />

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
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Official Email Address</label>
              <input
                type="email"
                placeholder="officer@gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box',
                  transition: 'border-color 200ms ease'
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--brass-gold), #8B7332)',
              color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 200ms ease', letterSpacing: '0.5px'
            }}>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>
                Official Email (.gov.in / .nic.in)
              </label>
              <input
                type="email"
                placeholder="officer@collectorate.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>
                Security Key / Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
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

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, var(--brass-gold), #8B7332)',
              color: 'white', border: 'none', borderRadius: '6px',
              fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.5px', transition: 'all 200ms ease'
            }}>
              {loading ? 'Authenticating...' : 'Sign In to Government Console →'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
          🔒 This portal requires a government-authorized Saarthi account.
        </div>
      </div>

      {/* Classification banner */}
      <div style={{
        position: 'relative', zIndex: 1, marginTop: '1.5rem',
        fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
        fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase',
        textAlign: 'center'
      }}>
        UNCLASSIFIED // DEMO ENVIRONMENT
      </div>

      {/* Back link */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to Saarthi Home
        </Link>
      </div>
    </div>
  );
}
