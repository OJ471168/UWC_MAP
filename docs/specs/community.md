# Spec: Community Module

**File:** `src/pages/CommunityPage.tsx` (planned)
**Sprint:** [Sprint 4](../sprints/sprint-4-auth-gated-pages.md)

## Overview

Members-only community hub with threaded discussions and a member directory. Requires active membership or admin role.

## Route

`/community` → `CommunityPage.tsx` (wrapped with `AuthGuard`)

## Current State (HTML)

Located at `public/community/index.html`.

### Features

**Discussions Tab:**
- Compose box for new posts
- Thread view: parent posts with nested replies
- Reply system (one level deep)
- Delete own posts
- Time-ago formatting ("5m ago", "2h ago")
- HTML escaping for XSS prevention

**Member Directory Tab:**
- Grid of member cards
- Avatar, name, bio, role badge (admin)
- Ordered by full_name

### Access Control

- Checks `auth.getSession()` on load
- Fetches profile → requires `membership_status = 'active'` or `role = 'admin'`
- Non-members see a "Join Now" message

## Planned Implementation

- Wrap route with `AuthGuard` component
- Two tabs managed with `useState`
- Posts fetched with parent-child relationship
- Profile cache loaded once for display names/avatars
- `useAuth()` provides current user for delete permissions

## Database Tables

| Table | Operation | Details |
|-------|-----------|---------|
| `posts` | SELECT, INSERT, DELETE | `id`, `author_id`, `content`, `parent_id`, `created_at` |
| `profiles` | SELECT | All profiles for display names + member directory |

## Dependencies

- [Auth Module](auth.md) — `useAuth()`, `AuthGuard`, `supabase` client
- React Router — navigation
