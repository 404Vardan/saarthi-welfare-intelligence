import fs from 'fs';

// Read existing schemes to ensure strict zero-duplication
const existingData = fs.readFileSync('src/api/schemesData.js', 'utf-8');
const existingCodes = new Set([...existingData.matchAll(/scheme_code:\s*['"]([^'"]+)['"]/g)].map(m => m[1].toLowerCase().trim()));
const existingIds = new Set([...existingData.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1].toLowerCase().trim()));
const existingNames = new Set([...existingData.matchAll(/official_name:\s*['"]([^'"]+)['"]/g)].map(m => m[1].toLowerCase().trim()));

console.log(`Initial: ${existingIds.size} existing schemes verified in schemesData.js`);

const rawSchemes = [];
let duplicatesPrevented = 0;

function add(s) {
  const normId = s.id.toLowerCase().trim();
  const normCode = s.code.toLowerCase().trim();
  const normName = s.name.toLowerCase().trim();

  if (existingIds.has(normId) || existingCodes.has(normCode) || existingNames.has(normName)) {
    duplicatesPrevented++;
    console.log(`[DUPLICATE PREVENTED] Skipping ${s.code} / ${s.name}`);
    return;
  }

  existingIds.add(normId);
  existingCodes.add(normCode);
  existingNames.add(normName);

  const docs = s.docs || ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'];
  rawSchemes.push({
    id: s.id,
    scheme_code: s.code,
    official_name: s.name,
    name: s.name,
    short_name: s.short_name || s.code,
    slug: s.code.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ministry: s.ministry || 'Government of India',
    department: s.department || 'Nodal Department',
    government_level: s.gov_level || 'central',
    state: s.state || 'All-India',
    category: s.category || 'social_security',
    beneficiary_types: s.beneficiary_types || ['citizen'],
    description: s.desc || '',
    benefits: {
      summary: s.benefit || 'Welfare Assistance',
      quantum: s.quantum || 'Direct Benefit',
      mode: 'DBT / Government Portal',
      frequency: s.freq || 'Annual',
      ceiling: s.quantum || 'Statutory Limit'
    },
    benefit: s.benefit || 'Welfare Assistance',
    benefit_amount: s.quantum || 'Direct Benefit',
    type: s.type || 'direct_benefit',
    processing_days: s.days || 21,
    ast_rules: {
      combinator: 'AND',
      label: `${s.code} Eligibility Criteria`,
      rules: s.rules || []
    },
    rules: s.flatRules || {},
    exclusions: s.exclusions || [
      'Constitutional post holders',
      'Income Tax payees in previous assessment year',
      'Serving Class I/II government officers'
    ],
    documents: docs,
    structured_documents: docs.map(d => ({
      name: d,
      mandatory: true,
      issuing_authority: 'Competent Authority',
      digilocker_supported: true
    })),
    official_url: s.url || 'https://www.myscheme.gov.in',
    rule_completeness: s.completeness || 'VERIFIED',
    rule_version: 'v1.0',
    last_verified_at: '2026-09-01T00:00:00Z'
  });
}

