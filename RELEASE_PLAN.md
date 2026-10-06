# Saarthi v2.0.0 Release Plan & Notes

This document provides the release notes, milestone definition, and tagging procedure for **v2.0.0 — Saarthi Welfare Intelligence Platform**.

---

## Proposed Release Tag: `v2.0.0`

**Release Title:** `Saarthi v2.0.0 — National Welfare Intelligence System`

---

## Release Notes

### Overview
Saarthi v2.0.0 marks a major milestone in Indian open-source GovTech and welfare intelligence. This release transitions the platform into a dual-sided civic-tech architecture connecting citizen-level discovery and deterministic eligibility evaluation with administrative policy intelligence and saturation mapping.

---

### What's New in v2.0.0

#### 1. Canonical Welfare Scheme Expansion (298 Schemes)
- **Expanded Scope**: Curated catalog of 298 real Central and State Government schemes across 12 sectors (`agriculture`, `education`, `healthcare`, `housing`, `social_security`, `tribal`, `msme`, etc.).
- **Authoritative Provenance**: Each scheme is linked to official government portals (`source_url`), publishing nodal ministries, version tags (`rule_version`), and explicit documentation checklists.
- **Unencoded Conditions Transparency**: Statutory nuances that cannot be captured purely by demographic fields are explicitly listed in `unencoded_conditions` to ensure honest citizen guidance.

#### 2. Campus Welfare Pilot (30 Schemes & 120 Assertions)
- Tailored sub-registry for university students, early-career researchers, junior faculty, and campus contract staff.
- Includes central sector scholarships, state fee reimbursements, SERB fellowships, and unorganized worker provisions.
- Validated by an automated 120-assertion coverage suite across four deterministic dimensions (valid persona, ineligible persona, incomplete profile, already-receiving flag).

#### 3. Deterministic AST Rule Engine & 3-Valued Kleene Logic
- Abstract Syntax Tree (AST) predicate evaluator operating on 3-valued Kleene logic (`passed`, `failed`, `insufficient_data`).
- Missing profile parameters return `insufficient_data` rather than defaulting to false or ₹0 income.
- Every evaluation produces an immutable, reproducible SHA-256 Decision Reference ID (`DEC-<SCHEME>-<HASH>`).

#### 4. Status-Aware Document Readiness Vault
- Document readiness scoring based on realistic lifecycle statuses: `VERIFIED` (100%), `UNDER_REVIEW` (50%), `UPLOADED` (30%), `EXPIRED` (0%), `REJECTED` (0%), and `NOT_UPLOADED` (0%).

#### 5. Multilingual Interface (11 Indian Languages)
- Dynamic localization supporting English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and Odia.

#### 6. Policy Intelligence & Synthetic Population Demonstration
- District welfare delivery saturation mapping and welfare gap diagnostics powered by a deterministic synthetic population model (`SyntheticPopulationAPI`).
- Policy scenario lab for testing eligibility threshold adjustments and demographic impacts.

#### 7. Defense-in-Depth Security & Tamper Prevention
- PostgreSQL Row-Level Security (RLS) policies enforcing tenant isolation.
- Fail-closed Role-Based Access Control (`citizen`, `government`, `admin`).
- Database triggers preventing unauthorized role escalation and self-verification.
- Serverless edge proxy isolating Gemini API credentials from client bundles.

---

### Verification & Validation

| Suite | Scope | Result |
| :--- | :--- | :---: |
| **Core Regression Suite** | 9 test groups (AST operators, Kleene logic, RLS invariants, decision digests) | **91 / 91 Passed** |
| **Campus Coverage Suite** | 30 schemes × 4 deterministic dimensions | **120 / 120 Passed** |
| **Production Build** | Vite 6 minified production build bundle check | **Clean Build** |

---

### Known Limitations

1. **Simulation vs Production Telemetry**: District-level saturation metrics and the 47.3 Cr eligible population baseline in the Government Intelligence Console are powered by a deterministic synthetic population model for policy demonstration; they do not represent live production telemetry from all 700+ Indian district collectorates.
2. **Statutory Legal Certification**: Automated test suites validate software implementation behavior against repository-encoded schemas; they do not constitute independent statutory certification by the Government of India.
3. **WCAG Compliance**: While accessibility principles are implemented, the platform is undergoing ongoing testing and is not yet certified fully compliant with WCAG 2.1 AA.

---

### Deployment & Live Access

- **Live Application**: [https://saarthi-welfare-intelligence.vercel.app](https://saarthi-welfare-intelligence.vercel.app)
- **Deployment Runbook**: See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Supabase SQL migration and Edge Function deployment steps.

---

### Tagging Procedure (for Maintainers)

To tag this release on GitHub:
```bash
git tag -a v2.0.0 -m "Release v2.0.0 — Saarthi National Welfare Intelligence System"
git push origin v2.0.0
```
Then navigate to GitHub Releases and publish with the notes above.
