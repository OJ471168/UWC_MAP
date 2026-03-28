# Sprint 4 — Auth-Gated Pages

**Status:** Complete
**Goal:** Migrate Community and Dashboard pages from static HTML to React, with auth-gated access.

## Scope

Convert `public/community/index.html` and `public/dashboard/index.html` into React pages wrapped with an `AuthGuard` component. These are the most complex pages — community has threaded discussions, dashboard has full CRUD + admin panel.

## Deliverables

- [x] Create `AuthGuard.tsx` — redirects to `/join` if not authenticated or not an active member
- [x] Create `CommunityPage.tsx` — discussions feed (threaded), member directory, post/reply/delete
- [x] Create `DashboardPage.tsx` — event CRUD, resource CRUD, image upload, co-facilitator tags, super admin panel
- [x] Add routes: `/community` → CommunityPage (guarded), `/dashboard` → DashboardPage (guarded)

## Key Considerations

- Dashboard is the most complex page — consider splitting into sub-components (EventForm, ResourceForm, AdminPanel)
- Rich text editor (Quill.js) and image cropper (CropperJS) need React wrappers or alternatives
- Community page needs real-time feel — consider Supabase realtime subscriptions
- Both pages check `membership_status` and `role` — `useAuth()` already provides this

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/auth/AuthGuard.tsx` | Created | Auth-gated route wrapper — redirects to `/join` if not member/admin |
| `src/pages/CommunityPage.tsx` | Created | Threaded discussions feed, compose box, replies, member directory grid |
| `src/pages/DashboardPage.tsx` | Created | Event/resource CRUD with drawers, co-facilitator tags, image upload, super admin panel (users + events) |
| `src/router.tsx` | Modified | Added guarded `/community` and `/dashboard` routes |

## Related Specs

- [Community Module](../specs/community.md)
- [Dashboard Module](../specs/dashboard.md)
- [Auth Module](../specs/auth.md)
