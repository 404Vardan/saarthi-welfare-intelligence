import React, { useState, useEffect } from 'react';
import { GovAnalyticsAPI } from '../../api/govAnalyticsApi';
import { MapPin, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function GovDistricts() {
  const [selectedState, setSelectedState] = useState('All');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await GovAnalyticsAPI.fetchDistrictIntelligence(selectedState);
      setDistricts(data);
      if (data.length > 0) setSelectedDistrict(data[0]);
    }
    load();
  }, [selectedState]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(197, 160, 89, 0.12)', color: 'var(--brass-gold)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
            [ADMINISTRATIVE JURISDICTIONAL DATA] NIC AGGREGATE
          </div>
          <h1 className="gov-page-title" style={{ margin: 0 }}>District Delivery Intelligence</h1>
          <p className="gov-page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Identify specific procedural blockers and trigger targeted welfare delivery interventions.
          </p>
        </div>

        <select
          className="ops-select"
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="All">All States</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Kerala">Kerala</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-6)' }}>
        {/* District Master Table */}
        <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>District</th>
                <th>State</th>
                <th>Eligible Base</th>
                <th>Reached</th>
                <th>Unreached Gap</th>
              </tr>
            </thead>
            <tbody>
              {districts.map(d => {
                const isSelected = selectedDistrict?.id === d.id;
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(166, 135, 61, 0.15)' : 'transparent'
                    }}
                  >
                    <td style={{ fontWeight: 600, color: isSelected ? 'var(--brass-gold)' : 'white' }}>
                      {d.name} {isSelected && '➔'}
                    </td>
                    <td>{d.state}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{d.eligible.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)' }}>{d.reached.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--seal-vermillion)', fontWeight: 600 }}>{d.gapPct}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected District Deep Drilldown & Intervention */}
        {selectedDistrict && (
          <div className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase' }}>
                  District Intelligence Dossier
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', margin: '2px 0 0 0' }}>
                  {selectedDistrict.name}, {selectedDistrict.state}
                </h2>
              </div>
              <span className="badge" style={{ background: 'rgba(193,68,45,0.2)', color: 'var(--seal-vermillion)', fontFamily: 'var(--font-mono)' }}>
                {selectedDistrict.gapPct} Unreached Gap
              </span>
            </div>

            {/* Gap Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Eligible</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'white', marginTop: '2px' }}>
                  {selectedDistrict.eligible.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Reached</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--ledger-green)', marginTop: '2px' }}>
                  {selectedDistrict.reached.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Unreached</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--seal-vermillion)', marginTop: '2px' }}>
                  {selectedDistrict.unreached.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Observed Delivery Blockers */}
            <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '10px' }}>Observed Delivery Blockers:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Documentation Deficits</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedDistrict.blockers.documentation}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '6px' }}>
                  <div style={{ background: 'var(--seal-vermillion)', width: `${selectedDistrict.blockers.documentation}%`, height: '100%', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Awareness Asymmetry</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedDistrict.blockers.awareness}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '6px' }}>
                  <div style={{ background: 'var(--brass-gold)', width: `${selectedDistrict.blockers.awareness}%`, height: '100%', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Application Abandonment</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedDistrict.blockers.abandonment}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '6px' }}>
                  <div style={{ background: 'var(--slate)', width: `${selectedDistrict.blockers.abandonment}%`, height: '100%', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>

            {/* Actionable Saarthi Policy Intervention */}
            <div style={{ background: 'rgba(166, 135, 61, 0.1)', border: '1px solid rgba(166, 135, 61, 0.3)', padding: '14px', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                ⚡ Priority Policy Intervention:
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                {selectedDistrict.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
