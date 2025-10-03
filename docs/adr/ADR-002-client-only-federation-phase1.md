# ADR-002: Client-Only Federation (Phase 1)

Status: Proposed
Date: 2025-10-03

## Context
Initial MF integration produced build-time resolution issues (server-side transform) and a hooks runtime mismatch risk. Remote content is not SEO critical.

## Decision
Use client-only dynamic import (`next/dynamic` + `ssr:false`) for remote in Phase 1.

## Alternatives
* Enable federation server + client builds – adds complexity without current need.
* SSR federation now – premature; no KPI dependency.

## Consequences
Pros: Stable, fast iteration; simpler mental model; resilient fallback.
Cons: No SSR/streaming of remote; hydration-only rendering.

## Upgrade Path
Add SSR only if remote must contribute to LCP or SEO or we add multiple remotes with cross-cutting server rendering.
