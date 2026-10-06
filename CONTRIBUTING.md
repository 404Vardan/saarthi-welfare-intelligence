# Contributing to Saarthi

Thank you for your interest in contributing to **Saarthi (National Welfare Intelligence System)**! We welcome contributions from software engineers, policy researchers, civic-tech practitioners, students, linguists, and accessibility advocates.

---

## Table of Contents

1. [Core Architectural Principle](#core-architectural-principle)
2. [Ways to Contribute](#ways-to-contribute)
3. [Contributing Welfare Scheme Data & Eligibility Rules](#contributing-welfare-scheme-data--eligibility-rules)
4. [Development Setup](#development-setup)
5. [Testing & Validation Guidelines](#testing--validation-guidelines)
6. [Submitting a Pull Request](#submitting-a-pull-request)
7. [Code Style & Best Practices](#code-style--best-practices)

---

## Core Architectural Principle

Before contributing, please note our foundational architectural boundary:

> **AI assists. Verified rules decide.**

- **Deterministic Rule Engine:** All eligibility determinations, match calculations, threshold evaluations, and decision trace digests are executed exclusively by the deterministic rule engine (`src/engine/eligibilityEngine.js`).
- **Generative AI:** Large Language Models (Gemini via serverless edge proxy) are strictly assistive for plain-language summarization, conversational guidance, and multilingual interaction.
- **Rule Integrity:** **Under no circumstances will a Pull Request be accepted that shifts legal or statutory eligibility decision authority to an LLM or probabilistic model.**

---

## Ways to Contribute

We welcome diverse forms of contribution:

| Category | Description | Primary Directories |
| :--- | :--- | :--- |
| **Welfare Scheme Metadata** | Adding canonical central or state schemes, updating portal links, verifying benefits. | `src/api/schemesData.js`, `src/api/extendedSchemes.js` |
| **Eligibility Rules (AST)** | Encoding deterministic criteria, income ceilings, caste/category clauses, and exclusions. | `src/engine/eligibilityEngine.js`, `src/api/` |
| **Software Engineering** | React 18, Vite, responsive UI, CSS modularity, state management, and edge routines. | `src/components/`, `src/pages/`, `src/context/` |
| **Testing & Verification** | Regression suites, persona test vectors, edge-case boundary testing. | `scripts/test-engine.js`, `scripts/` |
| **Accessibility (a11y)** | Keyboard navigation, screen-reader semantics, color contrast, and assistive tech. | `src/components/`, `ACCESSIBILITY.md` |
| **Multilingual Support** | Improving translations across supported Indian languages (Hindi, Telugu, Tamil, Bengali, etc.). | `src/locales/` or translation dictionaries |
| **Research & GovTech** | Policy modeling, synthetic population analytics, academic citations, evaluation papers. | `docs/`, `CITATION.cff` |
| **Security & Privacy** | RLS audit, fail-closed auth verification, edge function proxy isolation. | `SECURITY.md`, `migration.sql` |

---

## Contributing Welfare Scheme Data & Eligibility Rules

To ensure academic and statutory credibility, all scheme contributions must adhere to strict provenance requirements:

### Mandatory Rule Submission Standards

1. **Official Source Backing Required:**
   - Every scheme must cite an authoritative, official government source (e.g., `*.gov.in`, `*.nic.in`, official state portal, or gazette notification).
   - Scheme records must include: `source_url`, `source_title`, `nodal_ministry`, and `last_verified_date`.
2. **NO LLM-Only Hallucinated Rules:**
   - **No contributor may introduce an eligibility rule based solely on an LLM-generated response.** 
   - You must have reviewed the statutory guideline, notification, or official portal before writing the AST rule.
3. **Transparent Unencoded Conditions:**
   - Real-world schemes often have criteria that cannot be captured by simple demographic attributes (e.g., *"Must possess a certificate of artisan craft from a designated trade association"* or *"Subject to Gram Sabha prioritization"*).
   - You must explicitly document these in `unencoded_conditions` or `notes` so applicants are never misled into believing an automated pass is a legal guarantee.
4. **Test Assertion Requirement:**
   - Any new or updated scheme rule must include at least two corresponding deterministic test cases:
     1. A valid passing persona.
     2. An ineligible persona failing on a known boundary condition.

### Scheme Data Schema Reference

```javascript
{
  id: "GOI-SCHEME-CODE",
  code: "SCHEME_SHORT_CODE",
  name: "Full Official Scheme Name",
  state: "Central", // or specific state: "Telangana", "Maharashtra", etc.
  category: "agriculture", // education, healthcare, social_security, etc.
  nodal_ministry: "Ministry of Agriculture & Farmers Welfare",
  source_url: "https://pmkisan.gov.in",
  source_title: "PM-KISAN Operational Guidelines",
  rule_version: "2026.1",
  rule_effective_from: "2019-02-01",
  verification_status: "VERIFIED", // VERIFIED, PARTIALLY_VERIFIED, INFORMATIONAL_ONLY
  unencoded_conditions: [
    "Subject to land ownership record verification in State Land Portal."
  ],
  rules: {
    // AST node representation evaluated by eligibilityEngine.js
  },
  documents_required: [
    { name: "Aadhaar Card", mandatory: true, issuing_authority: "UIDAI" }
  ]
}
```

---

## Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/404Vardan/saarthi-welfare-intelligence.git
   cd saarthi-welfare-intelligence
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Populate your Supabase configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Note: For running tests and viewing public schemes, test suites execute locally using Node.js without requiring a remote database connection).*

4. **Launch the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Testing & Validation Guidelines

Saarthi maintains automated regression suites to safeguard against regressions in eligibility evaluation and role-based access.

### 1. Core Deterministic Engine Tests (91 Assertions)
Validates AST predicate evaluation, 3-valued Kleene logic (`passed`, `failed`, `insufficient_data`), status-aware document readiness, household income aggregation, and RLS role invariants.
```bash
npm test
```

### 2. Campus Welfare Pilot Verification (30 Schemes & 120 Assertions)
Validates deduplication, geographic classification, and 4-dimension deterministic integrity across campus schemes:
```bash
node --env-file=.env scripts/verify_campus_pilot.js
node --env-file=.env scripts/test_campus_coverage.js
```

### 3. Production Build Validation
Always ensure that the Vite production bundle builds without errors:
```bash
npm run build
```

---

## Submitting a Pull Request

1. **Create a branch**:
   ```bash
   git checkout -b feature/scheme-pm-kusum-rules
   ```
2. **Commit your changes**:
   Follow conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).
   ```bash
   git commit -m "feat(registry): add PM-KUSUM solar pump scheme with AST rules and verification"
   ```
3. **Verify tests pass**:
   ```bash
   npm test
   npm run build
   ```
4. **Push and open a Pull Request**:
   Fill out our `.github/PULL_REQUEST_TEMPLATE.md` thoroughly. Ensure all source references and testing steps are included.

---

## Code Style & Best Practices

- **Modularity**: Keep components clean and focused. Prefer Vanilla CSS or existing design tokens over heavy ad-hoc utility classes.
- **Fail-Closed Logic**: Any security, access control, or eligibility logic must fail closed (i.e. default to safe rejection or `insufficient_data` rather than assuming access).
- **No Secrets**: Never commit Supabase Service Role keys, Gemini API keys, or personal credentials.
- **Respectful Collaboration**: Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all discussions and reviews.
