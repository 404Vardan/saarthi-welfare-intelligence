# SAARTHI — TECHNICAL VIVA & EXAMINER DEFENSE GUIDE
## Capstone Project Review III

This document provides definitive, technically grounded answers to all questions an examiner or professor may ask during the viva examination.

---

### Q1: "Is this application actually deployed and accessible right now?"
**Answer:**
> "Yes, sir/ma'am. The application is publicly deployed on Vercel's edge network at `https://[your-production-url].vercel.app`. It is connected directly to our Supabase PostgreSQL production cluster with active Row Level Security. You can open that URL right now on any phone or laptop and experience the entire product."

*(Action: Have the live URL open in a clean browser window ready to hand over or project).*

---

### Q2: "How does your eligibility engine work? Did you just use Gemini to check if someone qualifies?"
**Answer:**
> "No, sir. We deliberately **do NOT use an LLM or Gemini for eligibility decisions**. An LLM can hallucinate, produce non-deterministic results, and cannot be legally audited.
> 
> Instead, our eligibility engine is a **100% deterministic Abstract Syntax Tree (AST) rule engine**.
> We parse official government gazette criteria into AST condition trees using comparison operators (`EQ`, `GT`, `GTE`, `LT`, `LTE`, `IN`, `BETWEEN`) and logical combinators (`AND`, `OR`, `NOT`).
> The engine evaluates citizen demographic attributes against these trees using **3-Valued Kleene Logic** (`passed`, `failed`, `insufficient_data`).
> Every evaluation generates a byte-for-byte reproducible Decision Hash (`DEC-AST-[SCHEME]-[SHA256]`) so that any decision can be independently audited."

---

### Q3: "Then what is Gemini/AI used for in Saarthi?"
**Answer:**
> "Gemini 1.5 Flash is strictly used as an **advisory and language intelligence layer**:
> 1. Translating complex bureaucratic jargon into conversational, plain language across Indian regional languages.
> 2. Providing the conversational assistant ('Ask Saarthi') to guide citizens on which documents they need and how to apply.
> 3. Document checklist and administrative procedural advice.
> 
> The core architectural principle of Saarthi is: **AI assists, but verified deterministic rules decide.**"

---

### Q4: "What happens if a citizen does not provide their income or age during onboarding?"
**Answer:**
> "In most traditional platforms, missing data either defaults to `0` or throws an error. If income defaults to 0, a wealthy applicant who left the field blank might incorrectly qualify for BPL schemes. If it throws `false`, an eligible citizen is wrongfully rejected.
> 
> In Saarthi, we implemented **3-Valued Kleene Logic**:
> - If an attribute is missing, the AST node evaluates to `insufficient_data`.
> - In an `AND` group, if all other nodes pass, the overall result is `insufficient_data`.
> - This alerts the citizen with guided onboarding ('Add your annual income to unlock 4 eligible schemes') instead of rejecting them.
> We have 8 dedicated unit tests in our test suite verifying this exact behavior."

---

### Q5: "How do you handle household income versus individual income?"
**Answer:**
> "Schemes like Post-Matric SC Scholarships and PM Awas Yojana evaluate aggregate **household income**, whereas schemes like PM-KISAN evaluate the **individual landholder's income**.
> 
> In Saarthi, our citizen context builds a **household graph**:
> - Individual attributes are stored in the citizen profile.
> - Household members are stored in `household_members`.
> - The context dynamically computes `household.aggregate_income = profile.income + sum(member.income)`.
> The AST rules specify whether they evaluate against `profile.income_annual` or `household.aggregate_income`, preventing miscalculations."

---

