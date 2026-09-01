import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchemes } from '../../context/SchemeContext';
import EligibilityEngine from '../../engine/eligibilityEngine';
import {
  Users, Plus, Trash2, ShieldCheck, Heart, User, Sparkles,
  ArrowRight, CheckCircle, AlertTriangle, FileText, Check, Layers, ChevronRight
} from 'lucide-react';

export default function CitizenHousehold() {
  const { household, addHouseholdMember, removeHouseholdMember, profile, documents, applications, applyForScheme } = useAuth();
  const { schemes } = useSchemes();

  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'members'
  const [memberForm, setMemberForm] = useState({
    name: '',
    relation: 'spouse',
    age: 35,
    gender: 'female',
    occupation: 'homemaker',
    income_annual: 0
  });

  // Quick Preset Family Template Loader (Father: Farmer, Mother: Homemaker, Daughter: Student, Grandparent: Senior)
  const loadFamilyArchetype = () => {
    const archetypes = [
      { name: 'Kavita Patel', relation: 'spouse', age: 44, gender: 'female', occupation: 'homemaker', income_annual: 0 },
      { name: 'Ananya Patel', relation: 'child', age: 20, gender: 'female', occupation: 'student', income_annual: 0 },
      { name: 'Govindbhai Patel', relation: 'parent', age: 71, gender: 'male', occupation: 'senior', income_annual: 15000 }
    ];

    archetypes.forEach(m => addHouseholdMember(m));
  };

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

  // Evaluate the entire Household Portfolio using the generalized AST Engine
  const householdPortfolio = useMemo(() => {
    return EligibilityEngine.evaluateHouseholdPortfolio(profile, household, schemes, documents);
  }, [profile, household, schemes, documents]);

  // Aggregate Metrics
  const totalHouseholdIncome = (profile.income_annual || 0) + household.reduce((acc, m) => acc + (Number(m.income_annual) || 0), 0);
  const totalMembers = household.length + 1;
  const appliedSchemeIds = new Set((applications || []).map(a => a.schemeId));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <header className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(197, 160, 89, 0.15)', color: 'var(--brass-gold)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <Users size={13} />
            SAARTHI HOUSEHOLD INTELLIGENCE GRAPH
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem' }}>Family Welfare Portfolio</h1>
          <p className="page-description" style={{ fontSize: '0.9rem' }}>
            Multi-member relational evaluation. Instead of evaluating schemes in isolation, Saarthi analyzes what your entire household is entitled to collectively.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {household.length === 0 && (
            <button
              onClick={loadFamilyArchetype}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              title="Load standard 4-member household archetype (Farmer + Homemaker + Student + Senior)"
            >
              <Sparkles size={14} color="var(--brass-gold)" /> Load Standard Family Demo
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> Add Member
          </button>
        </div>
      </header>

      {/* Household Intelligence Top KPIs */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTopColor: 'var(--brass-gold)' }}>
          <div className="stat-value text-brass-gold">{totalMembers} Members</div>
          <div className="stat-label">Household Unit Composition</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--success-forest)' }}>
          <div className="stat-value text-ledger-green">₹{totalHouseholdIncome.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Annual Household Income</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--ink-navy)' }}>
          <div className="stat-value">{householdPortfolio.totalHouseholdEligible} Schemes</div>
          <div className="stat-label">Total Combined Entitlements Unlocked</div>
        </div>
      </div>

      {/* Navigation Tabs: Portfolio Optimizer vs Family Members */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            padding: '8px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'portfolio' ? '3px solid var(--brass-gold)' : 'none',
            color: activeTab === 'portfolio' ? 'var(--ink-navy)' : 'var(--slate)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          🎯 Prioritized Welfare Portfolio ({householdPortfolio.portfolioSchemes.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            padding: '8px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'members' ? '3px solid var(--brass-gold)' : 'none',
            color: activeTab === 'members' ? 'var(--ink-navy)' : 'var(--slate)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          👥 Family Members & Breakdown ({totalMembers})
        </button>
      </div>

      {/* TAB 1: PRIORITIZED WELFARE PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div>
          {/* Prioritization Strategy Banner */}
          <div style={{ padding: '12px 16px', borderRadius: '6px', background: '#F8FAF9', border: '1px solid #E2E8F0', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                OPTIMIZATION STRATEGY: HIGHEST IMPACT + EASIEST TO COMPLETE FIRST
              </span>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--slate)' }}>
                Schemes prioritized by financial quantum, immediate document readiness, and deduplication of family benefits.
              </p>
            </div>
            <span className="badge badge-eligible">
              {appliedSchemeIds.size} of {householdPortfolio.portfolioSchemes.length} Claimed
            </span>
          </div>

          {/* Portfolio Schemes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {householdPortfolio.portfolioSchemes.map((scheme, index) => {
              const hasApplied = appliedSchemeIds.has(scheme.schemeId);
              const docsReady = scheme.allDocumentsReady;

              return (
                <div
                  key={scheme.schemeId}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: index === 0 ? '5px solid var(--brass-gold)' : '4px solid var(--ink-navy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      {/* Priority Rank & Beneficiary Tag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--brass-gold)' }}>
                          #{index + 1} PRIORITY RECOMMENDATION
                        </span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(27, 42, 74, 0.08)', color: 'var(--ink-navy)', fontWeight: 600 }}>
                          For: {scheme.beneficiaries.join(', ')}
                        </span>
                      </div>

                      {/* Scheme Name & Benefit */}
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink-navy)', margin: '0 0 4px 0' }}>
                        {scheme.schemeName}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>
                        {scheme.benefit} · Administered by {scheme.ministry || 'Union Ministry'}
                      </div>
                    </div>

                    {/* Benefit Amount Pill */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Household Entitlement</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success-forest)' }}>
                        {scheme.benefitAmount || 'Cash / Aid'}
                      </div>
                    </div>
                  </div>

                  {/* Readiness & Document Flags */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: docsReady ? 'var(--success-forest)' : '#D97706', fontWeight: 600 }}>
                        {docsReady ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                        {docsReady ? 'All Required Documents Ready in Locker' : `${scheme.missingDocumentsCount} document(s) pending`}
                      </span>

                      <span style={{ color: 'var(--slate)', fontSize: '0.75rem' }}>
                        Match: {scheme.matchPercentage}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/citizen/scheme/${scheme.schemeId}`}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        Details
                      </Link>

                      {hasApplied ? (
                        <span className="badge badge-eligible" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => applyForScheme(scheme.schemeId, scheme.schemeName, `Applied on behalf of ${scheme.beneficiaries.join(', ')}`)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                        >
                          Apply for Family →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FAMILY MEMBERS LIST */}
      {activeTab === 'members' && (
        <div>
          {/* Member Creation Form Modal */}
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
                    placeholder="e.g. Ananya Patel"
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
                  <select
                    className="form-select"
                    value={memberForm.occupation}
                    onChange={e => setMemberForm({ ...memberForm, occupation: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="farmer">Farmer / Cultivator</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="senior">Senior Citizen</option>
                    <option value="artisan">Artisan / Craftsperson</option>
                    <option value="daily_wage">Daily Wage Worker</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
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

          {/* Member Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Primary Profile Card */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper)', borderLeft: '4px solid var(--ink-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--ink-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink-navy)', fontSize: '1.05rem' }}>
                    {profile.full_name || 'Primary Citizen'} <span style={{ fontSize: '0.75rem', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>(Head of Family)</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate)', marginTop: '2px' }}>
                    {profile.age} yrs · {profile.gender} · {profile.occupation} · Income: ₹{(profile.income_annual || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <span className="badge badge-eligible">Primary Passport</span>
            </div>

            {/* Household Dependent Cards */}
            {household.map(m => (
              <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--paper)', color: 'var(--ink-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <Heart size={18} color="var(--seal-vermillion)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ink-navy)' }}>
                      {m.name} <span style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'capitalize' }}>({m.relation})</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate)', marginTop: '2px' }}>
                      {m.age} yrs · {m.gender} · {m.occupation} · Income: ₹{(m.income_annual || 0).toLocaleString('en-IN')}
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
      )}
    </div>
  );
}
