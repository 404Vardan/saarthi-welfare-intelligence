# Saarthi Development & Research Roadmap

This roadmap outlines the past milestones, current implementation status, and proposed future research directions for the **Saarthi** platform.

---

## Phases Overview

| Phase | Focus Area | Status | Target Timeline |
| :--- | :--- | :---: | :--- |
| **Phase 1** | Foundation & Core Rule Engine | Completed | Q3 2026 |
| **Phase 2** | Citizen Welfare Intelligence & Passport | Completed | Q3 2026 |
| **Phase 3** | Scheme Registry Expansion (298 Schemes) | Completed | Q4 2026 |
| **Phase 4** | Government Welfare Intelligence & Policy Lab | In Progress | Q4 2026 |
| **Phase 5** | Trust, Verification & Provenance Pipelines | Planned | Q1 2027 |
| **Phase 6** | Research Scaling & Voice Inclusivity | Proposed | Q2 2027+ |

---

## Phase Details

### Phase 1: Foundation & Core Rule Engine (Completed)
- [x] Deterministic AST rule evaluation engine (`src/engine/eligibilityEngine.js`).
- [x] 3-Valued Kleene logic implementation (`passed`, `failed`, `insufficient_data`).
- [x] Initial regression test suite covering operators, logic, and edge cases.
- [x] Supabase PostgreSQL backend integration with base tables (`profiles`, `documents`, `applications`).
- [x] Fail-closed role-based access control (RBAC).

### Phase 2: Citizen Welfare Intelligence (Completed)
- [x] Adaptive Welfare Passport supporting dynamic demographic attributes.
- [x] Status-aware Document Vault with weighted readiness scoring.
- [x] Multilingual interface support across 11 Indian languages.
- [x] Deterministic SHA-256 Decision Reference digests (`DEC-<SCHEME>-<HASH>`).
- [x] Gemini 1.5 Flash conversational assistant proxied via serverless edge functions.

### Phase 3: Scheme Intelligence & Campus Welfare Pilot (Completed)
- [x] Canonical registry expansion to 298 Central and State schemes across 12 sectors.
- [x] Campus Welfare Pilot sub-registry (30 schemes) for students, scholars, and staff.
- [x] 120-assertion 4-dimension deterministic coverage suite (`test_campus_coverage.js`).
- [x] Unencoded statutory conditions transparency in scheme records.
- [x] Automated 91-test regression suite ensuring engine and RLS invariants.

### Phase 4: Government Welfare Intelligence (In Progress)
- [x] Synthetic population demonstration model (`SyntheticPopulationAPI`).
- [x] District welfare delivery saturation mapping and blocker identification.
- [x] Policy scenario lab for testing threshold adjustments.
- [ ] Direct export of district telemetry reports (PDF/CSV audit summaries).
- [ ] Administrative verification review queue UI for document approvals.

### Phase 5: Trust, Verification & Provenance (Planned)
- [ ] **Automated Gazette Scraper & Ingestion Pipeline**: Ingestion crawler monitoring official departmental portals for revised income ceilings or application deadlines.
- [ ] **Public Provenance Ledger**: Cryptographic signing of scheme rules with maintainer GPG keys.
- [ ] **Community Verification Workflow**: Crowdsourced verification portal for policy scholars and legal clinics to review AST rules against primary gazettes.
- [ ] **Comprehensive WCAG 2.1 AA Audit**: Screen-reader optimization with TalkBack and NVDA voice verification.

### Phase 6: Research Scaling & Inclusivity (Proposed)
- [ ] **Multilingual Voice Interface**: Speech-to-text and voice prompts for non-literate citizens in regional dialects.
- [ ] **Offline-First PWA Mode**: IndexedDB caching of scheme metadata and local AST evaluation for low-connectivity rural panchayats.
- [ ] **Empirical Policy Modeling**: Peer-reviewed publications evaluating algorithmic welfare targeting and administrative friction reduction.
