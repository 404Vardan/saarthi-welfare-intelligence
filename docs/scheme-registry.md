# Saarthi Welfare Scheme Registry

## Overview

The Saarthi Scheme Registry is a curated, structured catalog of **298 canonical Central and State Government welfare schemes** across India (`src/api/schemesData.js` and `src/api/extendedSchemes.js`).

The registry provides programmatic representations of welfare policies, combining statutory metadata, eligibility Abstract Syntax Trees (ASTs), required documentation checklists, and official government portal pathways.

---

## Registry Statistics & Categorization

```
Total Canonical Schemes: 298
├─ Central / All-India Schemes: 247
├─ Telangana State Schemes: 15
└─ Other State-Specific Schemes: 36
```

### Sector Category Breakdown

| Sector / Domain | Key Scheme Examples |
| :--- | :--- |
| **Education & Scholarships** | National Scholarship Portal (NSP), Post-Matric SC/ST, Pragati Scholarship, SERB Fellowships |
| **Agriculture & Rural Livelihoods**| PM-KISAN, PM Fasal Bima Yojana, PM Krishi Sinchayee, Rythu Bandhu |
| **Healthcare & Insurance** | Ayushman Bharat (PM-JAY), PM Suraksha Bima Yojana, Janani Suraksha Yojana |
| **Social Security & Pensions** | IGNOAPS (Senior Pension), IGNWPS (Widow Pension), IGNDPS (Disability Pension), Atal Pension |
| **Women & Child Development** | PMMVY, Sukanya Samriddhi Yojana, Poshan Abhiyaan |
| **Financial Inclusion & MSME** | PM Mudra Yojana, PM SVANidhi, Stand-Up India, PM Employment Generation Programme (PMEGP) |
| **Housing & Urban Affairs** | Pradhan Mantri Awas Yojana (Urban & Gramin) |
| **Artisans & Skilled Trades** | PM Vishwakarma Yojana, Hunar Haat |
| **Tribal Welfare** | Eklavya Model Residential Schools, PM JANMAN, NSTFDC Schemes |
| **Disability Welfare** | ADIP Scheme, Unique Disability ID (UDID) benefits, Deendayal Disabled Relief |

---

## Verification Status Classification

Every scheme in the canonical registry is categorized by its verification maturity:

| Status | Count | Meaning |
| :--- | :---: | :--- |
| **`VERIFIED`** | **271** | Sourced directly from published government gazettes or official ministerial guidelines, with full AST criteria and required documents. |
| **`PARTIALLY_VERIFIED`** | **3** | Core guidelines extracted from official state notices; secondary administrative nuances under active review. |
| **`INFORMATIONAL_ONLY`** | **24** | Informational summaries of evolving or newly announced programs where complete AST rules have not yet been codified. |

> **Important Clarification on Verification**:
> The term *"VERIFIED"* denotes that the scheme data, criteria, and documentation checklists in the repository have been cross-referenced with public government portal guidelines and gazette notices. It **does NOT** imply that the Government of India or state administrations have independently inspected or legally certified Saarthi's repository.

---

## Campus Welfare Pilot Sub-Registry (30 Schemes)

To validate Saarthi's targeted delivery capabilities, the registry includes a specialized sub-registry of **30 Campus Welfare Schemes**:
- **Target Demographics**: Undergraduate/postgraduate students, research scholars, junior faculty, non-teaching university staff, campus sanitation workers, and security personnel.
- **State & Central Programs**: Includes Telangana State ePASS (RTF & MTF), PM-USP Central Sector Scholarships, SERB National Postdoctoral Fellowships, and TS Unorganized Worker Welfare Board provisions.
- **Integrity Benchmarking**: All 30 campus schemes are subjected to a dedicated **120-assertion coverage test suite** (`scripts/test_campus_coverage.js`) testing valid personas, ineligible personas, incomplete profiles, and already-receiving flags.

---

## Scheme Schema Structure

```javascript
{
  id: "GOI-PM-KISAN",
  code: "PM_KISAN",
  name: "Pradhan Mantri Kisan Samman Nidhi",
  state: "Central",
  category: "agriculture",
  beneficiary_types: ["farmer", "small_farmer", "marginal_farmer"],
  nodal_ministry: "Ministry of Agriculture and Farmers Welfare",
  source_url: "https://pmkisan.gov.in",
  source_title: "PM-KISAN Operational Guidelines (Revised)",
  rule_version: "2026.1",
  rule_effective_from: "2019-02-01",
  verification_status: "VERIFIED",
  benefit_type: "cash_transfer",
  benefit_amount: "₹6,000 per annum (in 3 equal instalments of ₹2,000)",
  disbursement_frequency: "Tri-annual",
  unencoded_conditions: [
    "Subject to institutional landholder exclusion.",
    "Excludes income tax payees and former/present constitutional post holders."
  ],
  rules: {
    type: "AND",
    children: [
      { field: "occupation", operator: "EQ", value: "farmer" },
      { field: "is_institutional_landholder", operator: "NEQ", value: true },
      { field: "is_income_tax_payee", operator: "NEQ", value: true }
    ]
  },
  documents_required: [
    { name: "Aadhaar Card", mandatory: true, issuing_authority: "UIDAI" },
    { name: "Land Ownership Record (Khatoni/RoR)", mandatory: true, issuing_authority: "State Revenue Department" },
    { name: "Bank Account Passbook", mandatory: true, issuing_authority: "Scheduled Commercial Bank" }
  ]
}
```
