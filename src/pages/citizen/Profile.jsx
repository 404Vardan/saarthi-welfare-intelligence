import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function CitizenProfile() {
  const { profile, household, updateProfile, addHouseholdMember, removeHouseholdMember } = useAuth();
  const [savedToast, setSavedToast] = useState(false);

  // Household add form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('child');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberOccupation, setNewMemberOccupation] = useState('student');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : (type === 'number' ? (parseInt(value, 10) || 0) : value);
    updateProfile({ [name]: val });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addHouseholdMember({
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: parseInt(newMemberAge, 10) || 0,
      gender: 'other',
      occupation: newMemberOccupation,
      income_annual: 0
    });
    setNewMemberName('');
    setNewMemberAge('');
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Welfare Passport</h1>
          <p className="page-description">
            Your single unified profile. Updates instantly re-evaluate your eligibility across all verified schemes.
          </p>
        </div>
        {savedToast && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ledger-green)', fontWeight: 600, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> Auto-Saved & Re-Evaluated!
          </div>
        )}
      </header>

      {/* Main Profile Form */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--ink-navy)' }}>
          Demographic & Economic Profile
        </h3>

        <div className="profile-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              value={profile?.full_name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age (Years)</label>
            <input
              type="number"
              name="age"
              className="form-input"
              value={profile?.age || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={profile?.gender || 'male'}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Occupation</label>
            <select
              name="occupation"
              className="form-select"
              value={profile?.occupation || 'farmer'}
              onChange={handleChange}
            >
              <option value="farmer">Farmer / Agriculture</option>
              <option value="artisan">Artisan / Traditional Craft</option>
              <option value="daily_wage">Daily Wage Worker</option>
              <option value="self_employed">Self Employed / Micro-enterprise</option>
              <option value="salaried">Salaried Employee</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired / Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Annual Income (₹)</label>
            <input
              type="number"
              name="income_annual"
              className="form-input"
              value={profile?.income_annual || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Social Category</label>
            <select
              name="category"
              className="form-select"
              value={profile?.category || 'general'}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC (Scheduled Caste)</option>
              <option value="st">ST (Scheduled Tribe)</option>
              <option value="ews">EWS (Economically Weaker Section)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">State of Residence</label>
            <input
              type="text"
              name="state"
              className="form-input"
              value={profile?.state || 'Gujarat'}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Area Type</label>
            <select
              name="area_type"
              className="form-select"
              value={profile?.area_type || 'rural'}
              onChange={handleChange}
            >
              <option value="rural">Rural</option>
              <option value="semi_urban">Semi-Urban</option>
              <option value="urban">Urban</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Land Ownership</label>
            <select
              name="land_ownership"
              className="form-select"
              value={profile?.land_ownership || 'none'}
              onChange={handleChange}
            >
              <option value="none">No Land (Landless)</option>
              <option value="below_2_acres">Marginal (Below 2 Acres)</option>
              <option value="2_to_5_acres">Small (2 to 5 Acres)</option>
              <option value="above_5_acres">Medium / Large (Above 5 Acres)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">House Ownership</label>
            <select
              name="house_ownership"
              className="form-select"
              value={profile?.house_ownership || 'kuccha'}
              onChange={handleChange}
            >
              <option value="none">Homeless</option>
              <option value="kuccha">Kuccha House</option>
              <option value="pucca">Pucca House</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          <div className="form-group full-width" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="bpl_card"
                className="form-checkbox"
                checked={profile?.bpl_card || false}
                onChange={handleChange}
              />
              <span>Holds BPL / Ration Card</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="bank_account"
                className="form-checkbox"
                checked={profile?.bank_account !== false}
                onChange={handleChange}
              />
              <span>Active DBT-Linked Bank Account</span>
            </label>
          </div>
        </div>
      </div>

      {/* Household Composition */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ink-navy)' }}>
          Household Members
        </h3>
        <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Certain schemes (like Sukanya Samriddhi or Old Age Pensions) evaluate collective household members.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          {household.map(member => (
            <div key={member.id} className="household-member-card">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>{member.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>
                  {member.relation} · {member.age} yrs · {member.occupation}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeHouseholdMember(member.id)}
                style={{ background: 'none', border: 'none', color: 'var(--error-red)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Member Bar */}
        <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'center', background: 'var(--paper)', padding: '12px', borderRadius: '4px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Member Name"
            value={newMemberName}
            onChange={e => setNewMemberName(e.target.value)}
          />
          <select
            className="form-select"
            value={newMemberRelation}
            onChange={e => setNewMemberRelation(e.target.value)}
          >
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
          </select>
          <input
            type="number"
            className="form-input"
            placeholder="Age"
            value={newMemberAge}
            onChange={e => setNewMemberAge(e.target.value)}
          />
          <select
            className="form-select"
            value={newMemberOccupation}
            onChange={e => setNewMemberOccupation(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="homemaker">Homemaker</option>
            <option value="farmer">Farmer</option>
            <option value="daily_wage">Daily Wage</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add
          </button>
        </form>
      </div>
    </div>
  );
}
