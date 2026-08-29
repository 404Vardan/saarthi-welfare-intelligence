import React from 'react';

export default function GovPerformance() {
  const schemes = [
    { name: 'PM-KISAN', budget: '₹60,000 Cr', reached: '94%', processingDays: 21, satisfaction: '92%' },
    { name: 'Ayushman Bharat (PMJAY)', budget: '₹7,500 Cr', reached: '86%', processingDays: 7, satisfaction: '95%' },
    { name: 'PMAY-Gramin', budget: '₹54,000 Cr', reached: '72%', processingDays: 45, satisfaction: '81%' },
    { name: 'PM Vishwakarma', budget: '₹13,000 Cr', reached: '68%', processingDays: 15, satisfaction: '89%' }
  ];

  return (
    <div>
      <h1 className="gov-page-title">Scheme Performance Scorecard</h1>
      <p className="gov-page-subtitle">Disbursement velocity, citizen satisfaction, and operational efficiency across programmes.</p>

      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Programme</th>
              <th>Annual Allocation</th>
              <th>Target Coverage</th>
              <th>Avg. Processing SLA</th>
              <th>Citizen Rating</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map(s => (
              <tr key={s.name}>
                <td style={{ fontWeight: 600, color: 'white' }}>{s.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{s.budget}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ledger-green)', fontWeight: 600 }}>{s.reached}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{s.processingDays} Days</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass-gold)' }}>★ {s.satisfaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
