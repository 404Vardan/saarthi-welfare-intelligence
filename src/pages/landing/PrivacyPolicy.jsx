import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--seal-vermillion)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Saarthi Home
      </Link>

      <div className="card" style={{ padding: '2.5rem', background: '#FFFDF9', boxShadow: '0 8px 32px rgba(11, 31, 58, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div className="brand-seal-mark" style={{ background: 'var(--ink-navy)' }}>✦</div>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
              Statutory Trust & Data Protection Framework
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '2px 0 0 0', fontSize: '2rem' }}>
              Privacy Policy & Citizen Data Rights
            </h1>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
          Effective Date: 13 September 2026 · Version 2.0 (Digital Personal Data Protection Act Compliant)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: 'var(--ink-navy)', lineHeight: 1.7, fontSize: '0.92rem' }}>
          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              1. Our Core Privacy Commitment
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              Saarthi is built on the principle of <strong>minimum necessary data collection</strong>. We treat welfare entitlement data as confidential citizen trust. We never sell, monetize, or share your demographic or financial attributes with unauthorized third parties or commercial advertising networks.
            </p>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              2. Data We Collect & Specific Purpose
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
              <div>
                <strong>Demographics:</strong> Age, Gender, State, District, Pincode<br />
                <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Purpose: Filtering geographic & central scheme jurisdictions.</span>
              </div>
              <div>
                <strong>Economic Profile:</strong> Occupation, Income, Land Holding<br />
                <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Purpose: Deterministic income ceiling & agricultural rule matching.</span>
              </div>
              <div>
                <strong>Verification Proofs:</strong> Aadhaar, Income Proof, 7/12 RoR<br />
                <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Purpose: Encrypted in your private document vault for application bundling.</span>
              </div>
              <div>
                <strong>Audit Telemetry:</strong> Logins, Application Timelines<br />
                <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Purpose: Real-time milestone tracking and grievance redressal.</span>
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              3. Security Architecture & Encryption
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--slate)' }}>
              <li><strong>Row-Level Security (RLS):</strong> PostgreSQL database enforces granular tenant isolation — only you can query your private profile and documents.</li>
              <li><strong>Zero Secret Leakage:</strong> AI queries pass through secure serverless edge functions; API keys are never exposed to browser clients.</li>
              <li><strong>Encrypted Vault Storage:</strong> Document proofs in Supabase storage buckets are secured with time-limited signed URLs.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              4. Citizen Rights & Right to Erasure
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              Under applicable Indian data protection standards, you maintain absolute ownership of your welfare records. You may at any time:
            </p>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '6px', color: 'var(--slate)' }}>
              <li>Inspect and export your complete Welfare Passport dossier.</li>
              <li>Update or correct outdated revenue certificates.</li>
              <li>Request complete permanent deletion of your account, profile, and all uploaded vault files with one click in Account Settings.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              5. Contact Data Protection Officer (DPO)
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              For privacy inquiries, audit questions, or data deletion requests, contact our designated privacy desk at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-navy)' }}>privacy@saarthi.gov.in</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
