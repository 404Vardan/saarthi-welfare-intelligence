/**
 * Saarthi Deterministic AST Eligibility Engine - Regression Test Suite
 * 
 * Verifies:
 * 1. AST Boolean Combinators (AND, OR, NOT) & 3-Valued Logic (PASSED, FAILED, INSUFFICIENT_DATA)
 * 2. AST Predicate Operators (EQ, NEQ, GT, GTE, LT, LTE, IN, NOT_IN, CONTAINS, BETWEEN)
 * 3. Deep Context Resolution (Citizen, Household aggregation, Verified Documents)
 * 4. 10 Canonical Statutory Personas against Scheme Registries
 * 5. Decision Reference ID Integrity
 */

import { EligibilityEngine, ASTOperators } from '../src/engine/eligibilityEngine.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`);
  }
}

console.log('====================================================');
console.log('🚀 SAARTHI 2.0 DETERMINISTIC ENGINE REGRESSION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST GROUP 1: AST Operators Direct Evaluation
// ----------------------------------------------------
console.log('--- TEST GROUP 1: AST Predicate Operators ---');
assertEqual(ASTOperators.EQ('farmer', 'farmer'), true, 'EQ matches identical strings');
assertEqual(ASTOperators.EQ('farmer', 'artisan'), false, 'EQ rejects different strings');
assertEqual(ASTOperators.NEQ('farmer', 'artisan'), true, 'NEQ confirms different strings');
assertEqual(ASTOperators.GT(65, 60), true, 'GT handles numeric greater than');
assertEqual(ASTOperators.GT(60, 60), false, 'GT rejects numeric equality');
assertEqual(ASTOperators.GTE(60, 60), true, 'GTE accepts numeric equality');
assertEqual(ASTOperators.LT(25, 30), true, 'LT handles numeric less than');
assertEqual(ASTOperators.LTE(250000, 250000), true, 'LTE accepts numeric ceiling match');
assertEqual(ASTOperators.IN('sc', ['sc', 'st']), true, 'IN finds value in array');
assertEqual(ASTOperators.IN('general', ['sc', 'st']), false, 'IN rejects absent value');
assertEqual(ASTOperators.NOT_IN('general', ['sc', 'st']), true, 'NOT_IN confirms absence');
assertEqual(ASTOperators.CONTAINS('Pradhan Mantri Kisan', 'kisan'), true, 'CONTAINS handles case-insensitive substring');
assertEqual(ASTOperators.BETWEEN(22, [18, 35]), true, 'BETWEEN validates closed numeric range');
assertEqual(ASTOperators.BETWEEN(40, [18, 35]), false, 'BETWEEN rejects out-of-range value');

// ----------------------------------------------------
// TEST GROUP 2: 3-Valued Logic & Missing Profile Fields
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: 3-Valued Logic & Null/Undefined Safety ---');

const emptyCitizen = { name: 'Unknown Citizen' };
const emptyContext = EligibilityEngine.buildContext(emptyCitizen, [], []);

const ageNode = { field: 'citizen.age', op: 'GTE', value: 60, label: 'Age 60+' };
const ageEval = EligibilityEngine.evaluateNode(ageNode, emptyContext);
assertEqual(ageEval.status, 'insufficient_data', 'Missing age returns status = insufficient_data (not false or 0)');
assertEqual(ageEval.passed, false, 'Missing age is not passed');

const incomeNode = { field: 'citizen.income_annual', op: 'LTE', value: 250000, label: 'Income <= 2.5L' };
const incomeEval = EligibilityEngine.evaluateNode(incomeNode, emptyContext);
assertEqual(incomeEval.status, 'insufficient_data', 'Missing income returns status = insufficient_data (not defaulting to 0)');

// AND combinator with missing data
const andGroupWithMissing = {
  combinator: 'AND',
  rules: [
    { field: 'citizen.occupation', op: 'EQ', value: 'farmer', label: 'Occupation is Farmer' },
    { field: 'citizen.age', op: 'GTE', value: 18, label: 'Age 18+' }
  ]
};
const contextFarmerNoAge = EligibilityEngine.buildContext({ occupation: 'farmer' }, [], []);
const andEvalMissing = EligibilityEngine.evaluateNode(andGroupWithMissing, contextFarmerNoAge);
assertEqual(andEvalMissing.status, 'insufficient_data', 'AND group with 1 pass + 1 missing returns insufficient_data');

const contextNotFarmerNoAge = EligibilityEngine.buildContext({ occupation: 'artisan' }, [], []);
const andEvalFail = EligibilityEngine.evaluateNode(andGroupWithMissing, contextNotFarmerNoAge);
assertEqual(andEvalFail.status, 'failed', 'AND group with 1 fail + 1 missing returns failed (short-circuit rejection)');

// OR combinator with missing data
const orGroup = {
  combinator: 'OR',
  rules: [
    { field: 'citizen.category', op: 'EQ', value: 'sc', label: 'SC Category' },
    { field: 'citizen.category', op: 'EQ', value: 'st', label: 'ST Category' }
  ]
};
const contextSC = EligibilityEngine.buildContext({ category: 'sc' }, [], []);
assertEqual(EligibilityEngine.evaluateNode(orGroup, contextSC).status, 'passed', 'OR group with 1 matching condition passes');

// NOT combinator
const notNode = {
  combinator: 'NOT',
  rules: [{ field: 'citizen.occupation', op: 'EQ', value: 'government_officer', label: 'Govt Employee' }]
};
const contextFarmer = EligibilityEngine.buildContext({ occupation: 'farmer' }, [], []);
assertEqual(EligibilityEngine.evaluateNode(notNode, contextFarmer).status, 'passed', 'NOT node passes when child condition is false');

// ----------------------------------------------------
// TEST GROUP 3: Household Income Aggregation
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Household Graph & Income Aggregation ---');
const head = { id: 'head-1', income_annual: 150000 };
const members = [
  { id: 'mem-1', name: 'Spouse', income_annual: 80000 },
  { id: 'mem-2', name: 'Child', income_annual: 20000 }
];
const totalHouseholdIncome = EligibilityEngine.computeHouseholdIncome(head, members);
assertEqual(totalHouseholdIncome, 250000, 'Household income correctly sums head + members (150k + 80k + 20k = 250k)');

const contextHousehold = EligibilityEngine.buildContext(head, members, []);
assertEqual(contextHousehold.household.aggregate_income, 250000, 'Context household.aggregate_income matches computation');

// ----------------------------------------------------
// TEST GROUP 4: 10 Statutory Personas vs Real Schemes
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: 10 Statutory Personas Evaluation ---');

// Persona 1: Marginal Farmer
const persona1 = {
  id: 'p1',
  name: 'Ramesh Patel',
  age: 42,
  gender: 'male',
  occupation: 'farmer',
  income_annual: 120000,
  land_holding_acres: 1.8,
  category: 'obc',
  state: 'Uttar Pradesh',
  bpl_card: true
};

const pmKisanScheme = {
  id: 'pm-kisan',
  scheme_code: 'PM-KISAN',
  official_name: 'Pradhan Mantri Kisan Samman Nidhi',
  category: 'agriculture',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.occupation', op: 'EQ', value: 'farmer', label: 'Is a Farmer/Cultivator' },
      { field: 'citizen.land_holding_acres', op: 'LTE', value: 5.0, label: 'Land holding <= 5 acres' },
      { field: 'citizen.income_annual', op: 'LTE', value: 400000, label: 'Income within marginal threshold' }
    ]
  },
  documents: ['Aadhaar Card', 'Land Records / RoR', 'Bank Passbook']
};

