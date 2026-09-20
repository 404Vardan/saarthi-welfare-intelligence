import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import CommandPalette from '../common/CommandPalette';
import AskSaarthiDrawer from '../common/AskSaarthiDrawer';
import Breadcrumbs from '../common/Breadcrumbs';
import LanguageSelector from '../common/LanguageSelector';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FolderLock,
  Wallet,
  Compass,
  Sparkles,
  Layers,
  CheckSquare,
  FileCheck2,
  Bell,
  Bot,
  Settings,
  LogOut,
  Search,
  Command,
  Menu,
  X
} from 'lucide-react';

export default function CitizenLayout() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/citizen/login');
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile Top Header (Visible on screens < 1024px) */}
      <header className="citizen-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileNavOpen(prev => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-seal-mark" style={{ width: '28px', height: '28px', fontSize: '12px' }}>S</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink-navy)' }}>
              SAARTHI
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="btn-icon-subtle"
            style={{ padding: '6px', background: 'var(--paper-dark)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--ink-navy)' }}
            title="Search schemes"
          >
            <Search size={16} />
          </button>
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}

      {/* Grouped Sidebar Navigation */}
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        {/* Brand & Language Selector */}
        <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-seal-mark">S</div>
            <div>
              <div className="brand-name">SAARTHI</div>
              <div className="brand-tagline">National Welfare System</div>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Global Search Command Bar Shortcut */}
        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} color="var(--brass-gold)" /> {t('searchOrJump')}
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px', color: 'rgba(255,255,255,0.8)' }}>
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="sidebar-nav">
          {/* 1. HOME */}
          <div className="sidebar-section-title">HOME</div>
          <NavLink to="/citizen/dashboard" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            <span>{t('dashboard')}</span>
          </NavLink>

          {/* 2. MY WELFARE */}
          <div className="sidebar-section-title">MY WELFARE</div>
          <NavLink to="/citizen/profile" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={16} />
            <span>{t('welfarePassport')}</span>
          </NavLink>
          <NavLink to="/citizen/household" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={16} />
            <span>{t('household')}</span>
          </NavLink>
          <NavLink to="/citizen/documents" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FolderLock size={16} />
            <span>{t('documentVault')}</span>
          </NavLink>
          <NavLink to="/citizen/benefits" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Wallet size={16} />
            <span>{t('benefitsWallet')}</span>
          </NavLink>

          {/* 3. DISCOVER */}
          <div className="sidebar-section-title">DISCOVER</div>
          <NavLink to="/citizen/explorer" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Compass size={16} />
            <span>{t('schemesCatalogue')}</span>
          </NavLink>
          <NavLink to="/citizen/recommendations" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>{t('aiRecommendations')}</span>
          </NavLink>
          <NavLink to="/citizen/compare" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Layers size={16} />
            <span>{t('compareSchemes')}</span>
          </NavLink>

          {/* 4. MY JOURNEY */}
          <div className="sidebar-section-title">MY JOURNEY</div>
          <NavLink to="/citizen/action-plan" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CheckSquare size={16} />
            <span>{t('applyProcess')}</span>
          </NavLink>
          <NavLink to="/citizen/applications" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileCheck2 size={16} />
            <span>{t('trackStatus')}</span>
          </NavLink>
          <NavLink to="/citizen/notifications" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={16} />
            <span>{t('notifications')}</span>
          </NavLink>

          {/* 5. ASSIST */}
          <div className="sidebar-section-title">ASSIST</div>
          <NavLink to="/citizen/assistant" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bot size={16} />
            <span>{t('askSaarthi')}</span>
          </NavLink>

          {/* 6. ACCOUNT */}
          <div className="sidebar-section-title">ACCOUNT</div>
          <NavLink to="/citizen/settings" onClick={closeMobileNav} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-user">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="user-name">{profile?.full_name || 'Ramesh Yadav'}</div>
              <div className="user-role">Verified Citizen Passport</div>
            </div>
            <button
              onClick={handleSignOut}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}
              title={t('signOut')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Breadcrumbs />
        <Outlet />
      </main>

      {/* Mobile Persistent Bottom Navigation Bar (< 1024px) */}
      <nav className="citizen-mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/citizen/dashboard"
          onClick={closeMobileNav}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/citizen/recommendations"
          onClick={closeMobileNav}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={20} />
          <span>Entitlements</span>
        </NavLink>

        <NavLink
          to="/citizen/documents"
          onClick={closeMobileNav}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FolderLock size={20} />
          <span>Locker</span>
        </NavLink>

        <NavLink
          to="/citizen/applications"
          onClick={closeMobileNav}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FileCheck2 size={20} />
          <span>Tracker</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMobileNavOpen(prev => !prev)}
          className={`bottom-nav-item bottom-nav-btn ${mobileNavOpen ? 'active' : ''}`}
          aria-label="Toggle Full Menu"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Menu</span>
        </button>
      </nav>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={setCommandPaletteOpen} />

      {/* Persistent Floating Ask Saarthi Drawer */}
      <AskSaarthiDrawer />
    </div>
  );
}
