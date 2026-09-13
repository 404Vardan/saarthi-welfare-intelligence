import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, Mail, UserPlus } from 'lucide-react';

export default function CitizenLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, forgotPassword } = useAuth();

  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/citizen/dashboard';

  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    setErrorMsg('');
    const res = await signInWithGoogle(redirectPath);
    if (!res.success) {
      setOauthLoading(false);
      setErrorMsg(res.error || 'Failed to initialize Google login. Please verify Supabase OAuth setup.');
    }
  };

  const handleSignIn = async (e) => {
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
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to reset password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const res = await forgotPassword(email.trim());
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password reset link sent to your email. Please check your inbox.');
    } else {
      setErrorMsg(res.error || 'Failed to send reset email.');
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', boxShadow: '0 8px 32px rgba(11, 31, 58, 0.08)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto' }}>S</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.5rem' }}>
            National Welfare Passport
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginTop: '4px' }}>
            Secure identity & entitlement authentication
          </p>
        </div>

        {/* Forgot Password View */}
        {showForgotPassword ? (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 0.5rem 0' }}>
              Reset Password
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Enter your email and we'll send you a reset link.
            </p>

            {errorMsg && (
              <div style={{ background: 'rgba(193,68,45,0.1)', color: 'var(--seal-vermillion)', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(193,68,45,0.3)' }}>
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ background: 'rgba(34,139,34,0.1)', color: '#228B22', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(34,139,34,0.3)' }}>
                ✓ {successMsg}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--brass-gold)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Tab Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--paper)', padding: '4px', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
                style={{
                  padding: '8px',
                  border: 'none',
                  background: activeTab === 'signin' ? '#FFFDF9' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: activeTab === 'signin' ? 'var(--ink-navy)' : 'var(--slate)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
                style={{
                  padding: '8px',
                  border: 'none',
                  background: activeTab === 'signup' ? '#FFFDF9' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: activeTab === 'signup' ? 'var(--ink-navy)' : 'var(--slate)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(193,68,45,0.1)', color: 'var(--seal-vermillion)', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(193,68,45,0.3)' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={oauthLoading || loading}
              style={{
                width: '100%',
                padding: '11px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#374151',
                cursor: oauthLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                marginBottom: '1.25rem'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{oauthLoading ? 'Connecting to Google...' : (activeTab === 'signin' ? 'Continue with Google' : 'Sign up with Google')}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 10px', fontSize: '0.72rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or with email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
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
                    style={{ background: 'none', border: 'none', color: 'var(--brass-gold)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {loading ? 'Authenticating...' : 'Sign In →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Kumar Yadav"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px', marginTop: '8px' }}
                >
                  {loading ? 'Creating Account...' : 'Create Welfare Passport →'}
                </button>
              </form>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
