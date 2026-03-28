# Sprint 3 — Interactive Pages

**Status:** Complete
**Goal:** Migrate the Resources and Join pages from static HTML to React components.

## Scope

Convert `public/resources/index.html` and `public/join/index.html` into React pages that use the shared Supabase client and auth context.

## Deliverables

- [x] Create `ResourcesPage.tsx` — search, category filter tabs, author autocomplete, save/unsave, detail modal
- [x] Create `JoinPage.tsx` — signup/login forms, Stripe checkout redirect, membership status check
- [x] Add routes: `/resources` → ResourcesPage, `/join` → JoinPage
- [x] Move Stripe config into environment or shared module

## Key Considerations

- Resources page has complex filtering with real-time search + autocomplete — extract into a `useResourceFilters` hook
- Join page interacts heavily with auth — leverage existing `useAuth()` context
- Stripe checkout needs `stripe-config.js` values — move to a shared constant or env var
- Both pages use `localStorage` — Resources saves bookmarks, Join checks membership

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/ResourcesPage.tsx` | Created | Resources page with search, category tabs, author autocomplete, save/unsave, detail modal |
| `src/pages/JoinPage.tsx` | Created | Pricing card, signup/login forms, Stripe checkout redirect, membership check |
| `src/router.tsx` | Modified | Added `/resources` and `/join` routes |
| `src/lib/stripe.ts` | Created | Shared Stripe config constants + `getStripe()` loader |
| `package.json` | Modified | Added `@stripe/stripe-js` dependency |

## Related Specs

- [Resources Module](../specs/resources.md)
- [Join & Auth Flow](../specs/join.md)
