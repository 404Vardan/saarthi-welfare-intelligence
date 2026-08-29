import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CommandPalette from '../common/CommandPalette';
import AskSaarthiDrawer from '../common/AskSaarthiDrawer';
import Breadcrumbs from '../common/Breadcrumbs';
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
  Command
} from 'lucide-react';

export default function CitizenLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/citizen/login');
  };

  return (
    <div className="app-shell">
      {/* Grouped Sidebar Navigation */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-seal-mark">S</div>
          <div>
            <div className="brand-name">SAARTHI</div>
            <div className="brand-tagline">National Welfare System</div>
          </div>
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
              <Search size={14} color="var(--brass-gold)" /> Search or Jump...
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
          <NavLink to="/citizen/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          {/* 2. MY WELFARE */}
          <div className="sidebar-section-title">MY WELFARE</div>
          <NavLink to="/citizen/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={16} />
            <span>Welfare Passport</span>
          </NavLink>
          <NavLink to="/citizen/household" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={16} />
            <span>Household</span>
          </NavLink>
          <NavLink to="/citizen/documents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FolderLock size={16} />
            <span>Document Vault</span>
          </NavLink>
          <NavLink to="/citizen/benefits" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Wallet size={16} />
            <span>Benefits Wallet</span>
          </NavLink>

          {/* 3. DISCOVER */}
          <div className="sidebar-section-title">DISCOVER</div>
          <NavLink to="/citizen/explorer" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Compass size={16} />
            <span>Explore Schemes</span>
          </NavLink>
          <NavLink to="/citizen/recommendations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>For You</span>
          </NavLink>
          <NavLink to="/citizen/compare" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Layers size={16} />
            <span>Compare</span>
          </NavLink>

          {/* 4. MY JOURNEY */}
          <div className="sidebar-section-title">MY JOURNEY</div>
          <NavLink to="/citizen/action-plan" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CheckSquare size={16} />
            <span>Action Plan</span>
          </NavLink>
          <NavLink to="/citizen/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileCheck2 size={16} />
            <span>Applications</span>
          </NavLink>
          <NavLink to="/citizen/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={16} />
            <span>Notifications</span>
          </NavLink>

          {/* 5. ASSIST */}
          <div className="sidebar-section-title">ASSIST</div>
          <NavLink to="/citizen/assistant" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bot size={16} />
            <span>Ask Saarthi</span>
          </NavLink>

          {/* 6. ACCOUNT */}
          <div className="sidebar-section-title">ACCOUNT</div>
          <NavLink to="/citizen/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
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
              title="Sign Out"
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

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={setCommandPaletteOpen} />

      {/* Persistent Floating Ask Saarthi Drawer */}
      <AskSaarthiDrawer />
    </div>
  );
}
