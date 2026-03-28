# Spec: Resources Module

**File:** `src/pages/ResourcesPage.tsx` (planned)
**Sprint:** [Sprint 3](../sprints/sprint-3-interactive-pages.md)

## Overview

Public resources library with search, category filtering, author autocomplete, save/unsave, and detail modal. Read-only — no auth required.

## Route

`/resources` → `ResourcesPage.tsx`

## Current State (HTML)

Located at `public/resources/index.html`. Key features in the static version:

### Features

- **Search:** Real-time title search
- **Author autocomplete:** Dropdown suggestions from existing authors
- **Category tabs:** Filter by resource category
- **Saved tab:** Client-side bookmarked resources (localStorage)
- **Card grid:** Image, title, metadata, description preview, heart button
- **Detail modal:** Full resource view with image, title, metadata, full description

### Data Source

- `resources` table: `id`, `title`, `description`, `image_url`, `author`, `category`
- Read-only queries (no write operations for public users)
- Saved resource IDs stored in `localStorage` under key `savedResources`

## Planned Implementation

- Use shared `supabase` client from `lib/supabase.ts`
- Extract filter logic into `useResourceFilters` hook (search, category, author, saved)
- Modal as a React component with portal or overlay
- Author autocomplete with normalized matching

## Database Tables

| Table | Operation | Details |
|-------|-----------|---------|
| `resources` | SELECT | Filtered by search, category, author |

## Dependencies

- [Auth Module](auth.md) — Supabase client only (no auth required)
- React Router — navigation
