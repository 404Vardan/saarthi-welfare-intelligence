import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ArrowRight, ShieldCheck, UserCheck, Bot, PlusCircle, Scale, BarChart3, X } from 'lucide-react';
import { useSchemes } from '../../context/SchemeContext';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { schemes } = useSchemes();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Explore All Schemes', path: '/citizen/explorer', category: 'Citizen', icon: Search },
    { label: 'Update Welfare Passport', path: '/citizen/profile', category: 'Citizen', icon: UserCheck },
    { label: 'Upload Official Proofs', path: '/citizen/documents', category: 'Citizen', icon: FileText },
    { label: 'View Personalized Action Plan', path: '/citizen/action-plan', category: 'Citizen', icon: ArrowRight },
    { label: 'Track My Applications', path: '/citizen/applications', category: 'Citizen', icon: ShieldCheck },
    { label: 'Ask Saarthi Assistant', path: '/citizen/assistant', category: 'Assist', icon: Bot },
    { label: 'Government Command Center', path: '/government/dashboard', category: 'Government', icon: BarChart3 },
    { label: 'Open Policy Simulation Lab', path: '/government/policy-lab', category: 'Government', icon: Scale },
    { label: 'Ingest New Scheme to Registry', path: '/operations/add-scheme', category: 'Operations', icon: PlusCircle },
  ];

  const filteredSchemes = schemes.filter(s =>
    !query ||
    s.name?.toLowerCase().includes(query.toLowerCase()) ||
    s.short_name?.toLowerCase().includes(query.toLowerCase()) ||
    s.scheme_code?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredActions = quickActions.filter(a =>
    !query || a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    onClose(false);
    navigate(path);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(11, 31, 58, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '12vh',
      zIndex: 2000
    }} onClick={() => onClose(false)}>
      <div
        className="card"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          background: '#FFFDF8',
          border: '2px solid var(--ink-navy)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', gap: '12px' }}>
          <Search size={20} color="var(--brass-gold)" />
          <input
            type="text"
            placeholder="Type a scheme name, action, or command (e.g. PM-KISAN, Upload, Policy Lab)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--ink-navy)'
            }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'var(--paper)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--slate)' }}>
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {/* Matched Schemes */}
          {filteredSchemes.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700, padding: '4px 8px' }}>
                Schemes & Catalogues
              </div>
              {filteredSchemes.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleSelect(`/citizen/scheme/${s.id}`)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>
                      {s.name || s.official_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--slate)' }}>
                      {s.scheme_code} · {s.type || s.scheme_type}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--seal-vermillion)', fontWeight: 600 }}>
                    View Scheme Hub →
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)', textTransform: 'uppercase', fontWeight: 700, padding: '4px 8px' }}>
                Quick Actions & Navigation
              </div>
              {filteredActions.map((a, idx) => {
                const Icon = a.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(a.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={16} color="var(--seal-vermillion)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink-navy)', flex: 1 }}>
                      {a.label}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--slate)', textTransform: 'uppercase' }}>
                      {a.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
