import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOpsAuth } from '../../context/OpsAuthContext';

export default function ProtectedRoute({ children, role = 'citizen' }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { isAuthenticated: isOpsAuth } = useOpsAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)' }}>
        Authenticating Welfare Credentials...
      </div>
    );
  }

  if (role === 'citizen') {
    if (!user) {
      return <Navigate to="/citizen/login" state={{ from: location }} replace />;
    }
  } else if (role === 'operations') {
    if (!isOpsAuth) {
      return <Navigate to="/operations/login" state={{ from: location }} replace />;
    }
  }

  return children;
}
