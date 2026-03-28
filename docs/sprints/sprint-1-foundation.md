# Sprint 1 — Foundation

**Status:** Complete
**Goal:** Set up React Router SPA skeleton, shared auth, and migrate the map page.

## Scope

Convert the project from a multi-HTML-file setup into a React SPA with client-side routing, a shared Supabase client, and a unified navigation bar.

## Deliverables

- [x] Install `react-router-dom`
- [x] Create shared Supabase client (`src/lib/supabase.ts`)
- [x] Create auth context with `useAuth()` hook (`src/contexts/AuthContext.tsx`)
- [x] Create React Nav component replacing `shared-nav.js` (`src/components/layout/Nav.tsx`)
- [x] Create Layout shell with Nav + Outlet (`src/components/layout/Layout.tsx`)
- [x] Extract map into `MapPage.tsx` from old `App.tsx`
- [x] Create router config (`src/router.tsx`)
- [x] Create new entry point (`src/main.tsx`)
- [x] Create single `index.html` SPA entry (replaces `map.html`)
- [x] Update `vite.config.ts` — remove Gemini env vars, default entry
- [x] Update `vercel.json` — SPA fallback rewrites
- [x] Update `api.ts` to use shared Supabase client

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modified | Add `react-router-dom` dependency |
| `src/lib/supabase.ts` | Created | Shared Supabase client singleton |
| `src/contexts/AuthContext.tsx` | Created | Auth provider with `useAuth()` hook |
| `src/components/layout/Nav.tsx` | Created | React navigation bar (port of `shared-nav.js`) |
| `src/components/layout/Layout.tsx` | Created | App shell with Nav + Outlet |
| `src/pages/MapPage.tsx` | Created | Map page (extracted from `App.tsx`) |
| `src/router.tsx` | Created | React Router route definitions |
| `src/main.tsx` | Created | New entry point with RouterProvider |
| `src/services/api.ts` | Modified | Import client from `lib/supabase.ts` |
| `index.html` | Created | Single SPA entry point (replaces `map.html`) |
| `vite.config.ts` | Modified | Simplified config |
| `vercel.json` | Modified | SPA fallback rewrites |

## Related Specs

- [Auth Module](../specs/auth.md)
- [Layout & Navigation](../specs/layout.md)
- [Event Map](../specs/event-map.md)
