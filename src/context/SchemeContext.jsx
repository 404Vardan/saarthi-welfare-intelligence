import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchemesData } from '../api/schemesData';

const SchemeContext = createContext();

export function SchemeProvider({ children }) {
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGovLevel, setSelectedGovLevel] = useState('');
  const [savedSchemeIds, setSavedSchemeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      try {
        const data = await SchemesData.fetchAllSchemes();
        setSchemes(data);
      } catch (err) {
        console.error('Failed to load schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  const toggleSaveScheme = (id) => {
    setSavedSchemeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSchemes = schemes.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      s.name?.toLowerCase().includes(q) ||
      s.official_name?.toLowerCase().includes(q) ||
      s.short_name?.toLowerCase().includes(q) ||
      s.scheme_code?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      (s.beneficiary_tags && s.beneficiary_tags.some(t => t.toLowerCase().includes(q)));

    const matchesType = !selectedType || s.type === selectedType || s.scheme_type === selectedType;
    const matchesGov = !selectedGovLevel || s.gov_level === selectedGovLevel;

    return matchesSearch && matchesType && matchesGov;
  });

  return (
    <SchemeContext.Provider value={{
      schemes,
      filteredSchemes,
      searchQuery,
      setSearchQuery,
      selectedType,
      setSelectedType,
      selectedGovLevel,
      setSelectedGovLevel,
      savedSchemeIds,
      toggleSaveScheme,
      loading
    }}>
      {children}
    </SchemeContext.Provider>
  );
}

export function useSchemes() {
  return useContext(SchemeContext);
}
