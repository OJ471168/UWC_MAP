# Sprint 4 — Auth-Gated Pages

**Status:** Planned
**Goal:** Migrate Community and Dashboard pages from static HTML to React, with auth-gated access.

## Scope

Convert `public/community/index.html` and `public/dashboard/index.html` into React pages wrapped with an `AuthGuard` component. These are the most complex pages — community has threaded discussions, dashboard has full CRUD + admin panel.

## Deliverables

- [ ] Create `AuthGuard.tsx` — redirects to `/join` if not authenticated or not an active member
- [ ] Create `CommunityPage.tsx` — discussions feed (threaded), member directory, post/reply/delete
- [ ] Create `DashboardPage.tsx` — event CRUD, resource CRUD, rich text editor, image upload, co-facilitator tags, super admin panel
- [ ] Add routes: `/community` → CommunityPage (guarded), `/dashboard` → DashboardPage (guarded)

## Key Considerations

- Dashboard is the most complex page — consider splitting into sub-components (EventForm, ResourceForm, AdminPanel)
- Rich text editor (Quill.js) and image cropper (CropperJS) need React wrappers or alternatives
- Community page needs real-time feel — consider Supabase realtime subscriptions
- Both pages check `membership_status` and `role` — `useAuth()` already provides this

## File Changes (Planned)

| File | Action | Description |
|------|--------|-------------|
| `src/components/auth/AuthGuard.tsx` | Create | Auth-gated route wrapper |
| `src/pages/CommunityPage.tsx` | Create | Discussions + member directory |
| `src/pages/DashboardPage.tsx` | Create | Event/resource management + admin |
| `src/router.tsx` | Modify | Add guarded `/community` and `/dashboard` routes |

## Related Specs

- [Community Module](../specs/community.md)
- [Dashboard Module](../specs/dashboard.md)
- [Auth Module](../specs/auth.md)
