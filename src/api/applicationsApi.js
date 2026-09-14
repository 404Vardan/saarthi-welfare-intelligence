import { supabase } from './supabaseClient.js';

const LOCAL_STORAGE_KEY = 'saarthi_citizen_applications';

export const ApplicationsAPI = {
  // Generate official reference number format: SAARTHI-2026-XXXXXX
  generateReferenceNumber() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `SAARTHI-2026-${randomDigits}`;
  },

  async fetchUserApplications(profileId) {
    // 1. Authenticated User — Authoritative Database Source
    if (profileId && profileId !== 'demo-citizen-01') {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, schemes(name, short_name, benefit)')
          .eq('profile_id', profileId)
          .order('applied_at', { ascending: false });

        if (error) {
          console.error('[ApplicationsAPI] Authoritative DB query error:', error.message);
          // In production, do NOT fabricate fake seed records for a real citizen
          if (import.meta.env.PROD) {
            return [];
          }
        } else if (data) {
          return data.map(app => ({
            id: app.id,
            schemeId: app.scheme_id,
            schemeName: app.schemes?.name || app.scheme_name || 'Government Scheme',
            refNumber: app.reference_number,
            status: app.status || 'submitted',
            appliedAt: new Date(app.applied_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeline: Array.isArray(app.timeline) && app.timeline.length > 0 ? app.timeline : this.getDefaultTimeline(app.applied_at)
          }));
        }
      } catch (err) {
        console.error('[ApplicationsAPI] Failed to fetch applications:', err.message);
        return [];
      }
    }

    // 2. Demo / Unauthenticated Mode Only
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }

    // Default seed applications strictly for demo sessions
    const defaultApps = [
      {
        id: 'app-seed-001',
        schemeId: 'pm-kisan-001',
        schemeName: 'Pradhan Mantri Kisan Samman Nidhi',
        refNumber: 'SAARTHI-2026-004891',
        status: 'under_review',
        appliedAt: '12 Aug 2026',
        timeline: [
          { label: 'Application Submitted via Saarthi', date: '12 Aug 2026', done: true },
          { label: 'Aadhaar & e-KYC Verified', date: '14 Aug 2026', done: true },
          { label: 'State Land Record Verification', date: 'In Progress', active: true },
          { label: 'DBT Bank Account Disbursement', date: 'Pending' }
        ]
      }
    ];
    if (profileId === 'demo-citizen-01') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultApps));
    }
    return defaultApps;
  },

  async createApplication(profileId, schemeId, schemeName, notes = '') {
    const isAuthenticatedUser = profileId && profileId !== 'demo-citizen-01';

    // 1. Idempotency Check: Prevent duplicate submissions for the same scheme
    const existingApps = await this.fetchUserApplications(profileId);
    const existingMatch = existingApps.find(a => String(a.schemeId) === String(schemeId));
    if (existingMatch) {
      const err = new Error(`An active application for this scheme already exists under Reference ${existingMatch.refNumber}.`);
      err.code = 'DUPLICATE_APPLICATION';
      err.existingApplication = existingMatch;
      throw err;
    }

    const refNumber = this.generateReferenceNumber();
    const nowIso = new Date().toISOString();
    const timeline = this.getDefaultTimeline(nowIso);

    const newAppRecord = {
      id: 'app-' + Date.now(),
      profileId,
      schemeId,
      schemeName,
      refNumber,
      status: 'submitted',
      appliedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeline,
      notes
    };

    // 2. Authoritative Database Insert
    if (isAuthenticatedUser) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .insert({
            profile_id: profileId,
            scheme_id: schemeId,
            reference_number: refNumber,
            status: 'submitted',
            notes,
            timeline
          })
          .select()
          .single();

        if (error) {
          console.error('[ApplicationsAPI] Server rejected application submission:', error.message);
          throw new Error(`Application submission failed: ${error.message}`);
        }

        if (data) {
          newAppRecord.id = data.id;
        }
      } catch (err) {
        // Do NOT silently swallow failure and fabricate a fake localStorage submission
        throw err;
      }
    } else {
      // Offline / Demo session persistence
      const updated = [newAppRecord, ...existingApps];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    return newAppRecord;
  },

  getDefaultTimeline(dateStr) {
    const dateFormatted = new Date(dateStr || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return [
      { label: 'Application Submitted via Saarthi', date: dateFormatted, done: true },
      { label: 'Aadhaar & Document Audit', date: 'In Review', active: true },
      { label: 'Departmental Verification', date: 'Pending' },
      { label: 'Benefit Direct Disbursement (DBT)', date: 'Pending' }
    ];
  }
};

export default ApplicationsAPI;
