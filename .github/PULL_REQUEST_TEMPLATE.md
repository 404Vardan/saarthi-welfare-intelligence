## Summary

<!-- Provide a concise summary of the purpose and impact of this Pull Request. -->

## What Changed?

<!-- List the specific files, features, components, or rule definitions altered. -->
- 

## Why?

<!-- Explain the technical rationale, user requirement, or statutory guideline motivating this change. -->

---

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ Feature (non-breaking enhancement to application)
- [ ] 🏛️ Scheme data (addition or metadata update for a welfare scheme)
- [ ] ⚖️ Eligibility rule (AST predicate or threshold modification)
- [ ] 🧠 Research / Policy Lab (analytics or formal model improvement)
- [ ] 📝 Documentation (README, guides, or architecture specs)
- [ ] 🔐 Security & RLS (access controls, auth, or edge proxy)
- [ ] ♿ Accessibility (a11y improvements, screen-reader semantics)
- [ ] 🧪 Testing (regression assertions, coverage suites, test vectors)

---

## Welfare Rule Integrity (Required for Scheme/Rule Changes)

If this PR touches scheme definitions or eligibility logic, confirm the following:

- [ ] **Authoritative Government Source:** An official government portal link or statutory gazette citation is included in the PR or scheme metadata.
- [ ] **Effective Date Recorded:** The `rule_effective_from` or guideline revision date is specified.
- [ ] **Deterministic Decision Boundary:** Confirms to the core principle: **AI assists, verified rules decide**. This PR does **not** shift eligibility decision authority from deterministic rules to generative AI.
- [ ] **Unencoded Conditions Transparent:** Real-world statutory requirements that cannot be captured by simple demographic parameters are documented in `unencoded_conditions`.
- [ ] **Automated Test Coverage:** Includes test vectors for both eligible and ineligible personas in `scripts/test-engine.js` or `scripts/`.

---

## Validation & Verification

- [ ] `npm test` runs and all 91 regression tests pass.
- [ ] `node --env-file=.env scripts/test_campus_coverage.js` passes (if touching campus schemes).
- [ ] `npm run build` succeeds without bundle or syntax errors.
- [ ] Manual testing performed locally (include screenshots below if UI changed).

### Screenshots / Verification Output
<!-- If applicable, paste console test outputs or UI screenshots here -->
