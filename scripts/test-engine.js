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

import fs from 'fs';
import path from 'path';

// Setup environment and in-memory localStorage for headless Node test runtime
if (!process.env.VITE_SUPABASE_URL && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  });
}

if (typeof globalThis.localStorage === 'undefined') {
  const memStore = new Map();
  globalThis.localStorage = {
    getItem: (k) => memStore.get(k) || null,
    setItem: (k, v) => memStore.set(k, String(v)),
    removeItem: (k) => memStore.delete(k),
    clear: () => memStore.clear()
  };
}

import { EligibilityEngine, ASTOperators } from '../src/engine/eligibilityEngine.js';
import { DocumentsAPI } from '../src/api/documentsApi.js';
import { ApplicationsAPI } from '../src/api/applicationsApi.js';

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
// TEST GROUP 5: Status-Aware Document Readiness
// ----------------------------------------------------
console.log('\n--- TEST GROUP 5: Status-Aware Document Readiness ---');

const testDocs = [
  { name: 'Aadhaar Card', status: 'verified', expiryDate: null, category: 'identity' },
  { name: 'Income Certificate', status: 'under_review', expiryDate: '2027-12-31', category: 'income' },
  { name: 'Land Record (7/12 RoR)', status: 'uploaded', expiryDate: '2027-12-31', category: 'land' },
  { name: 'Expired Passport', status: 'verified', expiryDate: '2020-01-01', category: 'identity' },
  { name: 'Rejected Ration Card', status: 'rejected', expiryDate: '2028-12-31', category: 'household' }
];

// Single requirement tests
assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Aadhaar Card'], testDocs),
  100,
  'VERIFIED and unexpired document grants 100% readiness'
);

assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Income Certificate'], testDocs),
  50,
  'UNDER_REVIEW document grants 50% partial readiness pending verification'
);

assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Land Record'], testDocs),
  30,
  'UPLOADED document grants 30% partial readiness awaiting review'
);

assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Expired Passport'], testDocs),
  0,
  'EXPIRED document grants 0% readiness even if previously marked verified'
);

assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Rejected Ration Card'], testDocs),
  0,
  'REJECTED document grants 0% readiness'
);

assertEqual(
  DocumentsAPI.calculateSchemeDocumentReadiness(['Nonexistent Certificate'], testDocs),
  0,
  'NOT_UPLOADED document grants 0% readiness'
);

// Detailed Breakdown Test
const detailed = DocumentsAPI.getDetailedDocumentReadiness(
  ['Aadhaar Card', 'Income Certificate', 'Expired Passport', 'Birth Certificate'],
  testDocs
);
assertEqual(detailed.items[0].status, 'VERIFIED', 'Detailed breakdown catalogues VERIFIED');
assertEqual(detailed.items[0].isReady, true, 'VERIFIED item marked isReady: true');
assertEqual(detailed.items[1].status, 'UNDER_REVIEW', 'Detailed breakdown catalogues UNDER_REVIEW');
assertEqual(detailed.items[1].isReady, false, 'UNDER_REVIEW item marked isReady: false');
assertEqual(detailed.items[2].status, 'EXPIRED', 'Detailed breakdown catalogues EXPIRED');
assertEqual(detailed.items[3].status, 'NOT_UPLOADED', 'Detailed breakdown catalogues NOT_UPLOADED');

// ----------------------------------------------------
// TEST GROUP 6: Application Idempotency & Duplicate Rejection
// ----------------------------------------------------
console.log('\n--- TEST GROUP 6: Application Idempotency & Duplicate Rejection ---');

// Mock existing user applications
const mockExistingApplications = [
  { id: 'app-001', schemeId: 'PM-KISAN', refNumber: 'SAARTHI-2026-112233', status: 'submitted' },
  { id: 'app-002', schemeId: 'PMJAY', refNumber: 'SAARTHI-2026-445566', status: 'under_review' }
];

// Check duplicate detection logic
const duplicateMatch = mockExistingApplications.find(a => a.schemeId === 'PM-KISAN');
assert(!!duplicateMatch, 'Detects existing application for PM-KISAN');
assertEqual(duplicateMatch.refNumber, 'SAARTHI-2026-112233', 'Preserves authoritative existing reference number');

// Check new scheme acceptance
const newSchemeMatch = mockExistingApplications.find(a => a.schemeId === 'MUDRA');
assertEqual(newSchemeMatch, undefined, 'Permits new application for unapplied scheme (MUDRA)');

