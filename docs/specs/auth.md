# Spec: Auth Module

**Files:** `src/lib/supabase.ts`, `src/contexts/AuthContext.tsx`, `src/components/auth/AuthGuard.tsx`
**Sprint:** [Sprint 1](../sprints/sprint-1-foundation.md) (context), [Sprint 4](../sprints/sprint-4-auth-gated-pages.md) (guard)

## Overview

Centralized authentication layer using Supabase Auth. Provides a single Supabase client, a React context for session/profile state, and a route guard for protected pages.

## Components

### `src/lib/supabase.ts`

Single Supabase client instance shared across the entire app.

```ts
export const supabase: SupabaseClient
export const DEFAULT_AVATAR_URL: string
```

- Replaces 6 separate `createClient()` calls from the old HTML pages
- Uses the public anon key (read-only via RLS)

### `src/contexts/AuthContext.tsx`

React context providing auth state to the entire component tree.

```ts
interface UserProfile {
  id: string
  fullName: string
  avatarUrl: string
  membershipStatus: string | null  // 'active' | 'inactive' | null
  role: string | null              // 'user' | 'admin' | null
  isBlocked: boolean
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const useAuth: () => AuthState
```

**Behavior:**
- On mount: calls `supabase.auth.getSession()` and fetches profile from `profiles` table
- Listens to `onAuthStateChange` for login/logout/token refresh events
- Auto-fetches profile whenever session changes
- Provides `signOut()` that clears both session and profile state
- `loading` is `true` until initial session check completes

### `src/components/auth/AuthGuard.tsx` (Sprint 4)

Route wrapper that redirects unauthenticated or unauthorized users.

**Planned behavior:**
- If `loading` → show spinner
- If no session → redirect to `/join`
- If `profile.membershipStatus !== 'active'` and `profile.role !== 'admin'` → redirect to `/join`
- If `profile.isBlocked` → show blocked message
- Otherwise → render children

## Database Tables

| Table | Relevant Columns | Usage |
|-------|-------------------|-------|
| `profiles` | `id`, `full_name`, `avatar_url`, `membership_status`, `role`, `is_blocked` | Profile fetch on auth state change |

## Used By

- [Layout & Navigation](layout.md) — Nav shows user avatar or Join button
- [Landing Page](landing.md) — newsletter form (no auth required, just Supabase client)
- [Join Page](join.md) — signup/login flows
- [Community](community.md) — auth-gated access
- [Dashboard](dashboard.md) — auth-gated access
