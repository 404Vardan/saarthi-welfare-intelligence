# Saarthi Eligibility Engine & Decision Science

## Overview

The Saarthi Eligibility Engine (`src/engine/eligibilityEngine.js`) is a deterministic, rule-based reasoning system designed to evaluate complex welfare guidelines without relying on opaque machine learning models or probabilistic predictions.

---

## 1. Abstract Syntax Tree (AST) Architecture

Eligibility criteria in statutory government notifications consist of nested logical predicates (e.g., *"Must be a resident of Telangana AND (either an SC/ST student OR an OBC student with family annual income <= ₹1.5L)"*).

Saarthi models these rules as declarative Abstract Syntax Trees evaluated recursively:

```javascript
// Example AST node
{
  type: "AND",
  children: [
    { field: "state", operator: "EQ", value: "Telangana" },
    {
      type: "OR",
      children: [
        { field: "caste_category", operator: "IN", value: ["SC", "ST"] },
        {
          type: "AND",
          children: [
            { field: "caste_category", operator: "EQ", value: "OBC" },
            { field: "annual_income", operator: "LTE", value: 150000 }
          ]
        }
      ]
    }
  ]
}
```

### Supported AST Operators
- **`EQ`**: Strict equality (`a === b`)
- **`NEQ`**: Non-equality (`a !== b`)
- **`GT`**: Greater than numeric comparison (`Number(a) > Number(b)`)
- **`GTE`**: Greater than or equal to (`Number(a) >= Number(b)`)
- **`LT`**: Less than numeric comparison (`Number(a) < Number(b)`)
- **`LTE`**: Less than or equal to (`Number(a) <= Number(b)`)
- **`IN`**: Array containment (`b.includes(a)`)
- **`NOT_IN`**: Array exclusion (`!b.includes(a)`)
- **`CONTAINS`**: Substring or array membership (case-insensitive)
- **`BETWEEN`**: Closed numerical interval check (`a >= b[0] && a <= b[1]`)

---

## 2. Three-Valued Kleene Logic

Conventional welfare search engines often suffer from the **Missing-Data Trap**: if an applicant leaves an income or landholding field blank, engines either default the field to `0` (granting an undeserved pass) or treat it as false (falsely rejecting the applicant).

Saarthi implements **3-Valued Kleene Logic**:

| Logic State | Evaluation Meaning | UI Representation |
| :--- | :--- | :--- |
| **`passed`** | Attribute is present and satisfies statutory criterion | Green Checkmark |
| **`failed`** | Attribute is present and violates statutory criterion | Red Cross (Hard Blocker) |
| **`insufficient_data`** | Attribute is missing/undefined; criterion cannot be decided | Amber Question Mark (Prompt to Fill) |

### Kleene Truth Tables

#### Logical AND Group:
- `passed` AND `passed` = `passed`
- `failed` AND *any* = `failed` (Short-circuit fail)
- `passed` AND `insufficient_data` = `insufficient_data`
- `insufficient_data` AND `insufficient_data` = `insufficient_data`

#### Logical OR Group:
- `passed` OR *any* = `passed` (Short-circuit pass)
- `failed` OR `insufficient_data` = `insufficient_data`
- `failed` OR `failed` = `failed`

---

## 3. Near-Miss Detection & Tolerance Analysis

Citizens often miss statutory eligibility thresholds by nominal margins (e.g., earning ₹2,52,000 against a ₹2,50,000 income cap). Saarthi computes a **Match Percentage** and classifies applicants into three primary operational buckets:

1. **`eligible`** (100% match): All statutory conditions satisfied.
2. **`nearly_eligible`** (70%–99% match): The applicant fails minor soft parameters or misses a threshold within a configured tolerance delta (e.g. ±10% income delta, age within 1 year). The engine provides an explicit explanation of what condition was missed and the exact delta.
3. **`not_eligible`** (<70% match or hard disqualifier): The applicant fails fundamental statutory prerequisites (e.g., state residency or gender requirements for maternity programs).

---

## 4. Status-Aware Document Readiness

Welfare approval in India is gated by documentation. Saarthi grades document readiness using real-world status lifecycles:

| Document Status | Weight Contribution | Verification State |
| :--- | :--- | :--- |
| **`VERIFIED`** | 100% | Verified by competent authority; valid and unexpired |
| **`UNDER_REVIEW`** | 50% | Uploaded and awaiting administrative validation |
| **`UPLOADED`** | 30% | Citizen uploaded file; review pending |
| **`EXPIRED`** | 0% | Expired certificate (e.g. out-of-date annual income certificate) |
| **`REJECTED`** | 0% | Document rejected during verification |
| **`NOT_UPLOADED`**| 0% | Document not present in vault |

---

## 5. Cryptographic Decision Traces (`DEC-<SCHEME>-<HASH>`)

Every scheme evaluation emits an immutable SHA-256 digest:

```
DEC-PM_KISAN-3f9b2d8e4a10c...
```

The hash digest is computed deterministically over:
- Sanitized scheme code
- Citizen demographic evaluation vector
- Scheme rule version (`rule_version`)
- Evaluation outcome and clause-level trace

This ensures evaluations are 100% reproducible and verifiable for civic transparency and dispute resolution.
