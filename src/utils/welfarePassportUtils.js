/**
 * Saarthi Welfare Passport Intelligence & Completeness Utility
 *
 * Provides:
 * 1. Adaptive completeness scoring (weighted, non-penalizing toward irrelevant optional fields).
 * 2. Scheme-specific missing attribute analyzer (deduplicating missing parameters across evaluated schemes).
 * 3. Canonical Indian States and Union Territories registry.
 * 4. Progressive disclosure metadata model for the 11 welfare dimensions.
 */

export const INDIAN_STATES_AND_UTS = [
  'All-India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const TRI_STATE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
  { value: 'prefer_not_to_say', label: 'Prefer not to answer' }
];

/**
 * Weighted, Relevance-Aware Profile Completeness Engine
 * Does NOT penalize citizens for irrelevant optional fields.
 */
export function calculatePassportCompleteness(profile = {}, evaluations = []) {
  if (!profile) return { percentage: 0, level: 'low', summary: 'Profile not started', suggestions: [] };

  let score = 0;
  const suggestions = [];

  // Tier 1: Core Baseline Identity (Weight: 40 points)
  let corePoints = 0;
  if (profile.full_name && profile.full_name.trim().length > 1) corePoints += 8;
  if (profile.age !== undefined && profile.age !== null && profile.age !== '') corePoints += 8;
  if (profile.gender) corePoints += 8;
  if (profile.state) corePoints += 8;
  if (profile.district) corePoints += 4;
  if (profile.occupation) corePoints += 4;
  score += corePoints;

  // Tier 2: Economic & Social Foundation (Weight: 30 points)
  let econPoints = 0;
  const hasIncome = profile.income_annual !== undefined && profile.income_annual !== null && profile.income_annual !== '';
  if (hasIncome) {
    econPoints += 10;
  } else {
    suggestions.push({
      field: 'income_annual',
      section: 'economic',
      label: 'Annual Household Income',
      impact: 'High Impact (unblocks income-capped schemes)'
    });
  }

  if (profile.category) econPoints += 6;
  if (profile.area_type) econPoints += 5;
  if (profile.bank_account !== undefined && profile.bank_account !== null) econPoints += 5;
  if (profile.bpl_card !== undefined && profile.bpl_card !== null) econPoints += 4;
  score += econPoints;

  // Tier 3: Sector & Circumstance Adaptive Relevance (Weight: 20 points)
  // Non-penalizing: Checks what is relevant to THIS citizen
  let sectorPoints = 0;
  const isFarmer = profile.occupation === 'farmer' || profile.is_farmer || profile.is_farmer_involved === 'yes';
  const isStudent = profile.occupation === 'student' || profile.is_student;
  const isSenior = (Number(profile.age) >= 60) || profile.is_senior;

  if (isFarmer) {
    if (profile.land_ownership && profile.land_ownership !== 'not_sure') sectorPoints += 10;
    else suggestions.push({ field: 'land_ownership', section: 'agriculture', label: 'Land Ownership Details', impact: 'Required for PM-KISAN / PMFBY' });

    if (profile.farmer_type || profile.irrigation_type || profile.crop_category) sectorPoints += 10;
    else suggestions.push({ field: 'farmer_type', section: 'agriculture', label: 'Farmer Category', impact: 'Improves agricultural subsidies' });
  } else if (isStudent) {
    if (profile.education || profile.education_level) sectorPoints += 10;
    else suggestions.push({ field: 'education_level', section: 'education', label: 'Education Level', impact: 'Required for scholarships' });

    if (profile.institution_type || profile.course_type) sectorPoints += 10;
    else suggestions.push({ field: 'institution_type', section: 'education', label: 'Institution / Course', impact: 'Improves education grants' });
  } else if (isSenior) {
    sectorPoints += 10; // Auto-qualifies senior baseline
    if (profile.has_pension_enrolment !== undefined || profile.bpl_card) sectorPoints += 10;
    else suggestions.push({ field: 'has_pension_enrolment', section: 'financial', label: 'Existing Pension Status', impact: 'Required for NSAP Old Age Pension' });
  } else {
    // General Citizen: Housing / Employment / Amenities
    if (profile.house_ownership) sectorPoints += 10;
    else suggestions.push({ field: 'house_ownership', section: 'housing', label: 'Housing Condition', impact: 'Improves PMAY matching' });

    if (profile.employment_sector || profile.has_electricity || profile.has_lpg_connection) sectorPoints += 10;
  }
  score += sectorPoints;

  // Tier 4: Existing Benefits & Scheme Readiness (Weight: 10 points)
  let schemePoints = 0;
  if (Array.isArray(profile.existing_benefits) && profile.existing_benefits.length > 0) {
    schemePoints += 6;
  } else {
    suggestions.push({
      field: 'existing_benefits',
      section: 'existing_benefits',
      label: 'Existing Government Benefits',
      impact: 'Avoids duplicate recommendations'
    });
  }

  // Check if any evaluated schemes are blocked by missing data
  const blockedSchemesCount = evaluations.filter(e => e.status === 'insufficient_data').length;
  if (blockedSchemesCount === 0 && evaluations.length > 0) {
    schemePoints += 4;
  }
  score += schemePoints;

  // Clamp 0 to 100
  const finalPercentage = Math.min(100, Math.max(10, Math.round(score)));

  let summary = 'Basic Profile Started';
  let level = 'low';

  if (finalPercentage >= 80) {
    summary = 'Your profile contains enough verified information for authoritative welfare evaluations.';
    level = 'high';
  } else if (finalPercentage >= 55) {
    summary = 'Your profile qualifies for initial checks. Adding recommended fields will unlock more specific schemes.';
    level = 'medium';
  } else {
    summary = 'Complete recommended fields to enable accurate welfare matching.';
    level = 'low';
  }

  return {
    percentage: finalPercentage,
    summary,
    level,
    suggestions: suggestions.slice(0, 3)
  };
}

