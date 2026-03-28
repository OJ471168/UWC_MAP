# Spec: Three Principles Page

**File:** `src/pages/ThreePrinciplesPage.tsx`
**Sprint:** [Sprint 2](../sprints/sprint-2-static-pages.md)

## Overview

Educational content page explaining the Three Principles (Mind, Consciousness, Thought) as articulated by Sydney Banks. Pure content — no API calls or interactive state.

## Route

`/three-principles` → `ThreePrinciplesPage.tsx`

## Sections (top to bottom)

| Section | Content |
|---------|---------|
| Hero | Badge ("Foundation"), title, subtitle |
| Principle Cards | 3 cards (Mind, Consciousness, Thought) — each with icon, title, 2 paragraphs |
| Quote | Sydney Banks quote in blockquote |
| How They Work Together | 3 paragraphs explaining the unified system |
| CTA | "Continue Exploring" with links to `/resources` and `/map` |
| Footer | Copyright |

## Data

All content is hardcoded as constants. Principle cards are defined as an array with `icon`, `iconBg`, `iconColor`, `title`, and `paragraphs`.

## Dependencies

- React Router — `Link` for CTA buttons

## Database Tables

None.
