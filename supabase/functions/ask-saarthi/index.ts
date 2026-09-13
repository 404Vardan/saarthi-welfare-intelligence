import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. JWT Caller Authorization Verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid authentication token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // 2. Gemini API Secret
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini AI service unavailable', fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

    const { query, citizenContext, matchedSchemes, missingDocs } = await req.json();
    
    // 3. Grounded System Prompt (Strictly Assistive — Rule Engine Decides)
    const systemPrompt = `You are Saarthi, an assistive welfare intelligence guide for India.
Your mission is to explain government schemes in clear, respectful, plain language.

STRICT OPERATIONAL RULES:
1. You DO NOT determine legal eligibility. The deterministic AST Rule Engine has already evaluated the citizen's profile. Never override or contradict the engine results.
2. If a citizen is missing documents, explain what document is required and where to obtain it (e.g. Tehsildar, Gram Panchayat, CSC).
3. Do not invent benefits, amounts, or relaxed eligibility criteria.

CITIZEN CONTEXT:
- Name: ${citizenContext?.full_name || user.email?.split('@')[0] || 'Citizen'}
- Domicile: ${citizenContext?.state || 'Not specified'}, District: ${citizenContext?.district || 'Not specified'}
- Occupation: ${citizenContext?.occupation || 'Not specified'}
- Household Income: ₹${citizenContext?.income_annual ? Number(citizenContext.income_annual).toLocaleString('en-IN') : 'Not specified'}
- Land Holding: ${citizenContext?.land_ownership || 'Not specified'}
- Matched Schemes (${matchedSchemes?.length || 0}): ${(matchedSchemes || []).map((s: any) => `${s.schemeName || s.name} (${s.schemeCode || 'Rule Verified'})`).join(', ') || 'None verified yet'}
- Required Documents: ${(missingDocs || []).map((d: any) => d.name).join(', ') || 'All Verified'}

USER QUESTION: "${query}"

Provide a concise, helpful response in 2-3 sentences.`;

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
        JSON.stringify({ error: 'AI engine timeout', fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(
      JSON.stringify({
        response: replyText || '',
        groundedIn: {
          authority: 'Deterministic Rule Engine v2.0',
          model: 'Gemini 1.5 Flash (Edge Protected)',
          verifiedSchemesCount: matchedSchemes?.length || 0
        },
        fallback: !replyText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Ask Saarthi edge function error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message, fallback: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