### Q6: "How do you protect citizen data? Can one citizen see another citizen's documents?"
**Answer:**
> "We enforce security at three independent layers:
> 1. **PostgreSQL Row Level Security (RLS):** Every query is filtered at the database engine level. A user can only read and write records where `profile_id = auth.uid()`. Even if someone crafts a malicious client query, PostgreSQL rejects it.
> 2. **Private Storage Buckets with Signed URLs:** Uploaded documents (Aadhaar, income certificates) are stored in private Supabase buckets. They cannot be accessed via public URLs. The server generates a temporary, 1-hour cryptographic signed URL only for the authenticated owner or authorized verification officer.
> 3. **Tamper-Proof Triggers:** Application status (e.g. `submitted → approved`) cannot be edited by citizens. A PostgreSQL trigger checks `auth.uid()` against `user_roles` and blocks any unauthorized updates."

---

### Q7: "How is role separation enforced between Citizens, Government, and Admin?"
**Answer:**
> "Role separation is strictly **fail-closed**:
> 1. Client-side routing uses `ProtectedRoute.jsx` with an allowed roles whitelist (`['citizen']`, `['government']`, `['admin']`).
> 2. Authoritative role resolution is queried from the `user_roles` database table. If the database returns null or errors out, the role resolution fails closed to `null` and redirects to login.
> 3. Database operations are protected by PostgreSQL functions (`private.is_admin()`, `private.is_government()`). Even if a user bypasses the frontend, the database denies access."

---

### Q8: "What happens when a government ministry changes the rules of a scheme?"
**Answer:**
> "In Saarthi, scheme rules are **versioned and immutable**:
> - Each scheme has a `rule_version` (e.g., `v1.0`, `v2.1`) and a cryptographic hash of the gazette text.
> - When a ministry issues a new gazette, an Operations Admin creates a new version in the Scheme Registry rather than mutating the historic rule.
> - Existing applications remain tied to the rule version active on the date of submission (`applied_at`), preserving legal provenance and auditability."

---

### Q9: "Why is Saarthi different from the official government myScheme portal?"
**Answer:**
> "myScheme is an informative query portal where citizens answer 15 static questionnaire filters to see a list of scheme names.
> 
> Saarthi introduces four distinct technical advancements:
> 1. **The Dynamic Welfare Passport:** A persistent, reusable profile with a household demographic graph and verified document vault.
> 2. **Explainable Decision Traces:** Rather than a simple list, Saarthi shows an exact criterion-by-criterion breakdown of why someone qualifies or what near-miss gap disqualified them.
> 3. **Dual-Sided Architecture:** myScheme has no district-level intelligence console. Saarthi provides government collectors and policymakers with real-time intake telemetry, coverage saturation maps, and policy threshold simulation.
> 4. **Deep Official Portal Routing:** Saarthi prepares the citizen's document dossier and provides direct links to the authoritative submission portals (`pmkisan.gov.in`, `scholarships.gov.in`)."

---

### Q10: "What did YOU personally implement as Team Lead?"
**Answer:**
> "As Team Lead, I personally architected and implemented:
> 1. **The Deterministic AST Rule Engine:** Coded the AST node parser, predicate comparison functions, 3-valued logic, and byte-for-byte decision ID generator in `src/engine/eligibilityEngine.js`.
> 2. **Database & Security Hardening:** Authored the SQL migration scripts (`migration.sql`, `rbac_migration.sql`, `security_integrity_migration.sql`) including Row Level Security policies and privilege escalation prevention triggers.
> 3. **The Mobile Responsive Application Shell:** Designed and built the multi-portal navigation architecture, mobile slide-out drawers, and persistent bottom navigation bar in `src/components/layout/`.
> 4. **The Automated Test Suite:** Wrote the 91-test regression test suite (`scripts/test-engine.js`) verifying rule predicates, household graph math, auth fail-closed logic, and RLS invariants.
> 5. **Public Deployment & Vercel CI:** Managed git repository discipline, vercel configuration, and live Supabase integration."

---

### Q11: "Can you prove that your code is tested?"
**Answer:**
> "Yes, sir/ma'am. We have an automated regression test suite containing 91 assertions.
> Let me run it right now: `npm test`."
> 
*(Action: Open terminal and run `npm test`. Show 91 passed tests across AST operators, 3-valued logic, statutory personas, and RLS authorization invariants).*
