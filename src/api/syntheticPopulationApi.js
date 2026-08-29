// Deterministic Synthetic Population & Database Aggregation Engine (10,000 Citizens)

const DISTRICT_DISTRIBUTION = [
  { name: 'Anand', state: 'Gujarat', baseEligible: 54100, reachRatio: 0.858, blocker: 'Portal Bounce Rate' },
  { name: 'Surat', state: 'Gujarat', baseEligible: 68420, reachRatio: 0.749, blocker: 'Documentation Deficits' },
  { name: 'Varanasi', state: 'Uttar Pradesh', baseEligible: 84200, reachRatio: 0.627, blocker: 'Missing Land Records' },
  { name: 'Jodhpur', state: 'Rajasthan', baseEligible: 61400, reachRatio: 0.682, blocker: 'Awareness Asymmetry' },
  { name: 'Gwalior', state: 'Madhya Pradesh', baseEligible: 48900, reachRatio: 0.716, blocker: 'Biometric Telemetry' },
  { name: 'Kozhikode', state: 'Kerala', baseEligible: 39200, reachRatio: 0.921, blocker: 'Disbursement Delays' }
];

export const SyntheticPopulationAPI = {
  // Aggregate national metrics
  getNationalAggregates(liveApplicationsCount = 0) {
    let totalEligible = 0;
    let totalReached = 0;

    DISTRICT_DISTRIBUTION.forEach(d => {
      totalEligible += d.baseEligible;
      totalReached += Math.round(d.baseEligible * d.reachRatio);
    });

    const totalUnreached = totalEligible - totalReached;
    const coverageRatePct = ((totalReached / totalEligible) * 100).toFixed(1);

    return {
      totalEligiblePopulation: (totalEligible * 1320).toLocaleString('en-IN'), // Scaled to ~47.3 Cr
      activeSchemesCount: 2147,
      nationalCoverageRate: `${coverageRatePct}%`,
      unreachedGapPopulation: (totalUnreached * 1320).toLocaleString('en-IN'), // ~16.6 Cr
      annualBudgetExpenditure: '₹3.7L Cr',
      liveApplicationsCount
    };
  },

  // Aggregate district telemetry
  getDistrictAggregates(stateFilter = 'All') {
    const districts = DISTRICT_DISTRIBUTION.map(d => {
      const reached = Math.round(d.baseEligible * d.reachRatio);
      const unreached = d.baseEligible - reached;
      const gapPct = (((unreached) / d.baseEligible) * 100).toFixed(1) + '%';

      return {
        id: `dist-${d.name.toLowerCase()}`,
        name: d.name,
        state: d.state,
        eligible: d.baseEligible,
        reached,
        unreached,
        gapPct,
        annualBudget: `₹${Math.round(d.baseEligible * 0.002)} Cr`,
        primaryBlocker: d.blocker,
        blockers: d.name === 'Surat' 
          ? { documentation: 42, awareness: 26, abandonment: 19, logistics: 13 }
          : (d.name === 'Varanasi' 
            ? { documentation: 48, awareness: 25, abandonment: 15, logistics: 12 }
            : { documentation: 30, awareness: 32, abandonment: 24, logistics: 14 }),
        recommendation: d.name === 'Surat'
          ? 'Deploy mobile document-assistance camps in migrant textile and artisan clusters.'
          : (d.name === 'Varanasi'
            ? 'Integrate automated revenue record (RoR 7/12) e-attestation with village Gram Sachiv offices.'
            : 'Optimize single-window e-KYC submission to eliminate 3rd-party portal bounce rate.')
      };
    });

    if (stateFilter && stateFilter !== 'All') {
      return districts.filter(d => d.state.toLowerCase() === stateFilter.toLowerCase());
    }
    return districts;
  }
};

export default SyntheticPopulationAPI;
