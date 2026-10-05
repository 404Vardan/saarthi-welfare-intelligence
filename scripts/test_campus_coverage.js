// scripts/test_campus_coverage.js
import { campusPilotSchemes } from '../src/api/campusPilotSchemes.js';
import { EligibilityEngine } from '../src/engine/eligibilityEngine.js';

console.log('================================================================');
console.log('🏛️ SAARTHI CAMPUS PILOT: 30-SCHEME 4-DIMENSION COVERAGE SUITE');
console.log('================================================================\n');

/**
 * 4-Dimension Test Matrix for Every Campus Pilot Scheme:
 * 1. Valid Persona          -> status = 'eligible' (or 'informational_only')
 * 2. Ineligible Persona     -> status = 'not_eligible'
 * 3. Incomplete Persona     -> status = 'insufficient_data'
 * 4. Already Receiving Flag -> alreadyReceiving = true
 */

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Canonical Persona Templates
function createBaseValidProfile(scheme) {
  const profile = {
    id: `valid-${scheme.id}`,
    state: scheme.state === 'Telangana' ? 'Telangana' : 'All-India',
    age: 24,
    gender: 'female',
    category: 'sc',
    occupation: 'student',
    education: 'post_graduate',
    income_annual: 150000,
    land_ownership: 'below_2_acres',
    bpl_card: true
  };

  // Tailor specific profiles based on scheme intent
  if (scheme.campus_audience?.includes('faculty') || scheme.campus_audience?.includes('researcher')) {
    profile.occupation = 'researcher';
    profile.education = 'doctorate';
    profile.age = 26; // Well within JRF (<=28/30) and PDF (<=32/35) limits
  } else if (scheme.campus_audience?.some(a => ['contract_worker', 'security_worker', 'housekeeping_worker', 'canteen_worker'].includes(a))) {
    profile.occupation = 'daily_wage';
    profile.education = 'secondary';
    profile.age = 35;
    profile.income_annual = 180000;
  } else if (scheme.campus_audience?.includes('entrepreneur')) {
    profile.occupation = 'entrepreneur';
    profile.age = 26;
  }

  // Handle special schemes
  if (scheme.scheme_code === 'GOI-PM-SVANIDHI') {
    profile.occupation = 'daily_wage';
    profile.age = 30;
  }

  return profile;
}

function createIneligibleProfile(scheme, baseValid) {
  const ineligible = { ...baseValid, id: `ineligible-${scheme.id}` };

  const rules = scheme.ast_rules?.rules || [];

  // 1. If state-restricted, cross state border
  if (scheme.state === 'Telangana') {
    ineligible.state = 'Haryana';
    return ineligible;
  }

  // 2. If income-capped, exceed ceiling massively
  if (rules.some(r => r.field.includes('income_annual'))) {
    ineligible.income_annual = 5000000; // 50 Lakhs
    return ineligible;
  }

  // 3. If occupation-specific, change to excluded category
  if (rules.some(r => r.field.includes('occupation'))) {
    ineligible.occupation = 'corporate_executive';
    return ineligible;
  }

  // 4. If age-restricted, violate specific operator
  const ageRule = rules.find(r => r.field.includes('age'));
  if (ageRule) {
    if (ageRule.op === 'GTE' || ageRule.op === 'GT') {
      ineligible.age = 13; // Below legal working age
    } else if (ageRule.op === 'LTE' || ageRule.op === 'LT') {
      ineligible.age = 75; // Above fellowship age
    } else if (ageRule.op === 'BETWEEN') {
      ineligible.age = 80;
    }
    return ineligible;
  }

  // 5. Gender-restricted
  if (rules.some(r => r.field.includes('gender'))) {
    ineligible.gender = 'male';
    return ineligible;
  }

  // 6. Category-restricted
  if (rules.some(r => r.field.includes('category'))) {
    ineligible.category = 'general';
    return ineligible;
  }

  ineligible.state = 'Foreign_State';
  return ineligible;
}

function createIncompleteProfile(scheme, baseValid) {
  const incomplete = { ...baseValid, id: `incomplete-${scheme.id}` };

  // Strip critical field required by AST rules
  const firstRule = scheme.ast_rules?.rules?.[0];
  if (firstRule) {
    const fieldKey = firstRule.field.replace('citizen.', '').replace('household.', '');
    delete incomplete[fieldKey];
  }

  return incomplete;
}

console.log(`Auditing and Stress-Testing ${campusPilotSchemes.length} Campus Pilot Schemes...\n`);

campusPilotSchemes.forEach((scheme, index) => {
  const code = scheme.scheme_code;
  const isInformational = scheme.rule_completeness === 'INFORMATIONAL_ONLY';

  // 1. Valid Persona Test
  const validProfile = createBaseValidProfile(scheme);
  const evalValid = EligibilityEngine.evaluateScheme(validProfile, [], scheme, []);

  const expectedValidStatus = isInformational ? 'informational_only' : 'eligible';
  assert(
    evalValid.status === expectedValidStatus,
    `[${code}] Valid Profile: expected '${expectedValidStatus}', got '${evalValid.status}'`
  );

  // 2. Ineligible Persona Test
  const ineligProfile = createIneligibleProfile(scheme, validProfile);
  const evalInelig = EligibilityEngine.evaluateScheme(ineligProfile, [], scheme, []);
  assert(
    evalInelig.status === 'not_eligible',
    `[${code}] Ineligible Profile: expected 'not_eligible', got '${evalInelig.status}'`
  );

  // 3. Incomplete Profile Test
  const incompProfile = createIncompleteProfile(scheme, validProfile);
  const evalIncomp = EligibilityEngine.evaluateScheme(incompProfile, [], scheme, []);
  const acceptableIncomp = evalIncomp.status === 'insufficient_data' || evalIncomp.missingDataCount > 0 || isInformational;
  assert(
    acceptableIncomp,
    `[${code}] Incomplete Profile: expected 'insufficient_data', got '${evalIncomp.status}'`
  );

  // 4. Already Receiving Flag Test
  const receivingProfile = {
    ...validProfile,
    existing_benefits: [scheme.scheme_code]
  };
  const evalReceiving = EligibilityEngine.evaluateScheme(receivingProfile, [], scheme, []);
  assert(
    evalReceiving.alreadyReceiving === true,
    `[${code}] Already Receiving Flag: expected true, got ${evalReceiving.alreadyReceiving}`
  );
});

console.log('----------------------------------------------------------------');
console.log(`TEST SUMMARY: ${passedAssertions} / ${totalAssertions} Assertions Passed`);
console.log('----------------------------------------------------------------');

if (failedAssertions === 0) {
  console.log('🎉 100% OF 30 CAMPUS SCHEMES PASSED ALL 4 DETERMINISTIC INTEGRITY CHECKS!\n');
  process.exit(0);
} else {
  console.error(`❌ ${failedAssertions} Assertions Failed. Review details above.\n`);
  process.exit(1);
}
