import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ style = {} }) {
  const { currentLang, setLanguage, supportedLanguages } = useLanguage();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', ...style }}>
      <Globe size={14} color="var(--brass-gold)" />
      <select
        value={currentLang}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select Language"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 600,
          padding: '3px 8px',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ background: '#1B2A4A', color: '#FFFFFF' }}>
            {lang.native} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
}
