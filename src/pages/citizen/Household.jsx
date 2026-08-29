import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Trash2, ShieldCheck, Heart, User } from 'lucide-react';

export default function CitizenHousehold() {
  const { household, addHouseholdMember, removeHouseholdMember, profile } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    relation: 'spouse',
    age: 35,
    gender: 'female',
    occupation: 'homemaker',
    income_annual: 0
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;
    addHouseholdMember(memberForm);
    setIsAdding(false);
    setMemberForm({
      name: '',
      relation: 'child',
      age: 18,
      gender: 'male',
      occupation: 'student',
      income_annual: 0
    });
  };

  // Calculate aggregated household income
  const totalHouseholdIncome = (profile.income_annual || 0) + household.reduce((acc, m) => acc + (m.income_annual || 0), 0);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Household Intelligence</h1>
          <p className="page-description">
            Family unit composition for collective welfare schemes like Ayushman Bharat (PM-JAY) and PMAY.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} /> Add Family Member
        </button>
      </header>

      {/* Aggregated Household Metrics */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTopColor: 'var(--brass-gold)' }}>
          <div className="stat-value text-brass-gold">{household.length + 1}</div>
          <div className="stat-label">Total Family Members</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--ledger-green)' }}>
          <div className="stat-value text-ledger-green">₹{totalHouseholdIncome.toLocaleString('en-IN')}</div>
          <div className="stat-label">Combined Household Income</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--ink-navy)' }}>
          <div className="stat-value">{profile.ration_card_type?.toUpperCase() || 'PHH'}</div>
          <div className="stat-label">Ration Card Categorization</div>
        </div>
      </div>

      {/* Add Member Modal / Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '1.5rem', background: '#FFFDF8', border: '2px solid var(--brass-gold)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
            Add Family Member
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Relationship to Head</label>
              <select
                className="form-select"
                value={memberForm.relation}
                onChange={e => setMemberForm({ ...memberForm, relation: e.target.value })}
              >
                <option value="spouse">Spouse</option>
                <option value="child">Child (Son / Daughter)</option>
                <option value="parent">Parent (Father / Mother)</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other Dependent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                value={memberForm.age}
                onChange={e => setMemberForm({ ...memberForm, age: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={memberForm.gender}
                onChange={e => setMemberForm({ ...memberForm, gender: e.target.value })}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input
                type="text"
                className="form-input"
                value={memberForm.occupation}
                onChange={e => setMemberForm({ ...memberForm, occupation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Annual Income (₹)</label>
              <input
                type="number"
                className="form-input"
                value={memberForm.income_annual}
                onChange={e => setMemberForm({ ...memberForm, income_annual: parseInt(e.target.value, 10) })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Member →
            </button>
          </div>
        </form>
      )}

      {/* Member Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Head of Household Card */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper)', borderLeft: '4px solid var(--ink-navy)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--ink-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '1rem' }}>
                {profile.full_name} <span style={{ fontSize: '0.75rem', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>(Head of Family)</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: '2px' }}>
                {profile.age} yrs · {profile.gender} · {profile.occupation} · Income: ₹{profile.income_annual?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <span className="badge badge-eligible">Primary Passport Holder</span>
        </div>

        {/* Family Members */}
        {household.map(m => (
          <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--paper)', color: 'var(--ink-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                <Heart size={18} color="var(--seal-vermillion)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>
                  {m.name} <span style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'capitalize' }}>({m.relation})</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: '2px' }}>
                  {m.age} yrs · {m.gender} · {m.occupation} · Income: ₹{m.income_annual?.toLocaleString('en-IN') || 0}
                </div>
              </div>
            </div>
            <button
              onClick={() => removeHouseholdMember(m.id)}
              style={{ background: 'none', border: 'none', color: 'var(--seal-vermillion)', cursor: 'pointer', padding: '6px' }}
              title="Remove family member"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