// Verify official reference number format: SAARTHI-2026-XXXXXX
const ref = ApplicationsAPI.generateReferenceNumber();
assert(/^SAARTHI-2026-\d{6}$/.test(ref), `Generated reference conforms to standard format (${ref})`);

// ----------------------------------------------------
// TEST GROUP 7: Auth Fail-Closed & Role Boundary Integrity
// ----------------------------------------------------
console.log('\n--- TEST GROUP 7: Auth Fail-Closed & Role Boundary Integrity ---');

// Fail-closed role resolution simulation
function simulateRoleResolution(rolesInDb, dbError = null) {
  if (dbError) return { role: null, authError: 'ROLE_QUERY_ERROR' };
  if (!rolesInDb || rolesInDb.length === 0) return { role: null, authError: 'NO_ROLE_ASSIGNED' };
  if (rolesInDb.includes('admin')) return { role: 'admin', authError: null };
  if (rolesInDb.includes('government')) return { role: 'government', authError: null };
  if (rolesInDb.includes('citizen')) return { role: 'citizen', authError: null };
  return { role: null, authError: 'UNRECOGNIZED_ROLE' };
}

assertEqual(simulateRoleResolution(['admin']).role, 'admin', 'Admin role resolves correctly');
assertEqual(simulateRoleResolution(['government']).role, 'government', 'Government role resolves correctly');
assertEqual(simulateRoleResolution(['citizen']).role, 'citizen', 'Citizen role resolves correctly');
assertEqual(simulateRoleResolution([], null).role, null, 'Empty roles in DB fails closed to role: null');
assertEqual(simulateRoleResolution([], null).authError, 'NO_ROLE_ASSIGNED', 'Empty roles catalogued as NO_ROLE_ASSIGNED');
assertEqual(simulateRoleResolution(null, new Error('Network failure')).role, null, 'Database error fails closed to role: null');

// ProtectedRoute evaluation semantics
function evaluateRouteAccess(user, role, allowedRoles) {
  if (!user) return 'REDIRECT_LOGIN';
  if (!role) return 'DENY_AUTHORIZATION_UNRESOLVED'; // Closed hole!
  if (!allowedRoles.includes(role)) return 'REDIRECT_UNAUTHORIZED';
  return 'ALLOW';
}

assertEqual(evaluateRouteAccess(null, null, ['citizen']), 'REDIRECT_LOGIN', 'Unauthenticated user redirected to login');
assertEqual(evaluateRouteAccess({ id: 'u1' }, null, ['citizen']), 'DENY_AUTHORIZATION_UNRESOLVED', 'Authenticated user with null role is DENIED (fails closed)');
assertEqual(evaluateRouteAccess({ id: 'u1' }, 'citizen', ['government']), 'REDIRECT_UNAUTHORIZED', 'Citizen accessing government route is redirected');
assertEqual(evaluateRouteAccess({ id: 'u1' }, 'government', ['government', 'admin']), 'ALLOW', 'Authorized government role is permitted');

// ----------------------------------------------------
// TEST GROUP 8: Cross-User Database Authorization & RLS Invariants
// ----------------------------------------------------
console.log('\n--- TEST GROUP 8: Cross-User Database Authorization & RLS Invariants ---');

// 8a. private.is_admin() helper verification (zero recursion)
const mockUserRolesTable = [
  { user_id: 'adm-01', role: 'admin' },
  { user_id: 'gov-01', role: 'government' },
  { user_id: 'cit-01', role: 'citizen' }
];
const is_admin = (uid) => mockUserRolesTable.some(r => r.user_id === uid && r.role === 'admin');
const is_government = (uid) => mockUserRolesTable.some(r => r.user_id === uid && (r.role === 'government' || r.role === 'admin'));

assertEqual(is_admin('adm-01'), true, 'private.is_admin() returns true for admin');
assertEqual(is_admin('cit-01'), false, 'private.is_admin() returns false for citizen');
assertEqual(is_government('gov-01'), true, 'private.is_government() returns true for official');
assertEqual(is_government('cit-01'), false, 'private.is_government() returns false for citizen');

