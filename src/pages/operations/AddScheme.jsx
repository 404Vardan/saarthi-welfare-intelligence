import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemeRegistryAPI } from '../../api/registryApi';
import { PlusCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OpsAddScheme() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    scheme_code: '',
    official_name: '',
    short_name: '',
    scheme_type: 'direct_benefit',
    gov_level: 'central',
    ministry: '',
    department: 'Government of India',
    benefits_summary: '',
    benefit_amount: '',
    documents: 'Aadhaar Card, Bank Passbook, Land Record (7/12)',
    source_tier: 'TIER_1_PRIMARY',
    source_url: 'https://egazette.gov.in',
    source_authority: 'Central Ministry Notification',
    rulesJson: '{\n  "income_limit": 200000,\n  "income_type": "household",\n  "occupation": ["farmer"],\n  "bank_account_required": true\n}'
  });

  const [status, setStatus] = useState('');
  const [jsonError, setJsonError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jsonError) {
      alert('Please fix JSON rule syntax errors before submitting.');
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

      // 1. Ingest Scheme record (UNDER_REVIEW)
      const newScheme = await SchemeRegistryAPI.createScheme({
        scheme_code: formData.scheme_code.toUpperCase().trim(),
        official_name: formData.official_name.trim(),
        short_name: formData.short_name.trim() || formData.scheme_code.toUpperCase().trim(),
        scheme_type: formData.scheme_type,
        gov_level: formData.gov_level,
        ministry: formData.ministry.trim(),
        department: formData.department.trim(),
        benefits_summary: formData.benefits_summary.trim(),
        benefit_amount: formData.benefit_amount.trim(),
        required_documents: docArray,
        lifecycle_status: 'UNDER_REVIEW'
      });

      // 2. Ingest initial v1.0 rule version
      await SchemeRegistryAPI.createRuleVersion(newScheme.id, {
        version: '1.0',
        rules: parsedRules,
        verification_status: 'PENDING',
        change_summary: 'Initial official gazette ingestion',
        source_reference: formData.source_authority
      });

      // 3. Ingest Source provenance
      await SchemeRegistryAPI.addSchemeSource(newScheme.id, {
        source_tier: formData.source_tier,
        source_type: 'gazette_notification',
        source_url: formData.source_url,
        source_authority: formData.source_authority
      });

      setStatus('✓ Scheme successfully ingested into Registry under "UNDER_REVIEW" status!');
      setTimeout(() => navigate('/operations/registry'), 1800);
    } catch (err) {
      alert('Error ingesting scheme: ' + err.message);
    }
  };

  return (
    <div>
      <header className="ops-page-header">
        <h1 className="ops-page-title">Ingest Welfare Programme</h1>
        <p className="ops-page-subtitle">
          Structure newly discovered government gazettes into machine-readable rule definitions. Ingested schemes enter in UNDER_REVIEW status.
        </p>
      </header>

      {status && (
        <div className="ops-toast success" style={{ position: 'static', marginBottom: '20px' }}>
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Official Classification */}
        <div className="ops-card">
          <h3>1. Administrative Identification</h3>
          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Scheme Code / Identifier *</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. PM-KISAN, PMJAY, PMAY-G"
                value={formData.scheme_code}
                onChange={e => setFormData({ ...formData, scheme_code: e.target.value })}
                required
              />
            </div>
            <div className="ops-form-group">
              <label>Full Official Gazette Title *</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi"
                value={formData.official_name}
                onChange={e => setFormData({ ...formData, official_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Disbursement Type</label>
              <select
                className="ops-select"
                value={formData.scheme_type}
                onChange={e => setFormData({ ...formData, scheme_type: e.target.value })}
              >
                <option value="direct_benefit">Direct Benefit Transfer (DBT)</option>
                <option value="subsidy">Capital Subsidy</option>
                <option value="insurance">Insurance & Risk Cover</option>
                <option value="pension">Social Security & Pension</option>
                <option value="loan">Concessional Credit & Loan</option>
                <option value="skill_training">Skill Training & Toolkits</option>
              </select>
            </div>
            <div className="ops-form-group">
              <label>Jurisdiction Level</label>
              <select
                className="ops-select"
                value={formData.gov_level}
                onChange={e => setFormData({ ...formData, gov_level: e.target.value })}
              >
                <option value="central">Central Sector</option>
                <option value="state">State Scheme</option>
                <option value="joint">Centrally Sponsored (Joint)</option>
              </select>
            </div>
          </div>

          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Nodal Ministry / Department *</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. Ministry of Agriculture and Farmers Welfare"
                value={formData.ministry}
                onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                required
              />
            </div>
            <div className="ops-form-group">
              <label>Mandatory Proofs (Comma-Separated)</label>
              <input
                type="text"
                className="ops-input"
                value={formData.documents}
                onChange={e => setFormData({ ...formData, documents: e.target.value })}
              />
            </div>
          </div>

          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Benefits Summary *</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. ₹6,000 / year in 3 direct installments"
                value={formData.benefits_summary}
                onChange={e => setFormData({ ...formData, benefits_summary: e.target.value })}
                required
              />
            </div>
            <div className="ops-form-group">
              <label>Benefit Amount (Display)</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. ₹6,000, ₹5,00,000"
                value={formData.benefit_amount}
                onChange={e => setFormData({ ...formData, benefit_amount: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Source Provenance Tier */}
        <div className="ops-card">
          <h3>2. Official Source Provenance (Tier 1)</h3>
          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Source Authority / Gazette Citation *</label>
              <input
                type="text"
                className="ops-input"
                placeholder="e.g. Extraordinary Gazette of India No. 88/2026"
                value={formData.source_authority}
                onChange={e => setFormData({ ...formData, source_authority: e.target.value })}
                required
              />
            </div>
            <div className="ops-form-group">
              <label>Official Gazette URL</label>
              <input
                type="url"
                className="ops-input"
                value={formData.source_url}
                onChange={e => setFormData({ ...formData, source_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Structured Rule JSON */}
        <div className="ops-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>3. Structured Eligibility Criteria (JSON)</h3>
            {jsonError ? (
              <span style={{ color: '#f87171', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{jsonError}</span>
            ) : (
              <span style={{ color: 'var(--ledger-green)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>✓ Valid JSON Syntax</span>
            )}
          </div>
          <div className="ops-form-group">
            <textarea
              className="ops-textarea"
              style={{ minHeight: '180px', fontFamily: 'var(--font-mono)' }}
              value={formData.rulesJson}
              onChange={handleJsonChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="ops-btn ops-btn-primary" style={{ padding: '14px 36px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18} /> Ingest Scheme into Master Registry (Under Review)
        </button>
      </form>
    </div>
  );
}
