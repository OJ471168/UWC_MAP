# Sprint 2 — Static Pages

**Status:** Complete
**Goal:** Migrate the Landing page and Three Principles page from static HTML to React components.

## Scope

Convert `public/index.html` and `public/three-principles/index.html` into React pages with Tailwind styling, React Router `<Link>` navigation, and shared Supabase client for the newsletter form.

## Deliverables

- [x] Create `LandingPage.tsx` — hero, mission, changes lives, principles preview, application areas, for-who cards, membership pricing, FAQ accordion, newsletter form, footer
- [x] Create `ThreePrinciplesPage.tsx` — hero, 3 principle cards, Sydney Banks quote, how they work together, CTA, footer
- [x] Add routes: `/` → LandingPage, `/three-principles` → ThreePrinciplesPage
- [x] Fix MapPage height to account for Nav bar

## Key Conversions

| Before (HTML) | After (React) |
|---------------|---------------|
| `<a href="/join">` | `<Link to="/join">` |
| `onclick="toggleFaq(this)"` | `useState` toggle per FAQ item |
| Inline `<script>` Supabase init | Shared `supabase` import from `lib/supabase.ts` |
| CSS custom properties + raw CSS | Tailwind utility classes |
| `shared-nav.js` injection | Nav rendered by Layout automatically |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/LandingPage.tsx` | Created | Full landing page with FAQ accordion + newsletter form |
| `src/pages/ThreePrinciplesPage.tsx` | Created | Three Principles content page |
| `src/router.tsx` | Modified | Added `/` and `/three-principles` routes |
| `src/pages/MapPage.tsx` | Modified | Height: `h-screen` → `h-[calc(100vh-115px)]` |

## Related Specs

- [Landing Page](../specs/landing.md)
- [Three Principles Page](../specs/three-principles.md)
