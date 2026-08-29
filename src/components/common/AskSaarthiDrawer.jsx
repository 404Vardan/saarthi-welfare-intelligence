import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GeminiAPI } from '../../api/geminiApi';

export default function AskSaarthiDrawer() {
  const navigate = useNavigate();
  const { profile, evaluations, documents } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Namaste ${profile?.full_name?.split(' ')[0] || 'Citizen'}! I am Saarthi, your welfare intelligence assistant. What entitlement questions can I help you resolve today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const missingDocs = documents.filter(d => d.status === 'pending');

  const quickQuestions = [
    { label: `Why do I qualify for ${eligibleSchemes.length} schemes?`, text: 'Why do I qualify for my matched schemes?' },
    { label: 'What document is missing in my locker?', text: 'Which documents are currently missing for my top schemes?' },
    { label: 'How does PM-KISAN installment work?', text: 'Explain the PM-KISAN installment schedule and criteria.' },
  ];

  const handleSendQuestion = async (text) => {
    const userQ = text || input;
    if (!userQ.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: userQ }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    const reply = await GeminiAPI.generateWelfareGuidance(userQ, profile, eligibleSchemes, missingDocs);
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--ink-navy)',
          color: 'var(--paper)',
          border: '2px solid var(--brass-gold)',
          borderRadius: '30px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 8px 24px rgba(11, 31, 58, 0.25)',
          cursor: 'pointer',
          zIndex: 1500,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Sparkles size={16} color="var(--brass-gold)" />
        <span>Ask Saarthi</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '380px',
            maxHeight: '520px',
            height: '80vh',
            background: '#FFFDF9',
            border: '2px solid var(--ink-navy)',
            borderRadius: '8px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1600,
            overflow: 'hidden'
          }}
        >
          {/* Drawer Header */}
          <div style={{ background: 'var(--ink-navy)', color: 'white', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-seal-mark" style={{ width: '22px', height: '22px', fontSize: '11px' }}>S</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ask Saarthi</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>Grounded AI Welfare Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  background: m.sender === 'user' ? 'var(--ink-navy)' : 'var(--paper)',
                  color: m.sender === 'user' ? 'white' : 'var(--ink-navy)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border)'
                }}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--paper)', color: 'var(--slate)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Saarthi is formulating guidance...
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div style={{ padding: '8px 12px', background: 'var(--paper)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--slate)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              Suggested Inquiries:
            </div>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(q.text)}
                style={{
                  background: '#FFFDF9',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  color: 'var(--ink-navy)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{q.label}</span>
                <ChevronRight size={12} color="var(--slate)" />
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', background: '#FFFDF9' }}>
            <input
              type="text"
              placeholder="Ask about schemes, criteria, rules..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendQuestion()}
              style={{
                flex: 1,
                padding: '8px 10px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}
            />
            <button
              onClick={() => handleSendQuestion()}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 12px' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
