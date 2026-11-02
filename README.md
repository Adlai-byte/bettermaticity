# BetterMati.org

A civic-tech portal that gives the people of Mati, Davao Oriental, Philippines plain-language access to their City Government's services, officials, legislation and public funds.

> ### ⚠️ Data verification and draft records
>
> BetterMati.org started from a template built for LGU Solano and has been rebranded to the City of Mati: name, domain, geography (`PH-DAO`), terminology (City / Sangguniang Panlungsod) and artwork.
>
> Core datasets are verified against official government portals:
>
> - **Verified & sourced** — emergency hotlines (`data/emergency-hotlines.json`), City finances (DBM & BLGF FY2021–FY2025), procurement notices and awarded civil works (PhilGEPS & BAC), the 26 barangays and 2024 census population (PSA POPCEN), elected officials' names, official portraits (Mayor and inaugural council group photo in `assets/images/officials/`), sourced attraction photos, and official links are sourced and checked against primary sources.
> - **Drafts & placeholders** — individual photos and office contacts for the Vice Mayor and councilors, department phone/email contacts, full texts of ordinances and resolutions (titles only currently), and tourism attraction details (with Mayo Bay and Guang-guang mangroves photos still pending) remain drafts (`_status: "draft"` or `[Placeholder]`) pending City Hall publication or confirmation.
>
> The authoritative, up-to-date status of every dataset is maintained on the live **[Data sources](https://bettermati.org/transparency/sources)** registry (`/transparency/sources`). Verified facts are tracked as BM-001; do not "correct" them from general knowledge.

![Version](https://img.shields.io/github/package-json/v/kaarlosasiang/bettermaticity)
![License](https://img.shields.io/badge/license-MIT%20%7C%20CC%20BY%204.0-blue)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js%2020-339933?logo=nodedotjs&logoColor=white)

## Open Source for LGUs

This repository is open source under the **MIT License** (code) and **CC BY 4.0** (content) and is free to use, modify, redistribute and publish by anyone who wants to run it for their own local government unit (LGU) in the Philippines.

We encourage adoption by other cities and municipalities in support of:

- **Transparency** - Making government information accessible to citizens
- **Accessibility** - Ensuring services are available to all, including persons with disabilities
- **Modernization** - Bringing local government services to digital platforms
- **Public Service** - Improving the delivery of government services to the community

To adapt it for your LGU, fork the repository and replace the JSON feeds in `data/`, the copy in `web/src/locales/`, and the branding in `assets/`.

## About

BetterMati.org is a volunteer-driven, open-source project, independent of the City Government. It gathers public information from official government portals and presents it in a plain, accessible format, with every dataset traced back to its source.

**Cost to the People of Mati = ₱0**

## Live Site

[https://bettermati.org](https://bettermati.org)

## Technology Stack

The site is a single **React + TypeScript** application built with **Vite** and prerendered to static HTML, so it runs on any static host or cPanel with no server runtime.

| Category             | Technologies                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Framework**        | React 19, TypeScript, React Router 6                                                                        |
| **Build / SSG**      | Vite 8, [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg) (static prerender)              |
| **Styling**          | Tailwind CSS v4, shadcn/ui (Radix UI), design tokens, `tw-animate-css`                                      |
| **Icons**            | lucide-react, react-icons (brand marks)                                                                     |
| **Fonts**            | Self-hosted via Fontsource — Inter Variable, Roboto Mono (no CDN)                                           |
| **Animation**        | Framer Motion (`LazyMotion` subset, reduced-motion aware)                                                   |
| **Search**           | Fuse.js site-wide search (`/search`), cmdk service palette                                                  |
| **Charts**           | Chart.js + react-chartjs-2                                                                                  |
| **Maps**             | OpenStreetMap (embedded)                                                                                    |
| **i18n**             | i18next + react-i18next (English, Cebuano)                                                                  |
| **Live data**        | Open-Meteo (weather), exchange-rate API, Facebook Page plugin (News)                                        |
| **Testing**          | Vitest + Testing Library, Playwright (cross-browser + integration), Lighthouse CI                           |
| **Tooling**          | oxlint, Prettier, `tsc` type-checking                                                                       |
| **PWA**              | Service worker (`sw.js`, versioned + runtime caching, seamless updates), Web App Manifest, offline fallback |
| **SEO**              | Prerendered HTML, Open Graph, Twitter Cards, XML sitemap, robots.txt                                        |
| **Server / Hosting** | Apache (`.htaccess`: clean URLs, CSP, HSTS, gzip), cPanel (production)                                      |
| **Analytics**        | Google Analytics 4 (gtag.js)                                                                                |
| **Accessibility**    | WCAG 2.1, ARIA, semantic HTML, reduced-motion support                                                       |

## Key Features

| Feature                 | Description                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **City Services**       | Ten service categories and 22 step-by-step service guides with requirements, fees, processing times and the official source        |
| **Government**          | Elected officials, City offices, the 26 barangays, and a checked list of the City's official websites and national portals         |
| **Legislation**         | Ordinances and resolutions of the Sangguniang Panlungsod, and how a measure becomes law                                            |
| **Transparency**        | City finances (FY2021–FY2025), projects and procurement, Full Disclosure reports, official documents, data sources and methodology |
| **City Statistics**     | Population, barangay data, economy, and DTI CMCI competitiveness rankings                                                          |
| **Visit Mati**          | Dahican Beach, Mount Hamiguitan, Pujada Bay, the Sleeping Dinosaur and the Subangan Museum                                         |
| **News**                | City updates from a runtime feed (`data/news.json`) plus the City's Facebook Page                                                  |
| **Site-wide Search**    | One search across every page, service, office, project, procurement notice, document and official link                             |
| **Emergency Hotlines**  | Always-visible hotline bar; a scrolling marquee on tablet and mobile that pauses on hover and focus                                |
| **Changelog**           | Plain-language release notes at [/changelog](https://bettermati.org/changelog), linked from the footer version                     |
| **Progressive Web App** | Installable, with seamless updates, versioned service-worker caching and an offline page                                           |
| **Languages**           | English and Cebuano (100% translated; draft awaiting native-speaker review)                                                        |
| **Accessibility**       | Skip links, ARIA labels, keyboard navigation, semantic HTML, reduced motion                                                        |
| **SEO and Performance** | Prerendered pages, per-page code splitting, clean URLs, meta tags, Open Graph, XML sitemap, gzip and caching                       |

## Architecture

The project is a **single Vite + React SSG application** in [`web/`](web/), plus **static passthrough** files at the repo root that the build merges into the final output.

- **`web/`** — the whole site: React 19 + TypeScript + Tailwind v4 + shadcn/ui. Every route is statically prerendered to HTML by `vite-react-ssg`. Routes are code-split, so each page loads only its own code.
- **[`web/migrated-routes.json`](web/migrated-routes.json)** — the source of truth for the live routes. It drives the prerender set, the build's folder pass, and `AppLink`'s SPA-vs-full-load decision.
- **[`web/src/lib/siteIndex.ts`](web/src/lib/siteIndex.ts)** — the Site index data that feeds both `/sitemap` and site-wide search.
- **`data/`** — JSON content feeds, imported at build time (except `news.json`, which is fetched at runtime so news can change without a rebuild).
- **Root static passthrough** — `assets/` (images), `data/`, `admin/` (news editor), `sw.js`, `manifest.webmanifest`, `.htaccess`, `offline.html`, `robots.txt` and the `403/404/500.html` error pages.
- **[`build.sh`](build.sh)** (`npm run build` at the repo root) — builds `web/`, assembles the prerendered HTML and hashed bundles (`/_app/*`) with the passthrough files into **`dist/`**, moves parent routes to `<route>/index.html` so Apache directories don't shadow them, generates `sitemap.xml`, and sets cPanel file permissions.
- **Clean URLs** — `.htaccess` mod_rewrite strips `.html`, so internal links use extensionless paths.

## Quick Start

```bash
git clone https://github.com/kaarlosasiang/bettermaticity.git
cd bettermaticity/web
npm install
npm run dev
# Open http://localhost:5173
```

## Installation

### Prerequisites

| Requirement | Version         | Purpose                                                  |
| ----------- | --------------- | -------------------------------------------------------- |
| Node.js     | v20 (`.nvmrc`)  | App tooling and package management                       |
| npm         | v10+            | Dependency management                                    |
| Git         | Latest          | Version control                                          |
| Python 3    | v3.x (optional) | `serve.py`, for previewing the built `dist/` and testing |

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/kaarlosasiang/bettermaticity.git
   cd bettermaticity
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

> Production builds, Playwright and Lighthouse run from the **repo root**, which has its own `npm install`.

## Usage

### App commands (run inside `web/`)

| Command              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server (http://localhost:5173)       |
| `npm run build`      | Build + statically prerender the app (`vite-react-ssg`) |
| `npm run preview`    | Preview the app's own build output                      |
| `npm run typecheck`  | Type-check with `tsc -b`                                |
| `npm run lint`       | Lint with oxlint                                        |
| `npm test`           | Run unit tests (Vitest + Testing Library)               |
| `npm run test:watch` | Run unit tests in watch mode                            |

### Repo-root commands

| Command                                    | Description                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `npm run build`                            | Full production build via `build.sh` → `dist/` (bumps the patch version)       |
| `npm run build -- --no-bump`               | Build without changing the version                                             |
| `npm run build:minor` / `build:major`      | Bump that level, then build                                                    |
| `npm run release [-- minor\|patch\|major]` | Bump the version and draft its `data/changelog.json` entry from recent commits |
| `npm run version:patch\|minor\|major`      | Bump the version only                                                          |
| `npm run format` / `format:check`          | Format or check the repo with Prettier                                         |
| `npm test`                                 | Playwright cross-browser specs against a fresh `web/` build                    |
| `npm run test:chrome`                      | The same specs in Chrome only                                                  |
| `npm run test:integration`                 | Full `build.sh`, then smoke tests of the shipped `dist/`                       |
| `npm run test:report`                      | Open the last Playwright HTML report                                           |
| `npm run lighthouse`                       | Run Lighthouse CI                                                              |
| `npm run package`                          | Build and zip a cPanel-ready release archive                                   |

To preview a production build with clean URLs working, serve it with `serve.py`, which emulates the `.htaccess` rewrites:

```bash
python3 serve.py -d dist -p 8888
```

### Production Deployment

1. **Build** — `npm run build` from the repo root (runs `build.sh`).
2. **Output** — the deployable site is in `dist/` (prerendered HTML, hashed `/_app/*` bundles and the static passthrough).
3. **Deploy** — upload the contents of `dist/` to your server's `public_html/`, including `.htaccess` for clean URLs, security headers and caching.

Build-time settings come from an optional, git-ignored root `.env`: `VITE_SITE_URL` sets the canonical origin used in page metadata and `sitemap.xml` (default `https://bettermati.org`). See `.env.example`.

### File Permissions (cPanel)

| Type        | Permission | Numeric |
| ----------- | ---------- | ------- |
| Files       | rw-r--r--  | 644     |
| Directories | rwxr-xr-x  | 755     |

`build.sh` sets these for you.

## Multi-language Support (i18n)

Powered by **i18next / react-i18next**. Translations live in [`web/src/locales/`](web/src/locales/) as flat key files and are read through the `useLanguage()` hook's `t()`. Any key missing in the chosen language falls back to English.

| Language | Code  | Status                                                 |
| -------- | ----- | ------------------------------------------------------ |
| English  | `en`  | Complete                                               |
| Cebuano  | `ceb` | 100% translated (draft awaiting native-speaker review) |

To see what is left to translate, run `node scripts/i18n-report.mjs` (add `--keys <area#|prefix>` for a
to-do list, or `--json` for machine-readable output).

## Project Structure

```
bettermaticity/
├── web/                      # The Vite + React + TypeScript app (the whole site)
│   ├── src/
│   │   ├── pages/            # Route components (Home, Services, Government, Transparency, …)
│   │   │   └── service-details/  # The 22 service guides
│   │   ├── components/
│   │   │   ├── layout/       # Header, Footer, HotlineBar, InfoBar
│   │   │   ├── ui/           # shadcn/ui primitives
│   │   │   └── primitives/   # Container, Band, PageHeader, StatRow, RuledGrid, FilterPanel, Pager, …
│   │   ├── lib/              # Typed data modules and helpers (services, govData, siteIndex, searchIndex, …)
│   │   ├── locales/          # i18next resources (en, ceb)
│   │   ├── hooks/            # useLanguage, useNews
│   │   ├── Layout.tsx        # Shared chrome (header, footer)
│   │   ├── routes.tsx        # Route table (lazy, code-split)
│   │   └── main.tsx          # vite-react-ssg entry
│   ├── migrated-routes.json  # Source of truth for live routes
│   └── vite.config.ts        # Vite + SSG config
├── data/                     # JSON content feeds (services, officials, finances, …) and changelog.json
│   └── mati/                 # Canonical barangay reference dataset (PSA PSGC + boundaries)
├── assets/                   # Images and logos (static passthrough)
├── admin/                    # News editor (static passthrough)
├── docs/                     # Data plan, research and verification notes
├── scripts/                  # Version, release, sitemap and packaging scripts
├── tests/                    # Playwright specs (volunteer dialog, integration)
├── .github/workflows/        # Lighthouse CI, Claude review, Facebook sync
├── build.sh                  # Production build: web build → assemble dist/ → chmod
├── serve.py                  # Serves a built dist/ with the .htaccess rewrites
├── sw.js                     # Service worker
├── manifest.webmanifest      # PWA manifest
├── offline.html              # Offline fallback page
├── 403.html / 404.html / 500.html  # Apache error pages
├── .htaccess                 # Apache config (clean URLs, CSP, caching)
└── version.json              # Master version
```

## What's New

**1.9.0** added a Transparency section (City finances FY2021–FY2025, projects and procurement, Full Disclosure reports, official documents, data sources and methodology), separate pages for officials, offices and barangays, an Official links page, site-wide search, an About page, a Site index, and faster page loads through code splitting.

Every release is listed in plain language at [bettermati.org/changelog](https://bettermati.org/changelog), from [`data/changelog.json`](data/changelog.json).

## Contributing

Developers, designers, data researchers, writers, translators and residents of Mati are all welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, checks and project rules, and the [Code of Conduct](CODE_OF_CONDUCT.md) before taking part.

Short version: work inside `web/`, run `npm run typecheck && npm run lint && npm test` there, run `npm run format` at the root, and open a pull request. Data changes need an official source.

## Data Sources

Public information comes from official government sources. The full registry, with what each dataset covers, when it was last checked and how far it is verified, is on the [Data sources](https://bettermati.org/transparency/sources) page.

| Source                                  | URL                                                                                                                                       | Data                                 |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| City Government of Mati                 | [mati.gov.ph](https://mati.gov.ph/)                                                                                                       | Services, offices, Citizen's Charter |
| Sangguniang Panlungsod ng Mati          | [mati.gov.ph/sangguniang-panglungsod](https://web.archive.org/web/20260508085431/https://mati.gov.ph/sangguniang-panglungsod/) (archived) | Council members                      |
| Department of Budget and Management     | [dbm.gov.ph](https://www.dbm.gov.ph/)                                                                                                     | City finances (BESF Table F.13)      |
| Bureau of Local Government Finance      | [blgf.gov.ph](https://blgf.gov.ph/)                                                                                                       | Local income and expenditure reports |
| DILG Full Disclosure Policy Portal      | [fdpp.dilg.gov.ph](https://fdpp.dilg.gov.ph/)                                                                                             | Full Disclosure reports              |
| PhilGEPS                                | [philgeps.gov.ph](https://www.philgeps.gov.ph/)                                                                                           | Procurement notices                  |
| Department of Public Works and Highways | [dpwh.gov.ph](https://www.dpwh.gov.ph/)                                                                                                   | National infrastructure projects     |
| Philippine Statistics Authority         | [psa.gov.ph](https://psa.gov.ph/)                                                                                                         | Census, PSGC barangay codes          |
| DTI CMCI Portal                         | [cmci.dti.gov.ph](https://cmci.dti.gov.ph/)                                                                                               | Competitiveness index                |

## License

This project is dual-licensed:

| License     | Applies To  | Details                                |
| ----------- | ----------- | -------------------------------------- |
| MIT License | Source code | Free to use, modify, and distribute    |
| CC BY 4.0   | Content     | Attribution required for content reuse |

See [LICENSE](LICENSE) for full details.

## Contact

| Channel  | Link                                                                            |
| -------- | ------------------------------------------------------------------------------- |
| Website  | [bettermati.org](https://bettermati.org)                                        |
| Email    | volunteer@bettermati.org                                                        |
| Facebook | [@bettermati.org](https://www.facebook.com/bettermati.org)                      |
| LinkedIn | [BetterMati](https://www.linkedin.com/company/bettermati/)                      |
| Discord  | [Join Community](https://discord.com/invite/qeSu7RJkjQ)                         |
| GitHub   | [kaarlosasiang/bettermaticity](https://github.com/kaarlosasiang/bettermaticity) |

## Acknowledgments

- [Ramon Logan Jr.](https://ramonloganjr.com/) for the original BetterSolano template this site is built from
- [BetterSanFernando.org](https://bettersanfernando.org) for the design and transparency patterns this site follows
- [BetterGov.ph](https://bettergov.ph) for the civic-tech initiative in the Philippines
- LGU Mati for making public data available
- All volunteers and contributors who give their time
- The open-source community for the tools and libraries used
- The people of Mati for their feedback and support

---

Made for the people of Mati, Davao Oriental

## Developer

BetterMati.org is developed and maintained by [Kaarlo Sasiang](https://github.com/kaarlosasiang).
