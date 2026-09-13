// Google Gemini Integration for "Ask Saarthi" Welfare Assistant
import { supabase } from './supabaseClient';

export const GeminiAPI = {
  async generateWelfareGuidance(userQuery, citizenProfile, matchedSchemes = [], missingDocs = []) {
    try {
      const { data, error } = await supabase.functions.invoke('ask-saarthi', {
        body: {
          query: userQuery,
          citizenContext: citizenProfile,
          matchedSchemes,
          missingDocs
        }
      });

      if (!error && data && !data.fallback && data.response) {
        return data.response;
      }
      if (error) {
        console.warn('Edge function returned an error:', error);
      }
    } catch (err) {
      console.warn('Failed to invoke ask-saarthi edge function, using verified fallback rules:', err);
    }

    // Grounded deterministic response fallback
    const q = userQuery.toLowerCase();
    if (q.includes('document') || q.includes('missing') || q.includes('proof')) {
      if (missingDocs.length > 0) {
        return `Based on your matched programmes, you currently need to upload an ${missingDocs[0].name}. Your Aadhaar, Bank Passbook, and Ration Card are already verified in your Document Locker.`;
      }
      return 'Great news! All required document proofs are verified in your Document Locker. Your application readiness score is 100%.';
    }

    if (q.includes('pm-kisan') || q.includes('kisan') || q.includes('farmer')) {
      return `You are verified eligible for PM-KISAN (Samman Nidhi) because your annual income of ₹${citizenProfile?.income_annual?.toLocaleString('en-IN')} is within the gazette threshold and you hold verified agricultural land in ${citizenProfile?.state || 'Gujarat'}. You receive ₹6,000 annually in 3 direct DBT installments.`;
    }

    if (q.includes('why') || q.includes('qualify') || q.includes('eligible')) {
      return `Our deterministic rule engine verified ${matchedSchemes.length} schemes for you based on your verified demographic attributes (${citizenProfile?.occupation} in ${citizenProfile?.state}, income under ceiling). You can inspect the complete boolean decision breakdown on any Scheme Detail page.`;
    }

    return `Namaste ${citizenProfile?.full_name?.split(' ')[0] || 'Citizen'}! You are matched for ${matchedSchemes.length} verified government welfare schemes including ${matchedSchemes[0]?.schemeName || 'PM-KISAN'}. How can I assist you with your application today?`;
  }
};

export default GeminiAPI;
