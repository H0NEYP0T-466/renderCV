# Security Policy

renderCV takes security seriously. This document explains how to report vulnerabilities and how we handle them.

<br>

## 📋 Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [What to Include](#what-to-include)
- [Response Process](#response-process)
- [Disclosure Policy](#disclosure-policy)
- [Security Considerations](#security-considerations)

<br>

## Supported Versions

Only the latest release on `main` receives security patches. Always update to the latest version before reporting.

| Version | Supported |
|---------|-----------|
| latest on `main` | ✅ |
| previous releases | ❌ |

<br>

## Reporting a Vulnerability

**Do not open public issues for security vulnerabilities.**

Instead:

1. **Preferred (if available):** Use [GitHub Private Vulnerability Reporting](https://github.com/H0NEYP0T-466/renderCV/security/advisories/new).
2. **Fallback:** Email the maintainer at the address linked from the [H0NEYP0T-466 GitHub profile](https://github.com/H0NEYP0T-466).

We acknowledge receipt within **48 hours**.

<br>

## What to Include

- Description of the vulnerability
- Impact assessment (what an attacker can achieve)
- Steps to reproduce (code, screenshots, or video)
- Affected versions
- Proposed fix (if any)
- Your disclosure preference (named / anonymous)

<br>

## Response Process

1. **Acknowledgement** — within 48 hours
2. **Triage** — reproduce, assess severity (CVSS)
3. **Plan** — fix + release timeline communicated to reporter
4. **Fix** — merged to `main`, backported if applicable
5. **Release** — patched version published
6. **Credit** — reporter credited (unless anonymous preferred) in release notes

Target fix & release within **14 days** of acknowledgement for high/critical severity.

<br>

## Disclosure Policy

- **90-day coordinated disclosure.** We work with the reporter to publish a joint advisory after the fix lands.
- Premature public disclosure before the fix is released will not be credited and may be reverted.
- Critical active-exploit cases may be fast-tracked.

<br>

## Security Considerations

renderCV is a **client-side only** application:

- No backend, no auth, no data storage on servers
- User resume data stays in the browser (local state / localStorage if persisted)
- PDF export runs via `@react-pdf/renderer` in-browser
- Third-party deps: Vite + React + @dnd-kit + @react-pdf/renderer + lucide-react — monitor `npm audit`

Please report anything that violates these expectations (e.g., unexpected network calls from the app, XSS vectors in rendered CV content).

<br>

Thank you for helping keep renderCV safe.
