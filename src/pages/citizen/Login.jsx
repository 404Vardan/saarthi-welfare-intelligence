import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, Mail, UserPlus } from 'lucide-react';

export default function CitizenLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('citizen@saarthi.gov.in');
  const [password, setPassword] = useState('saarthi-demo-2026');
  const [fullName, setFullName] = useState('Ramesh Kumar Yadav');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/citizen/dashboard';

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await signIn(email, password);
    setLoading(false);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.error || 'Failed to authenticate.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await signUp(email, password, fullName.trim());
    setLoading(false);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signIn('citizen@saarthi.gov.in', 'saarthi-demo-2026');
    setLoading(false);
    navigate(redirectPath, { replace: true });
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

        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">Email or Mobile Number</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password / Passcode</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Welfare Passport →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
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
                placeholder="your.email@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Secure Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              {loading ? 'Registering Passport...' : 'Create Welfare Passport →'}
            </button>
          </form>
        )}

        {/* 1-Click Demo Login */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <UserCheck size={16} /> 1-Click Demo Citizen Sign In (Ramesh Yadav)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
