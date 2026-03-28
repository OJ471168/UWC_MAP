# Spec: Join & Auth Flow

**File:** `src/pages/JoinPage.tsx` (planned)
**Sprint:** [Sprint 3](../sprints/sprint-3-interactive-pages.md)

## Overview

Membership signup page with multi-step flow: pricing display → signup/login form → Stripe checkout redirect.

## Route

`/join` → `JoinPage.tsx`

## Current State (HTML)

Located at `public/join/index.html`.

### Flow

1. User sees pricing card → clicks "Join Now"
2. Signup form appears (name, email, password)
3. On signup success → creates Supabase auth user, updates profile with full_name
4. Redirects to Stripe Checkout with price ID and user metadata
5. Stripe success → redirects to `/dashboard?welcome=true`
6. Alternative: existing user clicks "Login" → signs in → checks membership → redirects to checkout if needed

### Edge Cases

- Already logged in but not a member → skip signup, go straight to checkout
- Already a member → show "You're already a member" card with link to dashboard
- Password validation: minimum 6 characters

## Planned Implementation

- Use `useAuth()` for session/profile state
- If already authenticated + active member → redirect to `/dashboard`
- Signup: `supabase.auth.signUp()` + profile update
- Login: `supabase.auth.signInWithPassword()`
- Stripe config moved from `stripe-config.js` to `src/lib/stripe.ts`

## External Dependencies

- **Stripe.js** — loaded via CDN or npm package
- `stripe-config.js` values:
  - `publishableKey` — Stripe public key
  - `priceId` — subscription price ID
  - Success URL: `/dashboard?welcome=true`
  - Cancel URL: `/join`

## Database Tables

| Table | Operation | Details |
|-------|-----------|---------|
| `auth.users` | signUp, signIn | Supabase Auth |
| `profiles` | UPDATE, SELECT | Set full_name, check membership_status |

## Dependencies

- [Auth Module](auth.md) — `useAuth()`, `supabase` client
- Stripe.js — checkout redirect
