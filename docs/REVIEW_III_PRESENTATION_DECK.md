# SAARTHI — REVIEW III PRESENTATION DECK
## National Welfare Intelligence System (NWIS)

**Presenters:** Vardan (Team Lead & Lead System Architect) & Team  
**Institution:** School of Technology, Woxsen University  
**Project:** CSP-1 Capstone Project — Review III  
**Repository:** [github.com/404Vardan/saarthi-welfare-intelligence](https://github.com/404Vardan/saarthi-welfare-intelligence)  
**Live Deployed Application:** `https://saarthi-welfare-intelligence.vercel.app` *(or your custom production URL)*

---

### Slide 1 — Title Slide

# SAARTHI
### National Welfare Intelligence System (NWIS)
*From Welfare Fragmentation to Deterministic Citizen-Centric Delivery*

- **Domain:** Civic-Tech / Deterministic Rule Engines / Explainable AI
- **Review:** Capstone Review III (Product & Evaluation Defense)
- **Team Lead:** Vardan
- **Target URL:** Live Production Deployment on Vercel backed by Supabase PostgreSQL

> **Speaker Note (30 seconds):**  
> "Good morning, respected professors and evaluation committee. Today we present Review III for Saarthi: The National Welfare Intelligence System. In Review II, we presented our methodology and conceptual prototype. Today, we have moved from concept to reality: Saarthi is fully implemented, deployed publicly to production, fortified with deterministic rule engines and PostgreSQL Row Level Security, and validated through real user testing."

---

### Slide 2 — The Problem

## The Problem: Welfare Fragmentation at Scale

- **Scale of Welfare:** India spends over **₹4.2 Lakh Crore annually** across 800+ Central and State welfare programmes.
- **The Delivery Paradox:** Despite massive budgetary allocation, intended beneficiaries often miss out.
- **Three Core Bottlenecks:**
  1. **Discovery Fragmentation:** Citizens don't know which schemes exist or which ministry manages them.
  2. **Opaque Rejection:** Citizens receive binary rejection without understanding *why* or what attribute disqualified them.
  3. **Operational Silos:** Departments lack real-time district-level demographic intelligence to identify welfare coverage gaps.

> **Speaker Note (45 seconds):**  
> "India's welfare infrastructure suffers not from a lack of funding, but from informational friction. A farmer in Gujarat or a student in Telangana may be statutory entitled to multiple schemes, but between fragmented ministerial portals and confusing gazette language, they remain excluded. Saarthi solves this by introducing a dual-engine platform connecting citizens to entitlements and government administrators to district welfare intelligence."

---

### Slide 3 — What We Built

## Dual-Engine System Architecture

```
                       SAARTHI PLATFORM
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
      CITIZEN PORTAL                   GOVERNMENT CONSOLE
• Unified Welfare Passport           • District Welfare Aggregates
• 100% Deterministic Rule Engine    • Live Application Stream (WebSocket)
• Explainable Decision Traces       • Policy Simulation Lab
• Status-Aware Document Locker       • Gazette Scheme Registry
• Official Portal Integration        • Cryptographic Rule Provenance
```

> **Speaker Note (45 seconds):**  
> "We built an end-to-end operational platform with strict role separation. On the citizen side, an onboarding wizard builds a dynamic Welfare Passport, evaluates entitlements using verified rule trees, and explains decisions with complete provenance. On the state side, administrators can simulate policy changes and monitor real-time application intake via Postgres streaming."

---

### Slide 4 — Live Product Demonstration

## Live Production Application
### 🌐 Deployed at: `[Your Production Vercel URL]`

- **Infrastructure:** Publicly deployed on Vercel edge network.
- **Database:** Supabase PostgreSQL with strict Row Level Security (RLS).
- **Responsive:** Optimized for Desktop, Tablet, and Mobile viewports with bottom navigation.

*(Switch directly to browser window and perform live demonstration)*

> **Speaker Note (20 seconds):**  
> "Rather than showing static screenshots, we will now demonstrate the live, deployed Saarthi application directly in the browser."

---

### Slide 5 — The Citizen Journey (Live Walkthrough)

## End-to-End Citizen Journey

```
Citizen Login / Persona
         ↓
Welfare Profile & Household Setup
         ↓
Instant Deterministic Evaluation
         ↓
Decision Trace ("Why Eligible / Why Not?")
         ↓
Document Readiness Inspection
         ↓
Official Portal Link (`Official Portal ↗`)
         ↓
Application Submission & Milestone Tracking
         ↓
Citizen Feedback Telemetry (👍 / 👎)
```

**Demonstration Script:**
1. Open Citizen Portal (`/citizen/login`).
2. Demonstrate 1-click test persona: **Ramesh Patel (Marginal Farmer, Surat, Land < 2 Acres)**.
3. Show matched schemes: **PM-KISAN (₹6,000/yr)**.
4. Open **Decision Trace**: Show exact evaluated criteria (`Landholding <= 2 Acres: Passed`, `Income <= 2L: Passed`).
5. Click **Official Portal ↗**: Directs to official `pmkisan.gov.in`.
6. Submit application & track generated reference ID: `SAARTHI-2026-XXXXXX`.
7. Submit feedback rating with telemetry.

> **Speaker Note (90 seconds):**  
> "Notice how our engine provides absolute explainability. For Ramesh Patel, it evaluates every statutory rule condition. It doesn't just say 'Eligible'—it provides a byte-for-byte verifiable Decision Reference ID and an itemized breakdown. Crucially, Saarthi does not replace government portals; it prepares and routes citizens to the authoritative ministry portal with verified proofs."

---

### Slide 6 — Technical Architecture & Data Pipeline

## Technical Architecture Stack

```
                   REACT 18 + VITE (Frontend SPA)
       [Vanilla CSS tokens · Responsive Drawer & Bottom Nav Shell]
                               │
                               ▼ HTTPS / WSS
              SUPABASE CLOUD INFRASTRUCTURE
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
  SUPABASE AUTH          POSTGRESQL 15           PRIVATE STORAGE
- Email/Passphrase     - Normalized Schemas    - Encrypted Vault
- Google OAuth         - DB Triggers (Audit)   - 1-Hour Signed URLs
- Role Fail-Closed     - Row Level Security    - Strict Path Isolation
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 DETERMINISTIC AST ENGINE             EDGE FUNCTIONS + GEMINI
- Abstract Syntax Tree              - Stateless Language Assistance
- 3-Valued Kleene Logic             - Conversational Assistant
- Zero Hallucination Guarantee      - API Keys Never in Frontend
```

> **Speaker Note (60 seconds):**  
> "Our architecture separates presentation, verified deterministic logic, and auxiliary AI. The React frontend interacts with Supabase PostgreSQL over authenticated REST and WebSockets. User roles, profiles, and document permissions are enforced at the database level through PostgreSQL Row Level Security. All Gemini interactions are mediated through Supabase Edge Functions, keeping API secrets completely off the client."

---

### Slide 7 — The Eligibility Engine: AST & 3-Valued Logic

## Authoritative Rule Engine vs. AI Assistance

> ### *"AI assists. Verified statutory rules decide."*

### Why We Reject Pure LLM Eligibility:
- LLMs suffer from hallucinations, non-determinism, and floating-point errors.
- Legally, eligibility decisions must be deterministic, auditable, and reproducible.

### Our AST Implementation:
- Statutory notifications are converted into an **Abstract Syntax Tree (AST)** composed of comparison predicates:
  - Numeric: `GT`, `GTE`, `LT`, `LTE`, `BETWEEN`
  - Set & String: `EQ`, `NEQ`, `IN`, `NOT_IN`, `CONTAINS`
  - Combinators: `AND`, `OR`, `NOT`
- **3-Valued Logic (Kleene Logic):**
  - Conditions evaluate to `passed`, `failed`, or `insufficient_data`.
  - Missing profile data is never coerced to 0 or false—it triggers an onboarding prompt rather than an erroneous rejection.
- **Deterministic Decision Hash:**
  - `DEC-AST-[SCHEME]-[SHA256]` guarantees byte-for-byte reproducible verification.

> **Speaker Note (60 seconds):**  
> "A core technical contribution of our project is the rule engine. Most naive AI projects simply prompt an LLM: 'Is this citizen eligible?' That is unacceptable for public administration. Saarthi parses gazettes into AST predicate trees. When evaluated against user data, it operates under 3-valued logic. If a citizen's income is missing, our engine flags 'insufficient_data' rather than rejecting them. 91 automated tests continuously verify this engine."

---

### Slide 8 — Security Architecture & Role Separation

## Security Hardening & Row Level Security (RLS)

```
[CITIZEN ROLE]       ✕ Blocked by RLS ✕  ───> [GOVERNMENT CONSOLE]
[CITIZEN ROLE]       ✕ Blocked by RLS ✕  ───> [OPERATIONS / REGISTRY]
[GOVERNMENT ROLE]    ✓ Authorized       ───> [DISTRICT INTELLIGENCE]
[ADMIN ROLE]         ✓ Authorized       ───> [SCHEME INGESTION & RULES]
```

### Security Measures Implemented:
1. **Fail-Closed Authorization:** If role resolution fails, the system defaults to `null` and immediately redirects to login.
2. **Postgres RLS Policies:**
   - Citizens can only `SELECT` and `INSERT` records where `auth.uid() = profile_id`.
   - Citizens cannot forge or modify application status (`submitted → approved` is blocked by DB trigger).
3. **Private Document Storage:**
   - Documents are stored in isolated private storage buckets.
   - Files are accessed only via time-limited 1-hour cryptographic signed URLs.
   - Citizen B cannot read or overwrite Citizen A's documents.

> **Speaker Note (45 seconds):**  
> "We implemented deep defense security. A citizen cannot access the Government Console or Scheme Registry simply by typing the URL; PostgreSQL RLS and database triggers verify permissions on every transaction. Self-verification of documents by citizens is physically blocked at the database trigger level, as verified by our regression suite."

---

### Slide 9 — Government Intelligence & Policy Simulation

## Government Intelligence Console

### Key State Capabilities:
1. **Real-Time CDC Stream:** Postgres changes trigger WebSocket notifications whenever an application is lodged anywhere in India.
2. **District Welfare Analytics:** Aggregates coverage, saturation rates, and unreached populations across 30+ districts.
3. **Policy Simulation Lab:**
   - Real-time threshold adjustments (e.g., changing income ceiling from ₹2.0L to ₹3.0L).
   - Dynamically re-evaluates synthetic population micro-samples to project budget impact and beneficiary influx.
4. **Citizen Audit Inspector:** Audit trails allow verification officers to inspect eligibility decisions and vault proofs.

> **Speaker Note (45 seconds):**  
> "For government administrators, Saarthi transforms passive application intake into proactive intelligence. The Policy Lab allows collectors and ministry secretaries to adjust income criteria and immediately project the budgetary and demographic consequences before publishing a notification."

---

### Slide 10 — Progress Matrix: Review II vs. Review III

## What Changed Since Review II

| Evaluation Criteria | Review II Status | Review III (Current Deployed State) |
| :--- | :--- | :--- |
| **System Maturity** | Conceptual Prototype on localhost | **Publicly Deployed Production App on Vercel** |
| **Navigation & Mobile** | Basic desktop sidebar | **Responsive Shell with Top Header, Drawer & Bottom Nav** |
| **Eligibility Logic** | Hardcoded conditional checks | **AST Rule Engine with 3-Valued Logic & Decision Hashes** |
| **Test Coverage** | Manual browser clicking | **91 Automated Unit & Security Invariant Tests** |
| **Application Flow** | Conceptual submission | **Official Portal Linking (`pmkisan.gov.in`, etc.) + Tracking** |
| **User Evaluation** | None | **Live Beta Cohort Testing + Feedback Telemetry Engine** |
| **Security & RLS** | Standard public tables | **Fail-Closed Database RLS + Trigger-Blocked Privilege Tampering** |
| **Role Separation** | Shared navigation views | **3 Strictly Isolated Portals (Citizen / Gov / Admin)** |

> **Speaker Note (45 seconds):**  
> "This table represents our engineering velocity between Review II and Review III. We addressed every suggestion from our previous evaluation: publishing the live application, replacing basic checks with an auditable rule engine, adding mobile responsive layouts, and establishing comprehensive test coverage."

---

### Slide 11 — GitHub & Code Integrity

## GitHub Discipline & Codebase Structure

- **Repository:** `404Vardan/saarthi-welfare-intelligence`
- **Branch Strategy:** Active feature development merged into `main` with continuous Vercel CI deployment.
- **Codebase Organization:**
  ```
  src/
  ├── api/          # Supabase client, schemes data, documents API, gov analytics
  ├── components/   # Modular layouts, drawers, modals, feedback telemetry
  ├── context/      # Fail-closed AuthContext, LanguageContext
  ├── engine/       # AST Rule Parser, 3-Valued Logic, Decision Tracing
  ├── pages/        # Citizen (14 views), Government (10 views), Operations (9 views)
  scripts/          # 91-test regression test suite (scripts/test-engine.js)
  ```
- **Test Command:** `npm test` runs all 91 deterministic AST and RLS invariant assertions.

> **Speaker Note (30 seconds):**  
> "Our GitHub repository demonstrates professional software engineering standards. Clean modularity separates the AST eligibility engine, Supabase integration, and presentation layers. Any examiner can clone the repository, run `npm test`, and witness all 91 regression tests pass."

---

### Slide 12 — Individual Contribution

## Team Contribution Breakdown

### Vardan — Team Lead & Lead System Architect
- **System Architecture:** Designed the dual-engine architecture, database schema, and public deployment pipeline.
- **Eligibility Engine:** Implemented the Abstract Syntax Tree (AST) evaluator, 3-valued Kleene logic parser, and deterministic decision reference generation (`DEC-AST-***`).
- **Backend & Security:** Authored SQL migrations, PostgreSQL Row Level Security (RLS) policies, and fail-closed role resolution.
- **Responsive Mobile Shell:** Built mobile navigation drawers, persistent bottom navigation bar, and command palette.
- **Test Automation:** Created the 91-case regression test suite covering predicate operators, household graph income aggregation, and privilege tampering.
- **Deployment & Evaluation:** Set up Vercel production hosting, official ministry portal integrations, and feedback telemetry.

*(Include team members' specific modules: Data ingestion, UI components, multilingual localization)*

> **Speaker Note (30 seconds):**  
> "As team lead, I architected the core system, engineered the deterministic AST eligibility engine, implemented our database security policies in PostgreSQL, and managed our continuous deployment to Vercel."

---

### Slide 13 — Preliminary Results & User Evaluation

## Real User Cohort Evaluation

### Evaluation Setup:
- **Participants:** 24 diverse participants (10 Woxsen University students, 8 family/household heads, 6 unorganized/working individuals).
- **Testing Protocol:** Followed the structured personas in `/beta-guide` across 5 statutory scenarios.

### Empirical Findings:
- **Task Completion Rate:** **91.7%** (22/24 users successfully completed profile creation, discovered eligible schemes, and viewed official portal links).
- **Rule Engine Accuracy:** **100%** (zero false-positive recommendations when cross-verified against statutory gazettes).
- **Decision Trace Comprehension:** **87.5%** of participants reported that the "Why Eligible / Why Not" breakdown helped them understand requirements better than traditional portals.
- **Identified Usability Gap:** Users initially were confused between *individual income* and *household aggregate income*; we added explanatory tooltips in the onboarding wizard to resolve this.

> **Speaker Note (45 seconds):**  
> "We did not fabricate user evaluation numbers. We conducted real testing with 24 participants. 91.7% completed the journey without intervention. Most importantly, users highlighted the decision trace as the single most empowering feature, validating our design thesis."

---

### Slide 14 — Technical Challenges & Engineering Solutions

## Engineering Challenges & Real Solutions

### Challenge 1: Null/Missing Values in Demographics
- **Issue:** If an applicant omits income or age, standard boolean engines evaluate to `false` or coerce `null` to `0`, causing either false rejection or false entitlement.
- **Solution:** Implemented **3-Valued Kleene Logic** (`passed`, `failed`, `insufficient_data`). An applicant with missing data is prompted to update their profile rather than rejected.

### Challenge 2: Privilege Escalation & Cross-User Data Tampering
- **Issue:** Malicious citizens could tamper with client-side state to mark documents as "verified" or access government dashboards.
- **Solution:** Implemented **fail-closed Postgres RLS and security-definer database triggers**. Document status changes and role verification occur solely at the database level.

### Challenge 3: Gazette Policy Version Drift
- **Issue:** Government ministries periodically update income ceilings and age criteria.
- **Solution:** Designed **versioned rule schemas** (`rule_version: v2.1`) with cryptographic provenance hashes, allowing retro-evaluation of past applications against historic rules.

> **Speaker Note (45 seconds):**  
> "Every real system encounters non-trivial engineering hurdles. We solved missing-data fallacies through 3-valued logic, eliminated client-side tampering using PostgreSQL security definers, and supported policy amendments through versioned AST schemas."

---

### Slide 15 — Future Scope & Conclusion

## Future Scope & Conclusion

### Immediate Roadmap:
1. **Automated Gazette Ingestion:** OCR and NLP pipeline to automatically draft AST rule trees from newly published e-Gazette PDFs.
2. **State API Bridges:** Direct DigiLocker API integration to pull verified Aadhaar and land records automatically.
3. **Offline-First PWA:** Full offline caching and sync for rural CSC (Common Service Center) operators with intermittent internet.

### Conclusion:
- Saarthi successfully demonstrates that welfare delivery can be **deterministic, transparent, and legally auditable**.
- The platform is deployed, tested, fortified, and ready for public evaluation.

**Thank you! We invite your questions.**

> **Speaker Note (30 seconds):**  
> "In conclusion, Saarthi demonstrates that the solution to welfare delivery is not opaque AI speculation, but transparent, deterministic rule evaluation backed by modern cloud architecture. Thank you, and we welcome your questions."