/**
 * Analyzes evaluated schemes to find high-yield missing attributes.
 * Deduplicates questions across schemes (e.g. asks Annual Income once for 8 schemes).
 */
export function analyzeMissingSchemeAttributes(evaluations = [], profile = {}) {
  const fieldToSchemes = new Map();

  evaluations.forEach(ev => {
    // Check rule breakdown for insufficient_data
    const missingRules = (ev.ruleBreakdown || []).filter(r => r.status === 'insufficient_data' || r.isMissingData);

    missingRules.forEach(r => {
      const fieldKey = r.field;
      if (!fieldKey) return;

      if (!fieldToSchemes.has(fieldKey)) {
        fieldToSchemes.set(fieldKey, {
          field: fieldKey,
          ruleLabel: r.rule || fieldKey,
          requiredValue: r.requiredValue,
          schemes: []
        });
      }

      const entry = fieldToSchemes.get(fieldKey);
      if (!entry.schemes.some(s => s.code === ev.schemeCode)) {
        entry.schemes.push({
          id: ev.schemeId,
          code: ev.schemeCode,
          name: ev.schemeName,
          benefit: ev.benefit
        });
      }
    });
  });

  // Map to friendly profile sections and input types
  const prioritized = Array.from(fieldToSchemes.values()).map(item => {
    const cleanField = item.field.replace(/^(citizen|household)\./, '');
    let section = 'economic';
    let inputType = 'text';

    if (['income_annual', 'household.income_annual', 'income_individual'].includes(item.field)) {
      section = 'economic';
      inputType = 'number';
    } else if (['land_ownership', 'farmer_type', 'is_farmer', 'land_holding_acres'].includes(cleanField)) {
      section = 'agriculture';
      inputType = 'select';
    } else if (['education', 'education_level', 'is_student'].includes(cleanField)) {
      section = 'education';
      inputType = 'select';
    } else if (['disability', 'disability_percentage'].includes(cleanField)) {
      section = 'social';
      inputType = 'select';
    } else if (['house_ownership', 'housing_type'].includes(cleanField)) {
      section = 'housing';
      inputType = 'select';
    } else if (['bpl_card', 'ration_card_type'].includes(cleanField)) {
      section = 'economic';
      inputType = 'select';
    }

    return {
      ...item,
      cleanField,
      section,
      inputType,
      schemesCount: item.schemes.length
    };
  });

  // Sort by highest scheme impact first
  prioritized.sort((a, b) => b.schemesCount - a.schemesCount);

  return prioritized;
}
