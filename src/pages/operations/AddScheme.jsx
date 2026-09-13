import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemesData } from '../../api/schemesData';
import { EligibilityEngine } from '../../engine/eligibilityEngine';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Play
} from 'lucide-react';

export default function OpsAddScheme() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    scheme_code: '',
    official_name: '',
    short_name: '',
    category: 'agriculture',
    government_level: 'central',
    state: 'All-India',
    ministry: '',
    department: 'Department of Welfare',
    benefit: '₹6,000 / year direct cash transfer',
    benefit_amount: '₹6,000',
    type: 'direct_benefit',
    description: '',
    documents: 'Aadhaar Card, Land Record (7/12), Bank Passbook',
    source_url: 'https://egazette.gov.in',
    source_authority: 'Gazette of India Notification',
    rulesJson: '{\n  "income_limit": 250000,\n  "income_type": "household",\n  "occupation": ["farmer"],\n  "land_ownership": ["below_2_acres", "2_to_5_acres", "above_5_acres"],\n  "bank_account_required": true\n}'
  });

  const [jsonError, setJsonError] = useState('');
  const [simProfile, setSimProfile] = useState({
    full_name: 'Simulated Citizen',
    occupation: 'farmer',
    income_annual: 180000,
    land_ownership: 'below_2_acres',
    state: 'Gujarat',
    bank_account: true
  });
  const [simResult, setSimResult] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleJsonChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, rulesJson: val }));
    try {
      JSON.parse(val);
      setJsonError('');
    } catch (err) {
      setJsonError('Invalid JSON syntax: ' + err.message);
    }
  };

  const handleRunSimulator = () => {
    try {
      const parsedRules = JSON.parse(formData.rulesJson);
      const tempScheme = {
        id: 'sim-scheme',
        scheme_code: formData.scheme_code || 'TEMP-SCHEME',
        name: formData.official_name || 'Simulated Scheme',
        rules: parsedRules
      };
      const evalResult = EligibilityEngine.evaluateSingleScheme(simProfile, [], tempScheme);
      setSimResult(evalResult);
    } catch (err) {
      alert('Cannot run simulator: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jsonError) {
      alert('Please fix JSON rule syntax errors before saving.');
      return;
    }

    try {
      let parsedRules = {};
      try {
        parsedRules = JSON.parse(formData.rulesJson);
      } catch {
        alert('Invalid JSON in rules field.');
        return;
      }

      const docArray = formData.documents.split(',').map(d => d.trim()).filter(Boolean);

      const newScheme = await SchemesData.addScheme({
        scheme_code: formData.scheme_code.toUpperCase().trim(),
        official_name: formData.official_name.trim(),
        name: formData.official_name.trim(),
        short_name: formData.short_name.trim() || formData.scheme_code.toUpperCase().trim(),
        category: formData.category,
        government_level: formData.government_level,
        state: formData.state,
        ministry: formData.ministry.trim(),
        department: formData.department.trim(),
        description: formData.description.trim(),
        benefit: formData.benefit.trim(),
        benefit_amount: formData.benefit_amount.trim(),
        type: formData.type,
        rules: parsedRules,
        documents: docArray,
        official_url: formData.source_url,
        rule_version: 'v1.0',
        status: 'active'
      });

      setStatusMessage('✓ Scheme successfully published to the master registry!');
      setTimeout(() => navigate('/operations/registry'), 1500);
    } catch (err) {
      alert('Error saving scheme: ' + err.message);
    }
  };

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="ops-page-title">Ingest Statutory Welfare Programme</h1>
          <p className="ops-page-subtitle">
            Enter official gazette parameters, build deterministic AST rules, simulate against citizen profiles, and publish to registry.
          </p>
        </div>
      </header>

      {statusMessage && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '14px 18px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {statusMessage}
        </div>
      )}

      {/* Step Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
        {[
          { step: 1, label: '1. Administrative Dossier' },
          { step: 2, label: '2. Rule Builder (AST)' },
          { step: 3, label: '3. Simulator & Publish' }
        ].map(item => (
          <button
            key={item.step}
            type="button"
            onClick={() => setCurrentStep(item.step)}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: `1px solid ${currentStep === item.step ? 'var(--seal-vermillion)' : 'var(--border)'}`,
              background: currentStep === item.step ? '#FFFDF9' : 'var(--paper)',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: currentStep === item.step ? 'var(--seal-vermillion)' : 'var(--ink-navy)',
              cursor: 'pointer'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: ADMIN DOSSIER */}
        {currentStep === 1 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1.25rem' }}>
              Core Administrative Metadata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Scheme Statutory Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PM-KISAN, PM-JAY, GUJ-MA"
                  value={formData.scheme_code}
                  onChange={e => handleChange('scheme_code', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PM Kisan Samman"
                  value={formData.short_name}
                  onChange={e => handleChange('short_name', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Official Title (as per Gazette)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi"
                  value={formData.official_name}
                  onChange={e => handleChange('official_name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nodal Ministry / Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ministry of Agriculture and Farmers Welfare"
                  value={formData.ministry}
                  onChange={e => handleChange('ministry', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sector / Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                >
                  <option value="agriculture">Agriculture & Allied</option>
                  <option value="health">Healthcare & Nutrition</option>
                  <option value="housing">Housing & Sanitation</option>
                  <option value="social_security">Social Security & Pensions</option>
                  <option value="credit">Financial Inclusion & MSME</option>
                  <option value="education">Education & Scholarships</option>
                  <option value="women">Women & Child Development</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Government Level</label>
                <select
                  className="form-select"
                  value={formData.government_level}
                  onChange={e => handleChange('government_level', e.target.value)}
                >
                  <option value="central">Central Government</option>
                  <option value="state">State Government</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State Scope</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="All-India or Specific State (e.g. Gujarat)"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Financial Benefit Display</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹6,000 / year in 3 tranches"
                  value={formData.benefit}
                  onChange={e => handleChange('benefit', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Benefit Amount</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹6,000"
                  value={formData.benefit_amount}
                  onChange={e => handleChange('benefit_amount', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Programme Description</label>
                <textarea
                  className="form-input"
                  placeholder="Official policy summary..."
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  style={{ minHeight: '70px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Proceed to Rule Builder <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RULE BUILDER */}
        {currentStep === 2 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              Deterministic Rule Engine AST Specification
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Configure deterministic eligibility rules. The Saarthi engine parses these attributes against citizen profiles with zero ambiguity.
            </p>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Eligibility Rule Configuration (JSON AST)</label>
              <textarea
                className="form-input"
                style={{
                  minHeight: '220px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  background: 'var(--paper)',
                  lineHeight: 1.5
                }}
                value={formData.rulesJson}
                onChange={handleJsonChange}
              />
              {jsonError && (
                <div style={{ color: 'var(--seal-vermillion)', fontSize: '0.8rem', marginTop: '6px' }}>
                  {jsonError}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Mandatory Verification Proofs (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={formData.documents}
                onChange={e => handleChange('documents', e.target.value)}
                placeholder="Aadhaar Card, Income Certificate, Land Record (7/12)"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Proceed to Simulator <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SIMULATOR & PUBLISH */}
        {currentStep === 3 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              Rule Simulator & Gazette Verification
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Verify deterministic evaluation accuracy against simulated citizen attributes before publishing.
            </p>

            {/* Simulator Controls */}
            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.9rem' }}>Test Profile Simulation:</span>
                <button
                  type="button"
                  onClick={handleRunSimulator}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={13} fill="currentColor" /> Run Test Evaluation
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
                <div><strong>Occupation:</strong> {simProfile.occupation}</div>
                <div><strong>Annual Income:</strong> ₹{simProfile.income_annual.toLocaleString('en-IN')}</div>
                <div><strong>Land Holding:</strong> {simProfile.land_ownership}</div>
                <div><strong>State:</strong> {simProfile.state}</div>
              </div>

              {simResult && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Result:</span>
                  <span className={`badge ${simResult.status === 'eligible' ? 'badge-eligible' : 'badge-nearly'}`}>
                    {simResult.status === 'eligible' ? '✓ 100% Eligible (Passed)' : 'Action Required / Ineligible'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Official Gazette URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.source_url}
                onChange={e => handleChange('source_url', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px' }}
              >
                <ShieldCheck size={16} /> Save & Publish Scheme →
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
