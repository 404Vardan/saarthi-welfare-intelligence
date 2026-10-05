import React, { useState } from 'react';
import { ThumbsUp, HelpCircle, ThumbsDown, CheckCircle2, X, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FeedbackWidget({ contextType = 'scheme', contextId, contextTitle }) {
  const { submitFeedback } = useAuth();
  const { t } = useLanguage();

  // Step 1: Usefulness ('yes' | 'somewhat' | 'no')
  const [usefulness, setUsefulness] = useState(null);
  // Step 2: Prior Awareness ('yes' | 'no')
  const [priorAwareness, setPriorAwareness] = useState(null);
  // Step 3: Improvement Area (optional)
  const [improvementArea, setImprovementArea] = useState('');
  const [customComment, setCustomComment] = useState('');

  const [activeStep, setActiveStep] = useState(1); // 1: Usefulness -> 2: Prior Awareness -> 3: Improvements
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const improvementOptions = [
    { id: 'eligibility', label: t('feedbackEligibility') || 'Eligibility information' },
    { id: 'benefits', label: t('feedbackBenefits') || 'Benefits information' },
    { id: 'documents', label: t('feedbackDocuments') || 'Required documents' },
    { id: 'process', label: t('feedbackProcess') || 'Application process' },
    { id: 'official_link', label: t('feedbackOfficialLink') || 'Official website' },
    { id: 'other', label: t('feedbackOther') || 'Other' }
  ];

  const handleUsefulnessSelect = (value) => {
    setUsefulness(value);
    setActiveStep(2);
    setShowModal(true);
  };

  const handleAwarenessSelect = (value) => {
    setPriorAwareness(value);
    setActiveStep(3);
  };

  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();

    if (submitFeedback) {
      submitFeedback({
        contextType,
        contextId,
        contextTitle,
        usefulness: usefulness || 'unspecified',
        priorAwareness: priorAwareness || 'unspecified',
        improvementArea: improvementArea || 'none',
        comment: customComment,
        sentiment: usefulness === 'yes' ? 'positive' : usefulness === 'no' ? 'negative' : 'neutral',
        reason: improvementArea || (usefulness === 'yes' ? 'helpful' : 'pilot_feedback'),
        timestamp: new Date().toISOString()
      });
    }

    setShowModal(false);
    setSubmitted(true);
  };

  return (
    <div className="feedback-widget" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--slate)' }}>
      {submitted ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ledger-green)', fontWeight: 600 }}>
          <CheckCircle2 size={15} /> {t('feedbackSuccess') || 'Thank you for your feedback!'}
        </span>
      ) : (
        <>
          <span style={{ fontWeight: 600, color: 'var(--ink-navy)' }}>
            {t('feedbackUsefulQuestion') || 'Was this useful?'}
          </span>

          {/* Option: Yes */}
          <button
            type="button"
            onClick={() => handleUsefulnessSelect('yes')}
            className="btn-icon-subtle"
            title={t('feedbackYes') || 'Yes'}
            style={{
              background: usefulness === 'yes' ? 'rgba(46, 125, 50, 0.12)' : 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: usefulness === 'yes' ? 'var(--ledger-green)' : 'var(--ink-navy)',
              fontWeight: 600
            }}
          >
            <ThumbsUp size={12} /> {t('feedbackYes') || 'Yes'}
          </button>

          {/* Option: Somewhat */}
          <button
            type="button"
            onClick={() => handleUsefulnessSelect('somewhat')}
            className="btn-icon-subtle"
            title={t('feedbackSomewhat') || 'Somewhat'}
            style={{
              background: usefulness === 'somewhat' ? 'rgba(197, 160, 89, 0.15)' : 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: usefulness === 'somewhat' ? 'var(--brass-gold)' : 'var(--ink-navy)',
              fontWeight: 600
            }}
          >
            <HelpCircle size={12} /> {t('feedbackSomewhat') || 'Somewhat'}
          </button>

          {/* Option: No */}
          <button
            type="button"
            onClick={() => handleUsefulnessSelect('no')}
            className="btn-icon-subtle"
            title={t('feedbackNo') || 'No'}
            style={{
              background: usefulness === 'no' ? 'rgba(184, 51, 42, 0.1)' : 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: usefulness === 'no' ? 'var(--seal-vermillion)' : 'var(--slate)',
              fontWeight: 600
            }}
          >
            <ThumbsDown size={12} /> {t('feedbackNo') || 'No'}
          </button>
        </>
      )}

      {/* Lightweight 2-Step Campus Feedback Modal */}
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
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '1.5rem', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <button
              onClick={() => {
                setShowModal(false);
                // If user dismissed after giving usefulness rating, save initial rating
                if (usefulness) handleFinalSubmit();
              }}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
              title="Close"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MessageSquareHeart size={18} color="var(--brass-gold)" />
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0, fontSize: '1.15rem' }}>
                {t('feedbackTitle') || 'Campus Pilot Feedback'}
              </h3>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--slate)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              Scheme: <strong>{contextTitle || 'Welfare Scheme'}</strong>
            </div>

            {/* STEP 2: Did you already know about this scheme? */}
            {activeStep === 2 && (
              <div>
                <p style={{ color: 'var(--ink-navy)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {t('feedbackPriorAwarenessQuestion') || 'Did you already know about this scheme?'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAwarenessSelect('yes')}
                    className="btn btn-secondary"
                    style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    ✓ {t('feedbackAlreadyKnew') || 'Yes, already knew'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAwarenessSelect('no')}
                    className="btn btn-primary"
                    style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    ✨ {t('feedbackNewToMe') || 'No, new to me'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Optional Improvement Area */}
            {activeStep === 3 && (
              <form onSubmit={handleFinalSubmit}>
                <p style={{ color: 'var(--ink-navy)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>
                  {t('feedbackImproveQuestion') || 'What could be improved?'} <span style={{ fontWeight: 400, color: 'var(--slate)', fontSize: '0.8rem' }}>(Optional)</span>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                  {improvementOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setImprovementArea(opt.id === improvementArea ? '' : opt.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: improvementArea === opt.id ? '1.5px solid var(--ink-navy)' : '1px solid var(--border)',
                        background: improvementArea === opt.id ? 'rgba(27, 42, 74, 0.08)' : 'var(--paper)',
                        color: 'var(--ink-navy)',
                        fontSize: '0.78rem',
                        fontWeight: improvementArea === opt.id ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <textarea
                    className="form-input"
                    placeholder="Short comments or suggestions (optional)..."
                    value={customComment}
                    onChange={e => setCustomComment(e.target.value)}
                    style={{ minHeight: '55px', fontSize: '0.82rem', padding: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontSize: '0.8rem', textDecoration: 'underline' }}
                  >
                    Skip & Submit
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ padding: '6px 16px' }}
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
