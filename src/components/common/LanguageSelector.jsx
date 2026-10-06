import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ theme = 'light', style = {} }) {
  const { currentLang, setLanguage, supportedLanguages } = useLanguage();

  const isDark = theme === 'dark' || theme === 'navy';

  const selectStyle = isDark ? {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '4px 8px',
    cursor: 'pointer',
    outline: 'none'
  } : {
    background: '#FFFFFF',
    border: '1px solid var(--border, #CBD5E1)',
    borderRadius: '6px',
    color: 'var(--ink-navy, #0B1F3A)',
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '4px 8px',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  };

  const optionStyle = isDark ? {
    background: '#1B2A4A',
    color: '#FFFFFF'
  } : {
    background: '#FFFFFF',
    color: '#0B1F3A'
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', ...style }}>
      <Globe size={14} color={isDark ? 'var(--brass-gold, #D4AF37)' : 'var(--seal-vermillion, #C84B31)'} />
      <select
        value={currentLang}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select Language"
        style={selectStyle}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code} style={optionStyle}>
            {lang.native} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
}
