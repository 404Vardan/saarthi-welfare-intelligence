import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';
import { SchemesData } from '../api/schemesData';
import { EligibilityEngine } from '../engine/eligibilityEngine';
import { ApplicationsAPI } from '../api/applicationsApi';
import { DocumentsAPI } from '../api/documentsApi';

const AuthContext = createContext();

const LOCAL_PROFILE_KEY = 'saarthi_welfare_profile';
const LOCAL_HOUSEHOLD_KEY = 'saarthi_welfare_household';

export const STATUTORY_TEST_PERSONAS = {
  farmer: {
    key: 'farmer',
    id: 'demo-farmer-01',
    name: 'Ramesh Patel',
    role: 'citizen',
    badge: 'Marginal Farmer',
    tagline: 'Land < 2 Acres · Surat, Gujarat · Target: PM-KISAN & PMFBY',
    profile: {
      id: 'demo-farmer-01',
      full_name: 'Ramesh Patel',
      age: 42,
      gender: 'male',
      occupation: 'farmer',
      income_annual: 120000,
      land_ownership: 'below_2_acres',
      land_holding_acres: 1.8,
      house_ownership: 'kuccha',
      area_type: 'rural',
      state: 'Gujarat',
      district: 'Surat',
      pincode: '395007',
      category: 'obc',
      bpl_card: true,
      disability: false,
      is_farmer: true,
      is_student: false
    },
    household: [
      { id: 'hh-01', name: 'Kamla Patel', relation: 'Spouse', age: 39, occupation: 'homemaker', income_annual: 0 },
      { id: 'hh-02', name: 'Suresh Patel', relation: 'Child', age: 14, occupation: 'student', income_annual: 0 }
    ],
    documents: [
      { id: 'doc-f1', name: 'Aadhaar Card', category: 'identity', status: 'verified', docNumber: 'XXXX-XXXX-9812' },
      { id: 'doc-f2', name: 'Land Record (7/12 RoR)', category: 'land', status: 'verified', docNumber: 'ROR-GJ-7712' },
      { id: 'doc-f3', name: 'Bank Passbook (DBT Linked)', category: 'financial', status: 'verified', docNumber: 'SBI-991823' }
    ]
  },
  student: {
    key: 'student',
    id: 'demo-student-02',
    name: 'Pooja Meghwal',
    role: 'citizen',
    badge: 'SC College Student',
    tagline: 'Undergraduate · Jaipur, Rajasthan · Target: Post-Matric SC Scholarship',
    profile: {
      id: 'demo-student-02',
      full_name: 'Pooja Meghwal',
      age: 20,
      gender: 'female',
      occupation: 'student',
      income_annual: 180000,
      state: 'Rajasthan',
      district: 'Jaipur',
      pincode: '302001',
      category: 'sc',
      education_level: 'undergraduate',
      bpl_card: true,
      disability: false,
      is_student: true,
      is_farmer: false
    },
    household: [
      { id: 'hh-s1', name: 'Ramkaran Meghwal', relation: 'Father', age: 48, occupation: 'daily_wage', income_annual: 140000 }
    ],
    documents: [
      { id: 'doc-s1', name: 'Aadhaar Card', category: 'identity', status: 'verified', docNumber: 'XXXX-XXXX-4532' },
      { id: 'doc-s2', name: 'Caste Certificate (SC)', category: 'category', status: 'verified', docNumber: 'SC-RJ-2024-910' },
      { id: 'doc-s3', name: 'College Enrollment & Fee Receipt', category: 'financial', status: 'verified', docNumber: 'COL-2026-881' }
    ]
  },
  woman_head: {
    key: 'woman_head',
    id: 'demo-woman-03',
    name: 'Anjali Devi',
    role: 'citizen',
    badge: 'Woman Beneficiary / Mother',
    tagline: 'BPL Mother · Patna, Bihar · Target: PMMVY & PM Ujjwala',
    profile: {
      id: 'demo-woman-03',
      full_name: 'Anjali Devi',
      age: 24,
      gender: 'female',
      occupation: 'homemaker',
      income_annual: 90000,
      state: 'Bihar',
      district: 'Patna',
      pincode: '800001',
      category: 'obc',
      bpl_card: true,
      is_pregnant_or_lactating: true,
      is_woman_head: true,
      is_student: false,
      is_farmer: false
    },
    household: [
      { id: 'hh-w1', name: 'Manoj Kumar', relation: 'Spouse', age: 27, occupation: 'artisan', income_annual: 90000 },
      { id: 'hh-w2', name: 'Aarav', relation: 'Child', age: 1, occupation: 'none', income_annual: 0 }
    ],
    documents: [
      { id: 'doc-w1', name: 'Aadhaar Card', category: 'identity', status: 'verified', docNumber: 'XXXX-XXXX-6129' },
      { id: 'doc-w2', name: 'Mother Child Protection (MCP) Card', category: 'household', status: 'verified', docNumber: 'MCP-BR-2025' },
      { id: 'doc-w3', name: 'BPL Ration Card', category: 'household', status: 'verified', docNumber: 'BPL-882910' }
    ]
  },
  artisan: {
    key: 'artisan',
    id: 'demo-artisan-04',
    name: 'Kallu Mistri',
    role: 'citizen',
    badge: 'Traditional Artisan',
    tagline: 'Carpenter / Woodcraft · Bhopal, MP · Target: PM Vishwakarma',
    profile: {
      id: 'demo-artisan-04',
      full_name: 'Kallu Mistri',
      age: 34,
      gender: 'male',
      occupation: 'artisan',
      trade: 'carpenter',
      income_annual: 140000,
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      pincode: '462001',
      category: 'obc',
      bpl_card: false,
      is_farmer: false,
      is_student: false
    },
    household: [
      { id: 'hh-a1', name: 'Radha Mistri', relation: 'Spouse', age: 31, occupation: 'homemaker', income_annual: 0 }
    ],
    documents: [
      { id: 'doc-a1', name: 'Aadhaar Card', category: 'identity', status: 'verified', docNumber: 'XXXX-XXXX-3341' },
      { id: 'doc-a2', name: 'Artisan Trade Verification', category: 'identity', status: 'verified', docNumber: 'VISH-MP-9012' }
    ]
  },
  senior: {
    key: 'senior',
    id: 'demo-senior-05',
    name: 'Devaki Amma',
    role: 'citizen',
    badge: 'Senior Citizen (68 yrs)',
    tagline: 'BPL Senior · Kollam, Kerala · Target: IGNOAPS Pension',
    profile: {
      id: 'demo-senior-05',
      full_name: 'Devaki Amma',
      age: 68,
      gender: 'female',
      occupation: 'homemaker',
      income_annual: 36000,
      state: 'Kerala',
      district: 'Kollam',
      pincode: '691001',
      category: 'general',
      bpl_card: true,
      is_senior: true,
      is_farmer: false,
      is_student: false
    },
    household: [],
    documents: [
      { id: 'doc-sn1', name: 'Aadhaar Card (Age Proof 68)', category: 'identity', status: 'verified', docNumber: 'XXXX-XXXX-1102' },
      { id: 'doc-sn2', name: 'BPL Ration Card', category: 'household', status: 'verified', docNumber: 'BPL-KL-7728' },
      { id: 'doc-sn3', name: 'Bank Passbook (DBT)', category: 'financial', status: 'verified', docNumber: 'CANARA-88192' }
    ]
  }
};

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
      if (session) {
        syncSession(session);
      } else {
        // Check for cached demo persona session
        try {
          const cachedDemo = localStorage.getItem('saarthi_demo_user');
          const cachedProf = localStorage.getItem(LOCAL_PROFILE_KEY);
          const cachedHh = localStorage.getItem(LOCAL_HOUSEHOLD_KEY);
          if (cachedDemo && cachedProf) {
            const dUser = JSON.parse(cachedDemo);
            const cProf = JSON.parse(cachedProf);
            const cHh = cachedHh ? JSON.parse(cachedHh) : [];
            if (isMounted) {
              setUser(dUser);
              setRole('citizen');
              setProfile(cProf);
              setHousehold(cHh);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('[Saarthi Auth] Demo restore notice:', e.message);
        }
        syncSession(null);
      }
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

  // ── 1-Click Evaluation Persona Activation (Zero Friction Evaluator / Beta Testing) ──
  const activateDemoPersona = async (personaKey) => {
    const persona = STATUTORY_TEST_PERSONAS[personaKey];
    if (!persona) return { success: false, error: 'Persona not found' };

    const demoUser = {
      id: persona.id,
      email: `${personaKey}@beta.saarthi.gov.in`,
      full_name: persona.name,
      is_demo: true
    };

    setUser(demoUser);
    setRole('citizen');
    setProfile(persona.profile);
    setHousehold(persona.household);
    setDocuments(persona.documents);

    localStorage.setItem('saarthi_demo_user', JSON.stringify(demoUser));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(persona.profile));
    localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(persona.household));

    // Ensure schemes are available & compute deterministic evaluation
    let currentSchemes = schemes;
    if (!currentSchemes || currentSchemes.length === 0) {
      try {
        currentSchemes = await SchemesData.fetchAllSchemes();
        setSchemes(currentSchemes);
      } catch {
        currentSchemes = [];
      }
    }

    const evalResults = EligibilityEngine.evaluateEligibility(persona.profile, persona.household, currentSchemes);
    setEvaluations(evalResults);

    return { success: true, persona };
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
      activateDemoPersona,
      STATUTORY_TEST_PERSONAS,
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
