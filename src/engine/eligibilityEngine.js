/**
 * Saarthi Deterministic Eligibility & Welfare Intelligence Engine
 * 
 * Features:
 * 1. Composable AST-based Rule Evaluator (AND, OR, NOT, dynamic predicates).
 * 2. Deep Context Resolution (citizen profile, household graph, verified documents).
 * 3. Transparent Explainability Traces ("Why am I seeing this?").
 * 4. Tolerance & Near-Miss Detection (e.g., income marginally above ceiling, age within delta).
 * 5. Document Blocker Identification.
 * 6. Household Entitlement Aggregation & Portfolio Optimization.
 */

export const ASTOperators = {
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

export const EligibilityEngine = {
  /**
   * Resolves a dotted field path from context
   * Context shape: { citizen, household, documents, meta }
   */
  resolveField(context, path) {
    if (!path) return undefined;
    const parts = path.split('.');
    let current = context;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  },

  /**
   * Computes household aggregate income
   */
  computeHouseholdIncome(citizen, householdMembers = []) {
    let total = Number(citizen?.income_annual || 0);
    (householdMembers || []).forEach(m => {
      total += Number(m.income_annual || 0);
    });
    return total;
  },

  /**
   * Evaluates a single rule node against context
   * Uses 3-Valued Logic: PASSED | FAILED | INSUFFICIENT_DATA
   */
  evaluateNode(node, context) {
    // 1. AST Combinator Node (AND / OR / NOT)
    if (node.combinator) {
      const combinator = node.combinator.toUpperCase();
      const children = (node.rules || []).map(child => this.evaluateNode(child, context));

      if (combinator === 'AND') {
        const hasMissing = children.some(c => c.status === 'insufficient_data');
        const anyFailed = children.some(c => c.status === 'failed');
        const passed = children.every(c => c.status === 'passed');

        let groupStatus = 'passed';
        if (anyFailed) groupStatus = 'failed';
        else if (hasMissing) groupStatus = 'insufficient_data';

        return {
          type: 'group',
          combinator: 'AND',
          label: node.label || 'All Statutory Conditions Required',
          status: groupStatus,
          passed: groupStatus === 'passed',
          children
        };
      }

      if (combinator === 'OR') {
        const anyPassed = children.some(c => c.status === 'passed');
        const allFailed = children.every(c => c.status === 'failed');

        let groupStatus = 'failed';
        if (anyPassed) groupStatus = 'passed';
        else if (!allFailed) groupStatus = 'insufficient_data';

        return {
          type: 'group',
          combinator: 'OR',
          label: node.label || 'At Least One Condition Must Be Met',
          status: groupStatus,
          passed: groupStatus === 'passed',
          children
        };
      }

      if (combinator === 'NOT') {
        const child = children[0] || { status: 'failed', passed: false };
        let groupStatus = 'failed';
        if (child.status === 'passed') groupStatus = 'failed';
        else if (child.status === 'failed') groupStatus = 'passed';
        else groupStatus = 'insufficient_data';

        return {
          type: 'group',
          combinator: 'NOT',
          label: node.label || 'Condition Must Not Be Met',
          status: groupStatus,
          passed: groupStatus === 'passed',
          children
        };
      }
    }

    // 2. Leaf Predicate Node
    const { field, op = 'EQ', value: targetValue, label, impact = 'critical', tolerance = 0 } = node;
    const citizenValue = this.resolveField(context, field);

    // 3-Valued Check: Is the required citizen attribute missing or undefined?
    const isMissing = (citizenValue === undefined || citizenValue === null || citizenValue === '');

    if (isMissing) {
      return {
        type: 'predicate',
        field,
        op: String(op).toUpperCase(),
        label: label || this.formatFieldLabel(field),
        impact,
        status: 'insufficient_data',
        passed: false,
        nearMiss: false,
        delta: null,
        isMissingData: true,
        citizenValue: 'Missing / Not Provided',
        requiredValue: this.formatRequirement(String(op).toUpperCase(), targetValue),
        rawCitizenValue: undefined,
        rawTargetValue: targetValue
      };
    }

    let passed = false;
    let nearMiss = false;
    let delta = null;

    const opKey = String(op).toUpperCase();
    const evaluator = ASTOperators[opKey] || ASTOperators.EQ;

    if (evaluator) {
      passed = evaluator(citizenValue, targetValue);
    }

    // Near-miss detection for numerical boundaries (income, age, land)
    if (!passed && typeof citizenValue === 'number' && typeof targetValue === 'number') {
      if (['LTE', 'LT'].includes(opKey)) {
        const diff = citizenValue - targetValue;
        const allowableDelta = tolerance || targetValue * 0.15; // 15% tolerance default
        if (diff > 0 && diff <= allowableDelta) {
          nearMiss = true;
          delta = `Exceeds ceiling by ₹${diff.toLocaleString('en-IN')}`;
        }
      } else if (['GTE', 'GT'].includes(opKey)) {
        const diff = targetValue - citizenValue;
        const allowableDelta = tolerance || 2; // e.g. 2 years age
        if (diff > 0 && diff <= allowableDelta) {
          nearMiss = true;
          delta = `Short by ${diff} units`;
        }
      }
    }

    const nodeStatus = passed ? 'passed' : 'failed';

    return {
      type: 'predicate',
      field,
      op: opKey,
      label: label || this.formatFieldLabel(field),
      impact,
      status: nodeStatus,
      passed: Boolean(passed),
      nearMiss,
      delta,
      isMissingData: false,
      citizenValue: this.formatValue(field, citizenValue),
      requiredValue: this.formatRequirement(opKey, targetValue),
      rawCitizenValue: citizenValue,
      rawTargetValue: targetValue
    };
  },

  /**
   * Helper to format human-friendly field labels
   */
  formatFieldLabel(field) {
    if (!field) return 'Condition';
    const clean = field.replace(/^(citizen|household)\./, '');
    const map = {
      income_annual: 'Annual Income',
      'household.income_annual': 'Household Income',
      age: 'Citizen Age',
      gender: 'Gender',
      category: 'Social Category',
      occupation: 'Occupation',
      land_ownership: 'Land Ownership',
      house_ownership: 'House Ownership',
      area_type: 'Area Classification',
      state: 'Domicile State',
      bpl_card: 'BPL Card Status',
      bank_account: 'DBT Bank Account',
      education: 'Education Level'
    };
    return map[clean] || clean.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  },

  /**
   * Formats citizen values with Indian currency & units
   */
  formatValue(field, val) {
    if (val === undefined || val === null) return 'Not Provided';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (field.includes('income')) return `₹${Number(val).toLocaleString('en-IN')}`;
    if (field.includes('age')) return `${val} years`;
    if (Array.isArray(val)) return val.map(v => String(v).toUpperCase()).join(', ');
    return String(val).replace(/_/g, ' ').toUpperCase();
  },

  /**
   * Formats required rule thresholds into clear statements
   */
  formatRequirement(op, target) {
    const symbolMap = {
      EQ: '=',
      NEQ: '≠',
      GT: '>',
      GTE: '≥',
      LT: '<',
      LTE: '≤',
      IN: 'One of',
      NOT_IN: 'None of',
      CONTAINS: 'Must contain'
    };
    const sym = symbolMap[op] || '';
    if (Array.isArray(target)) {
      return `${sym} [${target.map(t => String(t).toUpperCase()).join(', ')}]`;
    }
    if (typeof target === 'number' && target > 1000) {
      return `${sym} ₹${target.toLocaleString('en-IN')}`;
    }
    if (typeof target === 'boolean') {
      return target ? 'Required' : 'Not Required';
    }
    return `${sym} ${String(target).toUpperCase()}`;
  },

  /**
   * Converts legacy scheme flat rules into AST schema seamlessly
   */
  convertLegacyRulesToAST(rules = {}) {
    const subRules = [];
    const incomeType = rules.income_type || 'individual';

    if (rules.income_limit !== undefined && rules.income_limit !== null) {
      subRules.push({
        field: incomeType === 'household' ? 'household.income_annual' : 'citizen.income_annual',
        op: 'LTE',
        value: Number(rules.income_limit),
        label: `${incomeType === 'household' ? 'Household' : 'Individual'} Income Limit`,
        impact: 'critical'
      });
    }

    if (rules.min_age !== undefined && rules.min_age !== null) {
      subRules.push({
        field: 'citizen.age',
        op: 'GTE',
        value: Number(rules.min_age),
        label: 'Minimum Age Requirement',
        impact: 'critical',
        tolerance: 2
      });
    }

    if (rules.max_age !== undefined && rules.max_age !== null) {
      subRules.push({
        field: 'citizen.age',
        op: 'LTE',
        value: Number(rules.max_age),
        label: 'Maximum Age Requirement',
        impact: 'critical',
        tolerance: 2
      });
    }

    if (rules.gender) {
      subRules.push({
        field: 'citizen.gender',
        op: Array.isArray(rules.gender) ? 'IN' : 'EQ',
        value: rules.gender,
        label: 'Gender Eligibility',
        impact: 'critical'
      });
    }

    if (rules.category) {
      subRules.push({
        field: 'citizen.category',
        op: Array.isArray(rules.category) ? 'IN' : 'EQ',
        value: rules.category,
        label: 'Social Category',
        impact: 'critical'
      });
    }

    if (rules.occupation) {
      subRules.push({
        field: 'citizen.occupation',
        op: Array.isArray(rules.occupation) ? 'IN' : 'EQ',
        value: rules.occupation,
        label: 'Occupation Status',
        impact: 'critical'
      });
    }

    if (rules.state) {
      subRules.push({
        field: 'citizen.state',
        op: Array.isArray(rules.state) ? 'IN' : 'EQ',
        value: rules.state,
        label: 'Domicile / State Requirement',
        impact: 'critical'
      });
    }

    if (rules.area_type) {
      subRules.push({
        field: 'citizen.area_type',
        op: Array.isArray(rules.area_type) ? 'IN' : 'EQ',
        value: rules.area_type,
        label: 'Area Classification',
        impact: 'moderate'
      });
    }

    if (rules.land_ownership) {
      subRules.push({
        field: 'citizen.land_ownership',
        op: Array.isArray(rules.land_ownership) ? 'IN' : 'EQ',
        value: rules.land_ownership,
        label: 'Land Holding Capacity',
        impact: 'critical'
      });
    }

    if (rules.house_ownership) {
      subRules.push({
        field: 'citizen.house_ownership',
        op: Array.isArray(rules.house_ownership) ? 'IN' : 'EQ',
        value: rules.house_ownership,
        label: 'Housing Condition',
        impact: 'moderate'
      });
    }

    if (rules.bpl_required) {
      subRules.push({
        field: 'citizen.bpl_card',
        op: 'EQ',
        value: true,
        label: 'BPL / Antyodaya Ration Status',
        impact: 'critical'
      });
    }

    if (rules.bank_account_required) {
      subRules.push({
        field: 'citizen.bank_account',
        op: 'NEQ',
        value: false,
        label: 'Active DBT Bank Account',
        impact: 'critical'
      });
    }

    if (rules.education) {
      subRules.push({
        field: 'citizen.education',
        op: Array.isArray(rules.education) ? 'IN' : 'EQ',
        value: rules.education,
        label: 'Educational Attainment',
        impact: 'moderate'
      });
    }

    return {
      combinator: 'AND',
      label: 'Standard Eligibility Ruleset',
      rules: subRules
    };
  },

  /**
   * Flattens AST breakdown for simple UI display & table rendering
   */
  flattenBreakdown(node) {
    const list = [];
    if (node.type === 'predicate') {
      list.push({
        rule: node.label,
        field: node.field,
        status: node.passed ? 'passed' : 'failed',
        citizenValue: node.citizenValue,
        requiredValue: node.requiredValue,
        impact: node.impact,
        nearMiss: node.nearMiss,
        delta: node.delta
      });
    } else if (node.children) {
      node.children.forEach(child => {
        list.push(...this.flattenBreakdown(child));
      });
    }
    return list;
  },

  /**
   * Evaluates citizen documents against scheme requirements
   */
  evaluateDocuments(citizenDocuments = [], schemeDocuments = []) {
    const normUserDocs = (citizenDocuments || []).map(d => (typeof d === 'string' ? d : d.name || '').toLowerCase());
    const required = schemeDocuments || [];

    const docStatus = required.map(docName => {
      const docLower = String(docName).toLowerCase();
      const isAvailable = normUserDocs.some(u => u.includes(docLower) || docLower.includes(u));
      return {
        name: docName,
        available: isAvailable,
        status: isAvailable ? 'available' : 'missing'
      };
    });

    const missingCount = docStatus.filter(d => !d.available).length;
    return {
      allAvailable: missingCount === 0,
      missingCount,
      totalRequired: required.length,
      docStatus
    };
  },

  /**
   * Computes household aggregate income without double counting
   */
  computeHouseholdIncome(citizen, householdMembers = []) {
    const citizenIncome = (citizen?.income_annual !== undefined && citizen?.income_annual !== null && citizen?.income_annual !== '')
      ? Number(citizen.income_annual)
      : undefined;

    let memberTotal = 0;
    let hasMemberIncome = false;

    (householdMembers || []).forEach(m => {
      if (m.income_annual !== undefined && m.income_annual !== null && m.income_annual !== '') {
        memberTotal += Number(m.income_annual);
        hasMemberIncome = true;
      }
    });

    if (citizenIncome === undefined && !hasMemberIncome) {
      return undefined;
    }

    // If household members have declared incomes, sum citizen's personal income with members
    // Otherwise fallback to citizen's self-reported household income
    return (citizenIncome || 0) + memberTotal;
  },

  /**
   * Evaluates a full Scheme against a Citizen Profile + Household + Documents Context
   */
  evaluateScheme(citizen = {}, householdMembers = [], scheme = {}, citizenDocuments = []) {
    const context = {
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
        income_annual: this.computeHouseholdIncome(citizen, householdMembers),
        membersCount: (householdMembers || []).length + 1,
        members: householdMembers || []
      },
      documents: citizenDocuments || []
    };

    // Obtain or construct AST
    const ast = scheme.ast_rules || (scheme.rules ? this.convertLegacyRulesToAST(scheme.rules) : null);

    let astResult = null;
    let flatBreakdown = [];

    if (ast && ast.rules && ast.rules.length > 0) {
      astResult = this.evaluateNode(ast, context);
      flatBreakdown = this.flattenBreakdown(astResult);
    }

    // Compute weights & match percentage
    let totalWeight = 0;
    let passedWeight = 0;
    let criticalFails = 0;
    let moderateFails = 0;
    let missingDataCount = 0;
    let hasNearMiss = false;

    flatBreakdown.forEach(b => {
      const weight = b.impact === 'critical' ? 2 : 1;
      totalWeight += weight;

      if (b.status === 'passed') {
        passedWeight += weight;
      } else if (b.status === 'insufficient_data') {
        missingDataCount++;
      } else {
        if (b.impact === 'critical') criticalFails++;
        else moderateFails++;
        if (b.nearMiss) hasNearMiss = true;
      }
    });

    // Check Documents
    const docEval = this.evaluateDocuments(citizenDocuments, scheme.documents || scheme.required_documents || []);

    // Determine Final Status with 3-Valued Precision
    let status = 'eligible';
    const totalFails = criticalFails + moderateFails;

    if (missingDataCount > 0 && totalFails === 0) {
      status = 'insufficient_data';
    } else if (totalFails === 0 && missingDataCount === 0) {
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

    const schemeTag = (scheme.short_name || scheme.scheme_code || 'SCH').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const decisionId = `DEC-${schemeTag}-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      decisionId,
      schemeId: scheme.id,
      schemeCode: scheme.scheme_code || scheme.short_name,
      schemeName: scheme.name || scheme.official_name,
      schemeShortName: scheme.short_name,
      benefit: scheme.benefit || scheme.benefits_summary,
      benefitAmount: scheme.benefit_amount || scheme.benefit,
      type: scheme.type || scheme.scheme_type,
      govLevel: scheme.gov_level || scheme.government_level,
      ministry: scheme.ministry,
      department: scheme.department,
      status,
      matchPercentage,
      missingDataCount,
      ruleBreakdown: flatBreakdown,
      astResult,
      documents: docEval.docStatus,
      missingDocumentsCount: docEval.missingCount,
      allDocumentsReady: docEval.allAvailable,
      ruleVersion: scheme.rule_version || '1.0.0',
      ruleEffectiveFrom: scheme.rule_effective_from || scheme.effective_date || '2025-01-01',
      lastVerifiedAt: scheme.last_verified_at || '2026-08-28T00:00:00Z',
      officialSource: scheme.official_source || scheme.source_url
    };
  },

  /**
   * Evaluates all schemes for a citizen profile
   */
  evaluateEligibility(citizen, householdMembers = [], schemes = [], citizenDocuments = []) {
    if (!citizen || !schemes || schemes.length === 0) return [];
    return schemes.map(s => this.evaluateScheme(citizen, householdMembers, s, citizenDocuments));
  },

  /**
   * Evaluates entire household and aggregates portfolio entitlements
   */
  evaluateHouseholdPortfolio(citizen, householdMembers = [], schemes = [], citizenDocuments = []) {
    const allMembers = [
      { ...citizen, relation: 'Self', isPrimary: true },
      ...(householdMembers || []).map(m => ({ ...m, isPrimary: false }))
    ];

    const memberEvaluations = allMembers.map(member => {
      const results = this.evaluateEligibility(member, householdMembers, schemes, citizenDocuments);
      const eligible = results.filter(r => r.status === 'eligible');
      const nearlyEligible = results.filter(r => r.status === 'nearly_eligible');

      return {
        memberId: member.id || member.relation,
        name: member.name || member.relation,
        relation: member.relation || 'Member',
        occupation: member.occupation || 'unspecified',
        age: member.age,
        eligibleCount: eligible.length,
        nearlyCount: nearlyEligible.length,
        eligibleSchemes: eligible,
        nearlySchemes: nearlyEligible
      };
    });

    // Aggregate deduplicated schemes across the household
    const householdSchemeMap = new Map();
    memberEvaluations.forEach(me => {
      me.eligibleSchemes.forEach(s => {
        if (!householdSchemeMap.has(s.schemeId)) {
          householdSchemeMap.set(s.schemeId, {
            ...s,
            beneficiaries: [me.name],
            priorityScore: (s.matchPercentage || 100) - (s.missingDocumentsCount * 10)
          });
        } else {
          householdSchemeMap.get(s.schemeId).beneficiaries.push(me.name);
        }
      });
    });

    const portfolioSchemes = Array.from(householdSchemeMap.values())
      .sort((a, b) => b.priorityScore - a.priorityScore);

    return {
      totalMembers: allMembers.length,
      memberEvaluations,
      portfolioSchemes,
      totalHouseholdEligible: portfolioSchemes.length
    };
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
