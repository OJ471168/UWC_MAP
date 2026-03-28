# Spec: Event Map

**Files:** `src/pages/MapPage.tsx`, `src/components/MapContainer.tsx`, `src/components/Sidebar.tsx`, `src/components/Navigation.tsx`, `src/components/EventPanel.tsx`, `src/components/EventList.tsx`, `src/components/HelpModal.tsx`, `src/services/api.ts`
**Sprint:** [Sprint 1](../sprints/sprint-1-foundation.md)

## Overview

Interactive global event map — the core feature of the application. Users can discover events via a Leaflet map with clustered markers or a calendar/grid view. Supports 8 filter types, event detail panel with calendar export, and geolocation-based search.

## Route

`/map` → `MapPage.tsx`

## Layout

```
┌──────────────────────────────────────────────────────┐
│ Nav (from Layout)                                    │
├────────┬─────────────────────────────────┬───────────┤
│Sidebar │ Map or List View                │Event Panel│
│(filters│ (MapContainer / EventList)      │(details)  │
│ search)│                                 │           │
│        │                                 │           │
└────────┴─────────────────────────────────┴───────────┘
```

- Height: `calc(100vh - 115px)` to account for Nav bar
- Sidebar: fixed left, scrollable
- Event Panel: slides in from right (450px width) when an event is selected

## State (MapPage.tsx)

| State | Type | Description |
|-------|------|-------------|
| `events` | `EventData[]` | All events from API |
| `loading` | `boolean` | API fetch in progress |
| `viewMode` | `'map' \| 'list'` | Toggle between map and calendar view |
| `selectedEvent` | `EventData \| null` | Currently selected event (opens detail panel) |
| `showHelp` | `boolean` | Help modal visibility |
| `favorites` | `number[]` | Saved event IDs (persisted in localStorage) |
| `isLocating` | `boolean` | Geolocation request in progress |
| `filters` | `FilterState` | All active filter values |

## Filtering (useMemo)

Applied in order:
1. **Favorites only** — show only saved events
2. **Search term** — match title or city (case-insensitive)
3. **Categories** — match against category group IDs
4. **Organizers** — match main organizer or co-facilitators
5. **Date (month/year)** — event overlaps selected month range
6. **Continent** — exact match
7. **Country** — exact match
8. **Geolocation radius** — Leaflet `distanceTo()` within configured radius

## API (`src/services/api.ts`)

### `fetchEvents(): Promise<EventData[]>`

- Queries `events` table joined with `profiles` (organizer info)
- Filters: `is_hidden = false`, `status = 'live'`
- Orders by `start_time` ascending
- Verifies co-facilitator registration status via separate `profiles` query
- Filters out blocked organizers

### `fetchEventDescription(id: number): Promise<string>`

- Lazy-loads event description by ID
- Called when EventPanel opens for a specific event

## Deep Linking

URL param `?event=<id>` selects and opens an event on page load.

## Favorites

- Stored in `localStorage` under key `saved_events`
- Array of event IDs (JSON stringified)
- Toggle via heart icon in EventList cards and EventPanel

## Dependencies

- [Layout & Navigation](layout.md) — Nav bar above the map
- [Auth Module](auth.md) — Supabase client for API calls
- Leaflet + React-Leaflet + MarkerCluster — map rendering
- Lucide React — icons

## Types

See `src/types.ts` for `EventData`, `FilterState`, `ViewMode`, `CategoryGroup`, `Facilitator`.
