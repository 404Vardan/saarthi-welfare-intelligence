# Security Policy

The Saarthi project takes data privacy, algorithmic integrity, and application security seriously, especially given our focus on citizen demographic information and welfare access.

---

## Supported Versions

Security fixes and patches are applied to the active development branch and latest release tag:

| Version | Supported |
| :--- | :--- |
| **2.0.x** | :white_check_mark: Supported |
| **< 2.0.0** | :x: End of Life |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a vulnerability or security flaw in Saarthi, please report it privately:

1. **GitHub Security Advisory (Preferred):**
   - Navigate to the [Security Advisories tab](https://github.com/404Vardan/saarthi-welfare-intelligence/security/advisories) of the repository.
   - Click **"Report a vulnerability"** to submit private details directly to project maintainers.

2. **Direct Maintainer Contact:**
   - Email: `pinkudesai1301@gmail.com`
   - Subject line: `[SECURITY] Saarthi Vulnerability Report`
   - Please include:
     - Description of the vulnerability and attack vector.
     - Affected files or endpoints.
     - Minimal proof-of-concept (PoC) or reproduction steps.
     - Potential impact on citizen data, access controls, or evaluation integrity.

### Disclosure Timeline

- **Acknowledgement:** We aim to acknowledge reports within **48 hours**.
- **Assessment & Fix:** We will evaluate the report, verify reproduction, and prepare a patch within **7–14 business days**.
- **Public Disclosure:** Coordinated disclosure will occur after a fix has been tested and merged into the main branch.

---

## Security Architecture & Threat Model

While Saarthi is an open-source civic-tech research project and makes no claims of being invulnerable, the architecture implements defense-in-depth principles:

### 1. Database & Row Level Security (RLS)
- **Granular Table Isolation**: Citizen profiles (`profiles`), document records (`documents`), and application submissions (`applications`) enforce PostgreSQL Row-Level Security policies.
- **Fail-Closed Permissions**: By default, tables reject cross-tenant reads and writes. A citizen user can only read and mutate their own records.
- **Self-Elevation Prevention**: Database triggers and security definer functions strictly block attempts by `citizen` accounts to alter their own role, approve applications, or mark their own documents as verified.

### 2. Role-Based Access Control (RBAC)
- Dedicated roles: `citizen`, `government`, and `admin`.
- Role verification checks in UI and database fail closed (`null` or unassigned roles are rejected).

### 3. Serverless AI Proxy Isolation
- Gemini 1.5 Flash API credentials (`GEMINI_API_KEY`) are stored as encrypted environment secrets inside Supabase Edge Functions (`supabase secrets set GEMINI_API_KEY=...`).
- The client frontend never has access to, nor bundles, generative AI provider secrets or Supabase service role keys.

### 4. Deterministic Rule Integrity
- Eligibility evaluations are fully deterministic and reproducible, insulated from prompt injection or adversarial conversational manipulation.
- Generated decision references include immutable SHA-256 hash digests (`DEC-<SCHEME>-<HASH>`), ensuring evaluation outputs can be audited against statutory rule versions.

### 5. Repository Secret Hygiene
- Automated testing and repository configurations exclude `.env` files.
- Contributors must never commit API secrets, private keys, or actual citizen PII.
