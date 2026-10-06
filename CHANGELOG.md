# Changelog

All notable changes to the **Saarthi** project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-10-06

### Added
- **Canonical Scheme Registry Expansion**: Expanded registry to 298 canonical Central and State Government schemes across 12 sector categories (`agriculture`, `education`, `healthcare`, `housing`, `social_security`, `tribal`, `msme`, etc.).
- **Campus Welfare Pilot (30 Schemes)**: Introduced specialized welfare routing for students, non-teaching campus staff, early-career researchers, and university contract workers.
- **Campus 4-Dimension Coverage Suite**: Added automated verification across 30 campus schemes testing valid personas, ineligible personas, incomplete profiles, and already-receiving flags (120 assertions).
- **Adaptive Welfare Passport**: Profile editor supporting dynamic socio-economic attributes, occupation sectors, caste categories, income ranges, and household graph members.
- **Status-Aware Document Vault**: Document readiness grading with status progression (`VERIFIED`, `UNDER_REVIEW`, `UPLOADED`, `EXPIRED`, `REJECTED`, `NOT_UPLOADED`).
- **Deterministic Decision Trace**: Immutable byte-for-byte SHA-256 decision digests (`DEC-<SCHEME>-<HASH>`) providing complete clause-by-clause explainability.
- **Multilingual Interface (11 Languages)**: Expanded UI localization across 11 Indian languages (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia).
- **Tamper-Resistant RBAC & RLS**: PostgreSQL Row-Level Security policies with fail-closed role assignments and DB triggers blocking citizen self-elevation.
- **Edge-Isolated AI Assistant**: Gemini 1.5 Flash conversational assistant proxied via serverless edge functions with strictly assistive trust boundaries.
- **Policy Intelligence Lab**: Synthetic population simulation for district-level saturation mapping, benefit gap analysis, and eligibility threshold modeling.

### Changed
- **Search & Discovery**: Refactored scheme filtering with instant full-text search, state-level scoping, and category facets.
- **Regression Suite**: Expanded automated engine test suite to 91 core regression assertions covering AST operators, 3-valued logic, household income aggregation, and RLS invariants.
- **Telemetry**: Integrated Vercel Analytics for privacy-preserving user traffic insights.

---

## [1.0.0] - 2026-09-15

### Added
- **Core AST Eligibility Engine**: Implementation of Abstract Syntax Tree predicate evaluation on normalized citizen attributes.
- **3-Valued Kleene Logic**: Formal handling of missing attributes (`insufficient_data`) to prevent silent rejections or false zeroes.
- **Initial Scheme Catalog**: Baseline catalog of major central flagship welfare schemes (PM-KISAN, Ayushman Bharat, PMAY, NSP).
- **Supabase Backend**: Initial PostgreSQL schema for user profiles, saved schemes, and document metadata.
- **Dual-Sided Prototype**: Early interface layouts for citizen discovery and administrative scheme browsing.
