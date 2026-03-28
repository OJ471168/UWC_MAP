# UWC Global Event Map

A community event discovery platform for the 3 Principles community. Users explore global events via an interactive map or calendar view, filter by category/location/date, and export to personal calendars.

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite (port 3000), React Router v7
- **Mapping:** Leaflet + React-Leaflet + leaflet.markercluster
- **Backend:** Supabase (PostgreSQL, Auth, Row-Level Security)
- **Styling:** Tailwind CSS (CDN), Lucide React icons
- **Payments:** Stripe (membership/subscription)
- **Deployment:** Vercel (SPA fallback: all routes → index.html)

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (entry point: `index.html`)
- `npm run preview` — Preview production build

## Project Layout

```
src/
  main.tsx               — Entry point: AuthProvider + RouterProvider
  router.tsx             — Route definitions (Layout → pages)
  types.ts               — TypeScript interfaces (EventData, FilterState, etc.)
  constants.ts           — Category groups, continent data, country codes
  lib/
    supabase.ts          — Shared Supabase client singleton
  contexts/
    AuthContext.tsx       — Auth provider + useAuth() hook
  components/
    layout/
      Layout.tsx         — App shell: Nav + Outlet
      Nav.tsx            — React navigation bar
    MapContainer.tsx     — Map view with clustering
    Sidebar.tsx          — Left sidebar with filters
    EventPanel.tsx       — Right detail panel
    EventList.tsx        — Calendar/grid view
    Navigation.tsx       — Map-specific top bar
    HelpModal.tsx        — Help overlay
  pages/
    LandingPage.tsx      — Homepage with hero, FAQ, newsletter
    ThreePrinciplesPage.tsx — Educational content page
    MapPage.tsx          — Event map (extracted from old App.tsx)
  services/
    api.ts               — Event API (uses shared Supabase client)

public/                  — Legacy static pages (being migrated to React)
  index.html             — Landing page (migrated → LandingPage.tsx)
  shared-nav.js          — Legacy nav (replaced by Nav.tsx)
  stripe-config.js       — Stripe publishable key
  dashboard/             — Event management (Sprint 4)
  community/             — Posts, membership (Sprint 4)
  three-principles/      — Content pages (migrated → ThreePrinciplesPage.tsx)
  join/                  — Registration (Sprint 3)
  resources/             — Resources library (Sprint 3)

docs/
  architecture.md        — High-level architecture, route map, key decisions
  sprints/               — Per-sprint change logs and deliverables
    sprint-1-foundation.md
    sprint-2-static-pages.md
    sprint-3-interactive-pages.md
    sprint-4-auth-gated-pages.md
    sprint-5-cleanup.md
  specs/                 — Per-module specifications
    auth.md              — Supabase client, AuthContext, AuthGuard
    layout.md            — Layout shell, Nav component
    event-map.md         — Map page, filtering, API, favorites
    landing.md           — Landing page sections, FAQ, newsletter
    three-principles.md  — Three Principles content page
    resources.md         — Resources library (planned)
    join.md              — Join/auth flow + Stripe (planned)
    community.md         — Community discussions + directory (planned)
    dashboard.md         — Dashboard CRUD + admin panel (planned)

supabase/
  migrations/            — Database schema
  functions/             — Edge functions (stripe-webhook)
```

## Architecture Notes

- **SPA with React Router:** Single `index.html` entry, client-side routing via `react-router-dom`
- **Auth context:** `useAuth()` provides session, profile, loading state — replaces per-page Supabase init
- **Supabase client:** Single instance in `src/lib/supabase.ts`, imported everywhere
- **Layout:** `Layout.tsx` renders `<Nav />` + `<Outlet />` — all routes get consistent navigation
- **Map page:** Full-height map with sidebar, filters, event panel — `h-[calc(100vh-115px)]`
- **Filtering:** 8 filter types applied via `useMemo` in `MapPage.tsx`
- **Favorites:** Stored in `localStorage` under key `saved_events`
- **Deep linking:** URL param `?event=<id>` opens an event on load

## Supabase

- Supabase anon key is in `src/lib/supabase.ts` (public, read-only via RLS)
- Key tables: `events`, `profiles`, `posts`, `newsletter_subscribers`, `resources`
- Auth is handled by Supabase Auth with `AuthContext` provider

## Conventions

- Path alias: `@/` maps to `src/`
- Named exports only
- Functional components with `React.FC` typing
- Tailwind for all styling — no CSS modules or styled-components
- Pages go in `src/pages/`, reusable components in `src/components/`
- Shared layout components in `src/components/layout/`

## Documentation

All project documentation lives in `docs/`. Files cross-reference each other:

- **`architecture.md`** — Top-level overview, links to all sprints and specs
- **`sprints/*.md`** — Each sprint lists deliverables, file changes, and links to related specs
- **`specs/*.md`** — Each module spec details behavior, data, dependencies, and links back to its sprint

When making changes: update the relevant spec, add file changes to the current sprint, and update the route map in `architecture.md` if routes changed.
