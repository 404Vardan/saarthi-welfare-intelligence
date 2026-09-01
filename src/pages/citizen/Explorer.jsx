import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSchemes } from '../../context/SchemeContext';
import { useAuth } from '../../context/AuthContext';
import EligibilityEngine from '../../engine/eligibilityEngine';
import {
  Search, Sparkles, CheckCircle2, XCircle, AlertTriangle, Bookmark,
  Layers, ArrowRight, ShieldCheck, FileText, Info, ChevronRight, X, SlidersHorizontal
} from 'lucide-react';

export default function CitizenExplorer() {
  const navigate = useNavigate();
  const { schemes } = useSchemes();
  const { user, profile, householdMembers, documents, applications, saveScheme, removeSavedScheme, savedSchemes } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [nlParsedIntent, setNlParsedIntent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchemeForExplain, setSelectedSchemeForExplain] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Natural Language Sample Queries for 1-click test
  const samplePrompts = [
    { label: '🎓 21yo Student, Gujarat, ₹2.5L Income', query: "I'm a 21-year-old SC student from Gujarat whose family income is ₹2.5 lakh." },
    { label: '🌾 Small Farmer with 2 Acres', query: "I am a rural farmer in UP owning 2 acres of land looking for direct cash and credit." },
    { label: '👵 65yo Senior Citizen, BPL', query: "I am a 65-year-old senior citizen with BPL card looking for monthly pension." },
    { label: '🔨 Traditional Artisan / Carpenter', query: "I am a 28-year-old wood artisan seeking skill toolkit and low interest loan." }
  ];

  // Natural language intent parser
  const parseNaturalLanguage = (text) => {
    if (!text || text.trim().length < 5) {
      setNlParsedIntent(null);
      return null;
    }

    const lower = text.toLowerCase();
    const intent = {
      raw: text,
      age: null,
      occupation: null,
      state: null,
      maxIncome: null,
      category: null,
      bpl: null
    };

    // Age extraction: "21-year-old", "21 yo", "aged 65", "60 years"
    const ageMatch = lower.match(/(\d{1,2})\s*(?:-year-old|years old|yo|years|age)/);
    if (ageMatch) intent.age = parseInt(ageMatch[1], 10);

    // Income extraction: "2.5 lakh", "250000", "₹2.5 lakh", "3 lakh"
    const incomeLakhMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)/);
    if (incomeLakhMatch) {
      intent.maxIncome = parseFloat(incomeLakhMatch[1]) * 100000;
    } else {
      const rawNumMatch = lower.match(/(?:income|salary|earning)(?:\s+is|\s+of|\s*[:=])?\s*(?:₹|rs\.?)?\s*(\d{5,7})/);
      if (rawNumMatch) intent.maxIncome = parseInt(rawNumMatch[1], 10);
    }

    // Occupation
    if (lower.includes('student') || lower.includes('college') || lower.includes('studying')) intent.occupation = 'student';
    else if (lower.includes('farmer') || lower.includes('agriculture') || lower.includes('kisan') || lower.includes('cultivator')) intent.occupation = 'farmer';
    else if (lower.includes('artisan') || lower.includes('carpenter') || lower.includes('craft') || lower.includes('blacksmith') || lower.includes('potter')) intent.occupation = 'artisan';
    else if (lower.includes('daily wage') || lower.includes('labourer') || lower.includes('worker')) intent.occupation = 'daily_wage';

    // Social category
    if (lower.includes('sc') || lower.includes('scheduled caste')) intent.category = 'sc';
    else if (lower.includes('st') || lower.includes('scheduled tribe')) intent.category = 'st';
    else if (lower.includes('obc')) intent.category = 'obc';

    // BPL status
    if (lower.includes('bpl') || lower.includes('ration card') || lower.includes('below poverty')) intent.bpl = true;

    // State extraction
    const states = ['Gujarat', 'Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Bihar', 'Karnataka', 'Tamil Nadu', 'Punjab', 'Haryana'];
    for (const st of states) {
      if (lower.includes(st.toLowerCase())) {
        intent.state = st;
        break;
      }
    }

    setNlParsedIntent(intent);
    return intent;
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val.length > 8) {
      parseNaturalLanguage(val);
    } else {
      setNlParsedIntent(null);
    }
  };

  const handleApplyPrompt = (promptQuery) => {
    setSearchTerm(promptQuery);
    parseNaturalLanguage(promptQuery);
  };

  // Evaluate schemes against citizen or parsed NL intent
  const evaluatedSchemes = useMemo(() => {
    // Context prioritizes parsed NL attributes if query exists, otherwise citizen profile
    const activeContext = {
      ...profile,
      age: nlParsedIntent?.age || profile.age || 28,
      occupation: nlParsedIntent?.occupation || profile.occupation || 'farmer',
      income_annual: nlParsedIntent?.maxIncome !== null && nlParsedIntent?.maxIncome !== undefined
        ? nlParsedIntent.maxIncome
        : (profile.income_annual || 180000),
      category: nlParsedIntent?.category || profile.category || 'obc',
      state: nlParsedIntent?.state || profile.state || 'Gujarat',
      bpl_card: nlParsedIntent?.bpl !== null && nlParsedIntent?.bpl !== undefined
        ? nlParsedIntent.bpl
        : (profile.bpl_card || false)
    };

    return schemes.map(scheme => {
      const evalResult = EligibilityEngine.evaluateScheme(activeContext, householdMembers, scheme, documents);
      return {
        ...scheme,
        evaluation: evalResult
      };
    });
  }, [schemes, profile, householdMembers, documents, nlParsedIntent]);

  // Filtered & Ranked schemes
  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter(scheme => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (scheme.category !== selectedCategory && scheme.type !== selectedCategory) return false;
      }

      // Search keyword filter if no structured NL intent
      if (searchTerm.trim() && !nlParsedIntent) {
        const t = searchTerm.toLowerCase();
        const matchesText =
          (scheme.official_name || scheme.name || '').toLowerCase().includes(t) ||
          (scheme.short_name || scheme.scheme_code || '').toLowerCase().includes(t) ||
          (scheme.description || '').toLowerCase().includes(t);
        if (!matchesText) return false;
      }

      return true;
    }).sort((a, b) => (b.evaluation.matchPercentage || 0) - (a.evaluation.matchPercentage || 0));
  }, [evaluatedSchemes, selectedCategory, searchTerm, nlParsedIntent]);

  const categories = [
    { id: 'all', label: 'All Catalogues' },
    { id: 'agriculture', label: '🌾 Agriculture & Farmers' },
    { id: 'healthcare', label: '🏥 Health & PMJAY' },
    { id: 'education', label: '🎓 Education & Scholarships' },
    { id: 'social_security', label: '🛡️ Social Security & Pension' },
    { id: 'skill_training', label: '🔨 Skilling & MSME' },
    { id: 'housing', label: '🏠 Rural Housing' },
    { id: 'credit', label: '💳 Credit & Loans' }
  ];

  const appliedSchemeIds = new Set((applications || []).map(a => a.schemeId));
  const savedSchemeIds = new Set(savedSchemes || []);

  const toggleSave = (schemeId) => {
    if (savedSchemeIds.has(schemeId)) {
      removeSavedScheme(schemeId);
    } else {
      saveScheme(schemeId);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Page Header */}
      <header className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(197, 160, 89, 0.15)', color: 'var(--brass-gold)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <Sparkles size={13} />
            SAARTHI INTELLIGENT DISCOVERY ENGINE
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem' }}>Explore Welfare Catalogues</h1>
          <p className="page-description" style={{ fontSize: '0.9rem' }}>
            Discover official Central & State schemes through natural language intent, with deterministic eligibility breakdowns for every result.
          </p>
        </div>
      </header>

      {/* Natural Language Discovery Input Box */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF7 100%)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={16} color="var(--brass-gold)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-navy)', letterSpacing: '0.02em' }}>
            NATURAL LANGUAGE INTENT SEARCH
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--brass-gold)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Try: 'I am a 21-year-old student from Gujarat whose family income is ₹2.5 lakh'..."
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            style={{
              paddingLeft: '46px',
              paddingRight: searchTerm ? '40px' : '16px',
              height: '52px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1.5px solid var(--brass-gold)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setNlParsedIntent(null); }}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Parsed Intent Visualizer */}
        {nlParsedIntent && (
          <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(27, 42, 74, 0.04)', border: '1px solid rgba(27, 42, 74, 0.1)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-navy)', textTransform: 'uppercase' }}>
              Extracted Intent:
            </span>
            {nlParsedIntent.age && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Age: {nlParsedIntent.age} yrs</span>}
            {nlParsedIntent.occupation && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Role: {nlParsedIntent.occupation.toUpperCase()}</span>}
            {nlParsedIntent.maxIncome && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Income: ≤ ₹{nlParsedIntent.maxIncome.toLocaleString('en-IN')}</span>}
            {nlParsedIntent.state && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>State: {nlParsedIntent.state}</span>}
            {nlParsedIntent.category && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Category: {nlParsedIntent.category.toUpperCase()}</span>}
            {nlParsedIntent.bpl && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>BPL: Yes</span>}
          </div>
        )}

        {/* 1-Click Persona Prompts */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate)', fontWeight: 600 }}>Quick Personas:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleApplyPrompt(p.query)}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: 'var(--ink-navy)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brass-gold)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '24px',
              border: selectedCategory === c.id ? '1px solid var(--ink-navy)' : '1px solid var(--border)',
              background: selectedCategory === c.id ? 'var(--ink-navy)' : 'var(--paper)',
              color: selectedCategory === c.id ? '#FFFFFF' : 'var(--ink-navy)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Schemes Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredSchemes.map(scheme => {
          const evalRes = scheme.evaluation;
          const isSaved = savedSchemeIds.has(scheme.id);
          const hasApplied = appliedSchemeIds.has(scheme.id);
          const matchPercent = evalRes.matchPercentage || 100;
          const status = evalRes.status;

          return (
            <div
              key={scheme.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                position: 'relative',
                borderTop: status === 'eligible' ? '3px solid var(--success-forest)' : status === 'nearly_eligible' ? '3px solid var(--brass-gold)' : '3px solid var(--slate)'
              }}
            >
              <div>
                {/* Header Badge & Bookmark */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700, background: 'rgba(197,160,89,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {scheme.scheme_code || 'CENTRAL'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {scheme.government_level || scheme.gov_level || 'Central'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSave(scheme.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isSaved ? 'var(--seal-vermillion)' : 'var(--slate)' }}
                    title={isSaved ? 'Remove from Saved' : 'Save to Portfolio'}
                  >
                    <Bookmark size={17} fill={isSaved ? 'var(--seal-vermillion)' : 'none'} />
                  </button>
                </div>

                {/* Scheme Name */}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--ink-navy)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {scheme.official_name || scheme.name}
                </h3>

                <p style={{ color: 'var(--slate)', fontSize: '0.82rem', lineHeight: 1.45, marginBottom: '1rem', minHeight: '36px' }}>
                  {scheme.description}
                </p>

                {/* Financial Entitlement Bar */}
                <div style={{ background: 'var(--paper)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--slate)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Statutory Benefit</div>
                  <div style={{ fontWeight: 700, color: 'var(--ink-navy)', fontSize: '0.92rem', marginTop: '2px' }}>
                    {scheme.benefits?.quantum || scheme.benefit || scheme.benefit_amount || 'Direct Financial Entitlement'}
                  </div>
                </div>

                {/* "WHY AM I SEEING THIS?" Live Explainability Block */}
                <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E1E8E5', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} color={status === 'eligible' ? 'var(--success-forest)' : 'var(--brass-gold)'} />
                      WHY AM I SEEING THIS?
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: status === 'eligible' ? '#E8F5E9' : status === 'nearly_eligible' ? '#FFF8E1' : '#FFEBEE',
                        color: status === 'eligible' ? 'var(--success-forest)' : status === 'nearly_eligible' ? 'var(--brass-gold)' : 'var(--seal-vermillion)'
                      }}
                    >
                      MATCH {matchPercent}%
                    </span>
                  </div>

                  {/* Criteria Checklist Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {evalRes.ruleBreakdown.slice(0, 3).map((rb, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: rb.status === 'passed' ? 'var(--ink-navy)' : 'var(--seal-vermillion)' }}>
                          {rb.status === 'passed' ? (
                            <CheckCircle2 size={13} color="var(--success-forest)" />
                          ) : (
                            <XCircle size={13} color="var(--seal-vermillion)" />
                          )}
                          {rb.rule}
                        </span>
                        <span style={{ color: 'var(--slate)', fontSize: '11px' }}>
                          {rb.citizenValue}
                        </span>
                      </div>
                    ))}

                    {/* Missing Document Alert if any */}
                    {evalRes.missingDocumentsCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #E0E0E0', fontSize: '0.75rem', color: '#D97706' }}>
                        <AlertTriangle size={13} />
                        <span>{evalRes.missingDocumentsCount} document(s) required to unlock</span>
                      </div>
                    )}
                  </div>

                  {/* Open Full Explainability Drawer */}
                  <button
                    onClick={() => setSelectedSchemeForExplain(scheme)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 0 0 0',
                      color: 'var(--brass-gold)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    View detailed deterministic audit trail <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Action Stream Footer: Compare -> Save -> Prepare Docs -> Apply */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', gap: '8px' }}>
                <Link
                  to="/citizen/compare"
                  style={{ color: 'var(--slate)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
                >
                  <Layers size={14} /> Compare
                </Link>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link
                    to="/citizen/documents"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    title="Prepare documents in Digital Locker"
                  >
                    Docs
                  </Link>

                  <Link
                    to={`/citizen/scheme/${scheme.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.8rem' }}
                  >
                    Scheme Hub <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "WHY AM I SEEING THIS?" Detailed Audit Modal */}
      {selectedSchemeForExplain && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                  DETERMINISTIC RULE AUDIT
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--ink-navy)', margin: '4px 0 0 0' }}>
                  {selectedSchemeForExplain.official_name || selectedSchemeForExplain.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSchemeForExplain(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', padding: '12px', background: 'var(--paper)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--slate)' }}>MATCH SCORE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: selectedSchemeForExplain.evaluation.status === 'eligible' ? 'var(--success-forest)' : 'var(--brass-gold)' }}>
                  {selectedSchemeForExplain.evaluation.matchPercentage}%
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--slate)' }}>GOVERNING GAZETTE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                  {selectedSchemeForExplain.official_source?.gazette_number || 'Union Gazette Notification'}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--slate)' }}>RULE ENGINE VERSION</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                  v{selectedSchemeForExplain.rule_version || '2.0.0'}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--ink-navy)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rule-by-Rule Evaluation
            </h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: 'var(--paper)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Condition</th>
                    <th style={{ padding: '8px 12px' }}>Your Profile</th>
                    <th style={{ padding: '8px 12px' }}>Required Threshold</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSchemeForExplain.evaluation.ruleBreakdown.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.rule}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--ink-navy)' }}>{r.citizenValue}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--slate)' }}>{r.requiredValue}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        {r.status === 'passed' ? (
                          <span style={{ color: 'var(--success-forest)', fontWeight: 700 }}>✓ PASS</span>
                        ) : (
                          <span style={{ color: 'var(--seal-vermillion)', fontWeight: 700 }}>✗ FAIL</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Document Checklist in Modal */}
            <h4 style={{ fontSize: '0.9rem', color: 'var(--ink-navy)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Document Verification Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.5rem' }}>
              {selectedSchemeForExplain.evaluation.documents.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '4px', background: d.available ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${d.available ? '#BBF7D0' : '#FDE68A'}` }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--ink-navy)', fontWeight: 500 }}>
                    <FileText size={15} color={d.available ? 'var(--success-forest)' : '#D97706'} />
                    {d.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: d.available ? 'var(--success-forest)' : '#D97706' }}>
                    {d.available ? 'VERIFIED IN LOCKER' : 'ACTION REQUIRED'}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setSelectedSchemeForExplain(null)} className="btn btn-outline btn-sm">
                Close Audit
              </button>
              <Link to={`/citizen/scheme/${selectedSchemeForExplain.id}`} className="btn btn-primary btn-sm">
                Proceed to Scheme Hub →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
