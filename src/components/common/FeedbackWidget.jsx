import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function FeedbackWidget({ contextType = 'scheme', contextId, contextTitle }) {
  const { submitFeedback } = useAuth();
  const [voted, setVoted] = useState(null); // 'positive' | 'negative'
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customComment, setCustomComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const feedbackReasons = [
    { id: 'wrong_eligibility', label: 'Eligibility result seems incorrect' },
    { id: 'not_relevant', label: 'Scheme is not relevant to my situation' },
    { id: 'outdated_info', label: 'Benefit or criteria information seems outdated' },
    { id: 'missing_scheme', label: 'Expected scheme was missing or not suggested' },
    { id: 'doc_confusion', label: 'Document requirements are confusing or inaccurate' },
    { id: 'technical_issue', label: 'Encountered a technical issue / broken link' },
    { id: 'other', label: 'Other feedback' }
  ];

  const handlePositive = () => {
    setVoted('positive');
    setSubmitted(true);
    if (submitFeedback) {
      submitFeedback({
        contextType,
        contextId,
        contextTitle,
        sentiment: 'positive',
        reason: 'helpful',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleNegativeClick = () => {
    setVoted('negative');
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (submitFeedback) {
      submitFeedback({
        contextType,
        contextId,
        contextTitle,
        sentiment: 'negative',
        reason: selectedReason || 'unspecified_issue',
        comment: customComment,
        timestamp: new Date().toISOString()
      });
    }
    setShowModal(false);
    setSubmitted(true);
  };

  return (
    <div className="feedback-widget" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--slate)' }}>
      {submitted ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ledger-green)', fontWeight: 600 }}>
          <CheckCircle2 size={14} /> Thank you for your feedback!
        </span>
      ) : (
        <>
          <span>Was this helpful?</span>
          <button
            type="button"
            onClick={handlePositive}
            className={`btn-icon-subtle ${voted === 'positive' ? 'active' : ''}`}
            title="Yes, accurate and helpful"
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: voted === 'positive' ? 'var(--ledger-green)' : 'var(--slate)'
            }}
          >
            <ThumbsUp size={13} /> Yes
          </button>

          <button
            type="button"
            onClick={handleNegativeClick}
            className={`btn-icon-subtle ${voted === 'negative' ? 'active' : ''}`}
            title="No, needs improvement"
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: voted === 'negative' ? 'var(--seal-vermillion)' : 'var(--slate)'
            }}
          >
            <ThumbsDown size={13} /> No
          </button>
        </>
      )}

      {/* Negative Feedback Reason Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 6px 0', fontSize: '1.2rem' }}>
              Help Us Improve Saarthi
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              What went wrong with this recommendation for <strong>{contextTitle || 'this scheme'}</strong>?
            </p>

            <form onSubmit={handleModalSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                {feedbackReasons.map(r => (
                  <label
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: selectedReason === r.id ? 'rgba(184, 51, 42, 0.06)' : 'var(--paper)',
                      border: `1px solid ${selectedReason === r.id ? 'var(--seal-vermillion)' : 'var(--border)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--ink-navy)'
                    }}
                  >
                    <input
                      type="radio"
                      name="feedback_reason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Additional Details (Optional)</label>
                <textarea
                  className="form-input"
                  placeholder="Tell us what information was incorrect or what you expected..."
                  value={customComment}
                  onChange={e => setCustomComment(e.target.value)}
                  style={{ minHeight: '65px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className="btn btn-primary btn-sm"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
