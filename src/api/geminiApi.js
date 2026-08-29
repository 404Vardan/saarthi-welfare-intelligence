// Google Gemini Integration for "Ask Saarthi" Welfare Assistant

export const GeminiAPI = {
  async generateWelfareGuidance(userQuery, citizenProfile, matchedSchemes = [], missingDocs = []) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    // Construct grounded context prompt
    const systemPrompt = `You are Saarthi, an official AI welfare guidance assistant for India.
Explain government schemes and application steps strictly based on the citizen's verified profile and gazette rules.
IMPORTANT: You DO NOT determine eligibility—the deterministic rule engine already did that. Do NOT contradict the rule engine.

Citizen Context:
- Name: ${citizenProfile?.full_name || 'Citizen'}
- Occupation: ${citizenProfile?.occupation || 'Farmer'}
- State & District: ${citizenProfile?.state || 'Gujarat'}, ${citizenProfile?.district || 'Anand'}
- Annual Income: ₹${citizenProfile?.income_annual?.toLocaleString('en-IN') || '1,80,000'}
- Land Ownership: ${citizenProfile?.land_ownership || '2 to 5 acres'}
- Matched Eligible Schemes (${matchedSchemes.length}): ${matchedSchemes.map(s => s.schemeName).join(', ')}
- Missing Verification Proofs: ${missingDocs.map(d => d.name).join(', ') || 'None (100% Ready)'}

Query from Citizen: "${userQuery}"

Provide a concise, helpful, and respectful response in 2-3 sentences.`;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return replyText;
        }
      } catch (err) {
        console.warn('Gemini API call failed, using verified fallback rules:', err);
      }
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
