# BetterMati.org

A civic-tech initiative providing transparent access to municipal services, programs, and public funds of LGU Mati, Davao Oriental, Philippines.

> ### ⚠️ Placeholders to fill with real City of Mati data
>
> This site was adapted from a template originally built for LGU Solano. All branding, geography (coordinates recentered on Mati, `PH-DAO`), terminology (City / Sangguniang Panlungsod), and the domain (`bettermati.org`) have been rebranded. The following LGU-specific content is **placeholder / draft** and must be replaced with verified data before going live:
>
> - **Elected officials** — `data/officials.json`, `web/src/lib/govDirectory.ts`, `web/src/pages/Government.tsx`, `web/src/pages/GovernmentOfficials.tsx` (mayor, vice mayor, and SP members shown as `[to be confirmed]` / `[Name]` placeholders).
> - **Barangays** — Mati has **26 barangays**. Names live in `web/src/lib/statsData.ts` (`barangayData`) and the canonical reference layer under `data/mati/`. Verify any common-word names (e.g. Roxas, Quezon, Concepcion, San Juan, San Luis, Poblacion) against Mati's actual barangays.
> - **Statistics** — population, land area, density, income class, historical trends, CMCI scores, poverty and economic figures live in `web/src/lib/statsData.ts`, `data/demographics.json`, and `data/competitive-index.json`; several are drafts pending verification (e.g. the `588.63 km²` land area is flagged **NEEDS VERIFICATION**).
> - **Legislation & projects** — `data/resolutions.json`, `data/ordinances.json`, `data/dpwh-projects.json`, and `web/src/lib/{dpwhData,infrastructureData,legislativeProcess}.ts` are reduced to labeled placeholders.
> - **City history** — the homepage timeline (`web/src/pages/Home.tsx` + `home-history-*` keys in `web/src/locales/*.json`) is placeholdered; add verified City of Mati history.
> - **Contact & hotlines** — phone/hotline numbers (`web/src/lib/hotlines.ts`, `web/src/components/layout/HotlineBar.tsx`) use Davao Oriental's `(087)` area code but are placeholder subscriber numbers; emails use `@mati.gov.ph` / `cityofmati` addresses; postal code `8200`. Replace with real values.
> - **Config** — Google Analytics ID is a placeholder; set your GA4 property. Confirm the `mati.gov.ph` domain and official Facebook page.
> - **Artwork** — the logo, favicon, PWA icons and OpenGraph banner now use the Mati "Sleeping Dinosaur" mark (Pujada Bay). The OpenGraph banner is a homepage screenshot, so re-capture it when the hero changes. `feel-mati.png` and the partner logos are separate artwork.
> - **Cebuano (`ceb`)** — `web/src/locales/ceb.json` is a machine-assisted starter set only; the bulk of keys fall back to English pending a full translation + native review.