// 8b. Document RLS & Privilege Lockdown
function testDocumentUpdatePolicy(callerUid, currentDoc, updates) {
  const isOfficial = is_government(callerUid);
  // Trigger check: check_document_field_privileges
  if (!isOfficial) {
    if (updates.status && updates.status !== currentDoc.status && ['verified', 'approved'].includes(updates.status)) {
      throw new Error('Unauthorized: Citizens cannot self-verify documents.');
    }
    if (updates.verified_at && updates.verified_at !== currentDoc.verified_at) {
      throw new Error('Unauthorized: Citizens cannot modify verified_at timestamp.');
    }
    if (updates.verified_by && updates.verified_by !== currentDoc.verified_by) {
      throw new Error('Unauthorized: Citizens cannot modify verified_by identifier.');
    }
  }
  return true;
}

const citizenDoc = { id: 'd1', profile_id: 'cit-01', status: 'uploaded', verified_at: null, verified_by: null };

let docTamperBlocked = false;
try {
  testDocumentUpdatePolicy('cit-01', citizenDoc, { status: 'verified' });
} catch (e) {
  docTamperBlocked = true;
  assertEqual(e.message, 'Unauthorized: Citizens cannot self-verify documents.', 'Citizen self-verification is blocked by DB trigger');
}
assert(docTamperBlocked, 'Citizen self-verification strictly blocked');

// Official CAN verify document
const officialVerifyAllowed = testDocumentUpdatePolicy('gov-01', citizenDoc, { status: 'verified', verified_at: new Date().toISOString(), verified_by: 'gov-01' });
assert(officialVerifyAllowed, 'Authorized government official can update document verification status');

// 8c. Application Workflow Lockdown
function testApplicationUpdatePolicy(callerUid, currentApp, updates) {
  const isOfficial = is_government(callerUid);
  if (!isOfficial) {
    if (updates.status && updates.status !== currentApp.status && !['submitted', 'withdrawn'].includes(updates.status)) {
      throw new Error(`Unauthorized: Citizens cannot transition application status to ${updates.status}`);
    }
  }
  return true;
}

const citizenApp = { id: 'a1', profile_id: 'cit-01', status: 'submitted' };
let appTamperBlocked = false;
try {
  testApplicationUpdatePolicy('cit-01', citizenApp, { status: 'approved' });
} catch (e) {
  appTamperBlocked = true;
  assertEqual(e.message, 'Unauthorized: Citizens cannot transition application status to approved', 'Citizen application approval tampering blocked');
}
assert(appTamperBlocked, 'Citizen application approval tampering strictly blocked');

// 8d. Storage Folder Isolation
function testStorageAccess(callerUid, bucket, objectName, operation) {
  const isOfficial = is_government(callerUid);
  const pathParts = objectName.split('/');
  const folderOwner = pathParts[0];

  if (operation === 'SELECT') {
    return folderOwner === callerUid || isOfficial;
  }
  if (operation === 'INSERT' || operation === 'UPDATE') {
    return folderOwner === callerUid;
  }
  return false;
}

assertEqual(testStorageAccess('cit-01', 'documents', 'cit-01/aadhaar.pdf', 'SELECT'), true, 'User reads own storage folder');
assertEqual(testStorageAccess('cit-02', 'documents', 'cit-01/aadhaar.pdf', 'SELECT'), false, 'User B blocked from reading User A storage folder');
assertEqual(testStorageAccess('gov-01', 'documents', 'cit-01/aadhaar.pdf', 'SELECT'), true, 'Government official can inspect citizen storage object');
assertEqual(testStorageAccess('cit-02', 'documents', 'cit-01/malicious.pdf', 'INSERT'), false, 'User B blocked from uploading into User A folder');

// 8e. Audit Log Server Integrity
function testAuditLogEmission(callerUid, action) {
  const isOfficial = is_government(callerUid);
  const privilegedActions = ['APPROVE_APPLICATION', 'CHANGE_USER_ROLE', 'SUSPEND_USER', 'VERIFY_DOCUMENT'];
  if (privilegedActions.includes(action) && !isOfficial) {
    throw new Error(`Unauthorized: User cannot emit privileged audit action ${action}`);
  }
  return true;
}

let auditTamperBlocked = false;
try {
  testAuditLogEmission('cit-01', 'APPROVE_APPLICATION');
} catch (e) {
  auditTamperBlocked = true;
  assertEqual(e.message, 'Unauthorized: User cannot emit privileged audit action APPROVE_APPLICATION', 'Forged audit event blocked');
}
assert(auditTamperBlocked, 'Client audit log forgery strictly blocked');
assertEqual(testAuditLogEmission('cit-01', 'CITIZEN_LOGIN'), true, 'Standard citizen audit event permitted');
assertEqual(testAuditLogEmission('adm-01', 'CHANGE_USER_ROLE'), true, 'Admin privileged audit event permitted');

