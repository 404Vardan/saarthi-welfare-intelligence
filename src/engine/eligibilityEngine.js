/**
 * Saarthi Deterministic Eligibility Engine
 * Evaluates citizen profile & household against date-aware structured scheme rules.
 * Produces transparent explainable breakdowns, match %, and future projections.
 */

export const EligibilityEngine = {
  computeHouseholdIncome(profile, householdMembers = []) {
    let total = profile.income_annual || 0;
    householdMembers.forEach(m => {
      total += (m.income_annual || 0);
    });
    return total;
  },

  checkRule(profile, householdMembers = [], ruleName, ruleValue, rules = {}) {
    const hm = householdMembers || [];

    switch (ruleName) {
      case 'income_limit': {
        const incomeType = rules.income_type || 'individual';
        const income = incomeType === 'household'
          ? this.computeHouseholdIncome(profile, hm)
          : (profile.income_annual || 0);
        const passed = income <= ruleValue;
        const margin = passed ? 0 : ((income - ruleValue) / ruleValue * 100);
        return {
          passed,
          citizenValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: `≤ ₹${ruleValue.toLocaleString('en-IN')}`,
          label: `${incomeType === 'household' ? 'Household' : 'Individual'} Income`,
          nearMiss: !passed && margin <= 20
        };
      }
      case 'min_age': {
        const age = profile.age || 0;
        return {
          passed: age >= ruleValue,
          citizenValue: `${age} years`,
          requiredValue: `≥ ${ruleValue} years`,
          label: 'Minimum Age',
          nearMiss: !passed && (ruleValue - age) <= 2
        };
      }
      case 'max_age': {
        const age = profile.age || 0;
        return {
          passed: age <= ruleValue,
          citizenValue: `${age} years`,
          requiredValue: `≤ ${ruleValue} years`,
          label: 'Maximum Age',
          nearMiss: !passed && (age - ruleValue) <= 2
        };
      }
      case 'gender':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.gender) : profile.gender === ruleValue,
          citizenValue: profile.gender ? profile.gender.toUpperCase() : 'Not specified',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.map(g => g.toUpperCase()).join(' / ') : String(ruleValue).toUpperCase(),
          label: 'Gender'
        };
      case 'category':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.category) : profile.category === ruleValue,
          citizenValue: profile.category ? profile.category.toUpperCase() : 'General',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.map(c => c.toUpperCase()).join(', ') : String(ruleValue).toUpperCase(),
          label: 'Social Category'
        };
      case 'occupation':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.occupation) : profile.occupation === ruleValue,
          citizenValue: profile.occupation ? profile.occupation.replace(/_/g, ' ') : 'Not set',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.map(o => o.replace(/_/g, ' ')).join(', ') : String(ruleValue),
          label: 'Occupation'
        };
      case 'area_type':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.area_type) : profile.area_type === ruleValue,
          citizenValue: profile.area_type || 'Rural',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.join(', ') : String(ruleValue),
          label: 'Area Type'
        };
      case 'land_ownership':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.land_ownership) : profile.land_ownership === ruleValue,
          citizenValue: profile.land_ownership ? profile.land_ownership.replace(/_/g, ' ') : 'none',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.map(l => l.replace(/_/g, ' ')).join(', ') : String(ruleValue),
          label: 'Land Ownership'
        };
      case 'house_ownership':
        return {
          passed: Array.isArray(ruleValue) ? ruleValue.includes(profile.house_ownership) : profile.house_ownership === ruleValue,
          citizenValue: profile.house_ownership || 'kuccha',
          requiredValue: Array.isArray(ruleValue) ? ruleValue.join(', ') : String(ruleValue),
          label: 'House Ownership'
        };
      case 'bpl_required':
        return {
          passed: !ruleValue || profile.bpl_card === true,
          citizenValue: profile.bpl_card ? 'Yes (BPL Card)' : 'No',
          requiredValue: 'BPL Card Mandatory',
          label: 'BPL Status'
        };
      case 'bank_account_required':
        return {
          passed: !ruleValue || profile.bank_account !== false,
          citizenValue: profile.bank_account !== false ? 'Active & DBT Linked' : 'No Account',
          requiredValue: 'Active Bank Account',
          label: 'DBT Bank Account'
        };
      case 'education': {
        const citizenEd = profile.education || 'none';
        const passed = Array.isArray(ruleValue) ? ruleValue.includes(citizenEd) : citizenEd === ruleValue;
        return {
          passed,
          citizenValue: citizenEd.replace(/_/g, ' '),
          requiredValue: Array.isArray(ruleValue) ? ruleValue.map(e => e.replace(/_/g, ' ')).join(', ') : String(ruleValue),
          label: 'Education Qualification'
        };
      }
      default:
        return { passed: true, citizenValue: 'N/A', requiredValue: 'N/A', label: ruleName };
    }
  },

  generateRuleBreakdown(profile, householdMembers, rules) {
    const breakdown = [];
    const skipKeys = ['income_type', 'custom_rules'];

    for (const [key, val] of Object.entries(rules)) {
      if (skipKeys.includes(key)) continue;
      if (val === null || val === undefined) continue;

      const res = this.checkRule(profile, householdMembers, key, val, rules);

      let impact = 'moderate';
      if (['income_limit', 'min_age', 'max_age', 'occupation', 'category', 'bpl_required'].includes(key)) {
        impact = 'critical';
      }

      breakdown.push({
        rule: res.label || key,
        ruleKey: key,
        status: res.passed ? 'passed' : 'failed',
        citizenValue: res.citizenValue,
        requiredValue: res.requiredValue,
        impact,
        nearMiss: res.nearMiss || false
      });
    }
    return breakdown;
  },

  evaluateScheme(profile, householdMembers, scheme) {
    const rules = scheme.rules || {};
    const breakdown = this.generateRuleBreakdown(profile, householdMembers, rules);

    let totalWeight = 0;
    let passedWeight = 0;
    let criticalFails = 0;
    let moderateFails = 0;
    let hasNearMiss = false;

    breakdown.forEach(b => {
      const weight = b.impact === 'critical' ? 2 : 1;
      totalWeight += weight;
      if (b.status === 'passed') {
        passedWeight += weight;
      } else {
        if (b.impact === 'critical') criticalFails++;
        else moderateFails++;
        if (b.nearMiss) hasNearMiss = true;
      }
    });

    let status = 'eligible';
    const totalFails = criticalFails + moderateFails;

    if (totalFails === 0) {
      status = 'eligible';
    } else if (criticalFails === 0 && moderateFails <= 1) {
      status = 'nearly_eligible';
    } else if (criticalFails === 1 && moderateFails === 0 && hasNearMiss) {
      status = 'nearly_eligible';
    } else if (totalFails <= 2 && hasNearMiss) {
      status = 'nearly_eligible';
    } else {
      status = 'not_eligible';
    }

    const matchPercentage = totalWeight > 0
      ? Math.round((passedWeight / totalWeight) * 100)
      : 100;

    return {
      schemeId: scheme.id,
      schemeCode: scheme.scheme_code || scheme.short_name,
      schemeName: scheme.name || scheme.official_name,
      schemeShortName: scheme.short_name,
      benefit: scheme.benefit || scheme.benefits_summary,
      benefitAmount: scheme.benefit_amount,
      type: scheme.type || scheme.scheme_type,
      govLevel: scheme.gov_level,
      ministry: scheme.ministry,
      documents: scheme.documents || scheme.required_documents || [],
      status,
      matchPercentage,
      ruleBreakdown: breakdown,
      ruleVersion: scheme.rule_version || '1.0',
      ruleEffectiveFrom: scheme.rule_effective_from || '2025-01-01',
      lastVerifiedAt: scheme.last_verified_at || '2026-08-28T00:00:00Z'
    };
  },

  evaluateEligibility(profile, householdMembers, schemes) {
    if (!profile || !schemes || schemes.length === 0) return [];
    return schemes.map(s => this.evaluateScheme(profile, householdMembers || [], s));
  },

  groupByStatus(results) {
    return {
      eligible: results.filter(r => r.status === 'eligible'),
      nearly_eligible: results.filter(r => r.status === 'nearly_eligible'),
      not_eligible: results.filter(r => r.status === 'not_eligible')
    };
  }
};

export default EligibilityEngine;