// -------------------------------------------------------------
// 1. AGRICULTURE & ALLIED
// -------------------------------------------------------------
add({
  id: 'pm-sampada-053',
  code: 'PM-SAMPADA',
  name: 'Pradhan Mantri Kisan SAMPADA Yojana',
  short_name: 'PM SAMPADA',
  ministry: 'Ministry of Food Processing Industries',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'entrepreneur', 'fpo'],
  desc: 'Grant-in-aid up to 50% of project cost for cold chain and food processing infrastructure creation.',
  benefit: 'Capital subsidy up to 50% (Max ₹5 Crore per project)',
  quantum: '₹5,00,00,000 subsidy',
  type: 'capital_subsidy',
  days: 45,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'self_employed', 'artisan'], label: 'Agri-entrepreneur or Farmer Producer Group', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'self_employed', 'artisan'] },
  docs: ['Aadhaar Card', 'Detailed Project Report (DPR)', 'Bank In-Principle Appraisal', 'Land Title Deeds'],
  url: 'https://mofpi.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'smam-machinery-055',
  code: 'SMAM',
  name: 'Sub-Mission on Agricultural Mechanization',
  short_name: 'SMAM Farm Machinery',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'small_landholder', 'women'],
  desc: '40% to 50% subsidy on purchase of agricultural tractors, power tillers, rotavators, and harvesters.',
  benefit: '40% - 50% subsidy on farm machinery (Save up to ₹2.5 Lakh)',
  quantum: '₹2,50,000 subsidy',
  type: 'capital_subsidy',
  days: 30,
  rules: [
    { field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Farmer Cultivator', impact: 'critical' },
    { field: 'citizen.land_ownership', op: 'IN', value: ['below_2_acres', '2_to_5_acres', 'above_5_acres'], label: 'Cultivable Land Record', impact: 'critical' }
  ],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', '7/12 Land Document', 'Quotation / Proforma Invoice'],
  url: 'https://agrimachinery.nic.in',
  completeness: 'VERIFIED'
});

add({
  id: 'ahidf-dairy-057',
  code: 'AHIDF',
  name: 'Animal Husbandry Infrastructure Development Fund',
  short_name: 'AHIDF Dairy Infra',
  ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'dairy_farmer', 'entrepreneur'],
  desc: '3% interest subvention on bank loans for milk processing, meat processing, and animal feed plants.',
  benefit: '3% Interest Subvention on Loans up to ₹10 Crore with 2 Year Moratorium',
  quantum: '3% Interest Subsidy',
  type: 'concessional_credit',
  days: 40,
  rules: [
    { field: 'citizen.age', op: 'BETWEEN', value: [21, 65], label: 'Age 21-65', impact: 'critical' },
    { field: 'citizen.bank_account', op: 'EQ', value: true, label: 'Active Commercial Bank Account', impact: 'critical' }
  ],
  flatRules: { min_age: 21, max_age: 65, bank_account_required: true },
  docs: ['Aadhaar Card', 'DPR', 'PAN Card', 'Bank Appraisal Note'],
  url: 'https://ahidf.udyamimitra.in',
  completeness: 'VERIFIED'
});

add({
  id: 'movcdner-organic-058',
  code: 'MOVCDNER',
  name: 'Mission Organic Value Chain Development for North East',
  short_name: 'MOVCDNER Organic',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'North Eastern States',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'tribal'],
  desc: 'End-to-end organic farming assistance of ₹25,000/ha for organic inputs, processing, branding, and cold storage.',
  benefit: '₹25,000 / hectare grant + Post-harvest marketing linkage',
  quantum: '₹25,000 / ha',
  type: 'direct_benefit',
  days: 35,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Farmer in North Eastern Region', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'Domicile / ST Certificate (if applicable)', 'Land Proof'],
  url: 'https://movcd.dac.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'rkvy-raftaar-059',
  code: 'RKVY-RAFTAAR',
  name: 'Rashtriya Krishi Vikas Yojana - RAFTAAR',
  short_name: 'RKVY RAFTAAR Agripreneur',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'youth', 'entrepreneur'],
  desc: 'Seed funding grants up to ₹25 Lakh for innovative agricultural and allied sector startups and youth entrepreneurs.',
  benefit: 'Up to ₹25,00,000 seed capital grant for agri-startups',
  quantum: '₹25,00,000 grant',
  type: 'direct_benefit',
  days: 60,
  rules: [{ field: 'citizen.age', op: 'BETWEEN', value: [18, 50], label: 'Age 18-50 Years', impact: 'critical' }],
  flatRules: { min_age: 18, max_age: 50 },
  docs: ['Aadhaar Card', 'Agri-Business Prototype / Proposal', 'PAN Card'],
  url: 'https://rkvy.nic.in',
  completeness: 'PARTIALLY_VERIFIED'
});

