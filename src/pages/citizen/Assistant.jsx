import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GeminiAPI } from '../../api/geminiApi';
import { Send, Bot, Sparkles, User, HelpCircle, ShieldAlert, Languages, MessageSquare } from 'lucide-react';
import FeedbackWidget from '../../components/common/FeedbackWidget';

export default function CitizenAssistant() {
  const { profile, evaluations, documents } = useAuth();

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const missingDocs = documents.filter(d => d.status === 'pending');

  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Namaste ${profile?.full_name?.split(' ')[0] || 'Citizen'}! I am Saarthi Assistant. I can explain official scheme rules, help you understand document requirements, and guide you through the application process.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const promptChips = [
    { label: 'Why am I eligible for PM-KISAN?', query: 'Why am I eligible for PM-KISAN based on my profile?' },
    { label: 'Required documents for Ayushman Bharat', query: 'What documents are required for Ayushman Bharat PM-JAY?' },
    { label: 'How to apply for Income Certificate in Gujarat?', query: 'What is the step by step process to get an Income Certificate in Gujarat?' },
    { label: 'Explain in Hindi (हिंदी में समझाइए)', query: 'कृपया मुझे मेरी पात्र योजनाओं के बारे में हिंदी में समझाइए।' },
    { label: 'Explain in Gujarati (ગુજરાતીમાં)', query: 'મને મારી યોગ્ય સરકારી યોજનાઓ વિશે ગુજરાતીમાં સમજાવો.' }
  ];

  const sendMessageWithText = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsgId = 'msg-' + Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    const reply = await GeminiAPI.generateWelfareGuidance(textToSend, profile, eligibleSchemes, missingDocs);
    const aiMsgId = 'msg-ai-' + Date.now();
    setLoading(false);
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: reply }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessageWithText(input);
  };

  return (
    <div>
      <header className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">Ask Saarthi Assistant</h1>
          <p className="page-description">
            Grounded AI welfare guidance. Eligibility decisions are strictly verified by our deterministic rule engine.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={16} color="var(--slate)" />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem' }}
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Gujarati">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </header>

      {/* Authoritative vs Assistive Boundary Banner */}
      <div
        className="card"
        style={{
          background: 'rgba(11, 31, 58, 0.04)',
          borderLeft: '4px solid var(--ink-navy)',
          padding: '10px 16px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <ShieldAlert size={18} color="var(--ink-navy)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--slate)', lineHeight: 1.4 }}>
          <strong>Authoritative Boundary:</strong> Saarthi AI assists with explanations and document queries. All statutory entitlement decisions are calculated deterministically by our Gazette Rule Engine.
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '4px' }}>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessageWithText(chip.query)}
            disabled={loading}
            className="filter-chip"
            style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', background: 'var(--paper)', cursor: 'pointer' }}
          >
            ✦ {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-messages" style={{ minHeight: '380px' }}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.sender}`}>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '6px', opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {m.sender === 'ai' ? <Sparkles size={12} color="var(--brass-gold)" /> : <User size={12} />}
                  {m.sender === 'ai' ? 'Saarthi Welfare Assistant' : 'You'}
                </span>
                {m.sender === 'ai' && (
                  <span style={{ fontSize: '10px', color: 'var(--brass-gold)', fontFamily: 'var(--font-mono)' }}>
                    Assistive Mode
                  </span>
                )}
              </div>

              <div style={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                {m.text}
              </div>

              {m.sender === 'ai' && (
                <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid rgba(11, 31, 58, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
                  <FeedbackWidget
                    contextType="assistant_response"
                    contextId={m.id}
                    contextTitle="Assistant Guidance"
                  />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-message ai" style={{ fontStyle: 'italic', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="var(--brass-gold)" /> Saarthi is synthesizing verified gazette guidance...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            className="form-input"
            placeholder="Ask anything about eligibility criteria, document deadlines, or application procedures..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
