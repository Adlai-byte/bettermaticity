# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BetterMati.org — a civic-tech portal for LGU Mati, Davao Oriental, Philippines.

The site is **one app: a Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui application in [`web/`](web/)**, statically prerendered to HTML by [`vite-react-ssg`](https://github.com/Daydreamer-riri/vite-react-ssg) and served as plain files from Apache/cPanel. There is no server runtime.

The repo used to hold a vanilla static-HTML site at the root plus an interim Next.js `react-app/`. **Both are gone** (removed in the Phase 9 cutover, `8df27d2`). Assume every code change targets `web/`. What remains at the root is the build pipeline, the JSON content feeds in `data/`, images in `assets/`, and server config. [`MIGRATION.md`](MIGRATION.md) is historical and describes a layout that no longer exists — don't follow it.

## Commands

App (run inside `web/`):

- `npm run dev` — Vite dev server → http://localhost:5173
- `npm run build` — `vite-react-ssg build` → `web/dist/` (prerenders the migrated route set)
- `npm run preview` — preview this app's own build
- `npm run typecheck` — `tsc -b`
- `npm run lint` — oxlint
- `npm test` — Vitest + Testing Library (`npm run test:watch` to watch)

Repo root:

- `npm run build` — full production build via [`build.sh`](build.sh) → `dist/` (bumps patch version first)
- `npm run build:minor` / `build:major` — bump that level, then build without a second bump
- `npm run serve:dist` — preview the built `dist/` at :8080
- `npm run version:patch|minor|major` — bump version only (see below)
- `npm run release [-- minor|patch|major] [--dry-run]` — start a release: bump the version and draft its `data/changelog.json` entry from commits since the last release (see below)
- `npm run format` / `format:check` — Prettier over the repo (`web/src/locales` is ignored)
- `npm run package` — build + zip a cPanel-ready release archive
- `npm test` — Playwright cross-browser specs for the volunteer dialog (`tests/volunteer-modal.*.spec.js`), run against a fresh `web/` build served by `serve.py`; `npm run test:chrome` for one browser. Slow on a busy machine: pass `--workers=2` if tests time out.
- `npm run test:integration` — full `build.sh` then smoke tests of the shipped `dist/` (`tests/integration/`)

## Routes — `migrated-routes.json` is the source of truth

[`web/migrated-routes.json`](web/migrated-routes.json) lists every live route (66 today). It drives three things at once:

1. the SSG prerender set (`ssgOptions.includedRoutes` in [`web/vite.config.ts`](web/vite.config.ts)),
2. `build.sh`'s flat→folder pass and the route count in its summary,
3. `AppLink`'s SPA-vs-full-navigation decision, via `isMigratedRoute` in [`web/src/lib/migratedRoutes.ts`](web/src/lib/migratedRoutes.ts).

**Adding a page means three edits:** the component under `web/src/pages/`, an entry in [`web/src/routes.tsx`](web/src/routes.tsx), and an entry in `migrated-routes.json`. Skipping the third means the page renders in dev but is never prerendered and never ships. Routes are code-split: give a new page `lazy: () => import('./pages/X').then((m) => ({ Component: m.default }))`, not an eager `Component` (only Home, `Layout` and the 404 load with the app). Keep the `import()` inside the `lazy` function itself — vite-react-ssg reads it there to preload the page's chunk in the prerendered HTML. A page should also appear in the Site index data ([`web/src/lib/siteIndex.ts`](web/src/lib/siteIndex.ts)), which feeds both `/sitemap` and site-wide search (`/search`); `searchIndex.test.ts` fails if a shipped route is unreachable from search.

Use `AppLink` (not bare `<Link>` or `<a>`) for internal navigation — it falls back to a full page load for anything not in the migrated set, and passes external/`mailto:`/`tel:` links straight through.

## App architecture (`web/src/`)

- `pages/` — route components. Service-category pages are grouped in `categories.tsx` / `categories2.tsx`; the 22 service-detail pages live in `pages/service-details/`.
- `routes.tsx` — the route table; `Layout.tsx` — persistent chrome; `main.tsx` — the `ViteReactSSG` entry (drives both prerender and hydration).
- `components/layout/` — `Header`, `Footer`, `HotlineBar`, `InfoBar`.
- `components/ui/` — shadcn/ui primitives. `components/primitives/` — layout/content primitives (`Container`, `Section`, `Band`, `PageHeader`, `SectionHead`, `StatRow`, `RuledGrid`, `SearchField`, `FilterPanel`/`FilterSelect`, `Pager`), re-exported from `primitives/index.ts`.
- `components/` (top level) — `Seo`, `AppLink`, `PWAManager`, `Analytics`, `ServiceSearch`, `VolunteerDialog`, `ProjectLedger`, `ProcurementTable`, `ServiceCategoryPage`, `ImageSlot`, `motion.ts`.
- `lib/` — typed data modules and helpers (`services.ts`, `govData.ts`, `govDirectory.ts`, `budgetData.ts`, `statsData.ts`, `dpwhData.ts`, `infrastructureData.ts`, `legislativeProcess.ts`, `hotlines.ts`, `charts.ts`, `utils.ts`, plus `siteIndex.ts` / `searchIndex.ts` for the Site index and site-wide search, `officialLinks.ts`, `sourceRegistry.ts`).
- `hooks/` — `useLanguage`, `useNews`.
- `index.css` — Tailwind v4 theme. Tokens are declared in `@theme inline`: the shadcn semantic set plus the brand palette (`--color-navy` Pujada navy, `--color-royal`, `--color-amber` "Feel Mati") and `--font-sans` / `--font-display` / `--font-mono`. Fonts are **self-hosted via `@fontsource`** — the `.htaccess` CSP forbids Google Fonts/CDN, so never add a font `<link>`.

**SEO:** every page renders `<Seo title description canonicalPath />`, which serializes title/description/canonical/OpenGraph/Twitter into the prerendered HTML via `vite-react-ssg`'s `<Head>`. New routes should include one.

**Motion:** use the shared primitives in [`web/src/components/motion.ts`](web/src/components/motion.ts) (`fadeUp`, `staggerContainer`, `revealViewport`) with the lean `LazyMotion` + `domAnimation` + `m.*` subset — importing `motion` directly from `framer-motion` pulls in the full bundle. Reduced motion is handled by wrapping a page's animated tree in `<MotionConfig reducedMotion="user">` (see `Home.tsx`), which drops transforms but keeps opacity fades — do that rather than gating animations by hand.

## Data

Content feeds live in the repo-root **`data/`** directory, not in `web/`. They are reached through the `@data` alias and **imported at build time**, so their contents are baked into the prerendered HTML:

```ts
import data from '@data/services.json'; // → repo-root data/services.json
```

To change displayed content, edit the JSON — not the components. Feeds: `services.json`, `officials.json`, `resolutions.json`, `ordinances.json`, `dpwh-projects.json`, `competitive-index.json`, `demographics.json`, `fiscal_transparency.json`, `news.json`.

The project map (`components/ProjectMap.tsx`, on `/transparency/projects` and Home) reads `awarded-civil-works.json` (the City's FDP Bid Results on Civil Works) plus notices and major projects, and draws barangays from `web/src/lib/barangayPaths.json`. That file is generated from `data/mati/dist/mati_barangays.geojson` by `node web/scripts/build-barangay-paths.mjs`; rerun it whenever the boundary file changes (a test fails if they drift).

Visit Mati photos are listed in `tourism.json`'s `photos` (self-hosted WebP under `assets/images/visit/`, a large and an 800 px `-sm` version) and referenced by id from attractions, coasts, Sambuokan and Home's tourism cards. Each one credits who published it, with its source; full citations are on `/visit-mati#photo-credits`. `tourismPhotos.test.ts` enforces the rules: a photo without a Creative Commons license must come from a `.gov.ph` source, and anything from mati.gov.ph must be cited through `web.archive.org`. Don't add a photo whose publisher you can't name.

The one exception is **`news.json`**, fetched at runtime from `/data/news.json` by `useNews` so news can be updated without a rebuild (the `admin/` news editor writes it).

`data/` is copied wholesale into `dist/data/` by `build.sh`, and the dev server is configured with `fs.allow: ['..']` so the root `data/` is importable during `npm run dev`.

## i18n (`web/src/i18n.ts`)

i18next + react-i18next, two languages: `en` / `ceb` (Cebuano). Filipino (`fil`) was removed on 2026-10-06 (`5e0217f`); don't claim it in copy.

- **Flat kebab-case keys.** `keySeparator` and `nsSeparator` are `false` — a `.` or `:` in a key is literal, not a path.
- `en` is bundled (needed synchronously for prerender + hydration); `ceb` is code-split and fetched on first switch via `loadLanguage`.
- The choice persists in `localStorage` under `selectedLang`, read client-only in a `useEffect` so the first render stays `en` and matches the prerendered HTML. **Don't move that read to render time** — it causes a hydration mismatch.
- `ceb.json` is a small machine-assisted starter set (~20% of `en`'s keys), so most Cebuano strings currently fall back to English pending a full translation + native review.
- Any new UI string needs a key in `en.json` (required), plus `ceb` when available. Missing keys fall back to English automatically.

## Version system — single source of truth

`version.json` (root) is the master version. [`scripts/bump-version.js`](scripts/bump-version.js) propagates it to `package.json` and `web/package.json`; `build.sh` calls this automatically. Never hand-edit version strings. The React `Footer` imports `version.json` at build time (build.sh bumps it before the Vite build) and renders `Ver. X.X.X` linking to `/changelog`. Release notes live in `data/changelog.json`: a minor/major bump needs a matching entry there, or `npm test` fails; patch bumps from routine builds do not. `npm run release` does the bump and drafts the entry; every drafted line starts with `TODO` and `npm test` fails until each is rewritten for residents or deleted.

## Build & deploy (`build.sh`)

Five stages: (1) optional `.env` config + version bump, (2) clean `dist/`, (3) `npm ci` + `vite-react-ssg build` inside `web/` → `web/dist/`, (4) assemble `dist/`, (5) chmod `755` dirs / `644` files for cPanel.

Stage 4 is the one with teeth:

- `web/dist/` is copied in as the site (hashed bundles land in `_app/`, **not** `assets/`, to avoid colliding with the passthrough `assets/`).
- **Flat → folder for parent routes.** SSG uses `dirStyle: 'flat'`, emitting both `government.html` and `government/officials.html`; an Apache directory named `government` would shadow `government.html`. So any route that has children is moved to `<route>/index.html`. Leaf routes stay flat. This is computed from `migrated-routes.json`, and the build **fails** if an expected parent route HTML is missing.
- Static passthrough: `assets/`, `data/`, `admin/`, the error pages, `.htaccess`, `sw.js`, `manifest.webmanifest`, `robots.txt`, `version.json`.
- `sitemap.xml` is generated from `migrated-routes.json` by `scripts/generate-sitemap.js`.

Deploy: upload `dist/` contents to cPanel `public_html/`. **Clean URLs** — `.htaccess` mod_rewrite strips `.html`, so links must use extensionless paths. Build-time config comes from an optional git-ignored root `.env`, sourced by `build.sh`: `VITE_SITE_URL` (or `SITE_URL`) sets the canonical origin used for `<Seo>` URLs and `sitemap.xml`, defaulting to `https://bettermati.org`. See `.env.example` / `web/.env.example`.

## Conventions

- Prettier is enforced (`.prettierrc`): single quotes, semicolons, 2-space, 100-col, ES5 trailing commas. Run `npm run format` before committing.
- TypeScript strict; avoid `any`. Functional components, PascalCase component files, `@/` alias for `web/src`, `@data` for the root `data/`.
- Reach for an existing primitive (`Container`, `Band`, `PageHeader`, `StatRow`, `RuledGrid`, `FilterPanel`) or a shadcn `ui/` component before writing new layout markup.
- Tests are Vitest + Testing Library colocated next to the code (`primitives.test.tsx`, `AppLink.test.tsx`, `i18n.test.ts`), run from `web/`.
- **This is a fork of a template originally built for LGU Solano**, rebranded to the City of Mati. LGU-specific records (barangays, resolutions, ordinances, DPWH projects, statistics, budget, city history) are largely **clearly-marked placeholders** (`[Placeholder]` / `[TODO]` / `_status: "draft"`) awaiting verified City of Mati data — see the checklist in `README.md`. Elected officials are the exception: names and councilor order are transcribed from mati.gov.ph (`data/officials.json`, `_status: "verified"`).
- **mati.gov.ph is compromised (as of 2026-11-01):** its pages load an unrelated outside script and it carries spam posts. Cite Internet Archive copies (`web.archive.org/web/<timestamp>/…`) of City pages instead of live URLs, check any live page for injected content before relying on it, and don't add new direct links to it (the one link on `/government/links` carries a warning note). Canonical verified facts are tracked as BM-001; don't "correct" them from general knowledge.
- [`web/GAP-AUDIT.md`](web/GAP-AUDIT.md) records the content-parity audit against the retired legacy site and the judgment calls made — useful when someone asks "was this section dropped or deliberately cut?"

## Mati reference dataset (`data/mati/`)

Canonical barangay layer (PSA PSGC + boundaries), separate from the `data/*.json` feeds. Read [`data/mati/CLAUDE.md`](data/mati/CLAUDE.md) for conventions/gotchas (non-contiguous PSGC codes, inflated `area_km2`, the build's PSGC integrity check) before joining anything to it. Consumed by `Government.tsx` via `@data/mati/dist/mati_barangays.min.json`. Regenerate with `cd data/mati && python3 build_barangays.py` (the cache in `data/mati/data/` is gitignored; `dist/` is committed). Barangay population sums to 148,672. Acquisition plan: [`docs/DATA-PLAN.md`](docs/DATA-PLAN.md).

## Hand-written static files that are still live

The React app is the whole _site_, but a handful of plain static files are still shipped and are **not** legacy residue — don't delete them:

- `403.html`, `404.html`, `500.html` — Apache error pages (served outside React).
- `offline.html` — PWA offline fallback, precached and served by `sw.js`.
- `admin/news-editor.html` — a standalone ~800-line tool that writes `data/news.json` (the feed `useNews` fetches at runtime).
- `sw.js`, `manifest.webmanifest`, `.htaccess`, `robots.txt`.
- **`serve.py`** — the standard way to serve a built `dist/`. It emulates the `.htaccess` clean-URL rewrites, which a plain `http.server` does not, so it is what CI and the tests use: the Lighthouse workflow (`.github/workflows/lighthouse.yml`), the Playwright integration harness (`playwright.integration.config.js`), and `build.sh` itself, which prints `python3 serve.py -d dist -p 8888` as the preview command. Both packaging scripts list it deliberately. Prefer it over `npm run serve:dist` when previewing a build — that one skips the rewrites, so clean URLs 404. It is not a dev server for source; use Vite for that.

All of the HTML files are self-contained (inline CSS/JS); none reference the deleted `assets/css` or `assets/js`. `build.sh` copies them into `dist/` in the stage-4 static passthrough.

## Known stale leftovers from the static era

These survive at the root but target files that no longer exist — they will fail if run.
They are **deliberately retained**, so don't propose deleting them; just don't trust or
extend them without fixing them first, and don't cite them as the way to do something:

- **Root `package.json`** `dev` / `serve` run `python3 -m http.server 8000` against a root `index.html` that no longer exists. Use `cd web && npm run dev`.
- **All 10 `scripts/*.py` i18n scripts** (`i18n-upgrade.py`, `add-*-keys.py`, `translate-pass*.py`, `translate-remaining.py`, `fix-footer-quiz-copyright.py`) operate on `assets/js/translations.js` and/or the old page `*.html` — all deleted. Translations now live in `web/src/locales/*.json`; edit those directly or write new tooling against them. (**`data/mati/build_barangays.py` is the exception** — it is current and still the supported way to regenerate the barangay dataset.)
- **`scripts/bump-version.js`** still walks a hardcoded `htmlDirs` list stamping `Ver. X.X.X` into HTML files; those directories are gone, so that pass is a no-op. The `web/package.json` sync is the part that matters.
- **`react-app/`** may exist on disk as untracked build leftovers (`.next/`, `node_modules/`, `out/`). It is not in git and is safe to delete.
