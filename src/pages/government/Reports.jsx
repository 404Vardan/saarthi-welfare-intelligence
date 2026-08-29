import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { GovAnalyticsAPI } from '../../api/govAnalyticsApi';

export default function GovReports() {
  const [downloadToast, setDownloadToast] = useState('');

  const handleDownloadCSV = async (reportType) => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'districts') {
      const data = await GovAnalyticsAPI.fetchDistrictIntelligence('All');
      filename = `saarthi-district-welfare-gap-report-2026.csv`;
      csvContent = 'District,State,Eligible_Population,Reached_Beneficiaries,Unreached_Gap,Gap_Percentage,Annual_Budget_Cr,Primary_Blocker\n' +
        data.map(d => `"${d.name}","${d.state}",${d.eligible},${d.reached},${d.unreached},"${d.gapPct}","${d.annualBudget}","${d.primaryBlocker}"`).join('\n');
    } else {
      filename = `saarthi-scheme-performance-sla-2026.csv`;
      csvContent = 'Scheme_Code,Scheme_Name,Disbursement_Type,Processing_SLA_Days,Coverage_Rate,Citizen_Satisfaction\n' +
        '"PM-KISAN","Pradhan Mantri Kisan Samman Nidhi","direct_benefit",21,"94%","92%"\n' +
        '"PMJAY","Ayushman Bharat (PMJAY)","insurance",7,"86%","95%"\n' +
        '"PMAY-G","PM Awas Yojana (Gramin)","subsidy",45,"72%","81%"\n' +
        '"VISHWAKARMA","PM Vishwakarma","skill_training",15,"68%","89%"';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(`✓ Exported ${filename}`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  const handleDownloadJSON = async () => {
    const districts = await GovAnalyticsAPI.fetchDistrictIntelligence('All');
    const overview = await GovAnalyticsAPI.fetchNationalOverview();
    const payload = {
      generatedAt: new Date().toISOString(),
      platform: 'Saarthi National Welfare Intelligence System',
      nationalOverview: overview,
      districtBreakdown: districts
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `saarthi-national-welfare-telemetry-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast('✓ Exported raw machine-readable JSON telemetry dataset');
    setTimeout(() => setDownloadToast(''), 3000);
  };

  return (
    <div>
      <h1 className="gov-page-title">Executive Intelligence Reports & Datasets</h1>
      <p className="gov-page-subtitle">
        Export real-time district delivery datasets, policy briefs, and raw telemetry for administrative reviews.
      </p>

      {downloadToast && (
        <div style={{ background: 'rgba(31,122,77,0.2)', color: 'var(--ledger-green)', border: '1px solid rgba(31,122,77,0.4)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {downloadToast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Report 1 */}
        <div className="gov-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileSpreadsheet size={28} color="var(--brass-gold)" />
            <div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                National District Welfare Gap & Delivery Telemetry Dataset (2026)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                Live Taluka & District saturation rates, unreached gap counts, and primary blockers · CSV format
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownloadCSV('districts')}
            className="ops-btn ops-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Download CSV
          </button>
        </div>

        {/* Report 2 */}
        <div className="gov-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileSpreadsheet size={28} color="var(--ledger-green)" />
            <div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                Scheme Performance, Disbursement Velocity & SLA Scorecard
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                Processing days, citizen satisfaction ratings, and DBT clearance timelines across 15 programmes · CSV format
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownloadCSV('schemes')}
            className="ops-btn ops-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Download CSV
          </button>
        </div>

        {/* Report 3 (Raw JSON) */}
        <div className="gov-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileText size={28} color="var(--slate)" />
            <div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                Full Machine-Readable Telemetry Export (JSON Schema v2.0)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                Complete structured JSON export for cross-ministry data pipeline integration · JSON format
              </div>
            </div>
          </div>
          <button
            onClick={handleDownloadJSON}
            className="ops-btn ops-btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