const p1Docs = [
  { type: 'aadhaar', verified: true },
  { type: 'land_records', verified: true },
  { type: 'bank_passbook', verified: true }
];

const p1Eval = EligibilityEngine.evaluateScheme(persona1, [], pmKisanScheme, p1Docs);
assertEqual(p1Eval.status, 'eligible', 'Persona 1 (Marginal Farmer) is ELIGIBLE for PM-KISAN');
assert(p1Eval.decision_reference_id.startsWith('DEC-'), 'P1 receives verifiable decision reference ID (starts with DEC-)');

// Persona 2: High Income Farmer (Ineligible)
const persona2 = {
  ...persona1,
  id: 'p2',
  income_annual: 1500000 // 15L
};
const p2Eval = EligibilityEngine.evaluateScheme(persona2, [], pmKisanScheme, p1Docs);
assertEqual(p2Eval.status, 'not_eligible', 'Persona 2 (High Income ₹15L Farmer) is INELIGIBLE for PM-KISAN');

// Persona 3: SC Post-Matric Student
const persona3 = {
  id: 'p3',
  name: 'Pooja Meghwal',
  age: 20,
  gender: 'female',
  occupation: 'student',
  income_annual: 200000,
  category: 'sc',
  state: 'Rajasthan',
  education_level: 'undergraduate'
};

