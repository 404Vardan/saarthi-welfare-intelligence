import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured', fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

    const { query, citizenContext, matchedSchemes, missingDocs } = await req.json();
    
    // Build the system prompt (same as current geminiApi.js)
    const systemPrompt = `You are Saarthi, an official AI welfare guidance assistant for India.
Explain government schemes and application steps strictly based on the citizen's verified profile and gazette rules.
IMPORTANT: You DO NOT determine eligibility—the deterministic rule engine already did that. Do NOT contradict the rule engine.

Citizen Context:
- Name: ${citizenContext?.full_name || 'Citizen'}
- Occupation: ${citizenContext?.occupation || 'Not specified'}
- State & District: ${citizenContext?.state || 'Not specified'}, ${citizenContext?.district || 'Not specified'}
- Annual Income: ₹${citizenContext?.income_annual?.toLocaleString('en-IN') || 'Not specified'}
- Land Ownership: ${citizenContext?.land_ownership || 'Not specified'}
- Matched Eligible Schemes (${matchedSchemes?.length || 0}): ${(matchedSchemes || []).map((s: any) => s.schemeName).join(', ') || 'None evaluated yet'}
- Missing Verification Proofs: ${(missingDocs || []).map((d: any) => d.name).join(', ') || 'None (100% Ready)'}

Query from Citizen: "${query}"

Provide a concise, helpful, and respectful response in 2-3 sentences.`;

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

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return new Response(
        JSON.stringify({ error: 'Gemini API returned an error', fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(
      JSON.stringify({ response: replyText || '', fallback: !replyText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Ask Saarthi edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message, fallback: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
