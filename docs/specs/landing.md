# Spec: Landing Page

**File:** `src/pages/LandingPage.tsx`
**Sprint:** [Sprint 2](../sprints/sprint-2-static-pages.md)

## Overview

The homepage of the UPWC site. Introduces the Three Principles, explains the community, and drives users toward the Event Map or membership signup.

## Route

`/` → `LandingPage.tsx`

## Sections (top to bottom)

| Section | Content | Interactive |
|---------|---------|-------------|
| Hero | Badge, headline, subtitle, 2 CTA buttons | Links to `/three-principles` and `/join` |
| Mission | Statement about shared human experience | No |
| Changes Lives | 6-item grid with icons | No |
| Three Principles | 3-card preview (Mind, Consciousness, Thought) | Link to `/three-principles` |
| Application | 7 area tags + highlight pill | No |
| For Who | 2 cards — Public vs Practitioners | Links to `/map` and `/join` |
| Membership | Pricing card ($40/year) with feature list | Link to `/join` |
| FAQ | 5-item accordion | Toggle open/close per item |
| Newsletter | Email form → Supabase insert | Form submission |
| Footer | Copyright | No |

## Interactive Features

### FAQ Accordion

- Each `FaqItem` manages its own `open` state via `useState`
- Clicking toggles `max-height` with CSS transition
- `+` / `−` indicator on the right

### Newsletter Form

- Email input + Submit button
- On submit: `supabase.from('newsletter_subscribers').insert({ email })`
- Handles duplicate emails (Supabase error code `23505`) with friendly message
- Success/error message displayed below form

## Data

All content is hardcoded as constants within the component (no API calls except newsletter).

## Database Tables

| Table | Operation | Trigger |
|-------|-----------|---------|
| `newsletter_subscribers` | INSERT | Newsletter form submit |

## Dependencies

- [Auth Module](auth.md) — `supabase` client for newsletter insert
- React Router — `Link` for internal navigation
