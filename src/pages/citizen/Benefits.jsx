import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, ArrowDownLeft, ShieldCheck, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function CitizenBenefits() {
  const { profile, evaluations } = useAuth();

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');

  const disbursements = [
    {
      scheme: 'PM-KISAN (Samman Nidhi)',
      installment: '17th Installment',
      amount: '₹2,000',
      date: '15 Aug 2026',
      status: 'Illustrative Ledger Credit',
      account: 'State Bank of India (***9102)'
    },
    {
      scheme: 'PM-KISAN (Samman Nidhi)',
      installment: '16th Installment',
      amount: '₹2,000',
      date: '12 Apr 2026',
      status: 'Illustrative Ledger Credit',
      account: 'State Bank of India (***9102)'
    },
    {
      scheme: 'PM Fasal Bima Yojana (PMFBY)',
      installment: 'Kharif Crop Relief Subsidy',
      amount: '₹8,400',
      date: '28 Jan 2026',
      status: 'Illustrative Ledger Credit',
      account: 'State Bank of India (***9102)'
    }
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Benefits & Aid Wallet</h1>
          <p className="page-description">
            Transparent ledger of direct financial transfers, subsidies, and upcoming welfare entitlements.
          </p>
        </div>
      </header>

      {/* Academic Transparency Alert */}
      <div style={{ background: 'rgba(166, 135, 61, 0.1)', border: '1px solid rgba(166, 135, 61, 0.3)', padding: '10px 14px', borderRadius: '4px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ink-navy)' }}>
        <Info size={16} color="var(--brass-gold)" />
        <span><strong>Academic Prototype Note:</strong> Disbursement records below represent simulated ledger entries for demonstration.</span>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTopColor: 'var(--ledger-green)' }}>
          <div className="stat-value text-ledger-green">₹12,400</div>
          <div className="stat-label">Modelled Aid in FY 2026</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--brass-gold)' }}>
          <div className="stat-value text-brass-gold">₹2,000</div>
          <div className="stat-label">Upcoming Direct Installment</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--ink-navy)' }}>
          <div className="stat-value">State Bank of India</div>
          <div className="stat-label">DBT-Linked Account Profile</div>
        </div>
      </div>

      {/* Direct Benefit Transfer Ledger */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
          Illustrative Direct Benefit Transfer (DBT) History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {disbursements.map((d, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownLeft size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.95rem' }}>{d.scheme}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '2px' }}>
                    {d.installment} · {d.account}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ledger-green)', fontSize: '1.1rem' }}>
                  +{d.amount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '2px' }}>
                  {d.date} · {d.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