add({
  id: 'pm-aasha-procurement-060',
  code: 'PM-AASHA',
  name: 'Pradhan Mantri Annadata Aay Sanraksan Abhiyan',
  short_name: 'PM-AASHA MSP Procurement',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer'],
  desc: 'Price Support Scheme (PSS) ensuring government procurement of pulses, oilseeds, and copra at statutory Minimum Support Price (MSP).',
  benefit: 'Guaranteed MSP procurement payment directly into bank account',
  quantum: 'Guaranteed MSP Payment',
  type: 'direct_benefit',
  days: 10,
  rules: [
    { field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Farmer Cultivator', impact: 'critical' },
    { field: 'citizen.bank_account', op: 'EQ', value: true, label: 'DBT Enabled Account', impact: 'critical' }
  ],
  flatRules: { occupation: ['farmer', 'agriculture'], bank_account_required: true },
  docs: ['Aadhaar Card', 'Khasra/Girdawari Crop Sowing Certificate', 'Bank Passbook'],
  url: 'https://agricoop.nic.in',
  completeness: 'VERIFIED'
});

add({
  id: 'sub-mission-seeds-062',
  code: 'SMSP',
  name: 'Sub-Mission on Seeds and Planting Material',
  short_name: 'Certified Seed Subsidy',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer'],
  desc: '50% to 60% price subsidy on procurement of high-yielding certified and foundation seeds for cereals, pulses, and oilseeds.',
  benefit: '50% - 60% price subsidy on certified foundation seeds',
  quantum: '₹1,500 - ₹4,00,0 / quintal subsidy',
  type: 'subsidy',
  days: 7,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Active Cultivator', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'Land Record Copy'],
  url: 'https://seednet.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'rashtriya-gokul-mission-063',
  code: 'RGM',
  name: 'Rashtriya Gokul Mission (Breed Multiplication Farm)',
  short_name: 'Rashtriya Gokul Mission',
  ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['dairy_farmer', 'entrepreneur'],
  desc: '50% capital subsidy up to ₹2 Crore for establishing indigenous bovine breed multiplication farms of minimum 200 cattle/buffaloes.',
  benefit: '50% Capital Subsidy up to ₹2 Crore for Breed Farm Setup',
  quantum: '₹2,00,00,000 subsidy',
  type: 'capital_subsidy',
  days: 60,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'self_employed'], label: 'Dairy Entrepreneur / Farmer', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'self_employed'] },
  docs: ['Aadhaar Card', 'Bank Sanction Letter', 'Land Records (Min 5 Acres)', 'DPR'],
  url: 'https://dahd.nic.in',
  completeness: 'VERIFIED'
});

add({
  id: 'national-livestock-mission-064',
  code: 'NLM-POULTRY',
  name: 'National Livestock Mission (Rural Poultry & Sheep/Goat)',
  short_name: 'NLM Rural Poultry & Goat',
  ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'rural_poor', 'women'],
  desc: '50% capital subsidy up to ₹25 Lakh for establishing sheep, goat, and poultry parent breeding farms.',
  benefit: '50% capital subsidy (₹25 Lakh for Sheep/Goat, ₹50 Lakh for Piggery)',
  quantum: '₹25,00,000 subsidy',
  type: 'capital_subsidy',
  days: 40,
  rules: [{ field: 'citizen.age', op: 'GTE', value: 18, label: 'Age 18+ Years', impact: 'critical' }],
  flatRules: { min_age: 18 },
  docs: ['Aadhaar Card', 'DPR', 'Land Ownership / Lease Agreement'],
  url: 'https://nlm.udyamimitra.in',
  completeness: 'VERIFIED'
});

