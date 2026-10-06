# Saarthi Testing & Verification Infrastructure

## Overview

Saarthi incorporates an extensive deterministic regression and integrity test suite. Because welfare eligibility impacts livelihoods, the testing infrastructure prioritizes reproducibility, zero-flakiness, and strict edge-case validation.

---

## 1. Core Deterministic Regression Suite (91 Assertions)

Executed via `npm test` (`scripts/test-engine.js`), this suite validates the mathematical correctness and security invariants of the platform across 9 test groups:

```
====================================================
🚀 SAARTHI 2.0 DETERMINISTIC ENGINE REGRESSION SUITE
====================================================
Test Group 1: AST Predicate Operators                  [14 Passed]
Test Group 2: 3-Valued Logic & Null/Undefined Safety    [ 7 Passed]
Test Group 3: Household Graph & Income Aggregation      [ 2 Passed]
Test Group 4: 10 Statutory Personas Evaluation          [12 Passed]
Test Group 5: Status-Aware Document Readiness           [12 Passed]
Test Group 6: Application Idempotency & Duplicate Guard [ 4 Passed]
Test Group 7: Auth Fail-Closed & Role Boundaries        [10 Passed]
Test Group 8: Cross-User RLS & Authorization Invariants [17 Passed]
Test Group 9: Deterministic Decision IDs & Zero Income  [13 Passed]
----------------------------------------------------
TOTAL: 91 / 91 Passed (0 Failures)
====================================================
```

### Breakdown of Test Groups

1. **AST Predicate Operators**: Verifies exact operator semantics (`EQ`, `NEQ`, `GT`, `GTE`, `LT`, `LTE`, `IN`, `NOT_IN`, `CONTAINS`, `BETWEEN`) against edge types and boundary numbers.
2. **3-Valued Kleene Logic**: Ensures missing attributes return `insufficient_data` rather than defaulting to false or zero. Validates AND/OR short-circuiting and NOT node inversions.
3. **Household Income Aggregation**: Validates dynamic family income aggregation across the applicant and household graph members.
4. **Statutory Persona Evaluation**: Validates 10 diverse statutory personas (Marginal Farmer, High-Income Farmer, SC Student, General Student, Senior BPL Citizen, Pregnant Mother, Artisan, Street Vendor, etc.).
5. **Status-Aware Document Readiness**: Confirms document weighted scoring across lifecycles (`VERIFIED`, `UNDER_REVIEW`, `UPLOADED`, `EXPIRED`, `REJECTED`, `NOT_UPLOADED`).
6. **Application Idempotency**: Tests duplicate application detection, reference code standardization, and race-condition prevention.
7. **Auth Fail-Closed Integrity**: Validates that unauthenticated users, users with missing roles, or database lookup errors safely fail closed.
8. **Cross-User RLS & Security Invariants**: Simulates PostgreSQL Row-Level Security policies, trigger self-elevation blocks, and storage folder isolation.
9. **Decision Hash Determinism & Zero-Income Parity**: Confirms byte-for-byte reproducibility of SHA-256 decision digests and confirms that an explicit ₹0 income is treated as valid zero rather than missing data.

---

## 2. Campus Welfare Pilot Coverage Suite (120 Assertions)

Executed via `node --env-file=.env scripts/test_campus_coverage.js`:

```
================================================================
🏛️ SAARTHI CAMPUS PILOT: 30-SCHEME 4-DIMENSION COVERAGE SUITE
================================================================
Auditing and Stress-Testing 30 Campus Pilot Schemes...
----------------------------------------------------------------
TEST SUMMARY: 120 / 120 Assertions Passed
🎉 100% OF 30 CAMPUS SCHEMES PASSED ALL 4 DETERMINISTIC INTEGRITY CHECKS!
================================================================
```

### The 4 Deterministic Integrity Dimensions
For every one of the 30 Campus Pilot schemes, the suite evaluates four distinct persona vectors:

1. **Valid Persona**: A demographic vector that matches all statutory conditions, verifying that the scheme evaluates to `eligible` with 100% match.
2. **Ineligible Persona**: A demographic vector violating a core constraint (e.g., income ceiling or category), verifying that the engine rejects or flags the applicant correctly.
3. **Incomplete Persona**: A demographic vector missing key required fields, verifying that the engine returns `insufficient_data` without issuing a false rejection.
4. **Already-Receiving Persona**: A persona flagged as already enrolled, verifying duplicate detection and exclusion.

---

## 3. How to Run Tests Locally

```bash
# 1. Run the core regression suite
npm test

# 2. Run the Campus Pilot verification suite
node --env-file=.env scripts/verify_campus_pilot.js

# 3. Run the 30-scheme 4-dimension coverage test
node --env-file=.env scripts/test_campus_coverage.js

# 4. Run the production build check
npm run build
```

---

## Important Notice on Testing vs. Legal Certification

> Automated test suites validate **software implementation integrity** against the criteria and schemas encoded in the repository. They prove that the code behaves deterministically as written. They **do NOT** constitute legal or statutory certification from the Government of India or state ministries.
