# Architecture: Migration from Static HTML to React SPA

## Overview

Migrating the site from a collection of static HTML pages (`public/`) plus a standalone React map app (`map.html`) into a unified React SPA with React Router. This gives us shared state (auth, Supabase client), consistent navigation, and a modern development experience across all pages.

## Before & After

### Before

```
map.html (Vite entry) ──► React App (src/)
public/ (static HTML)  ──► 6 separate pages, each with own Supabase client + shared-nav.js
```

### After

```
index.html (single Vite entry)
  └── React SPA with React Router
        ├── Shared Supabase client (src/lib/supabase.ts)
        ├── Auth context (src/contexts/AuthContext.tsx)
        ├── Layout shell (Nav + Outlet)
        └── Pages (src/pages/*.tsx)
```

## Route Map

| Route | Page | Status | Sprint |
|-------|------|--------|--------|
| `/` | LandingPage | Done | [Sprint 2](sprints/sprint-2-static-pages.md) |
| `/three-principles` | ThreePrinciplesPage | Done | [Sprint 2](sprints/sprint-2-static-pages.md) |
| `/map` | MapPage | Done | [Sprint 1](sprints/sprint-1-foundation.md) |
| `/resources` | ResourcesPage | Done | [Sprint 3](sprints/sprint-3-interactive-pages.md) |
| `/join` | JoinPage | Done | [Sprint 3](sprints/sprint-3-interactive-pages.md) |
| `/community` | CommunityPage | Done | [Sprint 4](sprints/sprint-4-auth-gated-pages.md) |
| `/dashboard` | DashboardPage | Done | [Sprint 4](sprints/sprint-4-auth-gated-pages.md) |

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| React Router (not Next.js) | Stay in Vite SPA world — minimal disruption, no SSR needed |
| Single Supabase client via module | Avoids 6 separate initializations; consistent auth state |
| Auth context (not per-page checks) | One `useAuth()` hook replaces copy-pasted `getSession()` calls |
| `AuthGuard` component | Declarative route protection, reusable for community + dashboard |
| Tailwind via PostCSS (build-time) | Replaced CDN with `@tailwindcss/postcss` in Sprint 5 for proper tree-shaking and build-time processing |
| Pages directory | Clear separation between route-level components and reusable components |

## Sprints

| Sprint | Focus | Status |
|--------|-------|--------|
| [Sprint 1 — Foundation](sprints/sprint-1-foundation.md) | Router, auth context, layout, map page | Complete |
| [Sprint 2 — Static Pages](sprints/sprint-2-static-pages.md) | Landing page, Three Principles page | Complete |
| [Sprint 3 — Interactive Pages](sprints/sprint-3-interactive-pages.md) | Resources, Join/auth flow | Complete |
| [Sprint 4 — Auth-Gated Pages](sprints/sprint-4-auth-gated-pages.md) | Community, Dashboard, AuthGuard | Complete |
| [Sprint 5 — Cleanup](sprints/sprint-5-cleanup.md) | Remove legacy HTML, install Tailwind properly | Complete |

## Module Specs

| Module | Spec | Key Files |
|--------|------|-----------|
| Auth | [specs/auth.md](specs/auth.md) | `lib/supabase.ts`, `contexts/AuthContext.tsx` |
| Layout & Nav | [specs/layout.md](specs/layout.md) | `components/layout/Layout.tsx`, `Nav.tsx` |
| Event Map | [specs/event-map.md](specs/event-map.md) | `pages/MapPage.tsx`, `services/api.ts`, map components |
| Landing | [specs/landing.md](specs/landing.md) | `pages/LandingPage.tsx` |
| Three Principles | [specs/three-principles.md](specs/three-principles.md) | `pages/ThreePrinciplesPage.tsx` |
| Resources | [specs/resources.md](specs/resources.md) | `pages/ResourcesPage.tsx` (planned) |
| Join | [specs/join.md](specs/join.md) | `pages/JoinPage.tsx` (planned) |
| Community | [specs/community.md](specs/community.md) | `pages/CommunityPage.tsx` (planned) |
| Dashboard | [specs/dashboard.md](specs/dashboard.md) | `pages/DashboardPage.tsx` (planned) |
