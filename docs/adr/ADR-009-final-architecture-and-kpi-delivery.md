# ADR-009: Final Architecture Decision and KPI Delivery Plan

Status: Accepted
Date: 2025-10-04
Related ADRs: ADR-001, ADR-002, ADR-006, ADR-007, ADR-008

## 1. Decision Summary
We will:
- Convert the host (dashboard-shell) to Next.js App Router only and adopt React Server Components for data fetching and Streaming SSR (no Pages Router in host).
- Implement the virtualized roster table as a Client Component, with data fetched by Server Components in paged/cursor slices (never fetch all 100k rows at once).
- Place the Encounter Form in a separate application served via Multi-Zones (route-level micro-frontend, vertical slicing). Cross-zone navigation is a hard navigation.
- Deliver the chart above the table as a client-only Module Federation remote using a runtime-only loader (plugin-less host). The remote is built with Webpack Module Federation and exposes a `remoteEntry.js` (true MF). The host loads and initializes the container at runtime in a Client Component, negotiates shared deps (React/UI) through the MF share scope, and renders the exposed module inside an ErrorBoundary.
- Keep the monorepo (Turborepo + pnpm) and shared packages (e.g., @pulsegrid/ui, future @pulsegrid/state, @pulsegrid/virtualization, @pulsegrid/schemas) for compile-time alignment across zones.

This combination satisfies all KPIs while minimizing risk from the deprecating Next federation plugin by not requiring a host-side build-time plugin in the App Router.

## 2. Context & Rationale
- KPI requires: Module Federation for at least one feature, independent deployability, shared dependency management, error isolation; plus RSC/streaming, virtualization, state architecture, compound forms, and testing.
- App Router (RSC) is better served without server-side federation complexity. Client-only Module Federation consumption is compatible with App Router because it runs entirely in a Client Component.
- Multi-Zones provide clear route-level isolation for the Form, enabling independent deployability without complicating the host’s RSC adoption.
- Monorepo packages provide compile-time shared code; MF share scope provides runtime shared deps for the chart remote (React 19.1.0, UI kit), preventing duplicate runtimes.

## 3. KPI Coverage Mapping
- Virtualized Data Table: Custom windowing engine (dynamic row heights), render only the visible rows, smooth scrolling (>50 FPS), measured and memory-safe. Data fetched in RSC via pages/cursors; client requests additional slices on demand.
- State Architecture: React Context + useReducer + custom selector hooks; normalized entities; optimistic updates where applicable; strict TypeScript; minimize re-renders via selectors and memoization.
- Compound Form Builder: Separate zone hosts the form; compound component pattern; Zod validation; nested field arrays; conditional fields; Error Boundaries; WCAG 2.1 AA.
- Testing: 90% coverage target with unit (utils, reducers, virtualization math), integration (table/filtering, form flows), E2E (roster → encounter → back) across zones, and visual regression via Storybook/Playwright.
- Next.js & RSC: App Router host; Server Components fetch; Streaming SSR with Suspense; partial hydration by using client boundaries only where interactivity is needed.
- Micro-Frontend: Chart loaded via runtime-only Module Federation in a client island (MF remoteEntry + container.get), negotiating shared deps. Form zone provides independent deploy at route level; chart MFE provides in-page embedding demo and error isolation.

## 4. Implementation Outline
- Host (dashboard-shell):
  - Add `app/` with server `layout.tsx` and RSC pages (e.g., `app/roster/page.tsx`).
  - Implement paged/cursor data fetch in RSC; stream skeletons via Suspense.
  - Build Client virtualization component with dynamic row height measurement and prefix-sum offset mapping.
  - Add `ChartIsland` client component: runtime MF loader that loads `remoteEntry.js`, calls `__webpack_init_sharing__('default')`, `container.init(shareScope)`, `container.get('./ChartWidget')`, and renders the result inside an ErrorBoundary and Suspense fallback.
- Form Zone (separate Next.js app, Multi-Zone):
  - Configure `assetPrefix` and rewrites in host.
  - Implement compound form, Zod validation, a11y, and error boundaries.
- Shared Packages (packages/*):
  - `@pulsegrid/ui` (design system components),
  - `@pulsegrid/state` (context/reducer/selectors),
  - `@pulsegrid/virtualization` (row math + measurement),
  - `@pulsegrid/schemas` (Zod models).
- Contract Tests:
  - CI test that fetches the chart remote’s `remoteEntry.js`, initializes share scope, and verifies the exposed module + build info.

## 5. Risks & Mitigations
- Server payload bloat with 100k records: Mitigated by paged/cursor fetch; only first window/materialized slice is sent initially; stream UI.
- Federation plugin deprecation: Host does not depend on a Next build-time MF plugin; consumption is runtime-only; remote uses standard Webpack MF.
- Cross-zone hard navigation: Expected; minimize user back-and-forth between zones; ensure UX communicates transitions.
- Runtime share-scope mismatch: Pin React/ReactDOM to 19.1.0; configure remote to mark them as singletons; add build-info contract test.

## 6. Alternatives Considered
- Pure Multi-Zones without MF (fails literal KPI),
- Full server + client federation in App Router (fragile; prior hook duplication issues),
- Manual runtime loader without MF (requires KPI amendment; kept as fallback if needed later).

## 7. Acceptance Criteria
- Host runs purely on App Router with at least one streaming RSC page.
- Chart is loaded via runtime Module Federation on the client, sharing React at runtime.
- Form is served from a separate zone under a unique path with assetPrefix and rewrites.
- Virtualized table meets performance targets (<100ms render of window; >50 FPS scroll), no leaks verified.
- Test suites in place (unit/integration/E2E/visual) approaching 90% coverage.

## 8. Operational Notes
- Use <a> for cross-zone links (no Next <Link> across zones to avoid prefetch misfire).
- Add monitoring: simple performance marks and error logging around the chart island.
- Document RSC/client boundaries for maintainers.

## 9. Status Changes to Related ADRs
- ADR-002 (Client-Only Federation Phase 1) is superseded for the host by this ADR (host moves to App Router and uses runtime-only MF loader rather than nextjs-mf host plugin). Remote remains MF-built.
- ADR-007 (Multi-Zones vs Federation) remains a reference; we adopt a complementary approach: route-level MFE via Multi-Zones for the form plus in-page MF for the chart.
- ADR-008 (MFE Options) is resolved by selecting the hybrid path compatible with App Router (runtime-only MF consumption).

---
Final Decision: Accepted. Proceed to implement as outlined above.
