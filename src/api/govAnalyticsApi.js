import { supabase } from './supabaseClient';
import { ApplicationsAPI } from './applicationsApi';
import { SyntheticPopulationAPI } from './syntheticPopulationApi';

export const GovAnalyticsAPI = {
  async fetchNationalOverview() {
    let liveApps = [];
    try {
      const { data, error } = await supabase.from('applications').select('*');
      if (!error && data && data.length > 0) {
        liveApps = data;
      } else {
        liveApps = await ApplicationsAPI.fetchUserApplications('demo-citizen-01');
      }
    } catch {
      liveApps = await ApplicationsAPI.fetchUserApplications('demo-citizen-01');
    }

    const popAggregates = SyntheticPopulationAPI.getNationalAggregates(liveApps.length);

    return {
      entitledCitizens: popAggregates.totalEligiblePopulation,
      activeSchemesIngested: popAggregates.activeSchemesCount,
      annualWelfareBudget: popAggregates.annualBudgetExpenditure,
      nationalCoverageRate: popAggregates.nationalCoverageRate,
      unreachedGapPopulation: popAggregates.unreachedGapPopulation,
      totalApplicationsSubmitted: liveApps.length,
      underReviewCount: liveApps.filter(a => a.status === 'under_review' || a.status === 'submitted').length,
      approvedCount: liveApps.filter(a => a.status === 'approved' || a.status === 'disbursed').length,
      recentApplications: liveApps.slice(0, 5)
    };
  },

  async fetchDistrictIntelligence(stateFilter = 'All') {
    return SyntheticPopulationAPI.getDistrictAggregates(stateFilter);
  },

  async fetchCitizenAuditRecord(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return null;

    const liveApps = await ApplicationsAPI.fetchUserApplications('demo-citizen-01');
    const matchedApp = liveApps.find(a => a.refNumber?.toLowerCase().includes(q) || a.schemeName?.toLowerCase().includes(q));

    return {
      citizenId: 'CTZ-2026-00482',
      name: 'Ramesh Kumar Yadav',
      district: 'Anand, Gujarat',
      occupation: 'Farmer',
      annualIncome: '₹1,80,000',
      category: 'OBC',
      verifiedProofs: ['Aadhaar Card (Passport Record)', 'Bank Passbook (DBT Linked)', 'Ration Card (PHH)'],
      schemesReceived: [
        {
          name: 'PM-KISAN (Samman Nidhi)',
          amount: '₹6,000 / yr',
          status: 'Illustrative Ledger Record',
          refNumber: matchedApp?.refNumber || 'SAARTHI-2026-004891',
          date: '15 Aug 2026'
        },
        {
          name: 'Pradhan Mantri Fasal Bima',
          amount: 'Subsidized Crop Cover',
          status: 'Active Policy Record',
          refNumber: 'PMFBY-2026-44120',
          date: '02 Jul 2026'
        }
      ],
      eligibleUnclaimed: [
        {
          name: 'PM Surya Ghar Muft Bijli Yojana',
          amount: '₹78,000 Rooftop Subsidy',
          reason: 'Application pending submission by citizen'
        },
        {
          name: 'Kisan Credit Card (KCC)',
          amount: '₹3,00,000 Credit @ 4%',
          reason: 'Income Certificate required before bank appraisal'
        }
      ]
    };
  }
};

export default GovAnalyticsAPI;
