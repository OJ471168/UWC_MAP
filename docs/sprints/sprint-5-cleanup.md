# Sprint 5 — Cleanup

**Status:** Complete
**Goal:** Remove legacy static HTML files and unused dependencies once all pages are migrated.

## Scope

After all pages are migrated to React, remove the old `public/` HTML pages, `shared-nav.js`, `stripe-config.js`, and `map.html`. Clean up any remaining CDN references. Install Tailwind as a proper build dependency.

## Deliverables

- [x] Remove `public/index.html` (replaced by LandingPage.tsx)
- [x] Remove `public/three-principles/` (replaced by ThreePrinciplesPage.tsx)
- [x] Remove `public/resources/` (replaced by ResourcesPage.tsx)
- [x] Remove `public/join/` (replaced by JoinPage.tsx)
- [x] Remove `public/community/` (replaced by CommunityPage.tsx)
- [x] Remove `public/dashboard/` (replaced by DashboardPage.tsx)
- [x] Remove `public/shared-nav.js` (replaced by Nav.tsx)
- [x] Remove `public/stripe-config.js` (replaced by `@stripe/stripe-js`)
- [x] Remove `map.html` (replaced by `index.html`)
- [x] Remove old `src/App.tsx` and `src/index.tsx` (replaced by `main.tsx` + pages)
- [x] Audit and remove unused CDN script tags
- [x] Install Tailwind as a proper dependency (replace CDN)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `public/index.html` | Deleted | Legacy landing page HTML |
| `public/three-principles/` | Deleted | Legacy Three Principles HTML |
| `public/resources/` | Deleted | Legacy Resources HTML |
| `public/join/` | Deleted | Legacy Join/auth HTML |
| `public/community/` | Deleted | Legacy Community HTML |
| `public/dashboard/` | Deleted | Legacy Dashboard HTML |
| `public/shared-nav.js` | Deleted | Legacy shared navigation script |
| `public/stripe-config.js` | Deleted | Legacy Stripe config (now via `@stripe/stripe-js`) |
| `map.html` | Deleted | Old standalone map entry point |
| `src/App.tsx` | Deleted | Old map-only root component (replaced by MapPage.tsx) |
| `src/index.tsx` | Deleted | Old entry point (replaced by main.tsx) |
| `index.html` | Modified | Removed Tailwind CDN script and inline styles |
| `src/index.css` | Created | Tailwind directives + custom scrollbar/animation styles |
| `src/main.tsx` | Modified | Added `import './index.css'` |
| `postcss.config.js` | Created | PostCSS config with `@tailwindcss/postcss` and autoprefixer |
| `package.json` | Modified | Added `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer` as devDependencies |

## Related Specs

- [Layout & Navigation](../specs/layout.md) — confirms Nav.tsx replaces shared-nav.js
