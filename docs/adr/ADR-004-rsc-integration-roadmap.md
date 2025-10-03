# ADR-004: RSC Integration Roadmap

Status: Draft
Date: 2025-10-03

## Context
RSC (React Server Components) & streaming SSR are KPI requirements. We have not yet introduced `app/` routes. Need a plan that coexists with current federation.

## Decision
Implement new feature surfaces (roster, patient detail, encounter form shell) under `app/`. Keep remote mounting via a client boundary inside `app/` pages.

## Implementation Steps
1. Scaffold `app/layout.tsx` with global providers (non-client if possible).
2. `app/page.tsx`: roster shell + placeholder virtualization mount.
3. `app/patient/[id]/page.tsx`: server component fetching patient summary + Suspense boundaries for flags, medications, etc.
4. Add `app/client/ClinicalFlagsWrapper.tsx` for remote.
5. Introduce streaming placeholder components (skeletons) with progressive hydration.

## Risks
* Confusion about data fetching split between Pages vs App – mitigated by confining Pages usage to federation demo.
* Potential need to elevate some providers to client boundary – weighed against hydration cost.

## Metrics to Track
* LCP for roster page (goal: < 2.5s on dev hardware baseline)
* Time-to-interactive for virtualization scroll area
* Suspense revealed segments timing (flags panel, etc.)
