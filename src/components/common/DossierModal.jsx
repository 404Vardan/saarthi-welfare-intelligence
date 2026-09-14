import React from 'react';
import {
  Printer, X, ShieldCheck, CheckCircle2, XCircle, AlertTriangle,
  FileText, Landmark, Calendar, Download, Award
} from 'lucide-react';

export default function DossierModal({ scheme, evaluation, profile, onClose }) {
  if (!scheme || !evaluation) return null;

  const decisionId = evaluation.decisionId || evaluation.decision_reference_id || `DEC-${scheme.scheme_code || 'SCH'}-2026`;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 18, 30, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div
        className="card dossier-printable"
        style={{
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          background: '#FFFFFF',
          color: '#111827',
          borderRadius: '10px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '2px solid #C5A059'
        }}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#C5A059" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1B2A4A', letterSpacing: '0.04em' }}>
              INFORMATIONAL ELIGIBILITY ASSESSMENT
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px double #1B2A4A', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#1B2A4A',
              color: '#C5A059',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.25rem',
              border: '2px solid #C5A059'
            }}>
              S
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SAARTHI WELFARE INTELLIGENCE PLATFORM
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1B2A4A', margin: '4px 0', fontFamily: 'var(--font-display, serif)' }}>
            CITIZEN ELIGIBILITY SELF-ASSESSMENT REPORT
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
            Informational Analysis — Not an Official Government Document
          </div>
        </div>

        {/* Decision & Verification Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#F8FAF9', padding: '12px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Decision Reference ID</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1B2A4A', marginTop: '2px', wordBreak: 'break-all' }}>
              {decisionId}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Evaluation Status</div>
            <div style={{ fontWeight: 800, color: evaluation.status === 'eligible' ? '#1B4D3E' : evaluation.status === 'nearly_eligible' ? '#C5A059' : '#C23B22', marginTop: '2px' }}>
              {evaluation.status === 'eligible' ? '✓ LIKELY ELIGIBLE' : evaluation.status === 'nearly_eligible' ? '⚠️ NEAR-MISS ADVISORY' : '✗ LIKELY NOT ELIGIBLE'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Date of Issuance</div>
            <div style={{ fontWeight: 700, color: '#1B2A4A', marginTop: '2px' }}>
              {issueDate}
            </div>
          </div>
        </div>

        {/* Scheme & Ministry Information */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Target Scheme</div>
          <h3 style={{ fontSize: '1.15rem', color: '#1B2A4A', margin: '2px 0 4px 0', fontWeight: 700 }}>
            {scheme.official_name || scheme.name} ({scheme.scheme_code})
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
            Nodal Authority: {scheme.ministry || 'Government of India'} &bull; {scheme.department || 'Nodal Department'}
          </div>
        </div>

        {/* Beneficiary Profile Snapshot */}
        <div style={{ marginBottom: '1.25rem', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', marginBottom: '8px' }}>
            Beneficiary Profile Stamped Context
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Beneficiary:</span> <strong>{profile?.full_name || 'Registered Citizen'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Age:</span> <strong>{profile?.age ? `${profile.age} yrs` : 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Occupation:</span> <strong>{(profile?.occupation || 'General').toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>State:</span> <strong>{profile?.state || 'All-India'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Annual Income:</span> <strong>{profile?.income_annual ? `₹${profile.income_annual.toLocaleString('en-IN')}` : 'Self-Declared'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Category:</span> <strong>{(profile?.category || 'General').toUpperCase()}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>BPL Card:</span> <strong>{profile?.bpl_card ? 'Yes' : 'No'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Locker Docs:</span> <strong>{evaluation.documents?.filter(d => d.available).length || 0} Attached</strong>
            </div>
          </div>
        </div>

        {/* Deterministic Rule Breakdown Matrix */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', marginBottom: '6px' }}>
            Statutory Rule Compliance Matrix
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #CBD5E1' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                <th style={{ padding: '6px 10px' }}>Statutory Criterion</th>
                <th style={{ padding: '6px 10px' }}>Citizen Stamped Profile</th>
                <th style={{ padding: '6px 10px' }}>Prescribed Threshold</th>
                <th style={{ padding: '6px 10px', textAlign: 'center' }}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {(evaluation.ruleBreakdown || []).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '6px 10px', fontWeight: 600 }}>{r.rule}</td>
                  <td style={{ padding: '6px 10px', color: '#1B2A4A' }}>{r.citizenValue}</td>
                  <td style={{ padding: '6px 10px', color: '#64748B' }}>{r.requiredValue}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 700, color: r.status === 'passed' ? '#1B4D3E' : r.status === 'insufficient_data' ? '#C5A059' : '#C23B22' }}>
                    {r.status === 'passed' ? '✓ PASS' : r.status === 'insufficient_data' ? '⚠️ INCOMPLETE' : '✗ FAIL'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Document Readiness Checklist */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', marginBottom: '6px' }}>
            Required Official Documents Verification Status
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.78rem' }}>
            {(evaluation.documents || []).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: d.available ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${d.available ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <FileText size={13} color={d.available ? '#1B4D3E' : '#D97706'} />
                  {d.name}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: d.available ? '#1B4D3E' : '#D97706' }}>
                  {d.available ? 'VAULT VERIFIED' : 'ACTION REQUIRED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer & Footer */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '10px 14px', marginTop: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>
            ⚠️ IMPORTANT DISCLAIMER
          </div>
          <div style={{ fontSize: '0.68rem', color: '#78350F', lineHeight: 1.4 }}>
            This document is an informational self-assessment generated by the Saarthi Welfare Intelligence Platform. It does NOT constitute government approval, official sanction, or eligibility certification. Final eligibility is determined solely by the relevant government authority upon formal application. Saarthi is an assistive technology tool — not a government body.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #1B2A4A', paddingTop: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1B2A4A' }}>
              REFERENCE INFORMATION
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', maxWidth: '520px', lineHeight: 1.35, marginTop: '2px' }}>
              This assessment was generated by the Saarthi deterministic rule engine based on your self-declared profile data. To formally apply for any scheme, please visit the official government portal or your nearest Common Service Centre (CSC) with original documents.
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace', padding: '6px 10px', background: '#F8FAF9', border: '1px solid #CBD5E1', borderRadius: '4px' }}>
              REF: {decisionId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
