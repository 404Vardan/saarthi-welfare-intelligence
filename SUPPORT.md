# Support & Community Resources

Welcome to the **Saarthi** support hub. Whether you have questions regarding the platform, need help running tests, want to propose a new welfare scheme, or have found a bug, here is where to find help.

---

## Where to Get Help

| Need | Recommended Channel | Details |
| :--- | :--- | :--- |
| **Bug Reports** | [GitHub Issues](https://github.com/404Vardan/saarthi-welfare-intelligence/issues/new?template=bug_report.md) | Submit reproducible bugs, broken links, or UI glitches using the Bug Report template. |
| **Welfare Scheme Corrections** | [Scheme Data Template](https://github.com/404Vardan/saarthi-welfare-intelligence/issues/new?template=scheme_data_update.md) | Report outdated guidelines, missing criteria, or revised income ceilings with official source links. |
| **Feature Requests** | [Feature Proposal](https://github.com/404Vardan/saarthi-welfare-intelligence/issues/new?template=feature_request.md) | Suggest enhancements to citizen workflows, government analytics, or language support. |
| **Research & GovTech Discourse** | [GitHub Discussions](https://github.com/404Vardan/saarthi-welfare-intelligence/discussions) | Discuss policy simulation models, 3-valued Kleene logic AST evaluation, or academic citations. |
| **General Q&A** | [GitHub Discussions (Q&A)](https://github.com/404Vardan/saarthi-welfare-intelligence/discussions/categories/q-a) | Ask general questions regarding installation, Supabase setup, or local development. |
| **Security Vulnerabilities** | [Security Policy](SECURITY.md) | **Do not post vulnerabilities publicly.** Report them privately per [SECURITY.md](SECURITY.md). |

---

## Common Inquiries & Troubleshooting

### 1. How do I test the live platform without setting up Supabase?
You can explore the deployed application directly at:
👉 **[https://saarthi-welfare-intelligence.vercel.app](https://saarthi-welfare-intelligence.vercel.app)**

### 2. Can I run the eligibility engine tests offline?
Yes! The test suites execute locally using Node.js without needing any database connectivity:
```bash
npm test
node --env-file=.env scripts/test_campus_coverage.js
```

### 3. How do I report a missing state or central scheme?
Open an issue using the [Scheme Data Update template](https://github.com/404Vardan/saarthi-welfare-intelligence/issues/new?template=scheme_data_update.md) and include the official government portal URL or gazette notification.

---

## Contacting the Maintainers

- **Lead Maintainer:** Vardan Desai ([@404Vardan](https://github.com/404Vardan))
- **Email:** `pinkudesai1301@gmail.com`
