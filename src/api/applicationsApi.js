import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'saarthi_citizen_applications';

export const ApplicationsAPI = {
  // Generate official reference number format: SAARTHI-2026-XXXXXX
  generateReferenceNumber() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `SAARTHI-2026-${randomDigits}`;
  },

  async fetchUserApplications(profileId) {
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        const { data, error } = await supabase
          .from('applications')
          .select('*, schemes(name, short_name, benefit)')
          .eq('profile_id', profileId)
          .order('applied_at', { ascending: false });

        if (!error && data && data.length > 0) {
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
      }
    } catch (err) {
      console.warn('Backend applications query failed, reading local cache:', err);
    }

    // Local persistent storage fallback
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }

    // Default seed applications for new sessions
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultApps));
    return defaultApps;
  },

  async createApplication(profileId, schemeId, schemeName, notes = '') {
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

    // Try Supabase insert
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
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

        if (!error && data) {
          newAppRecord.id = data.id;
        }
      }
    } catch (err) {
      console.warn('Backend application insert failed, persisting locally:', err);
    }

    // Update local cache
    const existing = await this.fetchUserApplications(profileId);
    const updated = [newAppRecord, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

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
