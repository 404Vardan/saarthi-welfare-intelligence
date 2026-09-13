import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';
import { SchemesData } from '../api/schemesData';
import { EligibilityEngine } from '../engine/eligibilityEngine';
import { ApplicationsAPI } from '../api/applicationsApi';
import { DocumentsAPI } from '../api/documentsApi';

const AuthContext = createContext();

const LOCAL_PROFILE_KEY = 'saarthi_welfare_profile';
const LOCAL_HOUSEHOLD_KEY = 'saarthi_welfare_household';

export function AuthProvider({ children }) {
  // ── Core Auth State ──
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'citizen' | 'government' | 'admin'
  const [loading, setLoading] = useState(true); // starts true until session is checked

  // ── Citizen Welfare State ──
  const [profile, setProfile] = useState(null);
  const [household, setHousehold] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);

  // ── Fetch user role from user_roles table ──
  const loadUserRole = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        // User may have multiple roles; use highest privilege
        const roles = data.map(r => r.role);
        if (roles.includes('admin')) return 'admin';
        if (roles.includes('government')) return 'government';
        return 'citizen';
      }
    } catch (err) {
      console.error('[Saarthi] Failed to load user role:', err.message);
    }
    return 'citizen'; // default role
  }, []);

  // ── Load profile from Supabase DB ──
  const loadProfileFromDatabase = useCallback(async (userId) => {
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
    } catch (err) {
      console.error('[Saarthi] Failed to load profile from database:', err.message);
    }
  }, []);

  // ── 1. Listen to Supabase Auth State ──
  useEffect(() => {
    // Check existing session on mount
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'Citizen'
          };
          setUser(u);
          const userRole = await loadUserRole(session.user.id);
          setRole(userRole);
          await loadProfileFromDatabase(session.user.id);
        }
      } catch (err) {
        console.error('[Saarthi] Session init error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || 'Citizen'
        };
        setUser(u);
        const userRole = await loadUserRole(session.user.id);
        setRole(userRole);
        await loadProfileFromDatabase(session.user.id);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setProfile(null);
        setHousehold([]);
        setEvaluations([]);
        setApplications([]);
        setDocuments([]);
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [loadUserRole, loadProfileFromDatabase]);

  // ── 2. Load Schemes & evaluate eligibility when profile changes ──
  useEffect(() => {
    if (!profile?.id) return;

    async function loadData() {
      try {
        const fetchedSchemes = await SchemesData.fetchAllSchemes();
        setSchemes(fetchedSchemes);

        const evalResults = EligibilityEngine.evaluateEligibility(profile, household, fetchedSchemes);
        setEvaluations(evalResults);

        const userApps = await ApplicationsAPI.fetchUserApplications(profile.id);
        setApplications(userApps);

        const userDocs = await DocumentsAPI.fetchUserDocuments(profile.id);
        setDocuments(userDocs);
      } catch (err) {
        console.error('[Saarthi] Failed to load welfare data:', err.message);
      }
    }
    loadData();
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sign In with email / password ──
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        const u = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || 'Citizen'
        };
        setUser(u);
        const userRole = await loadUserRole(data.user.id);
        setRole(userRole);
        await loadProfileFromDatabase(data.user.id);
        return { success: true, role: userRole };
      }
      return { success: false, error: 'Authentication failed. Please check your credentials.' };
    } catch (err) {
      console.error('[Saarthi] Sign in error:', err.message);
      return { success: false, error: 'Unable to connect to authentication service. Please try again.' };
    }
  };

  // ── Sign Up with Supabase ──
  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        const u = { id: data.user.id, email: data.user.email, full_name: fullName };
        setUser(u);
        setRole('citizen'); // New signups are always citizens

        // Create profile in Supabase profiles
        const newProf = { id: data.user.id, full_name: fullName };
        setProfile(newProf);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProf));

        try {
          await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName });
        } catch (profileErr) {
          console.error('[Saarthi] Profile creation failed:', profileErr.message);
        }

        return { success: true };
      }
      return { success: false, error: 'Account creation failed. Please try again.' };
    } catch (err) {
      console.error('[Saarthi] Sign up error:', err.message);
      return { success: false, error: err.message };
    }
  };

  // ── Forgot Password ──
  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/citizen/login`
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      console.error('[Saarthi] Password reset error:', err.message);
      return { success: false, error: 'Unable to send reset email. Please try again.' };
    }
  };

  // ── Sign Out — clears everything ──
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Saarthi] Sign out error:', err.message);
    }

    // Clear all Saarthi localStorage keys
    Object.keys(localStorage)
      .filter(k => k.startsWith('saarthi_'))
      .forEach(k => localStorage.removeItem(k));

    setUser(null);
    setRole(null);
    setProfile(null);
    setHousehold([]);
    setSchemes([]);
    setEvaluations([]);
    setApplications([]);
    setDocuments([]);
  };

  // ── Update profile and sync to Supabase + instant evaluation ──
  const updateProfile = async (updates) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));

    // Instant in-memory re-evaluation
    const evalResults = EligibilityEngine.evaluateEligibility(next, household, schemes);
    setEvaluations(evalResults);

    // Sync to Supabase profiles table
    if (user?.id) {
      try {
        await supabase.from('profiles').upsert({ id: user.id, ...next, updated_at: new Date().toISOString() });
      } catch (err) {
        console.error('[Saarthi] Profile sync failed:', err.message);
      }
    }
  };

  // ── Add household member & sync ──
  const addHouseholdMember = async (member) => {
    const newMember = { id: 'hm-' + Date.now(), profile_id: user?.id, ...member };
    const next = [...household, newMember];
    setHousehold(next);
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(next));

    const evalResults = EligibilityEngine.evaluateEligibility(profile, next, schemes);
    setEvaluations(evalResults);

    if (user?.id) {
      try {
        await supabase.from('household_members').insert(newMember);
      } catch (err) {
        console.error('[Saarthi] Household member sync failed:', err.message);
      }
    }
  };

  // ── Remove household member & sync ──
  const removeHouseholdMember = async (id) => {
    const next = household.filter(m => m.id !== id);
    setHousehold(next);
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(next));

    const evalResults = EligibilityEngine.evaluateEligibility(profile, next, schemes);
    setEvaluations(evalResults);

    if (user?.id) {
      try {
        await supabase.from('household_members').delete().eq('id', id);
      } catch (err) {
        console.error('[Saarthi] Household member delete failed:', err.message);
      }
    }
  };

  // ── Create real application ──
  const applyForScheme = async (schemeId, schemeName, notes = '') => {
    const profileId = user?.id || profile?.id;
    if (!profileId) {
      throw new Error('User must be signed in to apply for schemes.');
    }
    const newApp = await ApplicationsAPI.createApplication(profileId, schemeId, schemeName, notes);
    setApplications(prev => [newApp, ...prev.filter(a => a.schemeId !== schemeId)]);
    return newApp;
  };

  // ── Upload document ──
  const uploadDocument = async (fileObj, metadata = {}) => {
    const profileId = user?.id || profile?.id || 'demo-citizen-01';
    const newDoc = await DocumentsAPI.uploadDocument(profileId, fileObj, metadata);
    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
    return newDoc;
  };

  // ── Feedback Management ──
  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = localStorage.getItem('saarthi_citizen_feedback');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const submitFeedback = async (feedbackData) => {
    const record = {
      id: 'fb-' + Date.now(),
      userId: user?.id || 'anonymous_citizen',
      ...feedbackData
    };
    const updated = [record, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('saarthi_citizen_feedback', JSON.stringify(updated));

    // Try Supabase insert
    if (user?.id) {
      try {
        await supabase.from('feedbacks').insert({
          user_id: user.id,
          context_type: feedbackData.contextType,
          context_id: feedbackData.contextId,
          context_title: feedbackData.contextTitle,
          sentiment: feedbackData.sentiment,
          reason: feedbackData.reason,
          comment: feedbackData.comment
        });
      } catch (err) {
        console.warn('Feedback supabase sync offline:', err.message);
      }
    }
    return record;
  };

  // ── Explicit Eligibility Evaluation Trigger ──
  const runEligibilityEvaluation = (customProfile = null) => {
    const prof = customProfile || profile;
    if (prof) {
      const evalResults = EligibilityEngine.evaluateEligibility(prof, household, schemes);
      setEvaluations(evalResults);
      return evalResults;
    }
    return [];
  };

  // ── Role checking helpers ──
  const isCitizen = role === 'citizen';
  const isGovernment = role === 'government';
  const isAdmin = role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      // Auth
      user,
      role,
      loading,
      isAuthenticated,
      isCitizen,
      isGovernment,
      isAdmin,
      signIn,
      signUp,
      signOut,
      forgotPassword,
      // Citizen welfare data
      profile,
      household,
      schemes,
      evaluations,
      applications,
      documents,
      feedbackList,
      updateProfile,
      addHouseholdMember,
      removeHouseholdMember,
      applyForScheme,
      uploadDocument,
      submitFeedback,
      runEligibilityEvaluation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