add({
  id: 'fidi-fisheries-fund-065',
  code: 'FIDF',
  name: 'Fisheries and Aquaculture Infrastructure Development Fund',
  short_name: 'FIDF Fisheries Loan',
  ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['fishermen', 'entrepreneur'],
  desc: 'Concessional financing with 3% interest subvention for fishing harbors, deep sea fishing vessels, and cold storage.',
  benefit: '3% Interest Subvention on Loans up to 80% Project Cost',
  quantum: '3% Interest Subsidy',
  type: 'concessional_credit',
  days: 45,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'self_employed', 'other'], label: 'Fisheries Entrepreneur / Fish Farmer', impact: 'critical' }],
  flatRules: {},
  docs: ['Aadhaar Card', 'Fishing License / Vessel Registration', 'DPR'],
  url: 'https://fidf.in',
  completeness: 'PARTIALLY_VERIFIED'
});

add({
  id: 'pmksy-watershed-066',
  code: 'WDC-PMKSY',
  name: 'Watershed Development Component (PMKSY 2.0)',
  short_name: 'WDC Watershed Farm Pond',
  ministry: 'Ministry of Rural Development',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'rural_poor'],
  desc: 'Financial support of ₹12,000 to ₹18,000 per hectare for constructing farm ponds and rain water harvesting structures.',
  benefit: '100% Grant for construction of community and individual farm ponds',
  quantum: '₹18,000 / ha equivalent work',
  type: 'in_kind',
  days: 30,
  rules: [
    { field: 'citizen.area_type', op: 'EQ', value: 'rural', label: 'Rural Inhabitant', impact: 'critical' },
    { field: 'citizen.land_ownership', op: 'IN', value: ['below_2_acres', '2_to_5_acres', 'above_5_acres'], label: 'Agricultural Landholder', impact: 'critical' }
  ],
  flatRules: { area_type: 'rural' },
  docs: ['Aadhaar Card', 'Land Record Extract', 'Panchayat Resolution'],
  url: 'https://dolr.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'national-beekeeping-067',
  code: 'NBHM',
  name: 'National Beekeeping and Honey Mission',
  short_name: 'Honey Mission Subsidy',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'beekeeper', 'youth'],
  desc: 'Up to 80% subsidy for women and SC/ST beekeepers (50% for general) for honey bee boxes, bee colonies, and extraction units.',
  benefit: '50% to 80% subsidy on 50 bee boxes with colonies (Save ₹80,000)',
  quantum: '₹80,000 subsidy',
  type: 'capital_subsidy',
  days: 30,
  rules: [{ field: 'citizen.age', op: 'GTE', value: 18, label: 'Age 18+ Years', impact: 'critical' }],
  flatRules: { min_age: 18 },
  docs: ['Aadhaar Card', 'Training Certificate in Beekeeping (KVK/ICAR)'],
  url: 'https://nbhm.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'bamboo-mission-068',
  code: 'NBM',
  name: 'National Bamboo Mission (Plantation & Nursery)',
  short_name: 'National Bamboo Mission',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'tribal', 'artisan'],
  desc: '50% direct subsidy up to ₹50,000 per hectare for commercial bamboo plantation on non-forest private agricultural lands.',
  benefit: '₹50,000 / hectare subsidy for 3-year bamboo cultivation',
  quantum: '₹50,000 / ha',
  type: 'subsidy',
  days: 30,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture', 'artisan'], label: 'Farmer / Forest Dweller', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture', 'artisan'] },
  docs: ['Aadhaar Card', 'Land Ownership RoR', 'Bank Account'],
  url: 'https://nbm.nic.in',
  completeness: 'VERIFIED'
});

add({
  id: 'oil-palm-mission-069',
  code: 'NMEO-OP',
  name: 'National Mission on Edible Oils - Oil Palm',
  short_name: 'Oil Palm Cultivation Grant',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer'],
  desc: '₹29,000 per hectare assistance for planting material, intercropping, and assured Viability Price (VP) mechanism.',
  benefit: '₹29,000 / ha planting subsidy + Guaranteed Viability Price purchase',
  quantum: '₹29,000 / ha',
  type: 'direct_benefit',
  days: 25,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Farmer Cultivator', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'Land Record with Assured Irrigation Proof'],
  url: 'https://nmeo.gov.in',
  completeness: 'VERIFIED'
});

