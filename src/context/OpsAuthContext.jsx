import React, { createContext, useContext, useState } from 'react';

const OpsAuthContext = createContext();

export function OpsAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('saarthi_ops_session') === 'authenticated';
  });
  const [operator, setOperator] = useState({
    name: 'Demo Operator',
    role: 'Admin',
    email: 'ops@saarthi.gov.in'
  });

  const login = (email, passphrase) => {
    if (email === 'ops@saarthi.gov.in' && passphrase === 'saarthi-ops-2026') {
      sessionStorage.setItem('saarthi_ops_session', 'authenticated');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Demo: ops@saarthi.gov.in / saarthi-ops-2026' };
  };

  const logout = () => {
    sessionStorage.removeItem('saarthi_ops_session');
    setIsAuthenticated(false);
  };

  return (
    <OpsAuthContext.Provider value={{ isAuthenticated, operator, login, logout }}>
      {children}
    </OpsAuthContext.Provider>
  );
}

export function useOpsAuth() {
  return useContext(OpsAuthContext);
}
