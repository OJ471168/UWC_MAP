# Sprint 5 — Cleanup

**Status:** Planned
**Goal:** Remove legacy static HTML files and unused dependencies once all pages are migrated.

## Scope

After all pages are migrated to React, remove the old `public/` HTML pages, `shared-nav.js`, `stripe-config.js`, and `map.html`. Clean up any remaining CDN references.

## Deliverables

- [ ] Remove `public/index.html` (replaced by LandingPage.tsx)
- [ ] Remove `public/three-principles/` (replaced by ThreePrinciplesPage.tsx)
- [ ] Remove `public/resources/` (replaced by ResourcesPage.tsx)
- [ ] Remove `public/join/` (replaced by JoinPage.tsx)
- [ ] Remove `public/community/` (replaced by CommunityPage.tsx)
- [ ] Remove `public/dashboard/` (replaced by DashboardPage.tsx)
- [ ] Remove `public/shared-nav.js` (replaced by Nav.tsx)
- [ ] Remove `public/stripe-config.js` (replaced by `src/lib/stripe.ts`)
- [ ] Remove `map.html` (replaced by `index.html`)
- [ ] Remove old `src/App.tsx` and `src/index.tsx` (replaced by `main.tsx` + pages)
- [ ] Audit and remove unused CDN script tags
- [ ] Install Tailwind as a proper dependency (replace CDN)

## Related Specs

- [Layout & Navigation](../specs/layout.md) — confirms Nav.tsx replaces shared-nav.js
