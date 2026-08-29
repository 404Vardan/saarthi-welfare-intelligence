import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useOpsAuth } from '../../context/OpsAuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  LogOut
} from 'lucide-react';

export default function OperationsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, operator, logout } = useOpsAuth();

  const navItems = [
    { label: 'Dashboard', path: '/operations/dashboard', icon: LayoutDashboard },
    { label: 'Scheme Registry', path: '/operations/registry', icon: ClipboardList },
    { label: 'Verification Queue', path: '/operations/verification', icon: CheckCircle2 },
    { label: 'Add Scheme', path: '/operations/add-scheme', icon: PlusCircle },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/operations/login');
  };

  return (
    <div className="ops-layout">
      {/* SIDEBAR */}
      <aside className="ops-sidebar">
        <div className="sidebar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#e8c547' }}>
              Saarthi
            </span>
          </Link>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            Scheme Operations
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            {operator?.name || 'Demo Operator'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {operator?.role || 'Admin'}
          </div>
          <a
            href="#logout"
            onClick={handleLogout}
            style={{ color: '#e8c547', cursor: 'pointer', fontSize: '0.7rem', marginTop: '6px', display: 'inline-block' }}
          >
            Sign Out
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ops-main">
        <Outlet />
      </main>
    </div>
  );
}
