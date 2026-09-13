import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    dashboard: 'Dashboard',
    welfarePassport: 'Welfare Passport',
    household: 'Household',
    documentVault: 'Document Vault',
    benefitsWallet: 'Benefits Wallet',
    schemesCatalogue: 'Schemes Catalogue',
    aiRecommendations: 'Smart Recommendations',
    compareSchemes: 'Compare Schemes',
    applyProcess: 'Application Hub',
    trackStatus: 'Track Status',
    notifications: 'Notifications',
    askSaarthi: 'Ask Saarthi AI',
    searchOrJump: 'Search or Jump...',
    language: 'Language',
    signOut: 'Sign Out',
    eligible: 'Eligible',
    nearlyEligible: 'Near-Miss Advisory',
    missingInfo: 'Missing Info',
    ineligible: 'Ineligible',
    viewDossier: 'Official Dossier',
    downloadCertificate: 'Download Passport Dossier',
    verified: 'Verified',
    actionRequired: 'Action Required',
    decisionReference: 'Decision Reference ID',
    annualIncome: 'Annual Income',
    statutoryBenefit: 'Statutory Benefit'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    welfarePassport: 'कल्याण पासपोर्ट',
    household: 'परिवार सदस्य',
    documentVault: 'दस्तावेज़ लॉकर',
    benefitsWallet: 'लाभ वॉलेट',
    schemesCatalogue: 'योजना कैटलॉग',
    aiRecommendations: 'पात्र योजनाएं',
    compareSchemes: 'योजना तुलना',
    applyProcess: 'आवेदन प्रक्रिया',
    trackStatus: 'आवेदन स्थिति',
    notifications: 'सूचनाएं',
    askSaarthi: 'सारथी AI से पूछें',
    searchOrJump: 'खोजें या नेविगेट करें...',
    language: 'भाषा',
    signOut: 'लॉग आउट',
    eligible: 'पात्र',
    nearlyEligible: 'निकटतम पात्रता',
    missingInfo: 'अपूर्ण जानकारी',
    ineligible: 'अपात्र',
    viewDossier: 'आधिकारिक डोजियर',
    downloadCertificate: 'पासपोर्ट डोजियर डाउनलोड करें',
    verified: 'सत्यापित',
    actionRequired: 'कार्रवाई आवश्यक',
    decisionReference: 'निर्णय संदर्भ संख्या',
    annualIncome: 'वार्षिक आय',
    statutoryBenefit: 'कानूनी लाभ'
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    welfarePassport: 'કલ્યાણ પાસપોર્ટ',
    household: 'કુટુંબ સભ્યો',
    documentVault: 'દસ્તાવેજ લોકર',
    benefitsWallet: 'લાભ વોલેટ',
    schemesCatalogue: 'યોજના સૂચિ',
    aiRecommendations: 'લાયક યોજનાઓ',
    compareSchemes: 'યોજના સરખામણી',
    applyProcess: 'અરજી પ્રક્રિયા',
    trackStatus: 'અરજી સ્થિતિ',
    notifications: 'સૂચનાઓ',
    askSaarthi: 'સારથી AI ને પૂછો',
    searchOrJump: 'શોધો અથવા જાઓ...',
    language: 'ભાષા',
    signOut: 'લૉગ આઉટ',
    eligible: 'લાયક',
    nearlyEligible: 'નજીવી અપૂર્ણતા',
    missingInfo: 'અધૂરી માહિતી',
    ineligible: 'અલાયક',
    viewDossier: 'સત્તાવાર ડોઝિયર',
    downloadCertificate: 'પાસપોર્ટ ડોઝિયર ડાઉનલોડ કરો',
    verified: 'ચકાસાયેલ',
    actionRequired: 'કાર્યવાહી જરૂરી',
    decisionReference: 'નિર્ણય સંદર્ભ ક્રમાંક',
    annualIncome: 'વાર્ષિક આવક',
    statutoryBenefit: 'કાયદાકીય સહાય'
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    welfarePassport: 'कल्याण पासपोर्ट',
    household: 'कुटुंब सदस्य',
    documentVault: 'कागदपत्र लॉकर',
    benefitsWallet: 'लाभ पाकीट',
    schemesCatalogue: 'योजना यादी',
    aiRecommendations: 'पात्र योजना',
    compareSchemes: 'योजना तुलना',
    applyProcess: 'अर्ज प्रक्रिया',
    trackStatus: 'अर्ज स्थिती',
    notifications: 'सूचना',
    askSaarthi: 'सारथी AI ला विचारा',
    searchOrJump: 'शोधा किंवा जा...',
    language: 'भाषा',
    signOut: 'बाहेर पडा',
    eligible: 'पात्र',
    nearlyEligible: 'जवळपास पात्र',
    missingInfo: 'अपूर्ण माहिती',
    ineligible: 'अपात्र',
    viewDossier: 'अधिकृत डॉसियर',
    downloadCertificate: 'पासपोर्ट डॉसियर डाउनलोड करा',
    verified: 'पडताळणी पूर्ण',
    actionRequired: 'कृती आवश्यक',
    decisionReference: 'निर्णय संदर्भ क्रमांक',
    annualIncome: 'वार्षिक उत्पन्न',
    statutoryBenefit: 'वैधानिक लाभ'
  }
};

export const supportedLanguages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' }
];

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('saarthi_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('saarthi_language', currentLang);
  }, [currentLang]);

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (code) => {
    if (translations[code]) {
      setCurrentLang(code);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage: changeLanguage, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLang: 'en',
      setLanguage: () => {},
      t: (key) => translations.en[key] || key,
      supportedLanguages
    };
  }
  return context;
}
