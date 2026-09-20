import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  BarChart3,
  ShieldCheck,
  Activity,
  LogOut
} from 'lucide-react';

export default function OperationsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Command Center', path: '/operations/dashboard', icon: LayoutDashboard },
    { label: 'User & RBAC Mgmt', path: '/operations/users', icon: Users },
    { label: 'Scheme Registry', path: '/operations/registry', icon: ClipboardList },
    { label: 'Verification Queue', path: '/operations/verification', icon: CheckCircle2 },
    { label: 'Ingest Programme', path: '/operations/add-scheme', icon: PlusCircle },
    { label: 'Funnel Telemetry', path: '/operations/analytics', icon: BarChart3 },
    { label: 'Security Audit Logs', path: '/operations/audit-logs', icon: ShieldCheck },
    { label: 'System Health', path: '/operations/system-health', icon: Activity },
  ];

  const handleNavigate = () => setMobileMenuOpen(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (signOut) await signOut();
    navigate('/operations/login');
  };

  return (
    <div className="ops-layout">
      {mobileMenuOpen && (
        <button className="mobile-menu-overlay" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />
      )}
      <header className="mobile-shell-bar" style={{ background: '#0d1526', color: '#fff', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="mobile-shell-brand">
          <div className="brand-name" style={{ color: '#e8c547' }}>SAARTHI</div>
          <div className="brand-tagline" style={{ color: 'rgba(255,255,255,0.45)' }}>Platform Control Center</div>
        </div>
        <button className="mobile-menu-button" style={{ background: '#111b30', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(v => !v)}>
          <Activity size={18} />
        </button>
      </header>
      {/* SIDEBAR */}
      <aside className={`ops-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#e8c547' }}>
              Saarthi
            </span>
          </Link>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            Platform Control Center
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
                onClick={handleNavigate}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            {user?.full_name || 'Vardan (Admin)'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            Platform Administrator
          </div>
          <a
            href="#logout"
            onClick={handleLogout}
            style={{ color: '#e8c547', cursor: 'pointer', fontSize: '0.75rem', marginTop: '6px', display: 'inline-block' }}
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
