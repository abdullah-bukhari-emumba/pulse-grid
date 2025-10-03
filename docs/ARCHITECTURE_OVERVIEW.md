## PulseGrid Architecture Overview

Purpose: Single, concise but detailed reference capturing what we have built so far, why, the options evaluated, and the rationale behind current choices. This complements the individual ADRs (see /docs/adr).

### 1. Current Direction (Final)
We have accepted a hybrid that is App Router–first with a client-only runtime MF island and a route-level MFE form via Multi-Zones. See ADR-009.

* Monorepo: Turborepo with `apps/` (host + separate form zone + chart remote) and shared `packages/` (`ui`, `types`; planned `state`, `virtualization`, `schemas`).
* Host (dashboard-shell): Next.js App Router only; React Server Components for data fetching; Streaming SSR with Suspense; partial hydration with client components for interactive islands.
* Virtualized Table: Client Component windowing with dynamic row heights; data fetched in RSC via paged/cursor strategy; smooth scrolling and leak-safe lifecycle.
* Form (Encounter): Separate Next.js application served via Multi-Zones (route-level MFE, vertical slicing). Cross-zone navigation is a hard navigation.
* Chart MFE: Built as a Webpack Module Federation remote (remoteEntry.js). Loaded from the host via a client-only runtime MF loader (no Next host plugin). Runtime share scope negotiates React/UI singletons; wrapped in ErrorBoundary.
* KPI Status: Architecture chosen to satisfy all KPIs: virtualization, state architecture, compound form, testing, App Router + RSC/streaming, and “with module federation” via the chart island.

#### Why this final choice
- We tested server-side federation and hit React runtime duplication issues; client-only consumption was stable.
- App Router + RSC pairs best with minimizing host-side build-time federation; a client-only MF island preserves KPI compliance while avoiding SSR pitfalls.
- Multi-Zones give clean route-level isolation for the form without interfering with RSC adoption.
- Monorepo packages provide compile-time cohesion; the MF share scope provides runtime shared-deps for the chart.

### 2. Key Constraints & Realities
* React Server Components (RSC) + Module Federation (MF) integration is still evolving in the ecosystem; stable tooling favors Pages Router for MF plugin.
* We need BOTH: (a) MFE demonstration AND (b) RSC streaming for data-heavy pages.
* Deadlines and KPI breadth (virtualization, forms, test coverage) favor incremental, low-risk layering over premature deep refactor.
* Independent deployability is a KPI: remote must remain separable.

### 3. Options Considered (High-Level)
| Option | Summary | Pros | Cons | Decision |
|--------|---------|------|------|----------|
| A. App Router Host + Runtime MF Island + Multi-Zone Form | Final: App Router-only host, client-only runtime MF for chart, form as zone | Full KPI coverage; stable; RSC-first | Two MFE styles (route + component) | CHOSEN (Final) |
| B. Full Multi-Zones Only | Route-level MFE only, no MF | Simple; official | Fails literal MF clause | Not chosen |
| C. Manual Loader (no MF) | Custom ESM loader for widget | No plugin risk | KPI wording mismatch | Deferred |
| D. Iframe Remote | Embed remote in iframe | Strong isolation; trivial failure isolation | Poor UX integration; more communication ceremony | Rejected |
| E. Orchestrator (single-spa, qiankun, piral) | Introduce a runtime composition layer | Polyglot readiness; route isolation | Overkill with 1–2 MFEs; adds lifecycle complexity; slows KPI delivery | Rejected (premature) |

### 4. Why We Did NOT Use single-spa (Honest Reasons)
* We have a single remote + host; orchestration overhead not justified.
* Next.js already provides routing + code splitting; adding a second lifecycle system adds complexity without ROI.
* Federation solves code sharing & bundle boundary cleanly; single-spa does not address dependency de-duplication.
* Future readiness: If we add polyglot (e.g., Vue + React + Svelte) we will re-evaluate (criteria documented in ADR-003).