const postMatricScheme = {
  id: 'post-matric-sc',
  scheme_code: 'POST-MATRIC-SC',
  official_name: 'Post-Matric Scholarship for SC Students',
  category: 'education',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.occupation', op: 'EQ', value: 'student', label: 'Enrolled Student' },
      { field: 'citizen.category', op: 'IN', value: ['sc'], label: 'Belongs to SC community' },
      { field: 'citizen.income_annual', op: 'LTE', value: 250000, label: 'Family Income <= ₹2.5 Lakh/yr' }
    ]
  },
  documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'College Fee Receipt']
};

const p3Eval = EligibilityEngine.evaluateScheme(persona3, [], postMatricScheme, []);
assertEqual(p3Eval.status, 'eligible', 'Persona 3 (SC Student) is ELIGIBLE for Post-Matric Scholarship');

// Persona 4: General Category Student with High Income (Ineligible)
const persona4 = {
  id: 'p4',
  name: 'Rahul Sharma',
  age: 20,
  occupation: 'student',
  income_annual: 800000,
  category: 'general',
  state: 'Delhi'
};
const p4Eval = EligibilityEngine.evaluateScheme(persona4, [], postMatricScheme, []);
assertEqual(p4Eval.status, 'not_eligible', 'Persona 4 (General Student ₹8L) is INELIGIBLE for Post-Matric SC Scheme');

// Persona 5: Senior Citizen BPL (IGNOAPS)
const persona5 = {
  id: 'p5',
  name: 'Devaki Amma',
  age: 68,
  gender: 'female',
  occupation: 'homemaker',
  income_annual: 36000,
  bpl_card: true,
  category: 'general',
  state: 'Kerala'
};

const ignoapsScheme = {
  id: 'ignoaps',
  scheme_code: 'IGNOAPS',
  official_name: 'Indira Gandhi National Old Age Pension Scheme',
  category: 'social_security',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.age', op: 'GTE', value: 60, label: 'Age 60 years or above' },
      { field: 'citizen.bpl_card', op: 'EQ', value: true, label: 'Living Below Poverty Line (BPL)' }
    ]
  },
  documents: ['Aadhaar Card', 'BPL Ration Card', 'Age Proof']
};
const p5Eval = EligibilityEngine.evaluateScheme(persona5, [], ignoapsScheme, []);
assertEqual(p5Eval.status, 'eligible', 'Persona 5 (Senior 68yo BPL) is ELIGIBLE for IGNOAPS Pension');

// Persona 6: Underage Citizen for Pension (Ineligible)
const persona6 = {
  ...persona5,
  id: 'p6',
  age: 45
};
const p6Eval = EligibilityEngine.evaluateScheme(persona6, [], ignoapsScheme, []);
assertEqual(p6Eval.status, 'not_eligible', 'Persona 6 (45yo) is INELIGIBLE for Senior Pension');

// Persona 7: Traditional Artisan (PM Vishwakarma)
const persona7 = {
  id: 'p7',
  name: 'Kallu Mistri',
  age: 34,
  occupation: 'artisan',
  income_annual: 140000,
  state: 'Madhya Pradesh'
};

