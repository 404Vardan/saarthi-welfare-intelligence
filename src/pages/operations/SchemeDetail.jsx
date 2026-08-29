import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SchemeRegistryAPI } from '../../api/registryApi';
import { CheckCircle2, Clock, GitCommit, FileText, ArrowRight, ShieldCheck, Plus } from 'lucide-react';

export default function OpsSchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [ruleVersions, setRuleVersions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rules' | 'provenance' | 'propose'

  // Propose rule revision form state
  const [newVersion, setNewVersion] = useState('1.1');
  const [changeSummary, setChangeSummary] = useState('');
  const [rulesJson, setRulesJson] = useState('{\n  "income_limit": 250000,\n  "income_type": "household",\n  "occupation": ["farmer"],\n  "land_ownership": ["below_2_acres", "2_to_5_acres"],\n  "bank_account_required": true\n}');
  const [sourceRef, setSourceRef] = useState('Ministry of Agriculture Gazette Notification No. 88/2026');
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      const s = await SchemeRegistryAPI.getRegistryScheme(id);
      const rv = await SchemeRegistryAPI.getRuleVersions(id);
      setScheme(s);
      setRuleVersions(rv);
    }
    load();
  }, [id]);

  const handleProposeRevision = async (e) => {
    e.preventDefault();
    let parsed = {};
    try {
      parsed = JSON.parse(rulesJson);
    } catch {
      alert('Invalid JSON syntax in rules field.');
      return;
    }

    const proposedItem = {
      scheme_id: scheme.id,
      queue_type: 'RULE_CHANGE',
      priority: 'HIGH',
      title: `Proposed Rule v${newVersion} for ${scheme.official_name}`,
      proposed_changes: {
        version: newVersion,
        rules: parsed,
        summary: changeSummary,
        source: sourceRef
      },
      detection_source: 'Operations Console (Propose Revision)',
      detection_url: 'https://egazette.gov.in',
      status: 'PENDING'
    };

    await SchemeRegistryAPI.addToVerificationQueue(proposedItem);
    setToast(`✓ Rule Revision v${newVersion} queued for Verification review!`);
    setTimeout(() => setToast(''), 3500);
    setActiveTab('rules');
  };

  if (!scheme) {
    return <div className="ops-loading">Loading scheme registry details...</div>;
  }

  const statusClass = `ops-badge-${(scheme.lifecycle_status || 'published').toLowerCase().replace('_', '-')}`;

  return (
    <div>
      <header className="ops-page-header">
        <Link to="/operations/registry" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
          ← Back to Master Scheme Registry
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="ops-page-title">{scheme.official_name}</h1>
            <p className="ops-page-subtitle" style={{ fontFamily: 'var(--font-mono)' }}>
              Code: <strong style={{ color: 'var(--brass-gold)' }}>{scheme.scheme_code}</strong> · {scheme.ministry}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className={`ops-badge ${statusClass}`}>{scheme.lifecycle_status}</span>
            <button
              onClick={() => setActiveTab('propose')}
              className="ops-btn ops-btn-primary ops-btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> Propose Rule Revision
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="ops-toast success" style={{ position: 'static', marginBottom: '20px' }}>
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="ops-tabs">
        <button className={`ops-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview & Parameters
        </button>
        <button className={`ops-tab ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
          Rule Version Timeline ({ruleVersions.length})
        </button>
        <button className={`ops-tab ${activeTab === 'provenance' ? 'active' : ''}`} onClick={() => setActiveTab('provenance')}>
          Gazette Provenance (Tier 1)
        </button>
        <button className={`ops-tab ${activeTab === 'propose' ? 'active' : ''}`} onClick={() => setActiveTab('propose')}>
          + Propose Revision
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="ops-card">
            <h3>Classification & Administrative Data</h3>
            <div className="ops-field-grid">
              <div className="ops-field">
                <div className="ops-field-label">Scheme Code</div>
                <div className="ops-field-value">{scheme.scheme_code}</div>
              </div>
              <div className="ops-field">
                <div className="ops-field-label">Disbursement Type</div>
                <div className="ops-field-value" style={{ textTransform: 'capitalize' }}>
                  {(scheme.scheme_type || '').replace(/_/g, ' ')}
                </div>
              </div>
              <div className="ops-field">
                <div className="ops-field-label">Jurisdiction Level</div>
                <div className="ops-field-value" style={{ textTransform: 'capitalize' }}>
                  {scheme.gov_level}
                </div>
              </div>
              <div className="ops-field">
                <div className="ops-field-label">Nodal Ministry</div>
                <div className="ops-field-value">{scheme.ministry || 'Government of India'}</div>
              </div>
              <div className="ops-field">
                <div className="ops-field-label">Official Benefit Value</div>
                <div className="ops-field-value">{scheme.benefits_summary || scheme.benefit}</div>
              </div>
              <div className="ops-field">
                <div className="ops-field-label">Processing SLA</div>
                <div className="ops-field-value">{scheme.processing_days || 30} Days (Average)</div>
              </div>
            </div>
          </div>

          <div className="ops-card">
            <h3>Mandatory Required Document Proofs</h3>
            <div className="ops-tags">
              {(scheme.required_documents || scheme.documents || []).map((doc, idx) => (
                <span key={idx} className="ops-tag">📄 {doc}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="ops-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Versioned Rule History (Deterministic Logic)</h3>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
              Auto-selected by date in v_active_schemes
            </span>
          </div>

          <div className="ops-timeline">
            {ruleVersions.map(rv => (
              <div key={rv.id} className="ops-timeline-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ops-timeline-version">v{rv.version}</div>
                  <span className="ops-badge ops-badge-verified">
                    {rv.verification_status || 'VERIFIED'}
                  </span>
                </div>
                <div className="ops-timeline-date">
                  Effective: <strong>{rv.effective_from}</strong> → {rv.effective_until || 'Present (Active)'}
                </div>
                <div className="ops-timeline-summary">{rv.change_summary}</div>
                <div className="ops-json" style={{ marginTop: '12px' }}>
                  {JSON.stringify(rv.rules, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'provenance' && (
        <div className="ops-card">
          <h3>Official Source Provenance & Verification Tier</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '4px solid var(--ledger-green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'white' }}>TIER 1 // PRIMARY GOVERNMENT SOURCE</span>
                <span className="ops-badge ops-badge-verified">VERIFIED SOURCE</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Source Authority: {scheme.ministry || 'Ministry of Agriculture and Farmers Welfare'}<br />
                Reference: Extraordinary Gazette of India Notification No. 42-AGRI/2025<br />
                Crawler Verification Hash: <code style={{ color: 'var(--brass-gold)', fontSize: '11px' }}>sha256:e88192a09b2c89...</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'propose' && (
        <form onSubmit={handleProposeRevision} className="ops-card">
          <h3>Propose Rule Revision (Pushes to Verification Queue)</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '1.5rem' }}>
            Draft a new rule version with updated thresholds. Once reviewed and approved in the Verification Queue, it will automatically govern citizen matching with zero application downtime.
          </p>

          <div className="ops-grid-2">
            <div className="ops-form-group">
              <label>Proposed Version Tag *</label>
              <input
                type="text"
                className="ops-input"
                value={newVersion}
                onChange={e => setNewVersion(e.target.value)}
                required
              />
            </div>
            <div className="ops-form-group">
              <label>Official Source / Gazette Reference *</label>
              <input
                type="text"
                className="ops-input"
                value={sourceRef}
                onChange={e => setSourceRef(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="ops-form-group">
            <label>Change Summary / Gazette Clause Reference *</label>
            <input
              type="text"
              className="ops-input"
              placeholder="e.g. Revised annual income threshold from ₹2,00,000 to ₹2,50,000 per CCEA decision"
              value={changeSummary}
              onChange={e => setChangeSummary(e.target.value)}
              required
            />
          </div>

          <div className="ops-form-group">
            <label>Structured Rules (JSON) *</label>
            <textarea
              className="ops-textarea"
              style={{ minHeight: '180px', fontFamily: 'var(--font-mono)' }}
              value={rulesJson}
              onChange={e => setRulesJson(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="ops-btn ops-btn-primary" style={{ padding: '12px 28px' }}>
            Submit Revision to Verification Queue →
          </button>
        </form>
      )}
    </div>
  );
}
