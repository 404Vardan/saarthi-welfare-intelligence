import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AST Operators — mirrors the client-side engine for consistency
const ASTOperators: Record<string, (a: any, b: any) => boolean> = {
  EQ: (a, b) => a === b,
  NEQ: (a, b) => a !== b,
  GT: (a, b) => Number(a) > Number(b),
  GTE: (a, b) => Number(a) >= Number(b),
  LT: (a, b) => Number(a) < Number(b),
  LTE: (a, b) => Number(a) <= Number(b),
  IN: (a, b) => (Array.isArray(b) ? b.includes(a) : b === a),
  NOT_IN: (a, b) => (Array.isArray(b) ? !b.includes(a) : b !== a),
  CONTAINS: (a, b) => (Array.isArray(a) ? a.includes(b) : String(a).toLowerCase().includes(String(b).toLowerCase())),
  BETWEEN: (a, b) => Array.isArray(b) && Number(a) >= Number(b[0]) && Number(a) <= Number(b[1])
};

// Full AST-based Eligibility Engine — 3-Valued Logic (passed / failed / insufficient_data)
// This is a faithful port of the client-side engine to ensure identical results
const EligibilityEngine = {
  resolveField(context: any, path: string): any {
    if (!path) return undefined;
    const parts = path.split('.');
    let current = context;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  },

  computeHouseholdIncome(citizen: any, householdMembers: any[]): number | undefined {
    const citizenIncome = (citizen?.income_annual !== undefined && citizen?.income_annual !== null && citizen?.income_annual !== '')
      ? Number(citizen.income_annual)
      : undefined;

    let memberTotal = 0;
    let hasMemberIncome = false;

    (householdMembers || []).forEach((m: any) => {
      if (m.income_annual !== undefined && m.income_annual !== null && m.income_annual !== '') {
        memberTotal += Number(m.income_annual);
        hasMemberIncome = true;
      }
    });

    if (citizenIncome === undefined && !hasMemberIncome) {
      return undefined;
    }

    return (citizenIncome || 0) + memberTotal;
  },

  buildContext(citizen: any = {}, householdMembers: any[] = []) {
    const aggregateIncome = this.computeHouseholdIncome(citizen, householdMembers);
    return {
      citizen: {
        ...citizen,
        income_annual: (citizen?.income_annual !== undefined && citizen?.income_annual !== null && citizen?.income_annual !== '')
          ? Number(citizen.income_annual)
          : undefined,
        age: (citizen?.age !== undefined && citizen?.age !== null && citizen?.age !== '')
          ? Number(citizen.age)
          : undefined
      },
      household: {
        income_annual: aggregateIncome,
        aggregate_income: aggregateIncome,
        membersCount: (householdMembers || []).length + 1,
        members: householdMembers || []
      }
    };
  },

  evaluateNode(node: any, context: any): any {
    // AST Combinator Node (AND / OR / NOT)
    if (node.combinator) {
      const combinator = node.combinator.toUpperCase();
      const children = (node.rules || []).map((child: any) => this.evaluateNode(child, context));

      if (combinator === 'AND') {
        const hasMissing = children.some((c: any) => c.status === 'insufficient_data');
        const anyFailed = children.some((c: any) => c.status === 'failed');

        let groupStatus = 'passed';
        if (anyFailed) groupStatus = 'failed';
        else if (hasMissing) groupStatus = 'insufficient_data';

        return { type: 'group', combinator: 'AND', status: groupStatus, passed: groupStatus === 'passed', children };
      }

      if (combinator === 'OR') {
        const anyPassed = children.some((c: any) => c.status === 'passed');
        const allFailed = children.every((c: any) => c.status === 'failed');

        let groupStatus = 'failed';
        if (anyPassed) groupStatus = 'passed';
        else if (!allFailed) groupStatus = 'insufficient_data';

        return { type: 'group', combinator: 'OR', status: groupStatus, passed: groupStatus === 'passed', children };
      }

      if (combinator === 'NOT') {
        const child = children[0] || { status: 'failed', passed: false };
        let groupStatus = 'failed';
        if (child.status === 'passed') groupStatus = 'failed';
        else if (child.status === 'failed') groupStatus = 'passed';
        else groupStatus = 'insufficient_data';

        return { type: 'group', combinator: 'NOT', status: groupStatus, passed: groupStatus === 'passed', children };
      }
    }

    // Leaf Predicate Node
    const { field, op = 'EQ', value: targetValue, label, impact = 'critical', tolerance = 0 } = node;
    const citizenValue = this.resolveField(context, field);

    // 3-Valued Check: missing data
    const isMissing = (citizenValue === undefined || citizenValue === null || citizenValue === '');

    if (isMissing) {
      return {
        type: 'predicate', field, op: String(op).toUpperCase(), label: label || field,
        impact, status: 'insufficient_data', passed: false, nearMiss: false, isMissingData: true,
        citizenValue: 'Missing / Not Provided', requiredValue: String(targetValue)
      };
    }

    const opKey = String(op).toUpperCase();
    const evaluator = ASTOperators[opKey] || ASTOperators.EQ;
    const passed = evaluator ? evaluator(citizenValue, targetValue) : false;

    // Near-miss detection
    let nearMiss = false;
    if (!passed && typeof citizenValue === 'number' && typeof targetValue === 'number') {
      if (['LTE', 'LT'].includes(opKey)) {
        const diff = citizenValue - targetValue;
        const allowableDelta = tolerance || targetValue * 0.15;
        if (diff > 0 && diff <= allowableDelta) nearMiss = true;
      } else if (['GTE', 'GT'].includes(opKey)) {
        const diff = targetValue - citizenValue;
        const allowableDelta = tolerance || 2;
        if (diff > 0 && diff <= allowableDelta) nearMiss = true;
      }
    }

    return {
      type: 'predicate', field, op: opKey, label: label || field, impact,
      status: passed ? 'passed' : 'failed', passed: Boolean(passed), nearMiss, isMissingData: false,
      citizenValue: String(citizenValue), requiredValue: String(targetValue)
    };
  },

  flattenBreakdown(node: any): any[] {
    const list: any[] = [];
    if (node.type === 'predicate') {
      list.push({
        rule: node.label, field: node.field,
        status: node.status || (node.passed ? 'passed' : 'failed'),
        isMissingData: Boolean(node.isMissingData),
        citizenValue: node.citizenValue, requiredValue: node.requiredValue,
        impact: node.impact, nearMiss: node.nearMiss
      });
    } else if (node.children) {
      node.children.forEach((child: any) => { list.push(...this.flattenBreakdown(child)); });
    }
    return list;
  },

  convertLegacyRulesToAST(rules: any = {}) {
    const subRules: any[] = [];
    const incomeType = rules.income_type || 'individual';

    if (rules.income_limit != null) {
      subRules.push({ field: incomeType === 'household' ? 'household.income_annual' : 'citizen.income_annual', op: 'LTE', value: Number(rules.income_limit), label: 'Income Limit', impact: 'critical' });
    }
    if (rules.min_age != null) subRules.push({ field: 'citizen.age', op: 'GTE', value: Number(rules.min_age), label: 'Minimum Age', impact: 'critical', tolerance: 2 });
    if (rules.max_age != null) subRules.push({ field: 'citizen.age', op: 'LTE', value: Number(rules.max_age), label: 'Maximum Age', impact: 'critical', tolerance: 2 });
    if (rules.gender) subRules.push({ field: 'citizen.gender', op: Array.isArray(rules.gender) ? 'IN' : 'EQ', value: rules.gender, label: 'Gender', impact: 'critical' });
    if (rules.category) subRules.push({ field: 'citizen.category', op: Array.isArray(rules.category) ? 'IN' : 'EQ', value: rules.category, label: 'Category', impact: 'critical' });
    if (rules.occupation) subRules.push({ field: 'citizen.occupation', op: Array.isArray(rules.occupation) ? 'IN' : 'EQ', value: rules.occupation, label: 'Occupation', impact: 'critical' });
    if (rules.state) subRules.push({ field: 'citizen.state', op: Array.isArray(rules.state) ? 'IN' : 'EQ', value: rules.state, label: 'State', impact: 'critical' });
    if (rules.area_type) subRules.push({ field: 'citizen.area_type', op: Array.isArray(rules.area_type) ? 'IN' : 'EQ', value: rules.area_type, label: 'Area', impact: 'moderate' });
    if (rules.land_ownership) subRules.push({ field: 'citizen.land_ownership', op: Array.isArray(rules.land_ownership) ? 'IN' : 'EQ', value: rules.land_ownership, label: 'Land', impact: 'critical' });
    if (rules.house_ownership) subRules.push({ field: 'citizen.house_ownership', op: Array.isArray(rules.house_ownership) ? 'IN' : 'EQ', value: rules.house_ownership, label: 'Housing', impact: 'moderate' });
    if (rules.bpl_required) subRules.push({ field: 'citizen.bpl_card', op: 'EQ', value: true, label: 'BPL Status', impact: 'critical' });
    if (rules.bank_account_required) subRules.push({ field: 'citizen.bank_account', op: 'NEQ', value: false, label: 'Bank Account', impact: 'critical' });
    if (rules.education) subRules.push({ field: 'citizen.education', op: Array.isArray(rules.education) ? 'IN' : 'EQ', value: rules.education, label: 'Education', impact: 'moderate' });

    return { combinator: 'AND', label: 'Standard Eligibility Ruleset', rules: subRules };
  },

  evaluateScheme(citizen: any, householdMembers: any[], scheme: any) {
    const context = this.buildContext(citizen, householdMembers);
    const ast = scheme.ast_rules || (scheme.rules ? this.convertLegacyRulesToAST(scheme.rules) : null);

    let flatBreakdown: any[] = [];
    if (ast && ast.rules && ast.rules.length > 0) {
      const astResult = this.evaluateNode(ast, context);
      flatBreakdown = this.flattenBreakdown(astResult);
    }

    let totalWeight = 0, passedWeight = 0, criticalFails = 0, moderateFails = 0, missingDataCount = 0;
    let hasNearMiss = false;

    flatBreakdown.forEach((b: any) => {
      const weight = b.impact === 'critical' ? 2 : 1;
      totalWeight += weight;
      if (b.status === 'passed') passedWeight += weight;
      else if (b.status === 'insufficient_data') missingDataCount++;
      else {
        if (b.impact === 'critical') criticalFails++; else moderateFails++;
        if (b.nearMiss) hasNearMiss = true;
      }
    });

    const totalFails = criticalFails + moderateFails;
    let status = 'eligible';
    if (missingDataCount > 0 && totalFails === 0) status = 'insufficient_data';
    else if (totalFails === 0 && missingDataCount === 0) status = 'eligible';
    else if (criticalFails === 0 && moderateFails <= 1) status = 'nearly_eligible';
    else if (criticalFails === 1 && moderateFails === 0 && hasNearMiss) status = 'nearly_eligible';
    else if (totalFails <= 2 && hasNearMiss) status = 'nearly_eligible';
    else status = 'not_eligible';

    const matchPercentage = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 100;

    return {
      schemeId: scheme.id,
      schemeName: scheme.name || scheme.official_name,
      status,
      matchPercentage,
      missingDataCount,
      ruleBreakdown: flatBreakdown,
      incomeTypeUsed: scheme.rules?.income_type || 'individual'
    };
  }
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

    // Use the caller's own auth context so RLS applies to citizen data queries
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid authentication token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { profileId, syntheticCitizenId } = await req.json();

    let profile;
    let householdMembers: any[] = [];

    if (profileId) {
      // Verify the authenticated user can only evaluate their own profile
      if (profileId !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: You can only evaluate your own profile' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }

      // Use caller's auth context — RLS ensures they can only read their own data
      const { data: pData } = await callerClient.from('profiles').select('*').eq('id', profileId).single();
      const { data: hmData } = await callerClient.from('household_members').select('*').eq('profile_id', profileId);
      profile = pData;
      householdMembers = hmData || [];
    } else if (syntheticCitizenId) {
      // Synthetic citizens are public read — use caller client (RLS allows SELECT for all)
      const { data: sData } = await callerClient.from('synthetic_citizens').select('*').eq('id', syntheticCitizenId).single();
      profile = sData;
      householdMembers = sData?.household_members || [];
    } else {
      return new Response(
        JSON.stringify({ error: 'Missing profileId or syntheticCitizenId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Schemes are public read — RLS allows SELECT for all
    const { data: schemes } = await callerClient.from('schemes').select('*');

    const results = schemes?.map((s: any) => EligibilityEngine.evaluateScheme(profile, householdMembers, s)) || [];

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
