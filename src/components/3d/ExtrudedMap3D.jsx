import React, { useState } from 'react';

export default function ExtrudedMap3D() {
  const [selectedState, setSelectedState] = useState('Gujarat');

  const stateData = {
    Gujarat: {
      coverage: '85.8%',
      eligible: '5.4M',
      reached: '4.6M',
      unreached: '0.8M',
      height: 75,
      color: '#1F7A4D',
      schemes: 'PM-KISAN, PMFBY, KCC, Jyotigram'
    },
    'Uttar Pradesh': {
      coverage: '62.7%',
      eligible: '18.2M',
      reached: '11.4M',
      unreached: '6.8M',
      height: 52,
      color: '#C1442D',
      schemes: 'PM-KISAN, PMAY-G, UP Kanya Sumangala'
    },
    Rajasthan: {
      coverage: '68.2%',
      eligible: '6.1M',
      reached: '4.2M',
      unreached: '1.9M',
      height: 58,
      color: '#A6873D',
      schemes: 'PM Vishwakarma, MUDRA, Chiranjeevi'
    },
    'Madhya Pradesh': {
      coverage: '71.6%',
      eligible: '7.8M',
      reached: '5.6M',
      unreached: '2.2M',
      height: 62,
      color: '#A6873D',
      schemes: 'Ladli Behna, PM-KISAN, Sambal'
    },
    Kerala: {
      coverage: '92.1%',
      eligible: '3.9M',
      reached: '3.6M',
      unreached: '0.3M',
      height: 90,
      color: '#1F7A4D',
      schemes: 'Karunya, Kudumbashree, Pension'
    }
  };

  const active = stateData[selectedState] || stateData.Gujarat;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            3D National Topography & Welfare Relief
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: '4px 0 0 0', fontSize: '1.2rem' }}>
            State-by-State Delivery Elevation
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          Click state tile to inspect
        </span>
      </div>

      {/* 3D State Tiles */}
      <div className="map-states-container" style={{ marginBottom: '24px' }}>
        {Object.entries(stateData).map(([name, data]) => {
          const isSelected = selectedState === name;
          return (
            <div
              key={name}
              className={`state-3d-tile ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedState(name)}
              style={{
                borderLeft: `4px solid ${data.color}`,
                boxShadow: isSelected ? `0 8px 24px ${data.color}33` : 'none'
              }}
            >
              <div className="state-tile-header">
                <span style={{ color: 'white' }}>{name}</span>
                <span style={{ color: data.color, fontFamily: 'var(--font-mono)' }}>{data.coverage}</span>
              </div>
              <div className="state-tile-metrics">
                Reached: {data.reached} · Gap: {data.unreached}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected State 3D Detail Sheet */}
      <div style={{ background: '#0D213B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase' }}>
              Selected Territory
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'white' }}>
              {selectedState}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: active.color }}>
              {active.coverage}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
              Welfare Saturation
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Eligible Population</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{active.eligible}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Disbursed (Reached)</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--ledger-green)', marginTop: '2px' }}>{active.reached}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Unreached Gap</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--seal-vermillion)', marginTop: '2px' }}>{active.unreached}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
