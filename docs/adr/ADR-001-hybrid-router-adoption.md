# ADR-001: Hybrid Router Adoption (Pages + App Router)

Status: Proposed (target: Accept once `app/` scaffolding committed)
Date: 2025-10-03

## Context
We need: (a) Module Federation demo; (b) React Server Components (RSC) + streaming. Current MF plugin usage depends on Pages Router. RSC requires App Router. Rewriting federation layer for pure App Router now would create schedule risk and potential instability.

## Decision
Adopt a hybrid: retain minimal Pages Router surface ONLY for federation bootstrap & demo route; implement product flows (roster, patient detail, encounter) in `app/` using RSC.

## Alternatives
* Full App Router + experimental federation plugin – higher risk.
* ESM-only remote – lose dependency sharing + risk duplicate React.
* Iframe remote – UX + integration penalties.
* Abandon federation – violates KPI.

## Consequences
Pros: Meets KPIs quickly; low refactor cost; incremental path to SSR federation later.
Cons: Two paradigms; needs clear boundary & documentation.

## Exit Criteria
Switch to unified App Router federation when stable SSR-compatible MF tooling + need for remote SSR emerges.

## Ownership
Architecture maintainer to revisit quarterly or upon trigger event.
