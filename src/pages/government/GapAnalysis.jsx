import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function GovGapAnalysis() {
  const [activeInterventions, setActiveInterventions] = useState({
    mobile_camps: false,
    whatsapp_advisory: false,
    digilocker_sync: false
  });

  const toggleIntervention = (key) => {
    setActiveInterventions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Base unreached gap: 31,400 (37.3%)
  const baseUnreached = 31400;
  let reductionCitizens = 0;
  if (activeInterventions.mobile_camps) reductionCitizens += 9800;
  if (activeInterventions.whatsapp_advisory) reductionCitizens += 5400;
  if (activeInterventions.digilocker_sync) reductionCitizens += 6200;

  const simulatedUnreached = Math.max(5000, baseUnreached - reductionCitizens);
  const reductionPct = ((reductionCitizens / baseUnreached) * 100).toFixed(1);

  const bottlenecks = [
    {
      category: 'Documentation Deficits (41% of Drop-off)',
      impact: 'Missing formal digital certificates (Land RoR, Tehsildar Income, Artisan proof).',
      recommendation: 'Deploy automated village revenue camp linkage & DigiLocker e-attestation.',
      interventionKey: 'mobile_camps'
    },
    {
      category: 'Information & Discovery Asymmetry (27% of Drop-off)',
      impact: 'Citizens unaware of revised income slabs or new entitlement gazettes.',
      recommendation: 'Broadcast localized WhatsApp & SMS entitlement alerts upon demographic match.',
      interventionKey: 'whatsapp_advisory'
    },
    {
      category: 'Multi-Portal Filing Friction (18% of Drop-off)',
      impact: 'Applications abandoned at intermediate e-KYC or bank seeding stages.',
      recommendation: 'Enable unified single-click submission through the Saarthi Passport interface.',
      interventionKey: 'digilocker_sync'
    }
  ];

  return (
    <div>
      <h1 className="gov-page-title">Welfare Delivery Gap & Intervention Simulator</h1>
      <p className="gov-page-subtitle">
        Analyze why legally entitled citizens drop off and model targeted field interventions in real time.
      </p>

      {/* Intervention Simulator Control Strip */}
      <div className="gov-card" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              ⚡ Field Intervention Modeling
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: '2px 0 0 0', fontSize: '1.2rem' }}>
              Simulate Delivery Interventions (Varanasi / Surat Pilot)
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: reductionCitizens > 0 ? 'var(--ledger-green)' : 'white' }}>
              {reductionCitizens > 0 ? `-${reductionPct}% Gap (${reductionCitizens.toLocaleString('en-IN')} Reached)` : 'Baseline (0% Intervened)'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              Simulated Delivery Gain
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <button
            type="button"
            onClick={() => toggleIntervention('mobile_camps')}
            style={{
              padding: '14px',
              background: activeInterventions.mobile_camps ? 'rgba(31,122,77,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeInterventions.mobile_camps ? 'var(--ledger-green)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: activeInterventions.mobile_camps ? 'var(--ledger-green)' : 'white' }}>
              {activeInterventions.mobile_camps ? '✓ Deployed:' : '+ Deploy:'} Mobile Document Camps
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Estimated Gain: +9,800 Citizens Reached
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleIntervention('whatsapp_advisory')}
            style={{
              padding: '14px',
              background: activeInterventions.whatsapp_advisory ? 'rgba(31,122,77,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeInterventions.whatsapp_advisory ? 'var(--ledger-green)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: activeInterventions.whatsapp_advisory ? 'var(--ledger-green)' : 'white' }}>
              {activeInterventions.whatsapp_advisory ? '✓ Active:' : '+ Activate:'} WhatsApp Advisory
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Estimated Gain: +5,400 Citizens Reached
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleIntervention('digilocker_sync')}
            style={{
              padding: '14px',
              background: activeInterventions.digilocker_sync ? 'rgba(31,122,77,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeInterventions.digilocker_sync ? 'var(--ledger-green)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: activeInterventions.digilocker_sync ? 'var(--ledger-green)' : 'white' }}>
              {activeInterventions.digilocker_sync ? '✓ Integrated:' : '+ Integrate:'} DigiLocker Auto-Sync
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Estimated Gain: +6,200 Citizens Reached
            </div>
          </button>
        </div>
      </div>

      {/* Root-Cause Bottlenecks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {bottlenecks.map((b, idx) => (
          <div key={idx} className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', margin: 0, fontSize: '1.15rem' }}>
                {b.category}
              </h3>
              <span className="badge" style={{ background: 'rgba(193,68,45,0.2)', color: 'var(--seal-vermillion)', fontFamily: 'var(--font-mono)' }}>
                Systemic Blocker
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '12px' }}>
              {b.impact}
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '4px', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--brass-gold)' }}>Saarthi Recommended Action: </strong>
              <span>{b.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
