# Saarthi Trust Model & AI Boundaries

## Core Principle

> **AI assists. Verified rules decide.**

In statutory governance and civic-tech systems, citizen entitlements directly affect livelihoods, healthcare, and education. Delegating legal eligibility decisions to generative Large Language Models (LLMs) poses grave risks: hallucinations, probabilistic drift, non-reproducibility, and lack of statutory auditability.

Saarthi enforces an architectural boundary separating **assistive intelligence** from **statutory decision authority**.

---

## The Trust Boundary Diagram

```
                    SAARTHI TRUST BOUNDARY

        ┌──────────────────────────────────────────────┐
        │         DETERMINISTIC RULE ENGINE            │
        │                                              │
        │  • Abstract Syntax Tree (AST) evaluation     │
        │  • 3-Valued Kleene Logic evaluation          │
        │  • Deterministic Decision Traces             │
        │  • SHA-256 Decision Digest Generation        │
        │  • Gazette Rule Versioning (rule_version)    │
        │  • Explicit Missing-Data Detection           │
        └──────────────────────┬───────────────────────┘
                               │
                               ▼
                        AUTHORITATIVE
                      ELIGIBILITY RESULT


        ┌──────────────────────────────────────────────┐
        │            ASSISTIVE GEMINI AI               │
        │                                              │
        │  • Natural-language query translation        │
        │  • Plain-language clause explanation         │
        │  • Multilingual conversational interaction   │
        │  • Procedural guidance on portal navigation  │
        │  • Document application checklist guidance   │
        └──────────────────────────────────────────────┘

        AI DOES NOT BECOME THE AUTHORITY FOR ELIGIBILITY.
```

---

## Architectural Comparison: Deterministic Engine vs. Generative LLMs

| Feature / Dimension | Deterministic AST Engine (`eligibilityEngine.js`) | Generative AI (`Gemini 1.5 Flash`) |
| :--- | :--- | :--- |
| **System Role** | **Sole Statutory Decider** | **Assistive Conversational Guide** |
| **Mathematical Nature** | Deterministic, exact boolean logic | Probabilistic, next-token prediction |
| **Reproducibility** | 100% reproducible byte-for-byte | Subject to temperature, sampling, and drift |
| **Missing Data Handling**| Kleene 3-valued logic (`insufficient_data`) | Prone to assuming defaults (e.g. income = 0) |
| **Auditability** | Cryptographic hash digests (`DEC-<SCHEME>-<HASH>`) | Opaque, prompt-dependent natural language |
| **Adversarial Resilience**| Immune to prompt injection or jailbreaks | Susceptible to social engineering and jailbreaks |
| **Statutory Provenance** | Explicit links to official gazettes and portals | Cannot guarantee authentic legal citations |

---

## Gemini System Guardrails & Edge Isolation

The integration with Google Gemini 1.5 Flash in `supabase/functions/ask-saarthi` is constrained by strict architectural guardrails:

1. **Serverless Proxy Execution**:
   - The frontend never connects directly to Google AI endpoints.
   - The secret API key (`GEMINI_API_KEY`) is stored exclusively in Supabase encrypted environment secrets.

2. **System Prompt Directives**:
   - The model is explicitly informed: *"You are Saarthi Assistant, an informational guide. You DO NOT possess the legal authority to grant, deny, or alter welfare scheme eligibility. Always defer statutory eligibility determinations to the deterministic evaluation trace."*

3. **Context Injection**:
   - When answering citizen questions about specific schemes, the system prompt injects the **deterministic evaluation result** produced by `eligibilityEngine.js`.
   - The LLM's task is strictly to explain the engine's findings in clear, culturally appropriate language, not to compute its own decision.
