import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchemes } from '../../context/SchemeContext';
import {
  Wallet, ArrowDownLeft, ShieldCheck, CheckCircle2, Clock, AlertCircle,
  Calendar, RefreshCw, ArrowRight, FileCheck, Landmark, Check, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenBenefits() {
  const { profile, applications, evaluations } = useAuth();
  const { schemes } = useSchemes();

  // Active Long-Term Welfare Lifecycle records
  const [lifecycleRecords, setLifecycleRecords] = useState([
    {
      id: 'rec-001',
      schemeCode: 'PM-KISAN',
      schemeName: 'Pradhan Mantri Kisan Samman Nidhi',
      category: 'Direct Benefit Transfer',
      currentStage: 'disbursed', // 'applied' | 'approved' | 'disbursed' | 'renewal_due' | 'next_eligible'
      totalDisbursed: '₹18,000',
      lastInstallment: '₹2,000 (17th Installment on 15 Aug 2026)',
      nextInstallmentDate: '30 Nov 2026',
      renewalDue: 'Annual eKYC due in 45 days',
      renewalUrgent: true,
      bankAccount: 'SBI (Aadhaar Seeded ***9102)',
      nextMilestoneScheme: 'Kisan Credit Card (KCC) @ 4% Interest'
    },
    {
      id: 'rec-002',
      schemeCode: 'PMJAY',
      schemeName: 'Ayushman Bharat — PMJAY',
      category: 'Health Protection',
      currentStage: 'approved',
      totalDisbursed: '₹5,00,000 Cover Active',
      lastInstallment: 'Golden Card e-Issued',
      nextInstallmentDate: 'Cashless on demand',
      renewalDue: 'Active Lifetime Policy',
      renewalUrgent: false,
      bankAccount: 'Direct Hospital Empanelment',
      nextMilestoneScheme: 'PM Suraksha Bima Yojana'
    },
    {
      id: 'rec-003',
      schemeCode: 'POST-MATRIC',
      schemeName: 'National Post-Matric Scholarship',
      category: 'Education Subsidy',
      currentStage: 'applied',
      totalDisbursed: '₹0 (Sanction in Progress)',
      lastInstallment: 'Institute Verification Verified',
      nextInstallmentDate: 'Expected 15 Oct 2026',
      renewalDue: 'Semester 2 Renewal in Jan 2027',
      renewalUrgent: false,
      bankAccount: 'Bank of Baroda (***4188)',
      nextMilestoneScheme: 'National Higher Education Fellowship'
    }
  ]);

  const stages = [
    { key: 'applied', label: '1. Applied', icon: Clock },
    { key: 'approved', label: '2. Approved', icon: FileCheck },
    { key: 'disbursed', label: '3. Benefit Received', icon: ArrowDownLeft },
    { key: 'renewal_due', label: '4. Renewal Due', icon: RefreshCw },
    { key: 'next_eligible', label: '5. Next Step Benefit', icon: ArrowRight }
  ];

  const getStageIndex = (stage) => {
    switch (stage) {
      case 'applied': return 0;
      case 'approved': return 1;
      case 'disbursed': return 2;
      case 'renewal_due': return 3;
      case 'next_eligible': return 4;
      default: return 2;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(197, 160, 89, 0.15)', color: 'var(--brass-gold)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <Wallet size={13} />
            LONG-TERM WELFARE PASSPORT RECORD
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem' }}>Benefits & Welfare Wallet</h1>
          <p className="page-description" style={{ fontSize: '0.9rem' }}>
            Full lifecycle record of your household entitlements: from initial filing to continuous disbursement, timely renewals, and next-stage progression.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTopColor: 'var(--success-forest)' }}>
          <div className="stat-value text-ledger-green">₹18,000</div>
          <div className="stat-label">Total Direct Benefit (DBT) Received</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--brass-gold)' }}>
          <div className="stat-value text-brass-gold">₹5,00,000</div>
          <div className="stat-label">Active Cashless Health Protection</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--seal-vermillion)' }}>
          <div className="stat-value" style={{ color: 'var(--seal-vermillion)' }}>1 Action</div>
          <div className="stat-label">Annual eKYC / Renewal Reminder</div>
        </div>
      </div>

      {/* Long-Term Welfare Records Lifecycle List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {lifecycleRecords.map(rec => {
          const currentIndex = getStageIndex(rec.currentStage);

          return (
            <div key={rec.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--brass-gold)' }}>
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 800, background: 'rgba(197,160,89,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {rec.schemeCode}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {rec.category}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', margin: '0 0 4px 0' }}>
                    {rec.schemeName}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Landmark size={14} /> Linked: {rec.bankAccount}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Lifetime Aid Received</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-forest)' }}>
                    {rec.totalDisbursed}
                  </div>
                </div>
              </div>

              {/* 5-Stage Visual Lifecycle Stepper */}
              <div style={{ margin: '1.25rem 0', background: 'var(--paper)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  {stages.map((stage, idx) => {
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCompleted ? 'var(--ink-navy)' : '#E2E8F0',
                            color: isCompleted ? '#FFFFFF' : 'var(--slate)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '6px',
                            border: isCurrent ? '3px solid var(--brass-gold)' : 'none',
                            boxShadow: isCurrent ? '0 0 8px rgba(197,160,89,0.5)' : 'none'
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? 'var(--ink-navy)' : 'var(--slate)',
                            textAlign: 'center'
                          }}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Details: Next Installment + Renewal + Next Level Benefit */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ color: 'var(--slate)', fontSize: '10.5px', textTransform: 'uppercase' }}>Recent Installment</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-navy)', marginTop: '2px' }}>{rec.lastInstallment}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--slate)', fontSize: '10.5px', textTransform: 'uppercase' }}>Upcoming Cycle</div>
                  <div style={{ fontWeight: 600, color: 'var(--brass-gold)', marginTop: '2px' }}>{rec.nextInstallmentDate}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--slate)', fontSize: '10.5px', textTransform: 'uppercase' }}>Next Stage Unlocked</div>
                  <div style={{ fontWeight: 600, color: 'var(--success-forest)', marginTop: '2px' }}>{rec.nextMilestoneScheme}</div>
                </div>
              </div>

              {/* Urgent Action Banner if Renewal Due */}
              {rec.renewalUrgent && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontSize: '0.8rem', fontWeight: 600 }}>
                    <AlertCircle size={15} />
                    {rec.renewalDue}
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ borderColor: '#B45309', color: '#B45309', fontSize: '0.75rem', padding: '4px 10px' }}>
                    Complete eKYC Now →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
