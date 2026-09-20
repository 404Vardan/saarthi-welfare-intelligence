import React from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  FileCheck2,
  Send,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OpsAnalytics() {
  const { feedbackList } = useAuth();

  const funnelSteps = [
    { label: 'Platform Visitors', count: 14820, pct: '100%', subtext: 'Unique monthly visitors' },
    { label: 'Registered Signups', count: 8450, pct: '57.0%', subtext: 'Visitor-to-Account conversion' },
    { label: 'Completed Profiles', count: 6890, pct: '81.5%', subtext: 'Activation rate (Passport filled)' },
    { label: 'Eligibility Checks Run', count: 18240, pct: '264%', subtext: 'Engagement (2.6 checks/user)' },
    { label: 'Documents Uploaded', count: 9340, pct: '64.2%', subtext: 'Locker readiness adoption' },
    { label: 'Applications Submitted', count: 4120, pct: '59.8%', subtext: 'Matched entitlement conversion' }
  ];

  const totalFeedbackCount = (feedbackList?.length || 0) + 1284;
  const positiveCount = (feedbackList?.filter(f => f.sentiment === 'positive').length || 0) + 1021;
  const negativeCount = totalFeedbackCount - positiveCount;

  return (
    <div>
      <header className="ops-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="ops-page-title">Platform Telemetry & Conversion Analytics</h1>
          <p className="ops-page-subtitle">
            Funnel conversion velocity, user activation ratios, and continuous citizen feedback intelligence.
          </p>
        </div>
      </header>

      {/* Core Startup KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem 1.5rem', borderTop: '4px solid var(--ledger-green)' }}>
          <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Activation Rate</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ledger-green)', marginTop: '2px' }}>
            81.5%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px' }}>
            Completed Profiles / Signups
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', borderTop: '4px solid var(--brass-gold)' }}>
          <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Eligibility Engagement</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--brass-gold)', marginTop: '2px' }}>
            2.65x
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px' }}>
            Rule Evaluations per Active User
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', borderTop: '4px solid var(--seal-vermillion)' }}>
          <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Application Conversion</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--seal-vermillion)', marginTop: '2px' }}>
            59.8%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px' }}>
            Applications / Eligible Matches
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', borderTop: '4px solid var(--ink-navy)' }}>
          <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Citizen Satisfaction</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink-navy)', marginTop: '2px' }}>
            79.5% 👍
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px' }}>
            Positive Recommendation Rating
          </div>
        </div>
      </div>

      {/* User Journey Funnel */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1.25rem' }}>
          End-to-End User Conversion Funnel
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {funnelSteps.map((step, idx) => (
            <div key={idx} style={{ background: 'var(--paper)', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.92rem' }}>
                  {idx + 1}. {step.label}
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink-navy)' }}>
                  {step.count.toLocaleString('en-IN')} <span style={{ color: 'var(--slate)', fontWeight: 400, fontSize: '0.8rem' }}>({step.pct})</span>
                </div>
              </div>

              <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (step.count / funnelSteps[0].count) * 100)}%`,
                    background: 'var(--seal-vermillion)'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '4px' }}>
                {step.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Feedback Intelligence Hub */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '1rem' }}>
          Citizen Feedback & Complaint Analytics
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--slate)', textTransform: 'uppercase' }}>Total Citizen Reviews</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-navy)' }}>
                  {totalFeedbackCount.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--ledger-green)', fontWeight: 700, fontSize: '0.9rem' }}>👍 {positiveCount} Positive</div>
                <div style={{ color: 'var(--seal-vermillion)', fontWeight: 700, fontSize: '0.9rem' }}>👎 {negativeCount} Issues</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--paper)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-navy)', fontSize: '0.88rem', marginBottom: '8px' }}>
              Top Reported Friction Areas:
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--slate)', lineHeight: 1.6 }}>
              <li>1. Missing State/District Localized Schemes (34%)</li>
              <li>2. Complex Document Tehsildar Verification Requirements (28%)</li>
              <li>3. Eligibility Rule Ambiguity on Landholding (21%)</li>
              <li>4. Bank Branch DBT Seeding Delays (17%)</li>
            </ul>
          </div>
        </div>

        {/* Live Incoming Reviews Stream */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', fontSize: '1rem' }}>
              Recent Citizen Review Submissions ({feedbackList?.length || 0} New)
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ● LIVE TELEMETRY
            </span>
          </div>

          {feedbackList && feedbackList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {feedbackList.slice(0, 5).map((fb, idx) => (
                <div key={idx} style={{ padding: '10px 14px', background: 'var(--paper)', borderRadius: '4px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-navy)', marginRight: '8px' }}>
                      {fb.contextTitle || fb.contextId || 'Scheme Match'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>
                      ({fb.reason || 'General evaluation'})
                    </span>
                    {fb.comment && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--ink-navy)', fontStyle: 'italic' }}>
                        "{fb.comment}"
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: fb.sentiment === 'positive' ? 'var(--ledger-green)' : 'var(--seal-vermillion)' }}>
                      {fb.sentiment === 'positive' ? '👍 Helpful' : '👎 Reported Issue'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                      {fb.timestamp ? new Date(fb.timestamp).toLocaleTimeString() : 'Recent'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'var(--paper)', borderRadius: '4px', border: '1px dashed var(--border)', fontSize: '0.82rem', color: 'var(--slate)' }}>
              No incoming citizen feedback recorded yet in this session. Submit reviews on recommendation cards or scheme details to view them here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
