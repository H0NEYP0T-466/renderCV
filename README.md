<p align="center">
  <!-- Core -->
  <img src="https://img.shields.io/github/license/H0NEYP0T-466/renderCV?style=for-the-badge&color=brightgreen" alt="GitHub License">
  <img src="https://img.shields.io/github/stars/H0NEYP0T-466/renderCV?style=for-the-badge&color=yellow" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/H0NEYP0T-466/renderCV?style=for-the-badge&color=blue" alt="GitHub Forks">
  <img src="https://img.shields.io/github/issues/H0NEYP0T-466/renderCV?style=for-the-badge&color=red" alt="GitHub Issues">
  <img src="https://img.shields.io/github/issues-pr/H0NEYP0T-466/renderCV?style=for-the-badge&color=orange" alt="GitHub Pull Requests">
  <img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge" alt="Contributions Welcome">

  <!-- Activity -->
  <img src="https://img.shields.io/github/last-commit/H0NEYP0T-466/renderCV?style=for-the-badge&color=purple" alt="Last Commit">
  <img src="https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/renderCV?style=for-the-badge&color=teal" alt="Commit Activity">
  <img src="https://img.shields.io/github/repo-size/H0NEYP0T-466/renderCV?style=for-the-badge&color=blueviolet" alt="Repo Size">
  <img src="https://img.shields.io/github/languages/code-size/H0NEYP0T-466/renderCV?style=for-the-badge&color=indigo" alt="Code Size">

  <!-- Languages -->
  <img src="https://img.shields.io/github/languages/top/H0NEYP0T-466/renderCV?style=for-the-badge&color=critical" alt="Top Language">
  <img src="https://img.shields.io/github/languages/count/H0NEYP0T-466/renderCV?style=for-the-badge&color=success" alt="Languages Count">

  <!-- Community -->
  <img src="https://img.shields.io/github/discussions/H0NEYP0T-466/renderCV?style=for-the-badge&color=blue" alt="Discussions">
  <img src="https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation">
  <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge" alt="Open Source Love">
</p>

<br>

<p align="center"><strong>renderCV</strong> — a client-side CV / resume builder. Fill in your details, pick a template, and export a print-ready PDF. No backend, no accounts.</p>

<br>

## 🔗 Links

