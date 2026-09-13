import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Activity
} from 'lucide-react';

export default function OpsUsers() {
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Initial Seed Users
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-001',
      name: 'Ramesh Patel',
      email: 'ramesh.farmer@example.com',
      role: 'citizen',
      district: 'Surat, Gujarat',
      status: 'active',
      verified: true,
      lastActive: '10 mins ago',
      applicationsCount: 2
    },
    {
      id: 'usr-002',
      name: 'Priya Sharma',
      email: 'priya.sharma@gujarat.gov.in',
      role: 'government',
      district: 'State Health Nodal, Gujarat',
      status: 'active',
      verified: true,
      lastActive: '1 hour ago',
      applicationsCount: 0
    },
    {
      id: 'usr-003',
      name: 'Vardan Administrator',
      email: 'admin@saarthi.gov.in',
      role: 'admin',
      district: 'National HQ, New Delhi',
      status: 'active',
      verified: true,
      lastActive: 'Active Now',
      applicationsCount: 0
    },
    {
      id: 'usr-004',
      name: 'Dr. Anand Verma',
      email: 'a.verma@nic.in',
      role: 'verifier',
      district: 'Policy Review Board',
      status: 'active',
      verified: true,
      lastActive: '3 hours ago',
      applicationsCount: 0
    },
    {
      id: 'usr-005',
      name: 'Sunita Devi',
      email: 'sunita.bihar@example.com',
      role: 'citizen',
      district: 'Patna, Bihar',
      status: 'active',
      verified: true,
      lastActive: 'Yesterday',
      applicationsCount: 1
    },
    {
      id: 'usr-006',
      name: 'District Collector Varanasi',
      email: 'dm-varanasi@up.gov.in',
      role: 'government',
      district: 'Varanasi, Uttar Pradesh',
      status: 'active',
      verified: true,
      lastActive: '5 hours ago',
      applicationsCount: 0
    }
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));
    setToast(`✓ Updated user role to ${newRole.toUpperCase()} (Audit Logged)`);
    setTimeout(() => setToast(''), 3500);
  };

  const handleToggleStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setToast(`✓ Updated account status (Audit Logged)`);
    setTimeout(() => setToast(''), 3500);
  };

  const filtered = usersList.filter(u => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.district.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">User & Role Access Management</h1>
            <p className="ops-page-subtitle">
              Manage platform permissions, inspect citizen accounts, and govern institutional role bindings with mandatory audit tracking.
            </p>
          </div>
        </div>
      </header>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Role Counts Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Accounts', count: usersList.length, color: 'var(--ink-navy)' },
          { label: 'Citizens', count: usersList.filter(u => u.role === 'citizen').length, color: 'var(--ledger-green)' },
          { label: 'Government Nodal', count: usersList.filter(u => u.role === 'government').length, color: 'var(--brass-gold)' },
          { label: 'Policy Verifiers', count: usersList.filter(u => u.role === 'verifier').length, color: 'var(--seal-vermillion)' },
          { label: 'System Admins', count: usersList.filter(u => u.role === 'admin').length, color: 'var(--ink-navy)' }
        ].map((stat, idx) => (
          <div key={idx} className="card" style={{ padding: '14px 18px', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-navy)', marginTop: '2px' }}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Role Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by user name, email, or district jurisdiction..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['ALL', 'citizen', 'government', 'verifier', 'admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`filter-chip ${roleFilter === r ? 'active' : ''}`}
              style={{ textTransform: 'capitalize', cursor: 'pointer' }}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', boxShadow: '0 4px 16px rgba(11, 31, 58, 0.05)' }}>
        <table className="table" style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFFDF9', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>User Identity</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Assigned RBAC Role</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Jurisdiction / District</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: 'var(--slate)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.92rem' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>
                    {user.email} · Last active {user.lastActive}
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <select
                    className="form-select"
                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px' }}
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="government">Government</option>
                    <option value="verifier">Verifier</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>

                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--slate)' }}>
                  {user.district}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${user.status === 'active' ? 'badge-eligible' : 'badge-nearly'}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                    {user.status}
                  </span>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(user.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
