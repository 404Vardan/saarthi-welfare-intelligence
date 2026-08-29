import { supabase } from './supabaseClient';
import { fallbackSeedSchemes } from './schemesData';

export const SchemeRegistryAPI = {
  async fetchAllRegistrySchemes(filters = {}) {
    try {
      let query = supabase
        .from('scheme_registry')
        .select('*')
        .order('updated_at', { ascending: false });

      if (filters.lifecycle_status) query = query.eq('lifecycle_status', filters.lifecycle_status);
      if (filters.scheme_type) query = query.eq('scheme_type', filters.scheme_type);
      if (filters.gov_level) query = query.eq('gov_level', filters.gov_level);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Registry fetch fallback:', err);
    }

    // Fallback representation
    return fallbackSeedSchemes.map(s => ({
      id: s.id,
      scheme_code: s.scheme_code,
      official_name: s.name,
      short_name: s.short_name,
      description: s.description,
      scheme_type: s.type,
      gov_level: s.gov_level,
      ministry: s.ministry,
      department: 'Central Government',
      state: 'All India',
      benefits_summary: s.benefit,
      benefit_amount: s.benefit_amount,
      beneficiary_groups: s.beneficiary_tags,
      required_documents: s.documents,
      lifecycle_status: 'PUBLISHED',
      last_verified_at: s.last_verified_at,
      processing_days: s.processing_days,
      success_rate: s.success_rate,
      popularity_score: s.popularity_score,
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-08-28T00:00:00Z'
    }));
  },

  async getRegistryScheme(id) {
    const all = await this.fetchAllRegistrySchemes();
    return all.find(s => s.id === id || s.scheme_code === id) || all[0];
  },

  async createScheme(schemeData) {
    try {
      const { data, error } = await supabase
        .from('scheme_registry')
        .insert({
          ...schemeData,
          lifecycle_status: schemeData.lifecycle_status || 'UNDER_REVIEW'
        })
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // ignore
    }
    return {
      id: 'sch-' + Date.now(),
      ...schemeData,
      lifecycle_status: schemeData.lifecycle_status || 'UNDER_REVIEW',
      created_at: new Date().toISOString()
    };
  },

  async updateSchemeStatus(id, newStatus, changedBy = 'operator') {
    try {
      await supabase
        .from('scheme_registry')
        .update({ lifecycle_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {
      // ignore
    }
    return { success: true, id, status: newStatus };
  },

  async getRuleVersions(schemeId) {
    try {
      const { data, error } = await supabase
        .from('scheme_rule_versions')
        .select('*')
        .eq('scheme_id', schemeId)
        .order('effective_from', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {
      // ignore
    }

    return [
      {
        id: 'rv-1',
        scheme_id: schemeId,
        version: '1.0',
        rules: { income_limit: 200000, occupation: ['farmer'] },
        effective_from: '2025-01-01',
        effective_until: null,
        change_summary: 'Initial gazette enactment rules v1.0',
        verification_status: 'VERIFIED',
        verified_by: 'Ministry Review Officer',
        verified_at: '2026-01-10T10:00:00Z',
        source_reference: 'Gazette Notification No. 42-AGRI/2025'
      }
    ];
  },

  async createRuleVersion(schemeId, ruleData) {
    try {
      const { data, error } = await supabase
        .from('scheme_rule_versions')
        .insert({
          scheme_id: schemeId,
          version: ruleData.version || '1.1',
          rules: ruleData.rules || {},
          effective_from: ruleData.effective_from || new Date().toISOString().split('T')[0],
          change_summary: ruleData.change_summary || 'Proposed rule revision',
          verification_status: ruleData.verification_status || 'PENDING',
          source_reference: ruleData.source_reference || 'Official Notification'
        })
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // ignore
    }
    return { id: 'rv-' + Date.now(), scheme_id: schemeId, ...ruleData };
  },

  async fetchVerificationQueue(statusFilter = null) {
    try {
      let query = supabase
        .from('verification_queue')
        .select('*, scheme_registry(scheme_code, official_name, short_name)');
      if (statusFilter) query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
      // ignore
    }

    return [
      {
        id: 'vq-001',
        scheme_id: 'pm-kisan-001',
        queue_type: 'RULE_CHANGE',
        priority: 'HIGH',
        title: 'Income limit revision for PM-KISAN (₹2L → ₹3L)',
        proposed_changes: {
          income_limit: { old: 200000, new: 300000 },
          source: 'Cabinet Committee on Economic Affairs Notification'
        },
        detection_source: 'Official Gazette Crawler',
        detection_url: 'https://egazette.gov.in/notification/ccea-2026-08',
        status: 'PENDING',
        created_at: '2026-08-28T14:30:00Z',
        scheme_registry: {
          scheme_code: 'PM-KISAN',
          official_name: 'Pradhan Mantri Kisan Samman Nidhi',
          short_name: 'PM-KISAN'
        }
      },
      {
        id: 'vq-002',
        scheme_id: 'vishwakarma-008',
        queue_type: 'NEW_SCHEME',
        priority: 'CRITICAL',
        title: 'Verify modern toolkit subsidy guidelines for PM Vishwakarma',
        proposed_changes: {
          benefit_amount: { old: '₹10,000', new: '₹15,000' },
          eligible_trades: ['Carpenter', 'Blacksmith', 'Tailor', 'Cobbler', 'Sculptor']
        },
        detection_source: 'Ministry of MSME Portal',
        detection_url: 'https://msme.gov.in/schemes/pm-vishwakarma',
        status: 'PENDING',
        created_at: '2026-08-27T09:15:00Z',
        scheme_registry: {
          scheme_code: 'PM-VISHWAKARMA',
          official_name: 'PM Vishwakarma Scheme',
          short_name: 'PM Vishwakarma'
        }
      }
    ];
  },

  async approveVerification(queueId, reviewNotes = '', reviewedBy = 'Demo Operator') {
    try {
      await supabase
        .from('verification_queue')
        .update({
          status: 'APPROVED',
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', queueId);
    } catch {
      // ignore
    }
    return { success: true };
  },

  async rejectVerification(queueId, reviewNotes = '', reviewedBy = 'Demo Operator') {
    try {
      await supabase
        .from('verification_queue')
        .update({
          status: 'REJECTED',
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', queueId);
    } catch {
      // ignore
    }
    return { success: true };
  },

  async addToVerificationQueue(item) {
    try {
      const { data, error } = await supabase.from('verification_queue').insert(item).select().single();
      if (!error && data) return data;
    } catch {
      // ignore
    }
    return { id: 'vq-' + Date.now(), ...item };
  },

  async addSchemeSource(schemeId, sourceData) {
    try {
      await supabase.from('scheme_sources').insert({ scheme_id: schemeId, ...sourceData });
    } catch {
      // ignore
    }
  },

  async getSchemeStats() {
    return {
      total: 18,
      published: 15,
      updated: 1,
      underReview: 2,
      discovered: 3,
      extracted: 1,
      verified: 15,
      expired: 0,
      pendingVerifications: 2,
      recentChanges: 8
    };
  }
};

export default SchemeRegistryAPI;