- **Demo:** [rendercv.vercel.app](https://rendercv.vercel.app)
- **Docs:** This README + [CLAUDE.md](./CLAUDE.md)
- **Issues:** [GitHub Issues](https://github.com/H0NEYP0T-466/renderCV/issues)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

<br>

## 📑 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Dependencies & Packages](#-dependencies--packages)
- [Contributing](#-contributing)
- [License](#-license)
- [Security](#-security)
- [Code of Conduct](#-code-of-conduct)

<br>

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or pnpm / yarn)

### Setup

```bash
# clone
git clone https://github.com/H0NEYP0T-466/renderCV.git
cd rendercv

# install deps
npm install

# start dev server
npm run dev
```

Vite dev server runs at `http://localhost:5173` with HMR.

### Production build

```bash
npm run build   # type-check + vite build → dist/
npm run preview # preview dist/ locally
```

<br>

## ⚡ Usage

1. **Fill your info** — name, title, contact, summary, experience, education, projects, skills, awards.
2. **Reorder sections** — drag-and-drop with @dnd-kit.
3. **Choose a template** — currently `Modern` (more planned).
4. **Live preview** — A4-paginated, hard-clipped pages update as you type.
5. **Export / Print** — renders a PDF via `@react-pdf/renderer` and triggers the browser print dialog.

Templates are modular — drop a new folder under `src/templates/`, register it in `src/templates/index.ts`, and pick it from the UI.

<br>

## ✨ Features

- 🖱️ **Drag-and-drop section reordering** (@dnd-kit)
- 📄 **Print-ready A4 PDF export** (@react-pdf/renderer)
- 👁️ **Live DOM-measured pagination** (no estimate undercount)
- 📐 **Responsive layout** across desktop / tablet / mobile
- 🎨 **Modular template system** — swap or add templates without touching core
- 🖼️ **Optional photo** support
- 📋 **Section-based editor** — summary, experience, education, projects, skills, awards
- ⚡ **Client-side only** — no auth, no backend, no tracking

<br>

## 📂 Folder Structure

```
renderCV/
├── public/                   # static assets
├── src/
│   ├── main.tsx              # React entry (StrictMode → App)
│   ├── App.tsx               # root — editor/preview layout
│   ├── App.css
│   ├── index.css             # global CSS custom properties
│   ├── assets/
│   ├── types/
│   │   └── index.ts          # ResumeData shared types
│   ├── data/
│   │   ├── defaultResume.ts  # empty resume
│   │   └── exampleResume.ts  # sample data
│   ├── context/
│   │   └── ResumeContext.tsx # global state (data, template, UI)
│   ├── components/
│   │   ├── editor/
│   │   │   ├── EditorLayout.tsx/.css
│   │   │   ├── EditorPanel.tsx     # all form sections
│   │   │   ├── Field.tsx/.css      # reusable form field
│   │   │   ├── SectionEditor.tsx/.css
│   │   │   └── SortableSection.tsx/.css  # dnd wrapper
│   │   ├── preview/
│   │   │   ├── PreviewPanel.tsx/.css
│   │   └── export/
│   │       └── ExportButton.tsx/.css
│   └── templates/
│       ├── index.ts                # template registry
│       ├── TemplateRenderer.tsx    # switcher
│       └── modern/
│           ├── config.ts
│           ├── Preview.tsx/.css    # DOM-measured paginated preview
│           ├── ResumeDocument.tsx  # @react-pdf/renderer PDF
│           ├── paginate.ts         # shared estimate helpers for PDF
│           └── sections/
│               ├── Header.tsx/.css
│               ├── Summary.tsx
│               ├── Experience.tsx
│               ├── Education.tsx
│               ├── Projects.tsx
│               ├── Skills.tsx
│               ├── Awards.tsx
│               └── section-shared.css
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   └── pull_request_template.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── eslint.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── vercel.json
└── package.json
```

<br>

## 🛠 Tech Stack

### Languages

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

### Frameworks & Libraries

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### DevOps / CI / Tools

![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

### Cloud / Hosting

![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br>

## 📦 Dependencies & Packages

### Runtime Dependencies

| Package | Badge | Description |
|---------|-------|-------------|
| react | <a href="https://www.npmjs.com/package/react"><img src="https://img.shields.io/npm/v/react?style=for-the-badge&label=react"></a> | UI framework |
| react-dom | <a href="https://www.npmjs.com/package/react-dom"><img src="https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=react--dom"></a> | DOM renderer for React |
| @dnd-kit/core | <a href="https://www.npmjs.com/package/@dnd-kit/core"><img src="https://img.shields.io/npm/v/@dnd-kit/core?style=for-the-badge&label=%40dnd-kit%2Fcore"></a> | Drag-and-drop core |
| @dnd-kit/sortable | <a href="https://www.npmjs.com/package/@dnd-kit/sortable"><img src="https://img.shields.io/npm/v/@dnd-kit/sortable?style=for-the-badge&label=%40dnd-kit%2Fsortable"></a> | Sortable dnd extension |
| @dnd-kit/utilities | <a href="https://www.npmjs.com/package/@dnd-kit/utilities"><img src="https://img.shields.io/npm/v/@dnd-kit/utilities?style=for-the-badge&label=%40dnd-kit%2Futilities"></a> | dnd coordinate helpers |
| @react-pdf/renderer | <a href="https://www.npmjs.com/package/@react-pdf/renderer"><img src="https://img.shields.io/npm/v/@react-pdf/renderer?style=for-the-badge&label=%40react-pdf%2Frenderer"></a> | PDF generation |
| lucide-react | <a href="https://www.npmjs.com/package/lucide-react"><img src="https://img.shields.io/npm/v/lucide-react?style=for-the-badge&label=lucide--react"></a> | Icon library |
| @rolldown/binding-linux-x64-gnu | <a href="https://www.npmjs.com/package/@rolldown/binding-linux-x64-gnu"><img src="https://img.shields.io/npm/v/@rolldown/binding-linux-x64-gnu?style=for-the-badge&label=%40rolldown%2Fbinding--linux-x64-gnu"></a> | Rolldown native binding (linux) |

### Dev / Build / Test Dependencies

| Package | Badge | Description |
|---------|-------|-------------|
| vite | <a href="https://www.npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite?style=for-the-badge&label=vite"></a> | Bundler |
| typescript | <https://img.shields.io/npm/v/typescript?style=for-the-badge&label=typescript"><a href="https://www.npmjs.com/package/typescript"></a> | Type compiler |
| @types/react | <a href="https://www.npmjs.com/package/@types/react"><img src="https://img.shields.io/npm/v/@types/react?style=for-the-badge&label=%40types%2Freact"></a> | React types |
| @types/react-dom | <a href="https://www.npmjs.com/package/@types/react-dom"><img src="https://img.shields.io/npm/v/@types/react-dom?style=for-the-badge&label=%40types%2Freact--dom"></a> | React DOM types |
| @types/node | <a href="https://www.npmjs.com/package/@types/node"><img src="https://img.shields.io/npm/v/@types/node?style=for-the-badge&label=%40types%2Fnode"></a> | Node types |
| @vitejs/plugin-react | <a href="https://www.npmjs.com/package/@vitejs/plugin-react"><img src="https://img.shields.io/npm/v/@vitejs/plugin-react?style=for-the-badge&label=%40vitejs%2Fplugin--react"></a> | Vite + React (Oxc) |
| eslint | <a href="https://www.npmjs.com/package/eslint"><img src="https://img.shields.io/npm/v/eslint?style=for-the-badge&label=eslint"></a> | Linter |
| @eslint/js | <a href="https://www.npmjs.com/package/@eslint/js"><img src="https://img.shields.io/npm/v/@eslint/js?style=for-the-badge&label=%40eslint%2Fjs"></a> | ESLint flat config |
| typescript-eslint | <a href="https://www.npmjs.com/package/typescript-eslint"><img src="https://img.shields.io/npm/v/typescript-eslint?style=for-the-badge&label=typescript--eslint"></a> | TS ESLint integration |
| eslint-plugin-react-hooks | <a href="https://www.npmjs.com/package/eslint-plugin-react-hooks"><img src="https://img.shields.io/npm/v/eslint-plugin-react-hooks?style=for-the-badge&label=eslint--plugin--react--hooks"></a> | React hooks lint rules |
| eslint-plugin-react-refresh | <a href="https://www.npmjs.com/package/eslint-plugin-react-refresh"><img src="https://img.shields.io/npm/v/eslint-plugin-react-refresh?style=for-the-badge&label=eslint--plugin--react--refresh"></a> | Vite HMR lint rule |
| postcss | <a href="https://www.npmjs.com/package/postcss"><img src="https://img.shields.io/npm/v/postcss?style=for-the-badge&label=postcss"></a> | CSS processor |
| globals | <a href="https://www.npmjs.com/package/globals"><img src="https://img.shields.io/npm/v/globals?style=for-the-badge&label=globals"></a> | ESLint env globals |

> Versions shown are the latest published on npm at time of writing. The installed versions follow the ranges declared in `package.json`.

<br>

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and feature requests go through [GitHub Issues](https://github.com/H0NEYP0T-466/renderCV/issues) using the templates under `.github/ISSUE_TEMPLATE/`.

Quick summary:
- Fork → branch → change → lint → test → PR
- Match existing code style (plain CSS, TypeScript ES2023, immutable patterns)
- Open for "good first issue" labelled issues for newcomers

<br>

## 📜 License

Distributed under the **MIT License** — see [LICENSE](./LICENSE).

<br>

## 🛡 Security

Vulnerability reporting and handling policy: see [SECURITY.md](./SECURITY.md).

<br>

## 📏 Code of Conduct

All contributors and participants agree to the [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md).

<br>

<p align="center">Made with ❤ by <a href="https://github.com/H0NEYP0T-466">H0NEYP0T-466</a></p>