const vishwakarmaScheme = {
  id: 'pm-vishwakarma',
  scheme_code: 'PM-VISHWAKARMA',
  official_name: 'PM Vishwakarma Kaushal Samman',
  category: 'skill_training',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.occupation', op: 'IN', value: ['artisan', 'carpenter', 'blacksmith', 'potter', 'sculptor'], label: 'Traditional Trade Artisan' },
      { field: 'citizen.age', op: 'GTE', value: 18, label: 'Age 18+' }
    ]
  },
  documents: ['Aadhaar Card', 'Trade Verification Certificate', 'Bank Account']
};
const p7Eval = EligibilityEngine.evaluateScheme(persona7, [], vishwakarmaScheme, []);
assertEqual(p7Eval.status, 'eligible', 'Persona 7 (Artisan) is ELIGIBLE for PM Vishwakarma');

// Persona 8: Urban Street Vendor (PM SVANidhi)
const persona8 = {
  id: 'p8',
  name: 'Sunil Gupta',
  age: 38,
  occupation: 'street_vendor',
  income_annual: 160000,
  urban_rural: 'urban',
  state: 'Gujarat'
};

const svanidhiScheme = {
  id: 'pm-svanidhi',
  scheme_code: 'PM-SVANIDHI',
  official_name: 'PM Street Vendor AtmaNirbhar Nidhi',
  category: 'credit',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.occupation', op: 'EQ', value: 'street_vendor', label: 'Urban Street Vendor / Hawker' },
      { field: 'citizen.age', op: 'GTE', value: 18, label: 'Age 18+' }
    ]
  },
  documents: ['Aadhaar Card', 'Vending Certificate / Urban Local Body ID']
};
const p8Eval = EligibilityEngine.evaluateScheme(persona8, [], svanidhiScheme, []);
assertEqual(p8Eval.status, 'eligible', 'Persona 8 (Street Vendor) is ELIGIBLE for PM SVANidhi');

// Persona 9: Pregnant / Lactating Mother (PMMVY)
const persona9 = {
  id: 'p9',
  name: 'Anjali Devi',
  age: 24,
  gender: 'female',
  is_pregnant_or_lactating: true,
  income_annual: 90000,
  state: 'Bihar'
};

const pmmvyScheme = {
  id: 'pmmvy',
  scheme_code: 'PMMVY',
  official_name: 'Pradhan Mantri Matru Vandana Yojana',
  category: 'healthcare',
  ast_rules: {
    combinator: 'AND',
    rules: [
      { field: 'citizen.gender', op: 'EQ', value: 'female', label: 'Female Beneficiary' },
      { field: 'citizen.age', op: 'GTE', value: 19, label: 'Age 19+' },
      { field: 'citizen.is_pregnant_or_lactating', op: 'EQ', value: true, label: 'Pregnant / Lactating Mother' }
    ]
  },
  documents: ['Aadhaar Card', 'Mother Child Protection (MCP) Card', 'Bank Passbook']
};
const p9Eval = EligibilityEngine.evaluateScheme(persona9, [], pmmvyScheme, []);
assertEqual(p9Eval.status, 'eligible', 'Persona 9 (Pregnant Mother) is ELIGIBLE for PMMVY');

// Persona 10: Incomplete / Unauthenticated Profile (Missing mandatory inputs)
const persona10 = {
  id: 'p10',
  name: 'New Registered User'
  // age, occupation, income, state are missing
};
const p10Eval = EligibilityEngine.evaluateScheme(persona10, [], pmKisanScheme, []);
assertEqual(p10Eval.status, 'insufficient_data', 'Persona 10 (Incomplete Profile) yields insufficient_data without false rejection');
assertEqual(p10Eval.missingFields.length > 0, true, 'Missing fields are catalogued for guided onboarding');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DETERMINISTIC REGRESSION TESTS PASSED CLEANLY!\n');
}