![Version](https://img.shields.io/badge/version-1.2.0-green)
![License](https://img.shields.io/badge/license-MIT%20%7C%20CC%20BY%204.0-blue)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js%2020-339933?logo=nodedotjs&logoColor=white)

## Open Source for LGUs

This repository is open source under the **MIT License** and **CC BY 4.0** and is freely available for use, modification, redistribution, and publication by any individual or organization that wishes to implement it in their respective local government unit (LGU) across the Philippines.

We encourage adoption by other municipalities in support of:

- **Transparency** - Making government information accessible to citizens
- **Accessibility** - Ensuring services are available to all, including persons with disabilities
- **Modernization** - Bringing local government services to digital platforms
- **Public Service** - Improving the delivery of government services to the community

To adapt this project for your LGU, fork the repository and customize the content, styling, and data sources to match your municipality's requirements.

## About

BetterMati.org is a volunteer-driven, open-source project that empowers the people of Mati with easy access to local government information. The platform aggregates public data from official government portals and presents it in a user-friendly, accessible format.

**Cost to the People of Mati = ₱0**

## Live Demo

Visit the live website: [https://bettermati.org](https://bettermati.org)

## Technology Stack

The site is a single **React + TypeScript** application built with **Vite** and prerendered to static HTML (SSG) for hosting on any static host / cPanel.

| Category             | Technologies                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Framework**        | React 19, TypeScript, React Router                                                                          |
| **Build / SSG**      | Vite 8, [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg) (static prerender)              |
| **Styling**          | Tailwind CSS v4, shadcn/ui (Radix UI), CSS custom properties, `tw-animate-css`                              |
| **Icons**            | lucide-react, react-icons                                                                                   |
| **Fonts**            | Self-hosted via Fontsource — Inter, Plus Jakarta Sans, IBM Plex Mono (no CDN)                               |
| **Animation**        | Framer Motion (scroll reveals, hero stagger, reduced-motion aware)                                          |
| **Search**           | Fuse.js (fuzzy service search), cmdk (command palette)                                                      |
| **Charts**           | Chart.js + react-chartjs-2                                                                                  |
| **Maps**             | OpenStreetMap (embedded)                                                                                    |
| **i18n**             | i18next + react-i18next (English, Filipino, Cebuano)                                                        |
| **Live data APIs**   | Open-Meteo (weather), ExchangeRate (currency)                                                               |
| **Testing**          | Vitest + Testing Library, Playwright (cross-browser), Lighthouse CI                                         |
| **Tooling**          | oxlint, Prettier, `tsc` type-checking                                                                       |
| **PWA**              | Service worker (`sw.js`, versioned + runtime caching, seamless updates), Web App Manifest, offline fallback |
| **SEO**              | Prerendered HTML, Open Graph, Twitter Cards, XML Sitemap, robots.txt                                        |
| **Server / Hosting** | Apache (`.htaccess`: clean URLs, CSP, HSTS, gzip), cPanel (production)                                      |
| **Analytics**        | Google Analytics (gtag.js)                                                                                  |
| **Accessibility**    | WCAG 2.1, ARIA, semantic HTML, reduced-motion support                                                       |

## Key Features

| Feature                     | Description                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **City Services Directory** | Comprehensive guide to LGU services with requirements, fees, and processing times                                |
| **Government Officials**    | Directory of elected officials and department heads with contact information                                     |
| **Budget Transparency**     | Financial reports (BLGF SRE), income/expenditure breakdowns, and infrastructure projects                         |
| **Legislative Documents**   | Searchable database of ordinances and resolutions from the Sangguniang Panlungsod                                |
| **City Statistics**         | Demographics, economic data, and DTI CMCI competitive-index rankings                                             |
| **Appointment Services**    | Online appointment scheduling integration with the Mayor's Office (OASYS)                                        |
| **Mati Quiz**               | Interactive quiz about Mati history and culture, linked from the homepage and footer                             |
| **Real-time Information**   | Live weather updates, currency exchange rates, and Philippine time                                               |
| **Emergency Hotlines**      | Always-visible hotline bar with a clickable scrolling marquee on tablet/mobile, pause-on-hover for accessibility |
| **Progressive Web App**     | Installable PWA with seamless auto-updates, versioned service-worker caching, and an offline fallback page       |
| **Multi-language Support**  | English and Filipino, plus a Cebuano starter set (remaining keys fall back to English)                           |
| **Clean URLs**              | SEO-friendly URLs without `.html` extensions, powered by Apache mod_rewrite                                      |
| **Accessibility**           | WCAG 2.1: skip links, ARIA labels, keyboard navigation, semantic HTML, reduced-motion                            |
| **SEO Optimized**           | Statically prerendered pages, meta tags, Open Graph, Twitter Cards, and an XML sitemap                           |
| **Performance**             | Hashed/minified assets, gzip compression, and browser caching                                                    |

## Architecture

The project is a **single Vite + React SSG application** living in [`web/`](web/), plus a set
of **static passthrough** files at the repo root that the build merges into the final output.

- **`web/`** — the entire site: React 19 + TypeScript + Tailwind v4 + shadcn/ui. Every route
  is statically prerendered to HTML by `vite-react-ssg`. The set of routes to prerender is the
  single source of truth in [`web/migrated-routes.json`](web/migrated-routes.json).
- **Root static passthrough** — `assets/` (images), `data/` (JSON content feeds), `admin/`
  (news editor), `sw.js`, `manifest.webmanifest`, `.htaccess`, `offline.html`, and the
  `403/404/500.html` error pages. These are served as-is and layered into `dist/` at build time.
- **`build.sh`** (run via `npm run build` at the repo root) — builds the `web/` app, assembles
  the prerendered HTML + hashed assets (`/_app/*`) together with the root passthrough into
  **`dist/`**, folderizes parent routes to avoid Apache directory shadowing, and sets cPanel
  file permissions. Deploy the contents of `dist/` to `public_html/`.
- **Clean URLs** — `.htaccess` mod_rewrite strips `.html` (301 to the clean URL, internal
  rewrite back to the file). Internal links use extensionless paths.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/BetterMati/bettermati.git
cd bettermati

# Install and run the app (Vite dev server)
cd web
npm install
npm run dev

# Open http://localhost:5173
```

## Installation

### Prerequisites

| Requirement | Version         | Purpose                                            |
| ----------- | --------------- | -------------------------------------------------- |
| Node.js     | v20 (`.nvmrc`)  | App tooling and package management                 |
| npm         | v10+            | Dependency management                              |
| Git         | Latest          | Version control                                    |
| Python 3    | v3.x (optional) | Only for `serve.py` / previewing the built `dist/` |

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/BetterMati/bettermati.git
   cd bettermati
   ```

2. **Install app dependencies**

   ```bash
   cd web
   npm install
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

4. **Open in browser** — http://localhost:5173

> Building for production is driven from the **repo root** (see below), which additionally
> installs/uses the root tooling (`build.sh`, Playwright, Lighthouse).

## Usage

### App commands (run inside `web/`)

| Command             | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server (http://localhost:5173)       |
| `npm run build`     | Build + statically prerender the app (`vite-react-ssg`) |
| `npm run preview`   | Preview the app's own build output                      |
| `npm run typecheck` | Type-check with `tsc -b`                                |
| `npm run lint`      | Lint with oxlint                                        |
| `npm run test`      | Run unit tests (Vitest + Testing Library)               |

### Repo-root commands

| Command                      | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| `npm run build`              | Full production build via `build.sh` → `dist/` (bumps patch version) |
| `npm run build -- --no-bump` | Build without incrementing the version                               |
| `npm run build:minor`        | Bump minor version and build                                         |
| `npm run build:major`        | Bump major version and build                                         |
| `npm run serve:dist`         | Serve the production build in `dist/` (http://localhost:8080)        |
| `npm run version:patch`      | Bump patch version only                                              |
| `npm run version:minor`      | Bump minor version only                                              |
| `npm run version:major`      | Bump major version only                                              |
| `npm test`                   | Run Playwright cross-browser tests                                   |
| `npm run test:report`        | Open the last Playwright HTML report                                 |
| `npm run lighthouse`         | Run Lighthouse CI                                                    |

### Production Deployment

1. **Build production files**

   ```bash
   npm run build   # from the repo root → runs build.sh
   ```

2. **Output** — the deployable site is generated in `dist/` (prerendered HTML + hashed
   `/_app/*` assets + static passthrough).

3. **Deploy** — upload the contents of `dist/` to your web server's `public_html/` directory.
   Ensure `.htaccess` is included for clean URLs, CSP headers, and caching.

### File Permissions (cPanel)

| Type        | Permission | Numeric |
| ----------- | ---------- | ------- |
| Files       | rw-r--r--  | 644     |
| Directories | rwxr-xr-x  | 755     |

## Multi-language Support (i18n)

The site supports three languages, powered by **i18next / react-i18next**. Translation
resources live in [`web/src/locales/`](web/src/locales/) (`en.json`, `fil.json`, `ceb.json`)
and are consumed through the `useLanguage()` hook's `t()` function. Any key missing in the
active language automatically falls back to English.

| Language | Code  | Status                                                                |
| -------- | ----- | --------------------------------------------------------------------- |
| English  | `en`  | Complete                                                              |
| Filipino | `fil` | Complete                                                              |
| Cebuano  | `ceb` | Starter set (high-visibility UI; remaining keys fall back to English) |

To see what is left to translate, run `node scripts/i18n-report.mjs` (add `--keys <area#|prefix>` for a
to-do list, or `--json` for machine-readable output).

## Project Structure

```
bettermati/
├── web/                      # The Vite + React + TypeScript app (the entire site)
│   ├── src/
│   │   ├── pages/            # Route components (Home, Services, Government, Budget, …)
│   │   ├── components/
│   │   │   ├── layout/       # Header, Footer, HotlineBar, InfoBar
│   │   │   ├── ui/           # shadcn/ui primitives (button, card, dialog, …)
│   │   │   └── primitives/   # Container, Section, Grid, StatCard, …
│   │   ├── lib/              # Typed data + helpers (statsData, budgetData, hotlines, …)
│   │   ├── locales/          # i18next resources (en / fil / ceb)
│   │   ├── hooks/            # useLanguage, useNews, …
│   │   ├── Layout.tsx        # Shared chrome (persistent header/footer)
│   │   ├── routes.tsx        # Route table
│   │   └── main.tsx          # vite-react-ssg entry
│   ├── migrated-routes.json  # Single source of truth for prerendered routes
│   ├── vite.config.ts        # Vite + SSG + dev static-passthrough config
│   └── public/               # App-served static files (favicon, feel-mati.png, …)
├── assets/                   # Images / logos (static passthrough, merged into dist/)
├── data/                     # JSON content feeds (officials, services, ordinances, …)
│   └── mati/                 # Canonical barangay reference dataset (PSA PSGC + boundaries)
├── admin/                    # News editor (static passthrough)
├── scripts/                  # Build, version, and data scripts (bump-version.js, …)
├── dist/                     # Production build output (gitignored)
├── build.sh                  # Production build: web build → assemble dist → chmod
├── sw.js                     # Service worker (versioned + runtime caching)
├── manifest.webmanifest      # PWA web app manifest
├── offline.html              # Offline fallback page
├── 403.html / 404.html / 500.html  # Error pages
├── serve.py                  # Optional local server for previewing dist/
├── .htaccess                 # Apache config (clean URLs, CSP, caching)
├── version.json              # Version tracking
└── README.md                 # This file
```

## Recent Changes

### v1.2.0 — Full migration to Vite + React + TypeScript

- **Rebuilt the entire site** from the vanilla static-HTML pages and the thin Next.js
  `react-app/` island into a **single Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui**
  application in `web/`, statically prerendered by `vite-react-ssg`. The legacy static site and
  `react-app/` were removed; the repo root now holds only static passthrough merged into
  `dist/` by `build.sh`.
- **Faithful design-token port** — legacy `style.css` design tokens mapped onto Tailwind
  `@theme` + shadcn tokens; self-hosted Inter (no Google Fonts CDN); lucide icons.
- **Content-parity pass** — audited ~30 migrated routes against the legacy site and restored
  every dropped section (Budget/Transparency, Statistics, Government/Officials, Legislative,
  Public Safety, Home, and more).
- **Homepage "Feel Mati" revamp** — new hero with service search, "Rising in Mati", "Mati at a
  Glance", tourism, City Services, and a Public Funds panel driven by the real BLGF SRE data;
  Pujada-navy + Feel-Mati-amber palette with Plus Jakarta Sans + IBM Plex Mono (self-hosted).
- **Navigation refinement** — active-state pill, tightened sizing/spacing, plain-white header.
- **Framer Motion** — subtle, reduced-motion-aware homepage animation: section scroll-reveals,
  hero entrance stagger, grid-card stagger, and Public Funds bars that fill on view.
- **Tooling** — Vitest + Testing Library, Playwright (cross-browser), Lighthouse CI, oxlint,
  Prettier, and `tsc` type-checking.

---

> The entries below predate the migration and describe the **static-HTML era** of the project.
> They are retained for historical reference.

### v1.1.15 — Header, PWA, Version Automation & Code Quality

#### PWA Install Prompt & Seamless Updates

- Added "Install App" prompt banner using the `beforeinstallprompt` API with Install/Dismiss buttons, respecting standalone mode and session dismissal
- Replaced manual-refresh update flow with seamless `skipWaiting` + `controllerchange` auto-reload pattern
- Service worker now accepts `SKIP_WAITING` message from clients to activate waiting worker on demand
- Install banner goes full-width (no border-radius, no margins) on mobile viewports (<=575px) with slide-up animation
- Created `PWAManager` component handling both install prompt and SW update lifecycle

#### Footer Mobile Alignment

- Added `text-align: center` for `.footer-tagline` in the <=575px mobile breakpoint, overriding the tablet `text-align: left` rule

#### Responsive Header & Hotline Marquee

- Standardized header vertical spacing (padding, min-height, logo size) across desktop/tablet/mobile breakpoints
- Raised tablet breakpoint from 991px to 1024px to properly capture iPad Pro portrait and iPad Air landscape
- Converted the emergency hotline bar into a clickable scrolling marquee on tablet and mobile viewports (≤1024px) with pause-on-hover/focus for accessibility

#### Progressive Web App (PWA)

- Rewrote `sw.js` with dual-cache architecture: `STATIC_CACHE` (precached app shell) and `RUNTIME_CACHE` (dynamic content, 80-item FIFO, 7-day TTL)
- Navigation uses network-first with offline fallback; static assets use stale-while-revalidate; data/API uses network-first with cache fallback
- Upgraded `manifest.webmanifest` with maskable icons, app shortcuts, and iOS PWA meta tags
- Fixed theme-color to brand blue (#0032a0) across all files

#### Automatic Version Management

- Created cross-platform `scripts/bump-version.js` (Node.js) replacing the bash-only `version.sh`
- Version bump updates `version.json`, `package.json`, HTML files, and the React app
- Git pre-commit hook auto-bumps patch version on every commit (skips version-only commits)

#### Code Quality & Tooling

- Installed Prettier with project-wide configuration and a pre-commit format hook
- Resolved all npm vulnerabilities

### Earlier (static-HTML era)

- Added Mati Quiz CTA and footer link; added the Brief History of Mati interactive timeline (1760–1957)
- Upgraded translation coverage across English / Filipino / Cebuano with English fallback
- Standardized copyright and footer across all pages; updated year to 2026
- Removed `.html` extensions from navigation links (clean URLs via `.htaccess`)
- Tuned `build.sh` excludes and CSP headers for production

## Contributing

We welcome contributions from everyone! Whether you're a developer, designer, data researcher, content writer, translator, or a concerned citizen of Mati, your participation helps shape this project for all.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes (work inside `web/` for app code)
4. **Verify** — `cd web && npm run typecheck && npm run lint && npm run test`
5. **Commit** with a descriptive message
   ```bash
   git commit -m "feat: description of your changes"
   ```
6. **Push** to your fork and **open** a Pull Request with a detailed description

### Contribution Areas

| Area                   | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| **Bug Fixes**          | Report issues or submit fixes for existing bugs        |
| **Features**           | Propose or implement new functionality                 |
| **Content**            | Update service information, add missing municipal data |
| **Translations**       | Help translate content to Filipino or Cebuano          |
| **Design**             | Improve UI/UX, accessibility, and visual consistency   |
| **Data**               | Verify and update municipal statistics and records     |
| **Documentation**      | Enhance README, code comments, and guides              |
| **Data Visualization** | Enhance charts, graphs, and interactive presentations  |

### Code Style Guidelines

| Guideline         | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Formatting**    | Prettier (run `npm run format` at the repo root); enforced on commit                  |
| **Linting**       | oxlint (`cd web && npm run lint`) — keep new code warning-free                        |
| **Types**         | TypeScript; type-check with `npm run typecheck` before opening a PR                   |
| **Components**    | React function components; reuse `components/ui` (shadcn) and `components/primitives` |
| **Styling**       | Tailwind utility classes + design tokens; avoid ad-hoc global CSS                     |
| **Icons**         | Use lucide-react (react-icons only for brand marks)                                   |
| **i18n**          | Add new UI strings to `web/src/locales/en.json` (and `fil`/`ceb` when available)      |
| **Accessibility** | Maintain WCAG 2.1 (alt text, ARIA, keyboard nav, reduced-motion)                      |
| **Testing**       | Add/adjust Vitest unit tests and Playwright coverage where relevant                   |

## Data Sources

All public information is sourced from official government portals:

| Source                             | URL                                                                   | Data Type                 |
| ---------------------------------- | --------------------------------------------------------------------- | ------------------------- |
| LGU Mati Official Website          | [mati.gov.ph](https://mati.gov.ph/)                                   | Services, Officials       |
| Sangguniang Panlungsod ng Mati     | [sangguniangbayan.mati.gov.ph](https://sangguniangbayan.mati.gov.ph/) | Ordinances, Resolutions   |
| Bureau of Local Government Finance | [blgf.gov.ph](https://blgf.gov.ph/)                                   | Budget, Financial Reports |
| Philippine Statistics Authority    | [psa.gov.ph](https://psa.gov.ph/)                                     | Demographics, Census      |
| DTI CMCI Portal                    | [cmci.dti.gov.ph](https://cmci.dti.gov.ph/)                           | Competitive Index         |

## License

This project is dual-licensed:

| License     | Applies To  | Details                                |
| ----------- | ----------- | -------------------------------------- |
| MIT License | Source Code | Free to use, modify, and distribute    |
| CC BY 4.0   | Content     | Attribution required for content reuse |

See [LICENSE](LICENSE) for full details.

## Contact

| Channel  | Link                                                              |
| -------- | ----------------------------------------------------------------- |
| Website  | [bettermati.org](https://bettermati.org)                          |
| Email    | volunteer@bettermati.org                                          |
| Facebook | [@bettermati.org](https://www.facebook.com/bettermati.org)        |
| LinkedIn | [BetterMati](https://www.linkedin.com/company/bettermati/)        |
| Discord  | [Join Community](https://discord.com/invite/qeSu7RJkjQ)           |
| GitHub   | [BetterMati/bettermati](https://github.com/BetterMati/bettermati) |

## Acknowledgments

- [BetterGov.ph](https://bettergov.ph) for the civic-tech initiative in the Philippines
- [Abakada.org](https://abakada.org) for supporting civic technology efforts
- LGU Mati for public data availability and transparency
- All volunteers and contributors who dedicate their time
- Open-source community for the tools and libraries used
- Citizens of Mati for their feedback and support

---

Made for the people of Mati, Davao Oriental

## Developer

[Ramon Logan Jr.](https://ramonloganjr.com/) is a UAE-based full-stack developer and IT professional specializing in web development, design, cloud services, and cybersecurity. He is the developer behind BetterMati.org, [Abakada.org](https://abakada.org), and the founder of the small cloud-based solutions initiative, [HelloPinas.com](https://hellopinas.com). Ramon actively contributes to civic-tech efforts like [BetterGov.ph](https://bettergov.ph) and is an individual participant in the [OpenJS Foundation](https://openjsf.org/).
