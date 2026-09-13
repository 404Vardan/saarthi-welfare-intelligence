import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SchemesData } from '../../api/schemesData';
import { SchemeRegistryAPI } from '../../api/registryApi';
import { CheckCircle2, Clock, GitCommit, FileText, ArrowRight, ShieldCheck, Plus, ExternalLink } from 'lucide-react';

export default function OpsSchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rules' | 'propose'

  // Propose rule revision form state
  const [newVersion, setNewVersion] = useState('v1.1');
  const [changeSummary, setChangeSummary] = useState('Updated annual income eligibility ceiling as per latest gazette amendment');
  const [rulesJson, setRulesJson] = useState('{\n  "income_limit": 250000,\n  "income_type": "household",\n  "occupation": ["farmer"],\n  "land_ownership": ["below_2_acres", "2_to_5_acres"],\n  "bank_account_required": true\n}');
  const [sourceRef, setSourceRef] = useState('Ministry Gazette Notification No. 104/2026');
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      const all = await SchemesData.fetchAllSchemes();
      const found = all.find(s => s.id === id || s.scheme_code?.toLowerCase() === id?.toLowerCase());
      if (found) {
        setScheme(found);
        setRulesJson(JSON.stringify(found.rules || {}, null, 2));
      }
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

    try {
      const updated = await SchemesData.updateSchemeVersion(scheme.id, {
        rules: parsed
      }, changeSummary);

      setScheme(updated);
      setToast(`✓ Rule Revision ${updated.rule_version} published to master registry with audit trail!`);
      setTimeout(() => setToast(''), 4000);
      setActiveTab('overview');
    } catch (err) {
      alert('Error updating version: ' + err.message);
    }
  };

  if (!scheme) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading scheme registry details...</div>;
  }

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <Link to="/operations/registry" style={{ color: 'var(--slate)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
          ← Back to Master Scheme Registry
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                {scheme.scheme_code}
              </span>
              <span className="badge" style={{ background: 'var(--paper)', color: 'var(--slate)' }}>
                Rule {scheme.rule_version || 'v1.0'}
              </span>
              <span className="badge badge-eligible">PUBLISHED</span>
            </div>

            <h1 className="ops-page-title" style={{ margin: '4px 0 8px 0' }}>{scheme.official_name || scheme.name}</h1>
            <p className="ops-page-subtitle">
              {scheme.ministry} · {scheme.state === 'All-India' ? 'Central Scheme' : `${scheme.state} State`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab('propose')}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> Propose Rule Revision
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <button
          className={`filter-chip ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Administrative Overview
        </button>
        <button
          className={`filter-chip ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Active Rule AST Specification
        </button>
        <button
          className={`filter-chip ${activeTab === 'propose' ? 'active' : ''}`}
          onClick={() => setActiveTab('propose')}
        >
          Propose Policy Revision
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
              Programme Entitlement Summary
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {scheme.description || 'Statutory entitlement benefit verified against official primary gazette notification.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div><strong>Financial Quantum:</strong> {scheme.benefit}</div>
              <div><strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{scheme.category}</span></div>
              <div><strong>Government Level:</strong> <span style={{ textTransform: 'capitalize' }}>{scheme.government_level}</span></div>
              <div><strong>Target Beneficiary:</strong> {scheme.beneficiary_types?.join(', ') || 'Vulnerable Citizens'}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
              Gazette Provenance (Tier 1)
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.6 }}>
              <div><strong>Authority:</strong> {scheme.ministry}</div>
              <div><strong>Provenance Tier:</strong> Primary Statutory Gazette</div>
              <div><strong>Official Portal:</strong> <a href={scheme.official_url || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--seal-vermillion)' }}>{scheme.official_url || 'https://india.gov.in'}</a></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rules AST */}
      {activeTab === 'rules' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '8px' }}>
            Active Rule AST Configuration (Rule {scheme.rule_version || 'v1.0'})
          </h3>
          <pre style={{ background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', overflowX: 'auto' }}>
            {JSON.stringify(scheme.rules || scheme.ast_rules || {}, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab 3: Propose Revision */}
      {activeTab === 'propose' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '8px' }}>
            Propose Policy Version Increment
          </h3>
          <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Creating a revision will record an immutable policy version increment with an audit log.
          </p>

          <form onSubmit={handleProposeRevision}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Change Summary / Rationale</label>
              <input
                type="text"
                className="form-input"
                value={changeSummary}
                onChange={e => setChangeSummary(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Updated Rule JSON Configuration</label>
              <textarea
                className="form-input"
                style={{ minHeight: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'var(--paper)' }}
                value={rulesJson}
                onChange={e => setRulesJson(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                Publish Policy Revision →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
