import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldAlert, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--seal-vermillion)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Saarthi Home
      </Link>

      <div className="card" style={{ padding: '2.5rem', background: '#FFFDF9', boxShadow: '0 8px 32px rgba(11, 31, 58, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div className="brand-seal-mark" style={{ background: 'var(--seal-vermillion)' }}>⚖</div>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
              Terms of Platform Usage & Legal Disclaimers
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '2px 0 0 0', fontSize: '2rem' }}>
              Terms of Service & AI Disclaimers
            </h1>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
          Published: 13 September 2026 · Version 2.0
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: 'var(--ink-navy)', lineHeight: 1.7, fontSize: '0.92rem' }}>
          {/* AI vs Rule Engine Disclaimer Callout */}
          <div style={{ background: 'rgba(184, 51, 42, 0.06)', borderLeft: '4px solid var(--seal-vermillion)', padding: '1.25rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--seal-vermillion)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
              <ShieldAlert size={18} /> Important: Authoritative Rules vs. Assistive AI Policy
            </div>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              All statutory entitlement decisions on Saarthi are evaluated <strong>100% deterministically</strong> by our codified Gazette Rule Engine. Generative Artificial Intelligence (Gemini) is utilized strictly for natural language guidance, translations, and document explanation. AI models cannot create, alter, grant, or revoke government welfare benefits.
            </p>
          </div>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              1. Acceptance of Terms
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              By accessing, browsing, or utilizing the Saarthi Welfare Intelligence platform, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform immediately.
            </p>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              2. Nature of Platform & Government Data
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              Saarthi acts as an authoritative welfare intelligence aggregator and discovery platform. While we rigorously ingest and cross-verify statutory rules against the Gazette of India and state government notifications, the final sanction and disbursement of funds remains the sole statutory authority of the respective Ministry or District Administration.
            </p>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              3. Citizen Representations & Veracity of Records
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--slate)' }}>
              <li>You agree to provide accurate, truthful demographic and financial attributes in your Welfare Passport.</li>
              <li>Uploading fraudulent, forged, or altered revenue certificates is strictly prohibited and subject to legal prosecution under Indian Law.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--ink-navy)', marginBottom: '8px' }}>
              4. Limitation of Liability
            </h3>
            <p style={{ color: 'var(--slate)', margin: 0 }}>
              Saarthi shall not be liable for processing delays, departmental rejections, or server downtime originating from third-party government DBT payment gateways (PFMS/NPCI) or state revenue portals.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
