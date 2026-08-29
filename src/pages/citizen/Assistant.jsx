import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GeminiAPI } from '../../api/geminiApi';
import { Send, Bot, Sparkles, User, HelpCircle } from 'lucide-react';

export default function CitizenAssistant() {
  const { profile, evaluations, documents } = useAuth();

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const missingDocs = documents.filter(d => d.status === 'pending');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste ${profile?.full_name?.split(' ')[0] || 'Citizen'}! I am Saarthi Assistant. I can help explain why you qualify for schemes, what documents are required, and how to navigate the application process.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    const reply = await GeminiAPI.generateWelfareGuidance(userText, profile, eligibleSchemes, missingDocs);
    setLoading(false);
    setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Ask Saarthi Assistant</h1>
          <p className="page-description">
            Grounded AI welfare guidance. Eligibility decisions are strictly verified by our deterministic rule engine.
          </p>
        </div>
      </header>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-message ${m.sender}`}>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '4px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {m.sender === 'ai' ? <Sparkles size={12} color="var(--brass-gold)" /> : <User size={12} />}
                {m.sender === 'ai' ? 'Saarthi Welfare Assistant' : 'You'}
              </div>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message ai" style={{ fontStyle: 'italic', color: 'var(--slate)' }}>
              Saarthi is formulating guidance...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            className="form-input"
            placeholder="Ask about PM-KISAN, missing proofs, or eligibility criteria..."
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
