import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  ExternalLink, 
  X, 
  Plus, 
  Printer, 
  ShieldCheck, 
  Scale, 
  FileText, 
  Check, 
  HelpCircle, 
  ArrowLeft, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';

export default function CitizenCompare() {
  const { evaluations = [], schemes = [], profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter for the "Add Scheme" selector modal/dropdown
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial selected scheme IDs from URL or default
  const [selectedIds, setSelectedIds] = useState(() => {
    const queryScheme = searchParams.get('scheme');
    const queryIds = searchParams.get('ids');
    if (queryIds) {
      return queryIds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
    }
    if (queryScheme) {
      return [queryScheme];
    }
    return ['pm-kisan-001', 'pmjay-002'];
  });

  // Keep URL search params in sync or respond to external navigation
  useEffect(() => {
    const queryScheme = searchParams.get('scheme');
    const queryIds = searchParams.get('ids');
    if (queryScheme && !selectedIds.includes(queryScheme)) {
      setSelectedIds(prev => {
        if (prev.includes(queryScheme)) return prev;
        if (prev.length >= 3) return [...prev.slice(0, 2), queryScheme];
        return [...prev, queryScheme];
      });
    } else if (queryIds) {
      const parsed = queryIds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
      if (parsed.length > 0 && parsed.join(',') !== selectedIds.join(',')) {
        setSelectedIds(parsed);
      }
    }
  }, [searchParams]);

  // Ensure selectedIds points to valid available schemes once evaluations or schemes load
  useEffect(() => {
    if (evaluations.length === 0 && schemes.length === 0) return;

    // Check how many of current selectedIds exist
    const validCount = selectedIds.filter(id => {
      const inEval = evaluations.some(e => e.schemeId === id || e.schemeCode === id);
      const inRaw = schemes.some(s => s.id === id || s.scheme_code === id);
      return inEval || inRaw;
    }).length;

    // If none of the initial fallback IDs exist in user's data, pick top 2 available
    if (validCount === 0) {
      const sourceList = evaluations.length > 0 ? evaluations : schemes;
      if (sourceList.length >= 2) {
        setSelectedIds([
          sourceList[0].schemeId || sourceList[0].id,
          sourceList[1].schemeId || sourceList[1].id
        ]);
      } else if (sourceList.length === 1) {
        setSelectedIds([sourceList[0].schemeId || sourceList[0].id]);
      }
    }
  }, [evaluations, schemes]);

  // Safe resolver for any scheme id
  const resolveSchemeData = (id) => {
    if (!id) return null;
    const lowerId = String(id).toLowerCase();

    // 1. Try from evaluations
    const evalMatch = evaluations.find(e => 
      e.schemeId === id || 
      e.schemeCode === id || 
      String(e.schemeId).toLowerCase() === lowerId || 
      String(e.schemeCode).toLowerCase() === lowerId
    );

    // 2. Try from raw schemes
    const rawMatch = schemes.find(s => 
      s.id === id || 
      s.scheme_code === id || 
      String(s.id).toLowerCase() === lowerId || 
      String(s.scheme_code).toLowerCase() === lowerId
    );

    if (!evalMatch && !rawMatch) return null;

    const base = rawMatch || {};
    const evalData = evalMatch || {};

    // Normalize documents proof array safely to prevent "Objects are not valid as a React child"
    let docs = [];
    if (evalData.documents && Array.isArray(evalData.documents) && evalData.documents.length > 0) {
      docs = evalData.documents.map(d => ({
        name: typeof d === 'string' ? d : (d.name || 'Statutory Verification Proof'),
        available: typeof d === 'object' ? Boolean(d.available) : false,
        status: typeof d === 'object' ? (d.status || (d.available ? 'available' : 'missing')) : 'unverified'
      }));
    } else if (base.documents && Array.isArray(base.documents)) {
      docs = base.documents.map(d => ({
        name: typeof d === 'string' ? d : (d.name || 'Statutory Verification Proof'),
        available: false,
        status: 'unverified'
      }));
    } else if (base.structured_documents && Array.isArray(base.structured_documents)) {
      docs = base.structured_documents.map(d => ({
        name: typeof d === 'string' ? d : (d.name || 'Statutory Verification Proof'),
        available: false,
        status: 'unverified'
      }));
    } else {
      docs = [
        { name: 'Aadhaar Card (e-KYC)', available: true, status: 'available' },
        { name: 'DBT Bank Account Passbook', available: true, status: 'available' },
        { name: 'Income / Category Certificate', available: false, status: 'missing' }
      ];
    }

    // Safely extract benefit string
    let benefitValue = 'Direct Benefit Transfer';
    if (typeof evalData.benefit === 'string' && evalData.benefit.trim()) {
      benefitValue = evalData.benefit;
    } else if (typeof base.benefit === 'string' && base.benefit.trim()) {
      benefitValue = base.benefit;
    } else if (base.benefits?.summary) {
      benefitValue = base.benefits.summary;
    } else if (base.benefit_amount) {
      benefitValue = `₹${Number(base.benefit_amount).toLocaleString('en-IN')}`;
    }

    // Safely extract beneficiary types
    let targetGroup = 'Eligible Citizens & Families';
    if (Array.isArray(base.beneficiary_types) && base.beneficiary_types.length > 0) {
      targetGroup = base.beneficiary_types.map(b => String(b).replace(/_/g, ' ')).join(', ');
    } else if (base.target_group) {
      targetGroup = base.target_group;
    } else if (evalData.target_group) {
      targetGroup = evalData.target_group;
    }

    // Extract official portal URL
    let officialUrl = 'https://india.gov.in';
    if (base.official_url) {
      officialUrl = base.official_url;
    } else if (base.official_source) {
      officialUrl = typeof base.official_source === 'object' ? (base.official_source.official_url || 'https://india.gov.in') : base.official_source;
    } else if (evalData.officialSource) {
      officialUrl = typeof evalData.officialSource === 'object' ? (evalData.officialSource.official_url || 'https://india.gov.in') : evalData.officialSource;
    }

    return {
      id: evalData.schemeId || base.id || id,
      schemeId: evalData.schemeId || base.id || id,
      code: evalData.schemeCode || base.scheme_code || base.short_name || id,
      name: evalData.schemeName || base.official_name || base.name || id,
      shortName: evalData.schemeShortName || base.short_name || base.scheme_code || id,
      benefit: benefitValue,
      type: String(evalData.type || base.type || 'direct_benefit').replace(/_/g, ' '),
      govLevel: evalData.govLevel || base.government_level || base.gov_level || 'Central',
      ministry: evalData.ministry || base.ministry || 'Government of India',
      department: evalData.department || base.department || 'Nodal Department',
      status: evalData.status || (evalMatch ? 'informational' : 'unverified'),
      matchPercentage: evalData.matchPercentage !== undefined ? evalData.matchPercentage : null,
      decisionId: evalData.decisionId || evalData.decision_reference_id || null,
      processingDays: base.processing_days || evalData.processing_days || 21,
      targetGroup,
      documents: docs,
      ruleBreakdown: evalData.ruleBreakdown || [],
      missingFields: evalData.missingFields || [],
      officialUrl,
      gazetteNo: (typeof base.official_source === 'object' && base.official_source?.gazette_number)
        ? base.official_source.gazette_number
        : `GOI-${evalData.schemeCode || base.scheme_code || 'WLF'}-2026`,
      ruleVersion: evalData.ruleVersion || base.rule_version || '1.0'
    };
  };

  // Resolved list of currently compared schemes
  const selectedSchemes = useMemo(() => {
    return selectedIds.map(id => resolveSchemeData(id)).filter(Boolean);
  }, [selectedIds, evaluations, schemes]);

  // Handler to toggle / select a scheme
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Replace the last one if already 3
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  const removeScheme = (id) => {
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  // All eligible schemes available for quick selection
  const eligibleQuickPicks = useMemo(() => {
    const list = evaluations.filter(e => e.status === 'eligible' || e.status === 'nearly_eligible');
    return list.slice(0, 10);
  }, [evaluations]);

  // Filtered scheme catalog for the Add Scheme modal
  const filteredCatalog = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const all = schemes.length > 0 ? schemes : evaluations;
    return all.filter(s => {
      const code = (s.scheme_code || s.schemeCode || '').toLowerCase();
      const name = (s.official_name || s.name || s.schemeName || '').toLowerCase();
      const category = (s.category || '').toLowerCase();
      return !query || code.includes(query) || name.includes(query) || category.includes(query);
    }).slice(0, 20);
  }, [schemes, evaluations, searchQuery]);

  return (
    <div>
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Statutory Matrix
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>
              Comparing {selectedSchemes.length} of max 3 programmes
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={26} color="var(--seal-vermillion)" />
            Compare Welfare Entitlements
          </h1>
          <p className="page-description">
            Side-by-side evaluation of financial quantum, gazette rules, mandatory proofs, and turnaround times for <strong>{profile?.full_name || 'Citizen'}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={() => window.print()} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Print or export comparison matrix"
          >
            <Printer size={15} /> Print Matrix
          </button>
          <Link to="/citizen/recommendations" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={15} /> Matched Schemes
          </Link>
        </div>
      </header>

      {/* Quick Selection Toolbar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '1.5rem', background: 'var(--paper)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-navy)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="var(--brass-gold)" /> Quick Select:
            </span>
            {eligibleQuickPicks.map(e => {
              const id = e.schemeId || e.id;
              const isSelected = selectedIds.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleSelect(id)}
                  className={`filter-chip ${isSelected ? 'active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease',
                    background: isSelected ? 'var(--seal-vermillion)' : 'white',
                    color: isSelected ? 'white' : 'var(--ink-navy)',
                    borderColor: isSelected ? 'var(--seal-vermillion)' : 'var(--border)',
                    fontWeight: isSelected ? 600 : 500,
                    boxShadow: isSelected ? '0 2px 6px rgba(193,68,45,0.25)' : 'none'
                  }}
                >
                  {isSelected ? '✓ ' : '+ '}{e.schemeShortName || e.schemeCode || e.schemeName?.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add From Full Catalog
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem', color: 'var(--slate)' }}
                title="Clear selected schemes"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table / Matrix */}
      {selectedSchemes.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#FFFDF9' }}>
          <Layers size={48} color="var(--brass-gold)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
            No Schemes Selected for Comparison
          </h3>
          <p style={{ color: 'var(--slate)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            Select 2 or 3 government programmes to compare their eligibility criteria, financial quantum, and required verification proofs side-by-side.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                const source = evaluations.length >= 2 ? evaluations : schemes;
                if (source.length >= 2) {
                  setSelectedIds([source[0].schemeId || source[0].id, source[1].schemeId || source[1].id]);
                }
              }}
              className="btn btn-primary btn-sm"
            >
              Compare Top 2 Matched Schemes
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-secondary btn-sm"
            >
              Browse Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto', boxShadow: '0 4px 20px rgba(11, 31, 58, 0.06)', borderRadius: '12px' }}>
          <table className="table" style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FFFDF9', borderBottom: '2px solid var(--border)' }}>
                <th style={{ width: '220px', padding: '18px 20px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--slate)', letterSpacing: '0.05em' }}>
                  Criteria & Dimensions
                </th>
                {selectedSchemes.map(s => (
                  <th key={s.schemeId} style={{ padding: '18px 20px', textAlign: 'left', verticalAlign: 'top', minWidth: '240px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                        {s.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScheme(s.schemeId)}
                        title="Remove scheme from comparison"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--slate)',
                          padding: '2px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--ink-navy)', marginTop: '6px', lineHeight: 1.3 }}>
                      {s.name}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{s.govLevel.toUpperCase()}</span>
                      <span>•</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {s.ministry}
                      </span>
                    </div>
                  </th>
                ))}
                {selectedSchemes.length < 3 && (
                  <th style={{ padding: '18px 20px', textAlign: 'center', verticalAlign: 'middle', width: '200px', background: 'rgba(247,249,252,0.6)' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="btn btn-outline btn-sm"
                      style={{ borderStyle: 'dashed', borderColor: 'var(--border)', width: '100%', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={18} color="var(--seal-vermillion)" />
                      <span style={{ fontSize: '0.78rem', color: 'var(--ink-navy)' }}>Add Scheme to Compare</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* 1. Citizen Eligibility Status */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC' }}>
                  Citizen Eligibility Status
                </td>
                {selectedSchemes.map(s => {
                  let badgeClass = 'badge-pending';
                  let statusText = 'Informational';
                  if (s.status === 'eligible') {
                    badgeClass = 'badge-eligible';
                    statusText = '✓ 100% Eligible';
                  } else if (s.status === 'nearly_eligible') {
                    badgeClass = 'badge-nearly';
                    statusText = '⚡ Nearly Eligible';
                  } else if (s.status === 'insufficient_data') {
                    badgeClass = 'badge-pending';
                    statusText = '? Missing Data';
                  } else if (s.status === 'not_eligible') {
                    badgeClass = 'badge-not-eligible';
                    statusText = '✕ Criteria Unmet';
                  }

                  return (
                    <td key={s.schemeId} style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${badgeClass}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '4px 8px' }}>
                          {statusText}
                        </span>
                        {s.matchPercentage !== null && (
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate)' }}>
                            {s.matchPercentage}% match
                          </span>
                        )}
                      </div>
                      {s.decisionId && (
                        <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--slate)', marginTop: '4px' }}>
                          Ref: {s.decisionId}
                        </div>
                      )}
                    </td>
                  );
                })}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 2. Benefit Value & Quantum */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC' }}>
                  Statutory Benefit Value
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '14px 20px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ledger-green)', fontSize: '1.15rem' }}>
                      {s.benefit}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginTop: '3px', textTransform: 'capitalize' }}>
                      Mode: {s.type}
                    </div>
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 3. Turnaround Time */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC' }}>
                  Processing Turnaround
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '14px 20px', fontSize: '0.88rem', color: 'var(--ink-navy)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>~{s.processingDays} Days</span>
                    <span style={{ color: 'var(--slate)', fontSize: '0.78rem', display: 'block', marginTop: '2px' }}>
                      From e-KYC submission to sanction
                    </span>
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 4. Target Beneficiary Group */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC' }}>
                  Target Beneficiary Group
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.4 }}>
                    {s.targetGroup}
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 5. Mandatory Verification Proofs (Documents) */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC', verticalAlign: 'top' }}>
                  <div>Mandatory Verification Proofs</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--slate)' }}>
                    Verified against DigiLocker repository
                  </span>
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {s.documents.map((doc, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '8px', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--ink-navy)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {doc.available ? (
                              <CheckCircle2 size={13} color="var(--ledger-green)" />
                            ) : (
                              <AlertTriangle size={13} color="var(--brass-gold)" />
                            )}
                            {doc.name}
                          </span>
                          <span 
                            className={`badge ${doc.available ? 'badge-eligible' : 'badge-nearly'}`} 
                            style={{ fontSize: '9px', textTransform: 'uppercase', padding: '2px 5px' }}
                          >
                            {doc.available ? 'Ready' : 'Missing'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 6. Key Evaluated Rules */}
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC', verticalAlign: 'top' }}>
                  <div>Gazette Criteria Evaluation</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--slate)' }}>
                    AST deterministic rule comparison
                  </span>
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                    {s.ruleBreakdown && s.ruleBreakdown.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {s.ruleBreakdown.slice(0, 4).map((rule, idx) => {
                          const passed = rule.status === 'passed';
                          return (
                            <div 
                              key={idx} 
                              style={{ 
                                fontSize: '0.78rem', 
                                padding: '6px 8px', 
                                borderRadius: '4px',
                                background: passed ? 'rgba(31,122,77,0.06)' : 'rgba(193,68,45,0.06)',
                                borderLeft: `3px solid ${passed ? 'var(--ledger-green)' : 'var(--seal-vermillion)'}`
                              }}
                            >
                              <div style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>
                                {passed ? '✓ ' : '✕ '}{rule.rule || rule.field}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--slate)', marginTop: '2px' }}>
                                Citizen: <strong>{String(rule.citizenValue ?? 'Not Provided')}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate)', fontStyle: 'italic' }}>
                        Gazette rules available upon full profile synchronization.
                      </div>
                    )}
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>

              {/* 7. Action Row */}
              <tr>
                <td style={{ padding: '18px 20px', fontWeight: 700, color: 'var(--ink-navy)', background: '#FAFBFC' }}>
                  Action Stream
                </td>
                {selectedSchemes.map(s => (
                  <td key={s.schemeId} style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link 
                        to={`/citizen/scheme/${s.schemeId}`} 
                        className="btn btn-primary btn-sm" 
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        View Official Dossier <ArrowRight size={14} />
                      </Link>

                      {s.officialUrl && (
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem' }}
                        >
                          <ExternalLink size={12} /> Official Portal
                        </a>
                      )}
                    </div>
                  </td>
                ))}
                {selectedSchemes.length < 3 && <td style={{ background: 'rgba(247,249,252,0.3)' }} />}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="card" style={{ maxWidth: '580px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--ink-navy)' }}>
                  Add Scheme to Comparison
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--slate)' }}>
                  Select from available Central and State welfare programmes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: '#FAF9F6' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--slate)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search scheme name, code (e.g. PM-KISAN, PMJAY, PMMVY)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem'
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* Scheme List */}
            <div style={{ overflowY: 'auto', padding: '12px 24px', flex: 1 }}>
              {filteredCatalog.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate)', fontSize: '0.9rem' }}>
                  No schemes found matching "{searchQuery}".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredCatalog.map(item => {
                    const id = item.scheme_code || item.schemeCode || item.id || item.schemeId;
                    const isSelected = selectedIds.includes(id) || selectedIds.includes(item.id) || selectedIds.includes(item.schemeId);
                    const name = item.official_name || item.name || item.schemeName;
                    const code = item.scheme_code || item.schemeCode || item.short_name;
                    const benefit = item.benefit || item.benefits?.summary || 'Welfare Benefit';

                    return (
                      <div
                        key={id}
                        onClick={() => {
                          toggleSelect(id);
                          if (!isSelected && selectedIds.length >= 2) {
                            setShowAddModal(false);
                          }
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: `1px solid ${isSelected ? 'var(--seal-vermillion)' : 'var(--border)'}`,
                          background: isSelected ? 'rgba(193, 68, 45, 0.04)' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ flex: 1, paddingRight: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-neutral" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                              {code}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate)', textTransform: 'capitalize' }}>
                              {(item.category || item.type || 'Central').replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink-navy)', marginTop: '3px' }}>
                            {name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--ledger-green)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            {typeof benefit === 'string' ? benefit : 'Direct Benefit'}
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm`}
                          style={{ fontSize: '0.75rem', padding: '4px 10px', pointerEvents: 'none' }}
                        >
                          {isSelected ? 'Selected ✓' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: '#FFFDF9' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
