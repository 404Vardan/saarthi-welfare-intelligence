import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Role-Based Protected Route
 * 
 * Usage:
 *   <ProtectedRoute allowedRoles={['citizen']}>
 *     <CitizenLayout />
 *   </ProtectedRoute>
 * 
 *   <ProtectedRoute allowedRoles={['government', 'admin']}>
 *     <GovernmentLayout />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles = ['citizen'] }) {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        color: 'var(--slate)',
        background: 'var(--paper)',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--brass-gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Verifying credentials...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated — redirect to appropriate login based on current path
  if (!user) {
    let loginPath = '/citizen/login';
    const path = location.pathname;
    if (path.startsWith('/government')) loginPath = '/government/login';
    else if (path.startsWith('/operations')) loginPath = '/operations/login';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Authenticated but role is null or unresolved — fail closed
  if (!role) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--paper)',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '480px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 12px 0' }}>
            Authorization Unresolved
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
            Your account authenticated successfully, but an authoritative role could not be verified from the database. Access has been denied to preserve system integrity.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: 'var(--ink-navy)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Retry
            </button>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: 'var(--ink-navy)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but unauthorized role for this route — redirect to authorized area
  if (!allowedRoles.includes(role)) {
    const dashboardMap = {
      citizen: '/citizen/dashboard',
      government: '/government/dashboard',
      admin: '/operations/dashboard'
    };
    return <Navigate to={dashboardMap[role] || '/citizen/login'} replace />;
  }

  return children;
}
