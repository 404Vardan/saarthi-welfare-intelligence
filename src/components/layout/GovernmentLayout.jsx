import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../common/Breadcrumbs';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Scale,
  FileSpreadsheet,
  Search,
  Settings,
  LogOut
} from 'lucide-react';

export default function GovernmentLayout() {
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/government/login');
  };

  return (
    <div className="gov-shell">
      {mobileMenuOpen && (
        <button className="mobile-menu-overlay" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />
      )}
      <header className="mobile-shell-bar" style={{ background: '#071220', color: '#fff', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="mobile-shell-brand">
          <div className="brand-seal-mark">G</div>
          <div>
            <div className="brand-name">SAARTHI // GOV</div>
            <div className="brand-tagline">National Welfare Intelligence</div>
          </div>
        </div>
        <button className="mobile-menu-button" style={{ background: '#11223A', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(v => !v)}>
          <Search size={18} />
        </button>
      </header>
      {/* Sidebar */}
      <aside className={`gov-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-seal-mark">G</div>
          <div>
            <div className="brand-name">SAARTHI // GOV</div>
            <div className="brand-tagline">National Welfare Intelligence</div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="gov-nav">
          {/* 1. OVERVIEW */}
          <div className="gov-section-title">OVERVIEW</div>
          <NavLink to="/government/dashboard" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <LayoutDashboard size={16} />
            <span>Command Center</span>
          </NavLink>

          {/* 2. INTELLIGENCE */}
          <div className="gov-section-title">INTELLIGENCE</div>
          <NavLink to="/government/districts" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <MapPin size={16} />
            <span>District Intelligence</span>
          </NavLink>
          <NavLink to="/government/gap-analysis" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <AlertTriangle size={16} />
            <span>Welfare Gaps</span>
          </NavLink>
          <NavLink to="/government/performance" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <BarChart3 size={16} />
            <span>Scheme Performance</span>
          </NavLink>
          <NavLink to="/government/fraud" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <ShieldAlert size={16} />
            <span>Risk Intelligence</span>
          </NavLink>

          {/* 3. POLICY */}
          <div className="gov-section-title">POLICY</div>
          <NavLink to="/government/policy-lab" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <Scale size={16} />
            <span>Policy Lab</span>
          </NavLink>

          {/* 4. REPORTS */}
          <div className="gov-section-title">REPORTS</div>
          <NavLink to="/government/reports" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <FileSpreadsheet size={16} />
            <span>Reports & Exports</span>
          </NavLink>

          {/* 5. ACCOUNT */}
          <div className="gov-section-title">ACCOUNT</div>
          <NavLink to="/government/audit" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <Search size={16} />
            <span>Citizen Audit</span>
          </NavLink>
          <NavLink to="/government/settings" className={({ isActive }) => `gov-nav-link ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* User Card */}
        <div className="sidebar-user">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="user-name">Central Administration</div>
              <div className="user-role">Ministry of Planning & Welfare</div>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="gov-content">
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  );
}
