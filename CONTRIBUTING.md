# Contributing to renderCV

Welcome — glad you want to help. This is a client-side React + TypeScript resume builder. All contributions welcome: bug fixes, features, templates, docs, tests.

<br>

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branching & Commits](#branching--commits)
- [Code Style & Linting](#code-style--linting)
- [Project Conventions](#project-conventions)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

<br>

## Code of Conduct

Read and follow the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Be respectful, assume good intent, and keep discussion focused on the work.

<br>

## Getting Started

1. Fork the repo
2. Clone your fork
3. Install deps — `npm install`
4. Start dev server — `npm run dev`
5. Make changes on a new branch (never `main`)

```bash
git clone https://github.com/<your-username>/renderCV.git
cd renderCV
npm install
npm run dev
```

<br>

## Branching & Commits

- Branch from `main` — short, descriptive names:
  - `feat/dark-mode-toggle`
  - `fix/header-overlap-pdf`
  - `docs/update-readme`
  - `chore/bump-deps`
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add classic template`
  - `fix: dom pagination off by one`
  - `docs: fix install instructions`
- Each commit = one logical change. Don't bundle unrelated changes.

<br>

## Code Style & Linting

- **ESLint 10** with flat config — run `npm run lint` before pushing.
- **TypeScript** strict mode, ES2023 target.
- **Plain CSS only** — no Tailwind, no CSS-in-JS. One `.co-located .css` file per component.
- Match existing style in the file you're editing.

<br>

## Project Conventions

- **Immutability** — never mutate state. Return new objects/arrays.
- **Small files** — components < ~400 lines, < 800 hard cap. Extract utilities.
- **No hardcoded strings** — use constants for repeated values.
- **Validate input** — at form boundaries before storing in context.
- **Error handling** — log details server-side, show user-friendly messages in editor UI.
- **Template additions** — new section checklist:
  - Add `getSectionComponent` case in `src/templates/modern/Preview.tsx`
  - Add `case` to `sectionEstimatePt()` in `src/templates/modern/paginate.ts`
- **Pagination note** — Preview uses DOM measurement (not estimates). Don't refactor to estimates; they under-count content.

<br>

## Bug Reports & Feature Requests

Open an issue using the templates in `.github/ISSUE_TEMPLATE/`:

- **Bug** — steps to reproduce, expected/actual, OS/browser/version, logs.
- **Feature** — problem statement, proposed solution, scope, risks.

Search existing issues first. Duplicate reports slow us down.

<br>

## Pull Request Process

1. Open PR against `main`
2. Fill in the PR template (summary, testing, screenshots if UI)
3. Link related issue — `Fixes #123`
4. Lint + build must pass — `npm run lint && npm run build`
5. At least one maintainer review
6. Address review feedback
7. Maintainers merge

Keep PRs small and focused. Large PRs with mixed concerns are harder to review and get stalled.

<br>

## Testing

The project does **not** yet have automated tests. If you're adding a feature, please:

- Add unit tests for new utilities (Vitest expected once test infra lands)
- Describe manual testing steps in your PR
- Verify both **Preview** (DOM pagination) and **PDF export** paths

Help setting up Vitest is itself a welcome contribution.

<br>

## Documentation

- Update README for user-facing changes
- Update CLAUDE.md if architecture decisions change
- Use JSDoc-style comments for exported utilities
- Templates: document new options in their own `config.ts`

<br>

Thanks for contributing — every PR matters. ✌