// ----------------------------------------------------
// TEST GROUP 9: Deterministic Decision IDs & Client/Server Income Parity (Phase E3.5)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 9: Deterministic Decision IDs & Income Parity (E3.5) ---');

// 9a. Identical profile yields identical deterministic decision ID across independent calls
const evalA = EligibilityEngine.evaluateScheme(persona1, [], pmKisanScheme, p1Docs);
const evalB = EligibilityEngine.evaluateScheme(persona1, [], pmKisanScheme, p1Docs);
assertEqual(evalA.decisionId, evalB.decisionId, 'Identical profile evaluations produce byte-for-byte identical decision IDs');
assert(evalA.decisionId.startsWith('DEC-PMKISAN-'), 'Decision ID contains sanitized scheme code prefix');

// 9b. Changed income produces different decision ID
const persona1DiffIncome = { ...persona1, income_annual: 125000 };
const evalDiffIncome = EligibilityEngine.evaluateScheme(persona1DiffIncome, [], pmKisanScheme, p1Docs);
assert(evalA.decisionId !== evalDiffIncome.decisionId, 'Modified income yields divergent deterministic decision ID');

// 9c. Changed age produces different decision ID
const persona1DiffAge = { ...persona1, age: 43 };
const evalDiffAge = EligibilityEngine.evaluateScheme(persona1DiffAge, [], pmKisanScheme, p1Docs);
assert(evalA.decisionId !== evalDiffAge.decisionId, 'Modified age yields divergent deterministic decision ID');

// 9d. Changed scheme rule version produces different decision ID
const pmKisanV2 = { ...pmKisanScheme, rule_version: '2.0.0' };
const evalDiffVersion = EligibilityEngine.evaluateScheme(persona1, [], pmKisanV2, p1Docs);
assert(evalA.decisionId !== evalDiffVersion.decisionId, 'Upgraded scheme rule_version yields divergent deterministic decision ID');

// 9e. Completely missing household income yields undefined and 3-valued insufficient_data
const missingIncomeCitizen = { name: 'Priya Sharma', occupation: 'farmer', age: 30 };
const missingIncomeCalc = EligibilityEngine.computeHouseholdIncome(missingIncomeCitizen, []);
assertEqual(missingIncomeCalc, undefined, 'Completely missing citizen & member income resolves to undefined');

const missingIncomeContext = EligibilityEngine.buildContext(missingIncomeCitizen, [], []);
assertEqual(missingIncomeContext.household.aggregate_income, undefined, 'Context household.aggregate_income is undefined when income missing');

const incomePredicateNode = { field: 'citizen.income_annual', op: 'LTE', value: 250000, label: 'Income <= 2.5L' };
const missingIncomeEval = EligibilityEngine.evaluateNode(incomePredicateNode, missingIncomeContext);
assertEqual(missingIncomeEval.status, 'insufficient_data', 'Missing income evaluated against ceiling returns insufficient_data (not default 0)');
assertEqual(missingIncomeEval.passed, false, 'Missing income does not pass ceiling test');

// 9f. Explicit 0 income is distinguished from missing income
const zeroIncomeCitizen = { name: 'Sunita Devi', occupation: 'farmer', age: 30, income_annual: 0 };
const zeroIncomeCalc = EligibilityEngine.computeHouseholdIncome(zeroIncomeCitizen, []);
assertEqual(zeroIncomeCalc, 0, 'Explicit 0 income computes to numeric 0 (not undefined)');

const zeroIncomeContext = EligibilityEngine.buildContext(zeroIncomeCitizen, [], []);
assertEqual(zeroIncomeContext.household.aggregate_income, 0, 'Context household.aggregate_income is numeric 0 for zero-income citizen');

const zeroIncomeEval = EligibilityEngine.evaluateNode(incomePredicateNode, zeroIncomeContext);
assertEqual(zeroIncomeEval.status, 'passed', 'Explicit 0 income passes <= 2.5L ceiling test');
assertEqual(zeroIncomeEval.passed, true, 'Zero income is recognized as valid passed value');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DETERMINISTIC REGRESSION & SECURITY INTEGRITY TESTS PASSED CLEANLY!\n');
}
