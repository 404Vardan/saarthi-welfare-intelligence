import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  IndianRupee,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Briefcase,
  Layers,
  HeartHandshake
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

export default function CitizenOnboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, runEligibilityEvaluation } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // Local Form State initialized from current profile
  const [formData, setFormData] = useState({
    // Step 1: Demographics
    full_name: profile?.full_name || '',
    age: profile?.age || 38,
    gender: profile?.gender || 'male',
    state: profile?.state || 'Gujarat',
    district: profile?.district || 'Surat',
    pincode: profile?.pincode || '395007',

    // Step 2: Economic
    occupation: profile?.occupation || 'farmer',
    income_annual: profile?.income_annual || 180000,
    land_ownership: profile?.land_ownership || 'below_2_acres',
    house_ownership: profile?.house_ownership || 'kuccha',
    area_type: profile?.area_type || 'rural',
    household_size: profile?.household_size || 4,

    // Step 3: Circumstances
    category: profile?.category || 'obc',
    bpl_card: profile?.bpl_card !== false,
    disability: profile?.disability || false,
    is_student: profile?.is_student || false,
    is_farmer: profile?.is_farmer !== false,
    is_senior: profile?.age >= 60,
    is_woman_head: profile?.gender === 'female',

    // Step 4: Documents
    has_aadhaar: true,
    has_income_cert: true,
    has_caste_cert: true,
    has_land_record: true,
    has_ration_card: true,
    has_bank_account: true
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scanStages = [
    'Aggregating verified demographic & economic parameters...',
    'Evaluating against 100+ Central & State statutory rules...',
    'Verifying land records & income ceiling thresholds...',
    'Cross-referencing document readiness and DBT compatibility...',
    'Generating authoritative decision traces...'
  ];

  const handleFindBenefits = async () => {
    setIsScanning(true);
    // Persist profile
    updateProfile(formData);

    // Simulate scanning progress stages
    for (let i = 0; i < scanStages.length; i++) {
      setScanStepIndex(i);
      await new Promise(r => setTimeout(r, 650));
    }

    if (runEligibilityEvaluation) {
      runEligibilityEvaluation(formData);
    }

    setTimeout(() => {
      setIsScanning(false);
      navigate('/citizen/recommendations');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Onboarding Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="brand-seal-mark" style={{ margin: '0 auto 12px auto' }}>✦</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink-navy)', margin: '0 0 8px 0' }}>
          Welcome to Your Welfare Passport
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
          Complete 4 simple steps to let Saarthi deterministically match all central and state welfare benefits you are entitled to.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '2.5rem' }}>
        {[
          { step: 1, label: 'Demographics', icon: User },
          { step: 2, label: 'Economic Profile', icon: IndianRupee },
          { step: 3, label: 'Circumstances', icon: HeartHandshake },
          { step: 4, label: 'Document Proofs', icon: FileCheck2 }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isComplete = currentStep > item.step;

          return (
            <div
              key={item.step}
              onClick={() => item.step < currentStep && setCurrentStep(item.step)}
              style={{
                background: isActive ? '#FFFDF9' : (isComplete ? 'rgba(31, 122, 77, 0.06)' : 'var(--paper)'),
                border: `1px solid ${isActive ? 'var(--seal-vermillion)' : (isComplete ? 'var(--ledger-green)' : 'var(--border)')}`,
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isComplete ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--seal-vermillion)' : (isComplete ? 'var(--ledger-green)' : 'var(--slate)'),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {isComplete ? '✓' : item.step}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Step {item.step}</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-navy)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="card" style={{ padding: '2.25rem', boxShadow: '0 8px 32px rgba(11, 31, 58, 0.06)' }}>
        {/* STEP 1: DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ background: 'rgba(184, 51, 42, 0.08)', color: 'var(--seal-vermillion)', padding: '8px', borderRadius: '6px' }}>
                <User size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.3rem' }}>
                  Step 1: Basic Information
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
                  Essential identity and residency attributes to filter state & district level entitlements.
                </p>
              </div>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name (as per Aadhaar)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.full_name}
                  onChange={e => handleChange('full_name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age (in years)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={e => handleChange('age', parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Transgender / Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State of Domicile</label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Surat"
                  value={formData.district}
                  onChange={e => handleChange('district', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Pincode</label>
                <input
                  type="text"
                  className="form-input"
                  maxLength={6}
                  placeholder="e.g. 395007"
                  value={formData.pincode}
                  onChange={e => handleChange('pincode', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ECONOMIC PROFILE */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ background: 'rgba(184, 51, 42, 0.08)', color: 'var(--seal-vermillion)', padding: '8px', borderRadius: '6px' }}>
                <IndianRupee size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.3rem' }}>
                  Step 2: Economic & Occupational Profile
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
                  Used to evaluate income thresholds, asset ownership tests, and occupation-specific schemes.
                </p>
              </div>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Primary Occupation</label>
                <select
                  className="form-select"
                  value={formData.occupation}
                  onChange={e => handleChange('occupation', e.target.value)}
                >
                  <option value="farmer">Farmer / Agriculture</option>
                  <option value="artisan">Artisan / Traditional Craftsman (PM Vishwakarma)</option>
                  <option value="daily_wage">Daily Wage Laborer (Unorganized / MGNREGA)</option>
                  <option value="street_vendor">Street Vendor / Hawkers (PM SVANidhi)</option>
                  <option value="self_employed">Self Employed / Micro-Enterprise (PMEGP / Mudra)</option>
                  <option value="student">Student / Higher Education</option>
                  <option value="salaried">Salaried Employee (Private / Formal)</option>
                  <option value="unemployed">Unemployed Job Seeker</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="retired">Retired / Senior Citizen</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Annual Household Income (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  step="10000"
                  value={formData.income_annual}
                  onChange={e => handleChange('income_annual', parseInt(e.target.value, 10) || 0)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px', display: 'block' }}>
                  ₹{(formData.income_annual || 0).toLocaleString('en-IN')} / annum
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Agricultural Land Holding</label>
                <select
                  className="form-select"
                  value={formData.land_ownership}
                  onChange={e => handleChange('land_ownership', e.target.value)}
                >
                  <option value="none">Landless / No Land</option>
                  <option value="below_2_acres">Marginal Farmer (Below 2 Acres / 0.8 Hectare)</option>
                  <option value="2_to_5_acres">Small Farmer (2 to 5 Acres)</option>
                  <option value="above_5_acres">Medium / Large Farmer (Above 5 Acres)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Residential House Condition</label>
                <select
                  className="form-select"
                  value={formData.house_ownership}
                  onChange={e => handleChange('house_ownership', e.target.value)}
                >
                  <option value="kuccha">Kuccha House / Temporary Shelter (PMAY eligible)</option>
                  <option value="pucca">Pucca House (Permanent structure)</option>
                  <option value="rented">Rented Accommodation</option>
                  <option value="none">Homeless</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Habitation Area Type</label>
                <select
                  className="form-select"
                  value={formData.area_type}
                  onChange={e => handleChange('area_type', e.target.value)}
                >
                  <option value="rural">Rural Gram Panchayat</option>
                  <option value="semi_urban">Semi-Urban Municipality</option>
                  <option value="urban">Urban Municipal Corporation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Household Size</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="20"
                  value={formData.household_size}
                  onChange={e => handleChange('household_size', parseInt(e.target.value, 10) || 1)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RELEVANT CIRCUMSTANCES */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ background: 'rgba(184, 51, 42, 0.08)', color: 'var(--seal-vermillion)', padding: '8px', borderRadius: '6px' }}>
                <HeartHandshake size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.3rem' }}>
                  Step 3: Social Category & Circumstances
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
                  Special targeted welfare provisions (reservations, affirmative subsidies, disability entitlements).
                </p>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Social Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {[
                  { id: 'general', label: 'General' },
                  { id: 'ews', label: 'EWS' },
                  { id: 'obc', label: 'OBC' },
                  { id: 'sc', label: 'SC' },
                  { id: 'st', label: 'ST' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleChange('category', c.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '4px',
                      border: `1px solid ${formData.category === c.id ? 'var(--seal-vermillion)' : 'var(--border)'}`,
                      background: formData.category === c.id ? 'rgba(184, 51, 42, 0.08)' : 'var(--paper)',
                      fontWeight: 600,
                      color: formData.category === c.id ? 'var(--seal-vermillion)' : 'var(--ink-navy)',
                      cursor: 'pointer'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.bpl_card}
                  onChange={e => handleChange('bpl_card', e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>Holds BPL / NFSA Ration Card (Antyodaya / Priority)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>Unlocks PM Garib Kalyan Anna Yojana, subsidized housing, and Ayushman Bharat health coverage.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.disability}
                  onChange={e => handleChange('disability', e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>Person with Benchmark Disability (PwD &gt; 40%)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>UDID Cardholder or medical certificate holder for dedicated assistance schemes.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.is_student}
                  onChange={e => handleChange('is_student', e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>Enrolled Student (Pre-Matric / Post-Matric / Higher Ed)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>Matches scholarships, fee waivers, laptops, and stipend programmes.</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: DOCUMENT READINESS */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ background: 'rgba(184, 51, 42, 0.08)', color: 'var(--seal-vermillion)', padding: '8px', borderRadius: '6px' }}>
                <FileCheck2 size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.3rem' }}>
                  Step 4: Verification Readiness
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
                  Confirm documents currently available in your possession. You can upload digital copies in your Document Vault anytime.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { field: 'has_aadhaar', label: 'Aadhaar Card (Linked to Mobile & Bank)', required: true },
                { field: 'has_income_cert', label: 'Income Certificate (Revenue Authority)', required: true },
                { field: 'has_caste_cert', label: 'Caste / EWS Certificate (If applicable)', required: false },
                { field: 'has_land_record', label: 'Land Records (7/12 RoR / Khasra-Khatauni)', required: false },
                { field: 'has_ration_card', label: 'Ration Card (NFSA / BPL / APL)', required: false },
                { field: 'has_bank_account', label: 'Active Bank Passbook (DBT Seeded)', required: true }
              ].map(doc => (
                <div
                  key={doc.field}
                  onClick={() => handleChange(doc.field, !formData[doc.field])}
                  style={{
                    padding: '14px',
                    borderRadius: '6px',
                    border: `1px solid ${formData[doc.field] ? 'var(--ledger-green)' : 'var(--border)'}`,
                    background: formData[doc.field] ? 'rgba(31, 122, 77, 0.05)' : 'var(--paper)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    style={{ marginTop: '3px' }}
                    checked={formData[doc.field]}
                    onChange={() => {}} // Handled by container
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-navy)' }}>
                      {doc.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: formData[doc.field] ? 'var(--ledger-green)' : 'var(--slate)', marginTop: '2px' }}>
                      {formData[doc.field] ? '✓ Available for Verification' : '○ Not Available Yet'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Continue to Step {currentStep + 1} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFindBenefits}
              disabled={isScanning}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                boxShadow: '0 4px 16px rgba(184, 51, 42, 0.3)'
              }}
            >
              <Sparkles size={18} color="var(--brass-gold)" /> Find My Benefits →
            </button>
          )}
        </div>
      </div>

      {/* SCANNING RADAR MODAL OVERLAY */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2.5rem', background: '#FFFDF9' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(184, 51, 42, 0.1)',
                color: 'var(--seal-vermillion)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                animation: 'spin 3s linear infinite'
              }}
            >
              <Sparkles size={32} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink-navy)', margin: '0 0 8px 0' }}>
              Authoritative Welfare Matching
            </h3>

            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.5rem', minHeight: '40px' }}>
              {scanStages[scanStepIndex]}
            </p>

            {/* Progress Bar */}
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--seal-vermillion)',
                  width: `${((scanStepIndex + 1) / scanStages.length) * 100}%`,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