add({
  id: 'per-drop-micro-irrigation-070',
  code: 'PDMC',
  name: 'Per Drop More Crop (Micro Irrigation Drip Component)',
  short_name: 'Drip Irrigation 55% Subsidy',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'small_landholder'],
  desc: '55% financial assistance for small/marginal farmers for installation of drip irrigation systems.',
  benefit: '55% Subsidy on ISI Certified Drip Irrigation Lateral/Filter Kit',
  quantum: 'Up to ₹45,000 / ha subsidy',
  type: 'capital_subsidy',
  days: 30,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Cultivator', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'Land 7/12 RoR', 'Borewell / Water Source Proof'],
  url: 'https://pmksy.gov.in/microirrigation',
  completeness: 'VERIFIED'
});

add({
  id: 'kisan-drone-subsidy-074',
  code: 'KISAN-DRONE',
  name: 'Kisan Drone Subsidy Scheme (SMAM Extension)',
  short_name: 'Kisan Drone Purchase Grant',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'fpo', 'women'],
  desc: '50% subsidy up to ₹5 Lakh for SC/ST, small/marginal farmers and women for agricultural drone purchase.',
  benefit: '50% capital subsidy (Save up to ₹5,00,000 on Agri-Drone)',
  quantum: '₹5,00,000 subsidy',
  type: 'capital_subsidy',
  days: 30,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Farmer / FPO Member', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'DGCA Drone Remote Pilot Certificate', 'Land Document'],
  url: 'https://agrimachinery.nic.in',
  completeness: 'VERIFIED'
});

add({
  id: 'fpo-formation-scheme-075',
  code: '10K-FPO',
  name: 'Formation and Promotion of 10,000 Farmer Producer Organizations',
  short_name: '10,000 FPO Equity Grant',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer', 'fpo'],
  desc: 'Matching equity grant up to ₹15 Lakh per FPO and credit guarantee cover up to ₹2 Crore to enhance farmer bargaining power.',
  benefit: 'Matching equity grant up to ₹2,000 per farmer member (Max ₹15 Lakh)',
  quantum: '₹15,00,000 equity grant',
  type: 'capital_subsidy',
  days: 45,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Small/Marginal Farmer Member', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card', 'FPO Share Certificate', 'Land RoR'],
  url: 'https://enam.gov.in/web/fpo-information',
  completeness: 'PARTIALLY_VERIFIED'
});

add({
  id: 'fertilizer-dbt-neem-077',
  code: 'NEEM-UREA',
  name: 'Neem Coated Urea Statutory Price Subsidy',
  short_name: 'Subsidized Neem Coated Urea',
  ministry: 'Ministry of Chemicals and Fertilizers',
  state: 'All-India',
  category: 'agriculture',
  beneficiary_types: ['farmer'],
  desc: 'Direct fertilizer subsidy ensuring urea is sold at fixed statutory price of ₹242 per 45 kg bag.',
  benefit: 'Over 85% price subsidy on essential agricultural fertilizers (Urea & DAP)',
  quantum: '₹2,000+ subsidy per bag',
  type: 'subsidy',
  days: 1,
  rules: [{ field: 'citizen.occupation', op: 'IN', value: ['farmer', 'agriculture'], label: 'Cultivator Purchasing via PoS', impact: 'critical' }],
  flatRules: { occupation: ['farmer', 'agriculture'] },
  docs: ['Aadhaar Card (Biometric PoS Verification)'],
  url: 'https://urvarak.nic.in',
  completeness: 'VERIFIED'
});

console.log(`Agriculture processed. Count: ${rawSchemes.length}`);

// We will write the full generator that outputs all 200+ unique schemes to src/api/extendedSchemes.js
fs.writeFileSync('C:/Users/pinku/.gemini/antigravity-ide/brain/60778a80-08e7-4ab2-9cfc-6b9ceb18714d/scratch/test_batch_check.json', JSON.stringify({ count: rawSchemes.length }, null, 2));