### 5. Why Client-Only Federation (Phase 1)
* Eliminated build-time mismatch issues (initial SSR resolution errors).
* Simpler mental model for junior contributors: treat remote like a dynamic component.
* Performance acceptable for current widget scope (small remote footprint).
* Clear upgrade path: Add server-side federation only if we need SSR or SEO for remote content.

### 6. Exit Criteria (To Revisit Decisions)
Revisit hybrid + client-only federation if ANY of:
1. > 3 independent MFEs introduced OR chart remote grows beyond a small island.
2. Need SEO / first-paint SSR of remote UI.
3. Duplicate dependency bloat exceeds threshold (e.g., > +150KB React duplicates in bundle analysis).
4. Tooling maturity: stable RSC-compatible federation plugin adopted.
5. Product requirement: remote contributes to perceived load performance KPIs.

### 7. Upcoming Work (Mapped to KPIs)
| KPI Area | Immediate Actions |
|----------|------------------|
| Virtualized Table | Scaffold App Router RSC shell + virtualization engine package (`@pulsegrid/virtualization`). |
| State Architecture | Introduce normalized store: `entities/`, `slices/`, selector utilities + optimistic mutation queue. |
| Compound Form | Build form core (`<Form/>`, field registry, Zod schema adapter, array + conditional components). |
| Testing Strategy | Add test infra (Jest/Vitest + RTL), contract test for remote, initial Playwright smoke. |
| RSC + Streaming | Build roster + patient detail with App Router + Suspense boundaries; keep chart as client island. |
| MFE Hardening | Add build-info export for chart remote, runtime loader contract test, share-scope assertion. |
| Performance | Add Lighthouse CI baseline + Web Vitals logging + virtualization scroll benchmark harness. |

### 8. Risks & Mitigations (Snapshot)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Dual router confusion | Onboarding friction | ADR + README section + restrict Pages usage to federation demo only |
| Remote contract drift | Runtime break | Contract test + version handshake (+ fallback) |
| Premature optimization detour | Delayed KPI delivery | Guardrail: implement KPI-critical features before enhancements |
| Accessibility regression | KPI miss | Automated axe checks + manual audit checklist |
| Performance regression (virtualization) | UX stutter | Benchmark harness & commit gating |

### 9. ADR Index
* ADR-001 Hybrid Router Adoption (Pages + App Router)
* ADR-002 Client-Only Federation (Phase 1 Strategy)
* ADR-003 Federation vs Orchestrator (Rejecting single-spa now)
* ADR-004 RSC Integration Roadmap & Boundaries
* ADR-005 (Placeholder) Virtualization Strategy & Row Height Policy
* ADR-006 nextjs-mf Deprecation & Mitigation Strategy
* ADR-007 Multi-Zones vs Module Federation Contingency
* ADR-008 Micro-Frontend Strategy Options (Federation, Zones, Loader)
* ADR-009 Final Architecture and KPI Delivery Plan (Accepted)

### 11. Decision History (Short)
We explored and documented multiple avenues:
- Client-only federation (working) and attempted server federation (failed due to React mismatch) → ADR-002.
- Deprecation and risk assessment for nextjs-mf → ADR-006.
- Multi-Zones trade-offs and fit → ADR-007.
- Comprehensive options matrix (A–G) → ADR-008.
This final architecture (ADR-009) synthesizes App Router + RSC with a runtime MF island and a zone-based form to meet all KPIs with the least risk.

### 10. Guiding Principles
1. Ship meaningful vertical slices; avoid speculative abstraction.
2. Document trade-offs explicitly (no “implicit cleverness”).
3. Favor observable performance (measured) over assumed performance.
4. Keep MFEs boring first; add sophistication (SSR, version manifest) only when triggered by criteria.
5. Accessibility & resilience are first-class, not retrofits.

---
Maintained: Update this document when an ADR status changes (Accepted → Superseded) or a new exit criterion is met.
