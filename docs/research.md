# NWIS: Research & Academic Framework

## Formal Research Title

> **NWIS: A Knowledge Graph-Based National Welfare Intelligence System for Citizen-Centric Governance and Policy Decision Support**

**Author:** Vardan Desai ([@404Vardan](https://github.com/404Vardan))  
**Keywords:** Welfare Intelligence, GovTech, Civic-Tech, Knowledge Graph, Deterministic AST Engine, 3-Valued Kleene Logic, Explainable AI, Policy Decision Support.

---

## 1. Abstract & Problem Statement

Public welfare delivery in developing economies faces acute systemic challenges: severe information asymmetry, fragmented institutional gazettes, non-standardized eligibility rules, and document hurdles that exclude millions of eligible citizens. Conversely, policymakers lack granular, real-time telemetry on why eligible beneficiaries drop out across the delivery pipeline.

The **National Welfare Intelligence System (NWIS)** research architecture addresses these challenges through a dual-sided paradigm:
1. **At the Micro (Citizen) Level**: Formalizes statutory welfare guidelines into a computable Knowledge Graph evaluated via a deterministic 3-valued Kleene logic Abstract Syntax Tree (AST) engine, generating immutable SHA-256 decision traces and status-aware document readiness scores.
2. **At the Macro (Governance) Level**: Aggregates programmatic telemetry into a policy intelligence console featuring district delivery saturation mapping, welfare gap diagnostics, and synthetic population scenario simulation.

---

## 2. Core Research Pillars

### Pillar I: Formal Knowledge Representation of Welfare Policy
Statutory gazette notifications often combine multi-tiered demographic conditions, socio-economic ceilings, occupational exclusions, and temporal validity windows. NWIS models these policies as composable Abstract Syntax Trees linked to an entity ontology encompassing citizens, households, schemes, documents, and issuing authorities.

### Pillar II: Kleene 3-Valued Logic & The Missing-Data Trap
Standard search engines often fail silently or miscalculate when citizen attributes are unprovided (either defaulting income to ₹0 or rejecting the applicant). NWIS formalizes evaluation across three states (`passed`, `failed`, `insufficient_data`), providing short-circuit safety and explicit missing-data onboarding cues.

### Pillar III: AI Trust Boundaries & Algorithmic Explainability
Large Language Models cannot reliably serve as legal deciders due to hallucinations and non-deterministic behavior. NWIS enforces a strict separation: **AI assists; verified rules decide.** The model produces verifiable decision reference digests (`DEC-<SCHEME>-<HASH>`) linking citizen evaluation states directly to statutory rule versions (`rule_version`).

### Pillar IV: Policy Simulation & Synthetic Population Modeling
To test governance capabilities without compromising sensitive citizen census data, NWIS implements a deterministic synthetic population model (`SyntheticPopulationAPI`) that simulates demographic distributions and district delivery saturation curves for policy threshold adjustment.

---

## 3. Existing Evaluation & Defense Protocols in Repository

This repository contains supporting research documentation:

- [User Evaluation Protocol](file:///c:/Users/pinku/OneDrive/Documents/CSP-1/docs/USER_EVALUATION_PROTOCOL.md): Field evaluation protocol measuring task completion rate, decision trust, and document clarity across 5 statutory personas.
- [Review Presentation Deck](file:///c:/Users/pinku/OneDrive/Documents/CSP-1/docs/REVIEW_III_PRESENTATION_DECK.md): Formal research slide deck detailing technical motivation, architecture, and empirical findings.
- [Viva Defense Cheatsheet](file:///c:/Users/pinku/OneDrive/Documents/CSP-1/docs/VIVA_DEFENSE_CHEATSHEET.md): Technical defense notes on Kleene logic proofs, RLS security guarantees, and AST evaluation mechanics.

---

## 4. Citation

To cite this project in academic research or policy analysis, please consult [CITATION.cff](../CITATION.cff) or format as follows:

```bibtex
@software{Desai_Saarthi_NWIS_2026,
  author = {Desai, Vardan},
  title = {{NWIS: A Knowledge Graph-Based National Welfare Intelligence System for Citizen-Centric Governance and Policy Decision Support}},
  url = {https://github.com/404Vardan/saarthi-welfare-intelligence},
  version = {2.0.0},
  year = {2026}
}
```
