import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { SchemesData } from '../api/schemesData';
import { EligibilityEngine } from '../engine/eligibilityEngine';
import { ApplicationsAPI } from '../api/applicationsApi';
import { DocumentsAPI } from '../api/documentsApi';

const AuthContext = createContext();

const LOCAL_PROFILE_KEY = 'saarthi_welfare_profile';
const LOCAL_HOUSEHOLD_KEY = 'saarthi_welfare_household';

const defaultCitizenProfile = {
  id: 'demo-citizen-01',
  full_name: 'Ramesh Kumar Yadav',
  age: 45,
  gender: 'male',
  income_annual: 180000,
  occupation: 'farmer',
  state: 'Gujarat',
  district: 'Anand',
  area_type: 'rural',
  land_ownership: '2_to_5_acres',
  house_ownership: 'kuccha',
  category: 'obc',
  disability: 'none',
  education: 'secondary',
  bpl_card: false,
  ration_card_type: 'phh',
  bank_account: true
};

const defaultHousehold = [
  { id: 'hm-1', name: 'Sunita Yadav', relation: 'spouse', age: 42, gender: 'female', occupation: 'homemaker', income_annual: 0 },
  { id: 'hm-2', name: 'Amit Yadav', relation: 'child', age: 19, gender: 'male', occupation: 'student', income_annual: 0 }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check if demo or existing session exists
    const saved = localStorage.getItem('saarthi_auth_user');
    return saved ? JSON.parse(saved) : { id: 'demo-citizen-01', email: 'citizen@saarthi.gov.in', full_name: 'Ramesh Kumar Yadav' };
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
    return saved ? JSON.parse(saved) : defaultCitizenProfile;
  });

  const [household, setHousehold] = useState(() => {
    const saved = localStorage.getItem(LOCAL_HOUSEHOLD_KEY);
    return saved ? JSON.parse(saved) : defaultHousehold;
  });

  const [schemes, setSchemes] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Listen to Supabase Auth State
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || 'Citizen'
        };
        setUser(u);
        localStorage.setItem('saarthi_auth_user', JSON.stringify(u));
        loadProfileFromDatabase(session.user.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Load Schemes & evaluate eligibility
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fetchedSchemes = await SchemesData.fetchAllSchemes();
        setSchemes(fetchedSchemes);

        const evalResults = EligibilityEngine.evaluateEligibility(profile, household, fetchedSchemes);
        setEvaluations(evalResults);

        // Load applications & documents
        const userApps = await ApplicationsAPI.fetchUserApplications(profile?.id || 'demo-citizen-01');
        setApplications(userApps);

        const userDocs = await DocumentsAPI.fetchUserDocuments(profile?.id || 'demo-citizen-01');
        setDocuments(userDocs);
      } catch (err) {
        console.error('Failed to load initial welfare data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile.id]);

  // Load from Supabase DB on user sign-in
  const loadProfileFromDatabase = async (userId) => {
    try {
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (pData) {
        setProfile(pData);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(pData));
      }
      const { data: hData } = await supabase.from('household_members').select('*').eq('profile_id', userId);
      if (hData && hData.length > 0) {
        setHousehold(hData);
        localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(hData));
      }
    } catch {
      // ignore
    }
  };

  // Sign in with email / password or demo
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const u = { id: data.user.id, email: data.user.email, full_name: data.user.user_metadata?.full_name || 'Citizen' };
        setUser(u);
        localStorage.setItem('saarthi_auth_user', JSON.stringify(u));
        await loadProfileFromDatabase(data.user.id);
        return { success: true };
      }
    } catch {
      // ignore
    }

    // Demo fallback for instant access
    const demoUser = { id: 'demo-citizen-01', email, full_name: profile.full_name || 'Ramesh Kumar Yadav' };
    setUser(demoUser);
    localStorage.setItem('saarthi_auth_user', JSON.stringify(demoUser));
    return { success: true };
  };

  // Sign up with Supabase
  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (!error && data?.user) {
        const u = { id: data.user.id, email: data.user.email, full_name: fullName };
        setUser(u);
        localStorage.setItem('saarthi_auth_user', JSON.stringify(u));

        // Create profile in Supabase profiles
        const newProf = { ...profile, id: data.user.id, full_name: fullName };
        setProfile(newProf);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProf));
        await supabase.from('profiles').insert(newProf);

        return { success: true };
      }
      if (error) return { success: false, error: error.message };
    } catch (err) {
      return { success: false, error: err.message };
    }

    return { success: true };
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('saarthi_auth_user');
  };

  // Update profile and sync to Supabase + instant evaluation
  const updateProfile = async (updates) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));

    // Instant in-memory re-evaluation!
    const evalResults = EligibilityEngine.evaluateEligibility(next, household, schemes);
    setEvaluations(evalResults);

    // Sync to Supabase profiles table
    if (user?.id && user.id !== 'demo-citizen-01') {
      try {
        await supabase.from('profiles').upsert({ id: user.id, ...next, updated_at: new Date().toISOString() });
      } catch (err) {
        console.warn('Profile DB upsert sync failed:', err);
      }
    }
  };

  // Add household member & sync
  const addHouseholdMember = async (member) => {
    const newMember = { id: 'hm-' + Date.now(), profile_id: user?.id, ...member };
    const next = [...household, newMember];
    setHousehold(next);
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(next));

    const evalResults = EligibilityEngine.evaluateEligibility(profile, next, schemes);
    setEvaluations(evalResults);

    if (user?.id && user.id !== 'demo-citizen-01') {
      try {
        await supabase.from('household_members').insert(newMember);
      } catch {
        // ignore
      }
    }
  };

  // Remove household member & sync
  const removeHouseholdMember = async (id) => {
    const next = household.filter(m => m.id !== id);
    setHousehold(next);
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(next));

    const evalResults = EligibilityEngine.evaluateEligibility(profile, next, schemes);
    setEvaluations(evalResults);

    if (user?.id && user.id !== 'demo-citizen-01') {
      try {
        await supabase.from('household_members').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  };

  // Create real application
  const applyForScheme = async (schemeId, schemeName, notes = '') => {
    const newApp = await ApplicationsAPI.createApplication(user?.id || profile.id, schemeId, schemeName, notes);
    setApplications(prev => [newApp, ...prev.filter(a => a.schemeId !== schemeId)]);
    return newApp;
  };

  // Upload document
  const uploadDocument = async (fileObj) => {
    const newDoc = await DocumentsAPI.uploadDocument(user?.id || profile.id, fileObj);
    setDocuments(prev => [newDoc, ...prev.filter(d => d.name !== newDoc.name)]);
    return newDoc;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      household,
      schemes,
      evaluations,
      applications,
      documents,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      addHouseholdMember,
      removeHouseholdMember,
      applyForScheme,
      uploadDocument
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
