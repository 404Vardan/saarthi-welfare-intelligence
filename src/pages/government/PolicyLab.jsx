import React, { useState } from 'react';
import { Scale, Plus, Bookmark, Layers, ArrowRight, Check } from 'lucide-react';

export default function GovPolicyLab() {
  const [selectedScheme, setSelectedScheme] = useState('PM-KISAN');
  const [incomeLimit, setIncomeLimit] = useState(250000);
  const [landCap, setLandCap] = useState(5);
  const [includeTenants, setIncludeTenants] = useState(false);
  const [scenarioName, setScenarioName] = useState('Expanded Rural Threshold');

  // Baseline reference for PM-KISAN
  const baseline = {
    income: 200000,
    land: 5,
    tenants: false,
    eligible: 84200,
    cost: 412
  };

  // Live Scenario Calculations
  const deltaIncomeRatio = (incomeLimit - baseline.income) / baseline.income;
  const deltaLandRatio = (landCap - baseline.land) * 0.05;
  const tenantBonus = includeTenants ? 18500 : 0;

  const currentEligible = Math.round(
    baseline.eligible +
    (deltaIncomeRatio * 32000) +
    (deltaLandRatio * 15000) +
    tenantBonus
  );

  const deltaEligible = currentEligible - baseline.eligible;
  const deltaEligiblePct = ((deltaEligible / baseline.eligible) * 100).toFixed(1);

  const currentCost = Math.round((currentEligible * 6000) / 10000000); // in Cr
  const deltaCost = currentCost - baseline.cost;

  // Saved Scenarios state
  const [savedScenarios, setSavedScenarios] = useState([
    {
      id: 'PL-2026-004',
      name: 'Baseline Gazette Enactment',
      incomeLimit: 200000,
      landCap: 5,
      includeTenants: false,
      eligible: 84200,
      cost: 412,
      savedAt: '15 Aug 2026'
    },
    {
      id: 'PL-2026-018',
      name: 'Marginal Farmer Inclusive Cap',
      incomeLimit: 275000,
      landCap: 7,
      includeTenants: true,
      eligible: 112400,
      cost: 550,
      savedAt: '22 Aug 2026'
    }
  ]);

  const [toast, setToast] = useState('');

  const handleSaveScenario = (e) => {
    e.preventDefault();
    const newScenarioId = `PL-2026-0${Math.floor(20 + Math.random() * 80)}`;
    const newRecord = {
      id: newScenarioId,
      name: scenarioName || 'Custom Policy Scenario',
      incomeLimit,
      landCap,
      includeTenants,
      eligible: currentEligible,
      cost: currentCost,
      savedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setSavedScenarios(prev => [newRecord, ...prev]);
    setToast(`✓ Saved Scenario #${newScenarioId}: "${newRecord.name}"`);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="gov-page-title" style={{ margin: 0 }}>Policy Simulation Lab</h1>
          <p className="gov-page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Simulate eligibility parameter revisions, forecast fiscal outlays, and compare policy scenarios side-by-side.
          </p>
        </div>

        <select
          className="ops-select"
          value={selectedScheme}
          onChange={e => setSelectedScheme(e.target.value)}
          style={{ width: '220px' }}
        >
          <option value="PM-KISAN">PM-KISAN (Direct Transfer)</option>
          <option value="PMJAY">Ayushman Bharat (Health)</option>
          <option value="PMAY-G">PMAY-G (Housing Subsidy)</option>
          <option value="VISHWAKARMA">PM Vishwakarma (Artisans)</option>
        </select>
      </div>

      {toast && (
        <div style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)', border: '1px solid rgba(31,122,77,0.4)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {toast}
        </div>
      )}

      {/* Grid: Controls vs Live Impact */}
      <div className="gov-grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Controls Panel */}
        <div className="gov-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0, fontSize: '1.15rem' }}>
              Simulate Parameters: {selectedScheme}
            </h3>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)' }}>
              ● Live Sandbox
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Annual Income Ceiling:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                ₹{incomeLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="500000"
              step="25000"
              value={incomeLimit}
              onChange={e => setIncomeLimit(parseInt(e.target.value, 10))}
              className="slider-control"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
              <span>₹1.0L</span>
              <span>₹2.0L (Baseline)</span>
              <span>₹3.0L</span>
              <span>₹5.0L</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Landholding Cap:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700 }}>
                {landCap} Acres
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={landCap}
              onChange={e => setLandCap(parseInt(e.target.value, 10))}
              className="slider-control"
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              type="checkbox"
              checked={includeTenants}
              onChange={e => setIncludeTenants(e.target.checked)}
              className="form-checkbox"
            />
            <span style={{ fontSize: '0.85rem', color: 'white' }}>
              Extend Eligibility to Tenant Farmers (Leaseholders)
            </span>
          </label>

          {/* Save Scenario Form */}
          <form onSubmit={handleSaveScenario} style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="ops-input"
              placeholder="Scenario Name (e.g. Expanded Income Cap)"
              value={scenarioName}
              onChange={e => setScenarioName(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              required
            />
            <button type="submit" className="ops-btn ops-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bookmark size={14} /> Save Scenario
            </button>
          </form>
        </div>

        {/* Live Delta Impact Card */}
        <div className="gov-card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1.25rem', fontSize: '1.15rem' }}>
            Projected Macro Delta
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Baseline</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'white', marginTop: '4px' }}>
                {baseline.eligible.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>₹{baseline.cost} Cr Outlay</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Proposed</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--brass-gold)', marginTop: '4px' }}>
                {currentEligible.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>₹{currentCost} Cr Outlay</div>
            </div>

            <div style={{ background: deltaEligible >= 0 ? 'rgba(31,122,77,0.1)' : 'rgba(193,68,45,0.1)', padding: '16px 12px', borderRadius: '6px', border: `1px solid ${deltaEligible >= 0 ? 'rgba(31,122,77,0.3)' : 'rgba(193,68,45,0.3)'}` }}>
              <div style={{ fontSize: '11px', color: deltaEligible >= 0 ? 'var(--ledger-green)' : 'var(--seal-vermillion)', textTransform: 'uppercase', fontWeight: 700 }}>
                Delta Change
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: deltaEligible >= 0 ? 'var(--ledger-green)' : 'var(--seal-vermillion)', marginTop: '4px' }}>
                {deltaEligible >= 0 ? '+' : ''}{deltaEligible.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: deltaEligible >= 0 ? 'var(--ledger-green)' : 'var(--seal-vermillion)', marginTop: '2px', fontWeight: 600 }}>
                {deltaCost >= 0 ? '+' : ''}₹{deltaCost} Cr ({deltaEligible >= 0 ? '+' : ''}{deltaEligiblePct}%)
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '4px', fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--brass-gold)' }}>Policy Lab Analysis: </strong>
            Expanding income threshold to ₹{(incomeLimit / 100000).toFixed(1)} Lakhs incorporates an estimated {deltaEligible.toLocaleString('en-IN')} previously excluded agrarian households with an annual fiscal outlay delta of ₹{deltaCost} Crores.
          </div>
        </div>
      </div>

      {/* Side-by-Side Saved Scenario Comparison */}
      <div className="gov-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0, fontSize: '1.2rem' }}>
            Multi-Scenario Comparison Matrix
          </h3>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
            {savedScenarios.length} Scenarios Catalogued
          </span>
        </div>

        <table className="gov-table">
          <thead>
            <tr>
              <th>Scenario Ref</th>
              <th>Scenario Name</th>
              <th>Income Ceiling</th>
              <th>Land Cap</th>
              <th>Tenants Included</th>
              <th>Eligible Base</th>
              <th>Projected Budget</th>
            </tr>
          </thead>
          <tbody>
            {savedScenarios.map(s => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 600 }}>#{s.id}</td>
                <td style={{ fontWeight: 600, color: 'white' }}>{s.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{s.incomeLimit.toLocaleString('en-IN')}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{s.landCap} Acres</td>
                <td>{s.includeTenants ? '✓ Yes' : '— No'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 700 }}>
                  {s.eligible.toLocaleString('en-IN')}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--seal-vermillion)', fontWeight: 700 }}>
                  ₹{s.cost} Cr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
