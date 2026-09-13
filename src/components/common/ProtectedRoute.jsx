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

  // Not authenticated — redirect to appropriate login
  if (!user) {
    let loginPath = '/citizen/login';
    if (allowedRoles.includes('government')) loginPath = '/government/login';
    if (allowedRoles.includes('admin')) loginPath = '/operations/login';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Authenticated but wrong role — redirect to their own dashboard
  if (role && !allowedRoles.includes(role)) {
    const dashboardMap = {
      citizen: '/citizen/dashboard',
      government: '/government/dashboard',
      admin: '/operations/dashboard'
    };
    return <Navigate to={dashboardMap[role] || '/citizen/dashboard'} replace />;
  }

  return children;
}
