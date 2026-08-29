import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mirroring the client side engine
const EligibilityEngine = {
  computeHouseholdIncome(profile: any, householdMembers: any[]) {
    let total = profile.income_annual || 0;
    if (householdMembers && householdMembers.length > 0) {
      householdMembers.forEach(m => total += (m.income_annual || 0));
    }
    return total;
  },

  checkRule(profile: any, householdMembers: any[], ruleName: string, ruleValue: any, rules: any) {
    switch (ruleName) {
      case 'income_limit': {
        const incomeType = rules.income_type || 'individual';
        const income = incomeType === 'household' ? this.computeHouseholdIncome(profile, householdMembers) : (profile.income_annual || 0);
        return { passed: income <= ruleValue, citizenValue: income, requiredValue: `<=${ruleValue}` };
      }
      case 'min_age':
        return { passed: (profile.age || 0) >= ruleValue, citizenValue: profile.age, requiredValue: `>=${ruleValue}` };
      case 'max_age':
        return { passed: (profile.age || 0) <= ruleValue, citizenValue: profile.age, requiredValue: `<=${ruleValue}` };
      case 'gender':
        return { passed: ruleValue.includes(profile.gender), citizenValue: profile.gender, requiredValue: ruleValue.join(', ') };
      case 'category':
        return { passed: ruleValue.includes(profile.category), citizenValue: profile.category, requiredValue: ruleValue.join(', ') };
      case 'occupation':
        return { passed: ruleValue.includes(profile.occupation), citizenValue: profile.occupation, requiredValue: ruleValue.join(', ') };
      case 'area_type':
        return { passed: ruleValue.includes(profile.area_type), citizenValue: profile.area_type, requiredValue: ruleValue.join(', ') };
      case 'land_ownership':
        return { passed: ruleValue.includes(profile.land_ownership), citizenValue: profile.land_ownership, requiredValue: ruleValue.join(', ') };
      case 'house_ownership':
        return { passed: ruleValue.includes(profile.house_ownership), citizenValue: profile.house_ownership, requiredValue: ruleValue.join(', ') };
      case 'bpl_required':
        return { passed: !ruleValue || profile.bpl_card, citizenValue: profile.bpl_card, requiredValue: ruleValue };
      case 'bank_account_required':
        return { passed: !ruleValue || profile.bank_account, citizenValue: profile.bank_account, requiredValue: ruleValue };
      case 'has_girl_child_under': {
        const hasGirl = householdMembers.some(m => m.gender === 'female' && m.age < ruleValue);
        return { passed: hasGirl, citizenValue: hasGirl ? 'Yes' : 'No', requiredValue: `Girl under ${ruleValue}` };
      }
      default:
        return { passed: true, citizenValue: 'N/A', requiredValue: 'N/A' };
    }
  },

  generateRuleBreakdown(profile: any, householdMembers: any[], rules: any) {
    const breakdown = [];
    for (const [key, val] of Object.entries(rules)) {
      if (key === 'income_type' || key === 'custom_rules') continue;
      
      const res = this.checkRule(profile, householdMembers, key, val, rules);
      breakdown.push({
        rule: key,
        status: res.passed ? 'passed' : 'failed',
        citizenValue: res.citizenValue,
        requiredValue: res.requiredValue,
        impact: (key === 'income_limit' || key.includes('age')) ? 'critical' : 'moderate'
      });
    }
    return breakdown;
  },

  evaluateScheme(profile: any, householdMembers: any[], scheme: any) {
    const rules = scheme.rules || {};
    const breakdown = this.generateRuleBreakdown(profile, householdMembers, rules);
    
    let passedCount = 0;
    let totalRules = breakdown.length;
    let criticalFails = 0;
    let moderateFails = 0;

    breakdown.forEach(b => {
      if (b.status === 'passed') passedCount++;
      else if (b.impact === 'critical') criticalFails++;
      else moderateFails++;
    });

    let status = 'eligible';
    if (criticalFails > 1 || (criticalFails === 1 && moderateFails > 0)) status = 'not_eligible';
    else if (criticalFails === 1 || moderateFails > 0) status = 'nearly_eligible';

    const matchPercentage = totalRules > 0 ? Math.round((passedCount / totalRules) * 100) : 100;

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      status,
      matchPercentage,
      ruleBreakdown: breakdown,
      incomeTypeUsed: rules.income_type || 'individual',
      futureEligibility: {}
    };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { profileId, syntheticCitizenId } = await req.json();

    let profile;
    let householdMembers = [];

    if (profileId) {
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', profileId).single();
      const { data: hmData } = await supabase.from('household_members').select('*').eq('profile_id', profileId);
      profile = pData;
      householdMembers = hmData || [];
    } else if (syntheticCitizenId) {
      const { data: sData } = await supabase.from('synthetic_citizens').select('*').eq('id', syntheticCitizenId).single();
      profile = sData;
      householdMembers = sData.household_members || [];
    } else {
      return new Response(JSON.stringify({ error: 'Missing profileId or syntheticCitizenId' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const { data: schemes } = await supabase.from('schemes').select('*');
    
    const results = schemes?.map(s => EligibilityEngine.evaluateScheme(profile, householdMembers, s)) || [];

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
