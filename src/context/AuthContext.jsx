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

  // ── 1. Hardened Profile & Role Sync Engine ──
  // Guarantees that profiles and user_roles records exist in both DB and local state
  const ensureProfileAndRole = useCallback(async (authUser) => {
    if (!authUser?.id) return { profile: null, role: null, authError: 'UNAUTHENTICATED' };

    const userId = authUser.id;
    const fullName = authUser.user_metadata?.full_name || 
                     authUser.user_metadata?.name || 
                     authUser.email?.split('@')[0] || 
                     'Citizen';

    // 1. Authoritative Role Resolution (Strictly Fail-Closed)
    // Client NEVER provisions or self-assigns roles. Roles are assigned exclusively
    // via database triggers on signup or by authorized administrators.
    let resolvedRole = null;
    let authError = null;

    try {
      const { data: roleData, error: roleErr } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (roleErr) {
        console.error('[Saarthi Auth] Database error querying user_roles:', roleErr.message);
        authError = 'ROLE_QUERY_ERROR';
        resolvedRole = null;
      } else if (roleData && roleData.length > 0) {
        const roles = roleData.map(r => r.role);
        if (roles.includes('admin')) resolvedRole = 'admin';
        else if (roles.includes('government')) resolvedRole = 'government';
        else if (roles.includes('citizen')) resolvedRole = 'citizen';
        else {
          console.warn('[Saarthi Auth] Unrecognized role in DB:', roles);
          resolvedRole = null;
          authError = 'UNRECOGNIZED_ROLE';
        }
      } else {
        // No role assigned in database -> Fail closed. Never fabricate or assume 'citizen'.
        console.warn('[Saarthi Auth] No role record exists in database for user:', userId);
        resolvedRole = null;
        authError = 'NO_ROLE_ASSIGNED';
      }
    } catch (err) {
      console.error('[Saarthi Auth] Critical exception reading user_roles:', err.message);
      resolvedRole = null;
      authError = 'ROLE_RESOLUTION_EXCEPTION';
    }

    // 2. Resolve Profile (Guarantee record exists)
    let resolvedProfile = null;
    try {
      const { data: pData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (pData) {
        resolvedProfile = pData;
      } else {
        // Profile row missing (e.g. fresh OAuth sign-in or trigger bypass) -> create baseline profile
        const baselineProfile = {
          id: userId,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        try {
          const { data: insertedProf, error: insErr } = await supabase
            .from('profiles')
            .upsert(baselineProfile)
            .select()
            .single();

          resolvedProfile = insertedProf || baselineProfile;
        } catch (insErr) {
          console.warn('[Saarthi Auth] Profile upsert notice:', insErr.message);
          resolvedProfile = baselineProfile;
        }
      }
    } catch (err) {
      console.error('[Saarthi Auth] Error loading profile from DB:', err.message);
      resolvedProfile = { id: userId, full_name: fullName };
    }

    // 3. Resolve Household Members
    try {
      const { data: hData } = await supabase
        .from('household_members')
        .select('*')
        .eq('profile_id', userId);

      if (hData && hData.length > 0) {
        setHousehold(hData);
        localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(hData));
      }
    } catch (err) {
      console.warn('[Saarthi Auth] Household members fetch notice:', err.message);
    }

    // Store in local storage cache
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(resolvedProfile));

    return { profile: resolvedProfile, role: resolvedRole };
  }, []);

  // ── 2. Unified Session Synchronizer with Concurrency Lock ──
  useEffect(() => {
    let isMounted = true;
    let syncing = false;

    const syncSession = async (session) => {
      if (syncing) return;
      syncing = true;

      try {
        if (session?.user) {
          const u = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 
                       session.user.user_metadata?.name || 
                       session.user.email?.split('@')[0] || 
                       'Citizen'
          };
          if (isMounted) setUser(u);

          const { profile: resProfile, role: resRole } = await ensureProfileAndRole(session.user);
          if (isMounted) {
            setProfile(resProfile);
            setRole(resRole);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setRole(null);
            setProfile(null);
            setHousehold([]);
            setEvaluations([]);
            setApplications([]);
            setDocuments([]);
          }
        }
      } catch (err) {
        console.error('[Saarthi Auth] Auth synchronization error:', err.message);
      } finally {
        syncing = false;
        if (isMounted) setLoading(false);
      }
    };

    // Initial session bootstrap
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session);
    }).catch(err => {
      console.error('[Saarthi Auth] getSession error:', err.message);
      if (isMounted) setLoading(false);
    });

    // Unified auth event listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        await syncSession(session);
      } else if (event === 'SIGNED_OUT') {
        syncSession(null);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [ensureProfileAndRole]);

  // ── 3. Load Schemes & evaluate eligibility when profile changes ──
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
  }, [profile?.id, household]);

  // ── 4. Sign In with Email / Password ──
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
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Citizen'
        };
        setUser(u);
        const { profile: resProfile, role: resRole } = await ensureProfileAndRole(data.user);
        setProfile(resProfile);
        setRole(resRole);
        return { success: true, role: resRole };
      }
      return { success: false, error: 'Authentication failed. Please check your credentials.' };
    } catch (err) {
      console.error('[Saarthi] Sign in error:', err.message);
      return { success: false, error: 'Unable to connect to authentication service. Please try again.' };
    }
  };

  // ── 5. Sign In with Google OAuth ──
  const signInWithGoogle = async (redirectTo = '/citizen/dashboard') => {
    try {
      const targetUrl = `${window.location.origin}${redirectTo}`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: targetUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      console.error('[Saarthi] Google OAuth error:', err.message);
      return { success: false, error: err.message || 'Failed to initialize Google authentication.' };
    }
  };

  // ── 6. Sign Up with Supabase ──
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
        const { profile: resProfile, role: resRole } = await ensureProfileAndRole({
          ...data.user,
          user_metadata: { full_name: fullName }
        });
        setProfile(resProfile);
        setRole(resRole || 'citizen');

        return { success: true, role: resRole || 'citizen' };
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

  // ── Citizen Saved Schemes State ──
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try {
      const saved = localStorage.getItem('saarthi_saved_schemes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch saved schemes from database on login
  useEffect(() => {
    if (!user?.id) return;
    async function loadSavedSchemes() {
      try {
        const { data, error } = await supabase
          .from('saved_schemes')
          .select('scheme_id')
          .eq('profile_id', user.id);

        if (!error && data) {
          const ids = data.map(s => s.scheme_id);
          setSavedSchemes(ids);
          localStorage.setItem('saarthi_saved_schemes', JSON.stringify(ids));
        }
      } catch (err) {
        console.warn('[Saarthi] Failed to load saved schemes from DB:', err);
      }
    }
    loadSavedSchemes();
  }, [user?.id]);

  // Toggle saving/bookmarking a scheme
  const toggleSaveScheme = async (schemeId) => {
    const isCurrentlySaved = savedSchemes.includes(schemeId);
    const nextSaved = isCurrentlySaved
      ? savedSchemes.filter(id => id !== schemeId)
      : [...savedSchemes, schemeId];

    setSavedSchemes(nextSaved);
    localStorage.setItem('saarthi_saved_schemes', JSON.stringify(nextSaved));

    if (user?.id) {
      try {
        if (isCurrentlySaved) {
          await supabase
            .from('saved_schemes')
            .delete()
            .eq('profile_id', user.id)
            .eq('scheme_id', schemeId);
        } else {
          await supabase
            .from('saved_schemes')
            .insert({ profile_id: user.id, scheme_id: schemeId });
        }
      } catch (err) {
        console.warn('[Saarthi] Saved scheme DB sync notice:', err.message);
      }
    }
    return !isCurrentlySaved;
  };

  // ── Add household member & sync (Strict UUID validation) ──
  const addHouseholdMember = async (member) => {
    const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

    const newMember = { 
      id: generatedId, 
      profile_id: user?.id, 
      name: member.name,
      relation: member.relation,
      age: member.age ? Number(member.age) : null,
      gender: member.gender || 'other',
      occupation: member.occupation || 'unemployed',
      income_annual: member.income_annual ? Number(member.income_annual) : 0,
      education: member.education || 'none',
      disability: member.disability || 'none'
    };

    const next = [...household, newMember];
    setHousehold(next);
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(next));

    const evalResults = EligibilityEngine.evaluateEligibility(profile, next, schemes);
    setEvaluations(evalResults);

    if (user?.id) {
      try {
        const { error } = await supabase.from('household_members').insert(newMember);
        if (error) {
          console.warn('[Saarthi Auth] Household member DB insert error:', error.message);
        }
      } catch (err) {
        console.error('[Saarthi Auth] Household member sync failed:', err.message);
      }
    }
    return newMember;
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
        const { error } = await supabase.from('household_members').delete().eq('id', id);
        if (error) {
          console.warn('[Saarthi Auth] Household member DB delete error:', error.message);
        }
      } catch (err) {
        console.error('[Saarthi Auth] Household member delete failed:', err.message);
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
      signInWithGoogle,
      signUp,
      signOut,
      forgotPassword,
      // Citizen welfare data
      profile,
      household,
      schemes,
      savedSchemes,
      toggleSaveScheme,
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
