import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Home,
  Heart,
  CreditCard,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  Check,
  Search,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  calculatePassportCompleteness,
  analyzeMissingSchemeAttributes,
  INDIAN_STATES_AND_UTS,
  TRI_STATE_OPTIONS
} from '../../utils/welfarePassportUtils';

export default function CitizenProfile() {
  const { 
    profile, 
    household = [], 
    updateProfile, 
    addHouseholdMember, 
    removeHouseholdMember,
    evaluations = [],
    schemes = []
  } = useAuth();

  const { t } = useLanguage();

  const [savedToast, setSavedToast] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Search filter for existing benefits selector
  const [benefitSearch, setBenefitSearch] = useState('');

  // Household add form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('spouse');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberOccupation, setNewMemberOccupation] = useState('homemaker');
  const [newMemberIncome, setNewMemberIncome] = useState('');

  // Profile Completeness calculation
  const completeness = useMemo(() => {
    return calculatePassportCompleteness(profile, evaluations);
  }, [profile, evaluations]);

  // Missing Attributes Analysis across evaluated schemes
  const prioritizedMissing = useMemo(() => {
    return analyzeMissingSchemeAttributes(evaluations, profile);
  }, [evaluations, profile]);

  // Handle generic profile field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val;

    if (type === 'checkbox') {
      val = checked;
    } else if (type === 'number') {
      // Crucial: Unknown / empty income must remain undefined/null, NOT 0!
      val = value === '' ? null : Number(value);
    } else {
      val = value;
    }

    updateProfile({ [name]: val });
    triggerSaveToast();
  };

  // Direct attribute update helper
  const setAttribute = (field, val) => {
    updateProfile({ [field]: val });
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  // Add household member
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addHouseholdMember({
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: parseInt(newMemberAge, 10) || 0,
      gender: 'other',
      occupation: newMemberOccupation,
      income_annual: newMemberIncome === '' ? 0 : Number(newMemberIncome)
    });
    setNewMemberName('');
    setNewMemberAge('');
    setNewMemberIncome('');
    triggerSaveToast();
  };

  // Toggle existing benefits array
  const toggleExistingBenefit = (schemeKey) => {
    const currentList = Array.isArray(profile?.existing_benefits) ? profile.existing_benefits : [];
    const updated = currentList.includes(schemeKey)
      ? currentList.filter(k => k !== schemeKey)
      : [...currentList, schemeKey];

    updateProfile({ existing_benefits: updated });
    triggerSaveToast();
  };

  // All catalog schemes for the existing benefits selector
  const availableCatalog = useMemo(() => {
    const list = schemes.length > 0 ? schemes : evaluations;
    const query = benefitSearch.toLowerCase().trim();
    return list.filter(s => {
      const code = (s.scheme_code || s.schemeCode || s.short_name || '').toLowerCase();
      const name = (s.official_name || s.name || s.schemeName || '').toLowerCase();
      return !query || code.includes(query) || name.includes(query);
    }).slice(0, 15);
  }, [schemes, evaluations, benefitSearch]);

  // Section collapse state toggle
  const toggleSection = (sec) => {
    setActiveSection(prev => prev === sec ? null : sec);
  };

  // Format last updated date
  const lastUpdatedText = profile?.updated_at 
    ? new Date(profile.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Adaptive Welfare Identity
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {t('lastUpdated')}: {lastUpdatedText}
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} color="var(--seal-vermillion)" />
            {t('welfarePassport')}
          </h1>
          <p className="page-description">
            Your single, scheme-aware welfare profile. Updates deterministically re-evaluate eligibility across verified Central & State schemes.
          </p>
        </div>

        {savedToast && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--ledger-green)', 
            fontWeight: 700, 
            fontSize: '0.88rem',
            background: 'rgba(31, 122, 77, 0.1)',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(31, 122, 77, 0.25)'
          }}>
            <CheckCircle2 size={16} /> {t('profileUpdated')}
          </div>
        )}
      </header>

      {/* ── 1. Completeness & "Improve Matches" Bar ── */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFDF9', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                {t('passportCompleteness')}
              </span>
              <span className={`badge ${completeness.level === 'high' ? 'badge-eligible' : (completeness.level === 'medium' ? 'badge-nearly' : 'badge-neutral')}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700 }}>
                {completeness.percentage}%
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
              <div 
                style={{ 
                  width: `${completeness.percentage}%`, 
                  height: '100%', 
                  background: completeness.percentage >= 80 ? 'var(--ledger-green)' : (completeness.percentage >= 55 ? 'var(--brass-gold)' : 'var(--seal-vermillion)'),
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
            
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--slate)', lineHeight: 1.4 }}>
              {completeness.summary}
            </p>
          </div>

          {/* Actionable suggestions */}
          {completeness.suggestions.length > 0 && (
            <div style={{ background: 'var(--paper)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-navy)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                <Sparkles size={13} color="var(--brass-gold)" /> {t('improveMatches')}:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {completeness.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSection(sug.section)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '14px' }}
                    title={sug.impact}
                  >
                    + {sug.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Scheme-Specific Missing Information Alert Drawer ── */}
      {prioritizedMissing.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(166, 135, 61, 0.07)', borderColor: 'rgba(166, 135, 61, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--brass-gold)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--ink-navy)', fontWeight: 700 }}>
                {t('missingInfoTitle')} ({prioritizedMissing.length})
              </h3>
            </div>
            <span className="badge badge-nearly" style={{ fontSize: '0.72rem' }}>
              {t('badgeSchemeSpecific')}
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--slate)', margin: '0 0 12px 0' }}>
            Answering these prioritized questions will immediately unlock deterministic evaluation for blocked statutory schemes:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {prioritizedMissing.slice(0, 3).map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
                    {item.ruleLabel}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate)', marginTop: '2px' }}>
                    Unlocks: <strong>{item.schemes.map(s => s.code).join(', ')}</strong> ({item.schemesCount} schemes)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSection(item.section)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px', flexShrink: 0 }}
                >
                  Answer →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Adaptive Sections Accordion ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* ========================================================
            SECTION A: BASIC IDENTITY (Required Baseline)
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('basic')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'basic' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'basic' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secBasicIdentity')}
              </span>
              <span className="badge badge-eligible" style={{ fontSize: '0.7rem' }}>
                {t('badgeRequired')}
              </span>
            </div>
            {activeSection === 'basic' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'basic' && (
            <div style={{ padding: '20px' }}>
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    className="form-input"
                    value={profile?.full_name || ''}
                    onChange={handleChange}
                    placeholder="As appearing in official documents"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age (Years) *</label>
                  <input
                    type="number"
                    name="age"
                    className="form-input"
                    value={profile?.age ?? ''}
                    onChange={handleChange}
                    placeholder="e.g. 42"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={profile?.gender || 'male'}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Transgender</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="marital_status"
                    className="form-select"
                    value={profile?.marital_status || 'unspecified'}
                    onChange={handleChange}
                  >
                    <option value="unspecified">{t('optNotProvided')}</option>
                    <option value="unmarried">Unmarried / Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced_separated">Divorced / Separated</option>
                    <option value="prefer_not_to_say">{t('optPreferNotToSay')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">State of Domicile *</label>
                  <select
                    name="state"
                    className="form-select"
                    value={profile?.state || 'Gujarat'}
                    onChange={handleChange}
                  >
                    {INDIAN_STATES_AND_UTS.filter(s => s !== 'All-India').map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    name="district"
                    className="form-input"
                    value={profile?.district || ''}
                    onChange={handleChange}
                    placeholder="e.g. Surat, Jaipur, Patna"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Taluka / Tehsil / Block</label>
                  <input
                    type="text"
                    name="taluka_block"
                    className="form-input"
                    value={profile?.taluka_block || ''}
                    onChange={handleChange}
                    placeholder="Sub-district / Block"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    value={profile?.pincode || ''}
                    onChange={handleChange}
                    placeholder="6-digit Postal PIN"
                    maxLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Area Classification</label>
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
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION B: SOCIAL / COMMUNITY PROFILE
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('social')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'social' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'social' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HeartHandshake size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secSocialCommunity')}
              </span>
              <span className="badge badge-nearly" style={{ fontSize: '0.7rem' }}>
                {t('badgeRecommended')}
              </span>
            </div>
            {activeSection === 'social' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'social' && (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.83rem', color: 'var(--slate)', marginBottom: '1rem' }}>
                Used strictly to assess affirmative welfare criteria (scholarships, reserved quotas, assistive grants).
              </p>

              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Social Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={profile?.category || 'general'}
                    onChange={handleChange}
                  >
                    <option value="general">General</option>
                    <option value="obc">OBC (Other Backward Class)</option>
                    <option value="sc">SC (Scheduled Caste)</option>
                    <option value="st">ST (Scheduled Tribe)</option>
                    <option value="ews">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Religious / Linguistic Minority</label>
                  <select
                    name="minority_status"
                    className="form-select"
                    value={profile?.minority_status || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Notified Minority Community)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                    <option value="prefer_not_to_say">{t('optPreferNotToSay')}</option>
                  </select>
                </div>

                {/* Progressive Disclosure: Disability */}
                <div className="form-group">
                  <label className="form-label">Person with Benchmark Disability (PwD)?</label>
                  <select
                    name="disability"
                    className="form-select"
                    value={profile?.disability === false ? 'none' : (profile?.disability || 'none')}
                    onChange={handleChange}
                  >
                    <option value="none">No Disability</option>
                    <option value="physical">Physical / Locomotor Disability</option>
                    <option value="visual">Visual Impairment</option>
                    <option value="hearing">Hearing / Speech Impairment</option>
                    <option value="intellectual">Intellectual / Developmental</option>
                    <option value="multiple">Multiple Disabilities</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                    <option value="prefer_not_to_say">{t('optPreferNotToSay')}</option>
                  </select>
                </div>

                {profile?.disability && profile?.disability !== 'none' && profile?.disability !== 'not_sure' && profile?.disability !== 'prefer_not_to_say' && (
                  <div className="form-group" style={{ background: '#FAF9F6', padding: '10px', borderRadius: '6px' }}>
                    <label className="form-label">Disability Percentage (%)</label>
                    <input
                      type="number"
                      name="disability_percentage"
                      className="form-input"
                      value={profile?.disability_percentage ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 40 (Official UDID card percentage)"
                      min="1"
                      max="100"
                    />
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate)' }}>
                      Most statutory benefits require ≥40% disability certification.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION C: HOUSEHOLD PROFILE & MEMBERS
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('household')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'household' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'household' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secHousehold')}
              </span>
              <span className="badge badge-nearly" style={{ fontSize: '0.7rem' }}>
                {household.length + 1} Members
              </span>
            </div>
            {activeSection === 'household' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'household' && (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.83rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
                Family composition enables evaluation of child, senior, and girl-child benefits (Sukanya Samriddhi, PMMVY, Family Pension).
              </p>

              <div className="profile-form" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Household Size</label>
                  <input
                    type="number"
                    name="household_size"
                    className="form-input"
                    value={profile?.household_size || (household.length + 1)}
                    onChange={handleChange}
                    min="1"
                    max="25"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Female-Headed Household?</label>
                  <select
                    name="is_woman_head"
                    className="form-select"
                    value={profile?.is_woman_head ? 'yes' : (profile?.is_woman_head === false ? 'no' : 'no')}
                    onChange={(e) => setAttribute('is_woman_head', e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Eldest female member is head)</option>
                  </select>
                </div>
              </div>

              {/* Household Members List */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
                  Registered Household Members
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                  <div className="household-member-card" style={{ background: '#FAF9F6' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>{profile?.full_name || 'Primary Citizen'} (Self)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>
                        Head of Household · {profile?.age || '--'} yrs · {profile?.occupation || '--'}
                      </div>
                    </div>
                    <span className="badge badge-eligible" style={{ fontSize: '0.7rem' }}>Primary</span>
                  </div>

                  {household.map(member => (
                    <div key={member.id} className="household-member-card">
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>{member.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>
                          {member.relation} · {member.age} yrs · {member.occupation}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHouseholdMember(member.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--seal-vermillion)', cursor: 'pointer', padding: '4px' }}
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Member Bar */}
                <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr)) auto', gap: '8px', alignItems: 'center', background: 'var(--paper)', padding: '12px', borderRadius: '6px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Member Name *"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    required
                  />
                  <select
                    className="form-select"
                    value={newMemberRelation}
                    onChange={e => setNewMemberRelation(e.target.value)}
                  >
                    <option value="spouse">Spouse</option>
                    <option value="child">Child / Daughter / Son</option>
                    <option value="parent">Parent (Mother / Father)</option>
                    <option value="sibling">Sibling</option>
                    <option value="dependent">Other Dependent</option>
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Age *"
                    value={newMemberAge}
                    onChange={e => setNewMemberAge(e.target.value)}
                    min="0"
                    max="110"
                    required
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
                    <option value="retired">Senior / Retired</option>
                    <option value="none">Infant / None</option>
                  </select>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={15} /> Add
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION D: ECONOMIC PROFILE
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('economic')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'economic' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'economic' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secEconomic')}
              </span>
              <span className="badge badge-eligible" style={{ fontSize: '0.7rem' }}>
                {t('badgeRequired')}
              </span>
            </div>
            {activeSection === 'economic' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'economic' && (
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(11,31,58,0.04)', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--slate)' }}>
                ℹ️ <strong>Privacy Protection:</strong> Unknown or empty income is kept as <em>Unknown</em>. Saarthi never converts missing income to zero.
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Annual Household Income (₹)</label>
                  <input
                    type="number"
                    name="income_annual"
                    className="form-input"
                    value={profile?.income_annual ?? ''}
                    onChange={handleChange}
                    placeholder="Leave blank if unknown / not sure"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Individual Annual Income (₹) [Optional]</label>
                  <input
                    type="number"
                    name="income_individual"
                    className="form-input"
                    value={profile?.income_individual ?? ''}
                    onChange={handleChange}
                    placeholder="Applicant personal income"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Occupation *</label>
                  <select
                    name="occupation"
                    className="form-select"
                    value={profile?.occupation || 'farmer'}
                    onChange={handleChange}
                  >
                    <option value="farmer">Farmer / Agriculture</option>
                    <option value="artisan">Artisan / Traditional Craft</option>
                    <option value="daily_wage">Daily Wage / Construction Labour</option>
                    <option value="street_vendor">Street Vendor / Hawkers</option>
                    <option value="self_employed">Self Employed / Micro-enterprise</option>
                    <option value="salaried">Salaried Employee</option>
                    <option value="student">Student</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="unemployed">Unemployed / Job Seeker</option>
                    <option value="retired">Retired / Senior Citizen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Employment Sector</label>
                  <select
                    name="employment_sector"
                    className="form-select"
                    value={profile?.employment_sector || 'unorganized'}
                    onChange={handleChange}
                  >
                    <option value="unorganized">Unorganized / Informal Sector</option>
                    <option value="formal_private">Private Organized Sector</option>
                    <option value="government">Government / Public Sector</option>
                    <option value="self_employed">Independent / Self-employed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">BPL / Ration Card Holder?</label>
                  <select
                    name="bpl_card"
                    className="form-select"
                    value={profile?.bpl_card === true || profile?.bpl_card === 'yes' ? 'yes' : (profile?.bpl_card === false || profile?.bpl_card === 'no' ? 'no' : 'not_sure')}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAttribute('bpl_card', v === 'yes' ? true : (v === 'no' ? false : 'not_sure'));
                    }}
                  >
                    <option value="yes">Yes (Holds BPL / Ration Card)</option>
                    <option value="no">No</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ration Card Type</label>
                  <select
                    name="ration_card_type"
                    className="form-select"
                    value={profile?.ration_card_type || 'none'}
                    onChange={handleChange}
                  >
                    <option value="none">No Ration Card</option>
                    <option value="aay">Antyodaya Anna Yojana (AAY - Poorest of poor)</option>
                    <option value="phh">Priority Household (PHH / BPL)</option>
                    <option value="nphh">Non-Priority Household (NPHH / APL)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION E: AGRICULTURE & LAND (Conditional Progressive)
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('agriculture')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'agriculture' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'agriculture' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🌾</span>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secAgriculture')}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                Conditional
              </span>
            </div>
            {activeSection === 'agriculture' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'agriculture' && (
            <div style={{ padding: '20px' }}>
              {/* Gatekeeper Question */}
              <div className="form-group" style={{ marginBottom: '1.25rem', background: '#FAF9F6', padding: '12px', borderRadius: '6px' }}>
                <label className="form-label" style={{ fontWeight: 700, color: 'var(--ink-navy)' }}>
                  Are you or your household involved in agriculture or farming activities?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {TRI_STATE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAttribute('is_farmer_involved', opt.value)}
                      className={`btn ${profile?.is_farmer_involved === opt.value || (opt.value === 'yes' && profile?.occupation === 'farmer' && !profile?.is_farmer_involved) ? 'btn-primary' : 'btn-outline'} btn-sm`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Revealed Fields */}
              {(profile?.is_farmer_involved === 'yes' || (profile?.occupation === 'farmer' && profile?.is_farmer_involved !== 'no')) && (
                <div className="profile-form">
                  <div className="form-group">
                    <label className="form-label">Farmer Category</label>
                    <select
                      name="farmer_type"
                      className="form-select"
                      value={profile?.farmer_type || 'marginal'}
                      onChange={handleChange}
                    >
                      <option value="marginal">Marginal Farmer (Holding &lt; 1 Hectare / 2.5 Acres)</option>
                      <option value="small">Small Farmer (Holding 1 to 2 Hectares / 2.5 to 5 Acres)</option>
                      <option value="medium_large">Semi-Medium / Large Farmer (&gt; 2 Hectares)</option>
                      <option value="tenant">Tenant Farmer / Sharecropper</option>
                      <option value="labourer">Agricultural Labourer (Landless)</option>
                      <option value="not_sure">{t('optNotSure')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cultivable Land Ownership Status</label>
                    <select
                      name="land_ownership"
                      className="form-select"
                      value={profile?.land_ownership || 'below_2_acres'}
                      onChange={handleChange}
                    >
                      <option value="below_2_acres">Below 2 Acres (Marginal)</option>
                      <option value="2_to_5_acres">2 to 5 Acres (Small)</option>
                      <option value="above_5_acres">Above 5 Acres (Medium/Large)</option>
                      <option value="none">No Land (Landless / Tenant)</option>
                      <option value="not_sure">{t('optNotSure')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Exact Landholding (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="land_holding_acres"
                      className="form-input"
                      value={profile?.land_holding_acres ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 1.8"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Irrigation Profile</label>
                    <select
                      name="irrigation_type"
                      className="form-select"
                      value={profile?.irrigation_type || 'irrigated'}
                      onChange={handleChange}
                    >
                      <option value="irrigated">Irrigated Land (Canal / Tube well / Borewell)</option>
                      <option value="non_irrigated">Rainfed / Non-irrigated</option>
                      <option value="partially_irrigated">Partially Irrigated</option>
                      <option value="not_sure">{t('optNotSure')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Crop Category</label>
                    <select
                      name="crop_category"
                      className="form-select"
                      value={profile?.crop_category || 'kharif'}
                      onChange={handleChange}
                    >
                      <option value="kharif">Food Grains (Kharif - Paddy, Maize, etc.)</option>
                      <option value="rabi">Wheat / Pulses / Oilseeds (Rabi)</option>
                      <option value="horticulture">Horticulture / Fruits & Vegetables</option>
                      <option value="commercial">Commercial / Cash Crops (Cotton, Sugarcane)</option>
                      <option value="mixed">Mixed Farming</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Livestock / Dairy Ownership</label>
                    <select
                      name="owns_livestock"
                      className="form-select"
                      value={profile?.owns_livestock || 'no'}
                      onChange={handleChange}
                    >
                      <option value="no">No Livestock</option>
                      <option value="yes">Yes (Cattle, Buffalo, Goat, Poultry)</option>
                      <option value="not_sure">{t('optNotSure')}</option>
                    </select>
                  </div>
                </div>
              )}

              {profile?.is_farmer_involved === 'no' && (
                <div style={{ color: 'var(--slate)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  Agricultural fields skipped. This will not affect your evaluation for non-agricultural welfare programs.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION F: EDUCATION & ACADEMICS (Conditional)
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('education')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'education' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'education' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secEducation')}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {t('badgeOptional')}
              </span>
            </div>
            {activeSection === 'education' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'education' && (
            <div style={{ padding: '20px' }}>
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Highest Education Level Completed</label>
                  <select
                    name="education"
                    className="form-select"
                    value={profile?.education || profile?.education_level || 'secondary'}
                    onChange={handleChange}
                  >
                    <option value="none">No Formal Schooling</option>
                    <option value="primary">Primary (Class 1-5)</option>
                    <option value="secondary">Secondary (Class 6-10 / Matric)</option>
                    <option value="higher_secondary">Higher Secondary (Class 11-12 / Inter)</option>
                    <option value="diploma">Diploma / Vocational / ITI</option>
                    <option value="graduate">Undergraduate (BA / BSc / BCom / BTech)</option>
                    <option value="post_graduate">Post-Graduate / Doctorate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Currently Enrolled as Student?</label>
                  <select
                    name="is_student"
                    className="form-select"
                    value={profile?.is_student ? 'yes' : (profile?.is_student === false ? 'no' : (profile?.occupation === 'student' ? 'yes' : 'no'))}
                    onChange={(e) => setAttribute('is_student', e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Currently in School / College / Institute)</option>
                  </select>
                </div>

                {profile?.is_student && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Institution Type</label>
                      <select
                        name="institution_type"
                        className="form-select"
                        value={profile?.institution_type || 'government'}
                        onChange={handleChange}
                      >
                        <option value="government">Government School / College / University</option>
                        <option value="aided">Government-Aided Institution</option>
                        <option value="private">Private Recognized Institution</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">First-Generation Learner?</label>
                      <select
                        name="is_first_generation_learner"
                        className="form-select"
                        value={profile?.is_first_generation_learner || 'no'}
                        onChange={handleChange}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes (First in family to attend college)</option>
                        <option value="not_sure">{t('optNotSure')}</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION G: EMPLOYMENT & SKILLS
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('employment')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'employment' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'employment' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secEmployment')}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {t('badgeOptional')}
              </span>
            </div>
            {activeSection === 'employment' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'employment' && (
            <div style={{ padding: '20px' }}>
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Registered on e-Shram Portal?</label>
                  <select
                    name="eshram_registered"
                    className="form-select"
                    value={profile?.eshram_registered || 'not_sure'}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes (Possesses UAN Card)</option>
                    <option value="no">No</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Holds Building / Labour Board Card (BOCW)?</label>
                  <select
                    name="has_labour_card"
                    className="form-select"
                    value={profile?.has_labour_card || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Registered Construction/BOCW Worker)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seeking Skill Training / Apprenticeship?</label>
                  <select
                    name="has_vocational_training"
                    className="form-select"
                    value={profile?.has_vocational_training || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Interested in PMKVY / NAPS apprenticeship)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Traditional Artisan / Craftsperson (18 Trades)?</label>
                  <select
                    name="is_artisan"
                    className="form-select"
                    value={profile?.occupation === 'artisan' || profile?.is_artisan ? 'yes' : 'no'}
                    onChange={(e) => setAttribute('is_artisan', e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Carpenter, Blacksmith, Potter, Mason, Weaver, etc.)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION H: HOUSING & BASIC AMENITIES
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('housing')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'housing' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'housing' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secHousing')}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {t('badgeOptional')}
              </span>
            </div>
            {activeSection === 'housing' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'housing' && (
            <div style={{ padding: '20px' }}>
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Dwelling / House Ownership</label>
                  <select
                    name="house_ownership"
                    className="form-select"
                    value={profile?.house_ownership || 'kuccha'}
                    onChange={handleChange}
                  >
                    <option value="homeless">Houseless / Homeless</option>
                    <option value="kuccha">Kuccha House (Mud / Thatch roof)</option>
                    <option value="semi_pucca">Semi-Pucca House</option>
                    <option value="pucca">Pucca House (Concrete / Brick)</option>
                    <option value="rented">Rented Accommodation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">LPG Gas Connection Available (PM Ujjwala)?</label>
                  <select
                    name="has_lpg_connection"
                    className="form-select"
                    value={profile?.has_lpg_connection || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No LPG Cylinder (Uses traditional biomass/firewood)</option>
                    <option value="yes">Yes (Active Domestic LPG Connection)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Electricity Meter Connection</label>
                  <select
                    name="has_electricity"
                    className="form-select"
                    value={profile?.has_electricity || 'yes'}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes (Connected)</option>
                    <option value="no">No Electricity Connection</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sanitary Toilet Facility (SBM)</label>
                  <select
                    name="has_toilet"
                    className="form-select"
                    value={profile?.has_toilet || 'yes'}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes (Individual Household Latrine)</option>
                    <option value="no">No Individual Toilet</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION I: HEALTH & SOCIAL PROTECTION (Minimal & Privacy Conscious)
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('health')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'health' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'health' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secHealth')}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {t('badgeOptional')}
              </span>
            </div>
            {activeSection === 'health' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'health' && (
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(31,122,77,0.06)', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--ledger-green)' }}>
                🔒 <strong>Privacy Assurance:</strong> Saarthi never stores private medical diagnoses or clinical records. These questions only evaluate entitlement to free insurance and maternity grants.
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Ayushman Bharat (PM-JAY) or State Health Cover?</label>
                  <select
                    name="has_pmjay_or_state_cover"
                    className="form-select"
                    value={profile?.has_pmjay_or_state_cover || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No / Not Enrolled</option>
                    <option value="yes">Yes (Possesses Ayushman Card / ₹5L Cover)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pregnant or Lactating Mother in Household?</label>
                  <select
                    name="is_pregnant_or_lactating"
                    className="form-select"
                    value={profile?.is_pregnant_or_lactating ? 'yes' : (profile?.is_pregnant_or_lactating === false ? 'no' : 'no')}
                    onChange={(e) => setAttribute('is_pregnant_or_lactating', e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Eligible for PMMVY / Nutrition support)</option>
                    <option value="prefer_not_to_say">{t('optPreferNotToSay')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION J: FINANCIAL INCLUSION
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('financial')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'financial' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'financial' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secFinancial')}
              </span>
              <span className="badge badge-nearly" style={{ fontSize: '0.7rem' }}>
                {t('badgeRecommended')}
              </span>
            </div>
            {activeSection === 'financial' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'financial' && (
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(11,31,58,0.04)', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--slate)' }}>
                ℹ️ Saarthi <strong>never</strong> asks for bank account numbers, PINs, OTPs, or passwords.
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Aadhaar-Seeded DBT Bank Account</label>
                  <select
                    name="bank_account"
                    className="form-select"
                    value={profile?.bank_account === true || profile?.bank_account === 'yes' ? 'yes' : (profile?.bank_account === false ? 'no' : 'yes')}
                    onChange={(e) => setAttribute('bank_account', e.target.value === 'yes')}
                  >
                    <option value="yes">Yes (Active DBT Bank Account)</option>
                    <option value="no">No Bank Account</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Jan Dhan Account (PMJDY)</label>
                  <select
                    name="jan_dhan_account"
                    className="form-select"
                    value={profile?.jan_dhan_account || 'not_sure'}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes (Zero Balance PMJDY Account)</option>
                    <option value="no">No (Regular Savings Account)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Existing Pension Enrolment (APY / NSAP / NPS)</label>
                  <select
                    name="has_pension_enrolment"
                    className="form-select"
                    value={profile?.has_pension_enrolment || 'no'}
                    onChange={handleChange}
                  >
                    <option value="no">No Existing Pension</option>
                    <option value="yes">Yes (Currently receives government old-age/widow/disability pension)</option>
                    <option value="not_sure">{t('optNotSure')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION K: EXISTING GOVERNMENT BENEFITS (Important New Section)
           ======================================================== */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            onClick={() => toggleSection('benefits')}
            style={{ 
              padding: '16px 20px', 
              background: activeSection === 'benefits' ? '#FFFDF9' : 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: activeSection === 'benefits' ? '1px solid var(--border)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} color="var(--seal-vermillion)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-navy)' }}>
                {t('secExistingBenefits')}
              </span>
              <span className="badge badge-eligible" style={{ fontSize: '0.7rem' }}>
                {(profile?.existing_benefits || []).length} Active
              </span>
            </div>
            {activeSection === 'benefits' ? <ChevronUp size={18} color="var(--slate)" /> : <ChevronDown size={18} color="var(--slate)" />}
          </div>

          {activeSection === 'benefits' && (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate)', margin: '0 0 14px 0' }}>
                Mark schemes you are <strong>already enrolled in or receiving</strong>. Saarthi will list them under Active Benefits rather than recommending them as new unclaimed entitlements.
              </p>

              {/* Search Schemes */}
              <div style={{ marginBottom: '14px', position: 'relative' }}>
                <Search size={15} color="var(--slate)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search existing schemes (e.g. PM-KISAN, PMJAY, MGNREGA, Pension)..."
                  value={benefitSearch}
                  onChange={(e) => setBenefitSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Scheme Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {availableCatalog.map(scheme => {
                  const key = scheme.scheme_code || scheme.schemeCode || scheme.id;
                  const isReceived = (profile?.existing_benefits || []).includes(key) || (profile?.existing_benefits || []).includes(scheme.id);
                  const name = scheme.official_name || scheme.name || scheme.schemeName;

                  return (
                    <div
                      key={key}
                      onClick={() => toggleExistingBenefit(key)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isReceived ? 'var(--ledger-green)' : 'var(--border)'}`,
                        background: isReceived ? 'rgba(31,122,77,0.06)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                          {scheme.scheme_code || scheme.schemeCode || key}
                        </span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-navy)', marginTop: '2px' }}>
                          {name}
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {isReceived ? (
                          <span className="badge badge-eligible" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                            <Check size={12} /> {t('alreadyReceiving')}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>
                            + Mark
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer Save / Auto-saved info */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--slate)' }}>
          ✓ All edits auto-save & deterministically update your matched welfare schemes instantly.
        </span>

        <button
          type="button"
          onClick={() => triggerSaveToast()}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Check size={16} /> {t('saveChanges')}
        </button>
      </div>
    </div>
  );
}
