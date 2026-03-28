# Spec: Dashboard Module

**File:** `src/pages/DashboardPage.tsx` (planned)
**Sprint:** [Sprint 4](../sprints/sprint-4-auth-gated-pages.md)

## Overview

Member dashboard for managing events and resources. Most complex page in the application — includes CRUD operations, rich text editing, image upload/crop, and a super admin panel.

## Route

`/dashboard` → `DashboardPage.tsx` (wrapped with `AuthGuard`)

## Current State (HTML)

Located at `public/dashboard/index.html`.

### Features

**Events Tab:**
- Upcoming/past events grid (sorted by start_time)
- Event cards with status badges (Draft/Live/Hidden)
- Create/edit event drawer with fields: title, description (rich text), date/time, location (map search), image (upload + crop), co-facilitators (tag system), visibility
- Delete event

**Resources Tab:**
- Resource card grid
- Create/edit resource drawer: title, description, category, author, image

**Super Admin Panel (role = 'admin'):**
- User management table
- All events view
- User stats (total, active, blocked)

### Third-Party Libraries

- **Quill.js** — rich text editor for event descriptions
- **Leaflet + Geosearch** — location autocomplete in event form
- **CropperJS** — image cropping before upload

## Planned Implementation

Consider splitting into sub-components:
- `DashboardPage.tsx` — shell with tabs
- `EventForm.tsx` — drawer form for create/edit events
- `ResourceForm.tsx` — drawer form for create/edit resources
- `AdminPanel.tsx` — super admin view (conditional on `role = 'admin'`)

### Key Decisions Needed

- Quill.js → use `react-quill` wrapper or alternative (TipTap, Lexical)
- CropperJS → use `react-cropper` wrapper
- Image upload → Supabase Storage bucket

## Database Tables

| Table | Operation | Details |
|-------|-----------|---------|
| `events` | SELECT, INSERT, UPDATE, DELETE | Full CRUD, filtered by `author_id` |
| `resources` | SELECT, INSERT, UPDATE | Full CRUD |
| `profiles` | SELECT, UPDATE | Co-facilitator autocomplete, admin user management |
| `storage` | UPLOAD | Event/resource images |

## Dependencies

- [Auth Module](auth.md) — `useAuth()`, `AuthGuard`, `supabase` client
- Rich text editor library (TBD)
- Image cropper library (TBD)
- Leaflet Geosearch — location autocomplete
