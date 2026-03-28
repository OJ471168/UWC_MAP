# Spec: Layout & Navigation

**Files:** `src/components/layout/Layout.tsx`, `src/components/layout/Nav.tsx`
**Sprint:** [Sprint 1](../sprints/sprint-1-foundation.md)

## Overview

The app shell that wraps all routes. Provides a consistent navigation bar and page structure.

## Components

### `Layout.tsx`

Minimal shell component.

```tsx
<div className="min-h-screen flex flex-col">
  <Nav />
  <main className="flex-1">
    <Outlet />  {/* React Router renders the active page here */}
  </main>
</div>
```

- All routes are children of Layout in the router config
- Pages that need full-height (like MapPage) handle their own height calculation

### `Nav.tsx`

Replaces the legacy `public/shared-nav.js`. Pixel-identical design, React implementation.

**Structure:**
- Left: UPWC logo (links to `/`)
- Center: Navigation links — Home, The Three Principles, Resources, Event Map, Community
- Right: Auth area — user avatar + name (links to `/dashboard`) or "Join" button (links to `/join`)

**Features:**
- Uses `NavLink` from React Router for active state styling (blue text on active route)
- Uses `useAuth()` for profile/loading state
- Sticky positioning (`top-0 z-[1000]`)
- Responsive: adjusts gap/sizes on mobile

**Nav links:**

| Label | Route | Active match |
|-------|-------|-------------|
| Home | `/` | Exact match only |
| The Three Principles | `/three-principles` | Prefix match |
| Resources | `/resources` | Prefix match |
| Event Map | `/map` | Prefix match |
| Community | `/community` | Prefix match |

## Styling

- Logo height: 95px
- Nav background: white with subtle shadow
- Active link color: `#5c8ab9`
- Join button: `#9cbce2` background, white text, pill shape
- User menu: bordered pill with avatar + name

## Dependencies

- [Auth Module](auth.md) — `useAuth()` for session state
- React Router — `NavLink`, `Link`

## Used By

- All pages (via router Layout wrapper)
- [Event Map](event-map.md) — MapPage accounts for Nav height in its layout
