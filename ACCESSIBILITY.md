# Accessibility (a11y) Statement & Guidelines

Public welfare systems exist to serve all citizens, including persons with disabilities, elder beneficiaries, citizens with varying literacy levels, and users relying on low-bandwidth mobile devices or screen readers.

Saarthi is designed with accessibility as an ongoing engineering and design commitment.

---

## Accessibility Principles & Current Implementation

### 1. Semantic HTML & Document Hierarchy
- We strive to use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) to ensure screen-reading assistive technologies can navigate page regions effectively.
- Interactive controls utilize native `<button>` and `<a>` elements with explicit label semantics rather than unlabelled `<div>` click handlers.

### 2. Keyboard Navigation & Focus Management
- Interactive interface elements (scheme cards, search bars, filter chips, navigation links, and passport inputs) are structured to be navigable using standard keyboard inputs (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
- Visible focus outlines are preserved across interactive states to aid keyboard-only users.

### 3. Contrast & Visual Clarity
- The visual design emphasizes high contrast ratios between textual content and backgrounds across both dark and light modes.
- Color is never used as the sole indicator of critical statutory information:
  - Scheme eligibility indicators combine color (green/red/amber) with explicit text labels (*"Eligible"*, *"Ineligible"*, *"Insufficient Data"*) and distinct icons.
  - Document vault statuses explicitly label missing or expired items alongside color tokens.

### 4. Responsive & Mobile-First Layouts
- Designed to remain legible and fully functional across viewport widths from small smartphones (360px) to ultra-wide displays.
- Content adapts dynamically using responsive grid and flexbox structures without horizontal clipping.

### 5. Multilingual Inclusivity
- Information asymmetry in India is deeply linguistic. Saarthi supports an interface layer across 11 major Indian languages (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and Odia).
- Typography accommodates complex Indic scripts with appropriate font fallbacks and line heights.

### 6. Screen Reader Considerations
- Form inputs across the Welfare Passport and Scheme Filter bars include descriptive `id`, `name`, and aria attributes where appropriate.
- Modal dialogs (such as decision trace inspect sheets) trap focus and can be dismissed via keyboard.

---

## Known Limitations & Areas for Improvement

While we actively work toward alignment with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, the platform is an evolving open-source project and **we do not claim full statutory WCAG compliance**.

Current known focus areas for future improvements include:
- Screen-reader narration testing across voice readers like NVDA, JAWS, and TalkBack on Android.
- Speech-to-text voice search for non-literate citizens.
- Low-contrast refinement in complex data visualization charts in the Government Intelligence Console.

---

## Feedback & Accessibility Issues

If you encounter an accessibility barrier or have suggestions for assistive technology compatibility, please file an issue using the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template or email the maintainer at `pinkudesai1301@gmail.com` with the subject line `[A11Y] Accessibility Feedback`.
