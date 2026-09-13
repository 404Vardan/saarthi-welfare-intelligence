import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  Send,
  MessageSquareHeart,
  HelpCircle
} from 'lucide-react';

export default function BetaGuide() {
  const personas = [
    {
      title: '1. Small / Marginal Farmer (Surat / Gujarat)',
      profile: 'Age 38, Farmer, Annual Income ₹1.8 Lakh, Land < 2 Acres',
      expectedMatches: ['PM-KISAN (₹6,000)', 'PM Fasal Bima', 'Gujarat Kisan Sahay', 'Soil Health Card'],
      keyTests: 'Check landholding criteria in Decision Trace & submit a mock application.'
    },
    {
      title: '2. Enrolled College Student (Woxsen / Hyderabad / Delhi)',
      profile: 'Age 20, Student, Family Income ₹2.2 Lakh, OBC Category',
      expectedMatches: ['PM YASASVI OBC Scholarship', 'Central Sector Scholarship', 'PM e-Vidya'],
      keyTests: 'Verify fee waiver calculation and test Ask Saarthi AI in Hindi.'
    },
    {
      title: '3. Woman Head of Household / Homemaker',
      profile: 'Age 34, Female, Household Income ₹1.5 Lakh, BPL Ration Card',
      expectedMatches: ['PM Matru Vandana', 'PM Ujjwala 2.0 (LPG)', 'Ayushman Bharat PM-JAY'],
      keyTests: 'Inspect BPL-linked automatic health entitlement verification.'
    },
    {
      title: '4. Traditional Artisan / Craftsman (Carpenter / Potter / Mason)',
      profile: 'Age 42, Artisan, Annual Income ₹1.2 Lakh, Unorganized Worker',
      expectedMatches: ['PM Vishwakarma (₹15k toolkit + ₹3L loan)', 'Manav Kalyan Yojana', 'PM-SYM Pension'],
      keyTests: 'Verify 18-trade skill mapping in eligibility engine.'
    },
    {
      title: '5. Senior Citizen (Age 60+)',
      profile: 'Age 65, Retired, BPL Card holder, Rural Resident',
      expectedMatches: ['IGNOAPS Old Age Pension', 'PM Garib Kalyan Anna Yojana', 'Ayushman Bharat'],
      keyTests: 'Check pension monthly disbursement breakdown.'
    }
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--seal-vermillion)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Saarthi Home
      </Link>

      <div className="card" style={{ padding: '2.5rem', background: '#FFFDF9', boxShadow: '0 8px 32px rgba(11, 31, 58, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div className="brand-seal-mark" style={{ background: 'var(--brass-gold)' }}>★</div>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
              Phase 7 Beta Cohort Testing Protocol
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '2px 0 0 0', fontSize: '2rem' }}>
              Saarthi 1.0 Beta User Guide
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--slate)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Welcome to the Saarthi Beta Cohort! As recommended by faculty and mentors, we are conducting a controlled test with 20–50 real users across students, farmers, artisans, and families. Follow the 5 test personas below to evaluate our deterministic matching accuracy.
        </p>

        {/* 4-Step Testing Workflow */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            📋 How to Test Saarthi in 4 Steps:
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: '#FFFDF9', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <strong>Step 1: Sign Up</strong><br />
              <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Create citizen account at <code>/citizen/login</code></span>
            </div>
            <div style={{ background: '#FFFDF9', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <strong>Step 2: 4-Step Wizard</strong><br />
              <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Complete <code>/citizen/onboarding</code> & click "Find My Benefits"</span>
            </div>
            <div style={{ background: '#FFFDF9', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <strong>Step 3: Check Traces</strong><br />
              <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Inspect Decision Traces & upload test proof in Locker</span>
            </div>
            <div style={{ background: '#FFFDF9', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <strong>Step 4: Give Feedback</strong><br />
              <span style={{ color: 'var(--slate)', fontSize: '0.78rem' }}>Use 👍 / 👎 buttons to rate recommendation accuracy</span>
            </div>
          </div>
        </div>

        {/* Personas Cards */}
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
          🎯 Recommended Test Personas
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {personas.map((p, idx) => (
            <div key={idx} style={{ padding: '1.25rem', background: 'var(--paper)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--ink-navy)', fontSize: '1.05rem', marginBottom: '4px' }}>
                {p.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--seal-vermillion)', fontWeight: 600, marginBottom: '6px' }}>
                Profile Attributes: {p.profile}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '6px' }}>
                <strong>Expected Matches:</strong> {p.expectedMatches.join(', ')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ledger-green)', fontWeight: 600 }}>
                ✓ Key Verification Task: {p.keyTests}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/citizen/onboarding"
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={18} color="var(--brass-gold)" /> Launch Citizen Onboarding Scanner →
          </Link>
        </div>
      </div>
    </div>
  );
}
