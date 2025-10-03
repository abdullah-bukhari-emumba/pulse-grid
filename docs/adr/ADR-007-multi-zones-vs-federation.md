# ADR-007: Multi-Zones vs Module Federation (Migration / Contingency Analysis)

Status: Proposed  
Date: 2025-10-03  
Related ADRs: ADR-001, ADR-002, ADR-006  

## 1. Context
`nextjs-mf` (Webpack Module Federation integration for Next.js) is moving toward deprecation / maintenance-only (see ADR-006). We require a credible, documented fallback or complementary strategy for micro-frontend style separation that:
- Works with **App Router + RSC** (React Server Components)
- Reduces plugin lock-in risk
- Allows **independent deployability** (KPI requirement)

Next.js Multi-Zones is an officially supported approach for splitting a domain path space across multiple independently deployed Next.js applications (zones). Each zone owns a set of routes; cross-zone navigation incurs a full page load; intra-zone navigation stays a soft client transition.

## 2. What Multi-Zones Provide / DO NOT Provide
| Aspect | Provides | Does NOT Provide |
|--------|----------|------------------|
| Route-level isolation | ✅ Each zone maps to path prefixes | ❌ Component-level cross-imports |
| Independent deploys | ✅ Separate build & release | — |
| RSC compatibility | ✅ Native (each zone can use App Router) | — |
| Asset collision avoidance | ✅ via `assetPrefix` | — |
| Bundle de-duplication across zones | ❌ No shared runtime chunk negotiation | — |
| Runtime module sharing (like `shared` React) | ❌ (duplicate copies if versions differ) | — |
| Seamless soft navigation across all routes | ❌ Hard reload across zones | — |
| Fine-grained MFE composition (widget embedding) | ❌ Not inherent | Requires other pattern (e.g. runtime loader, iframe, remote fetch) |

## 3. Use Cases Where Multi-Zones Fit Well
* Entire feature verticals: `/dashboard/*`, `/admin/*`, `/clinical-flags/*`
* Gradual large-scale migrations (legacy + new platform coexisting)
* Teams needing autonomy at **route** granularity, not component reuse
* Hard SRP (Single Responsibility) boundaries (e.g., marketing site vs internal app)

## 4. Why Multi-Zones Alone Do NOT Replace Our Current Federation Use
Current micro-frontend demonstration embeds a **remote widget** (component-level integration) inside a host page without full page reload. Multi-Zones cannot natively mount another app's internal component tree inside a route owned by a different zone; it only proxies requests. To emulate our existing embedding behavior with zones we would need an additional strategy:
| Embedding Strategy | Feasibility | Drawbacks |
|--------------------|------------|-----------|
| Iframe zone app | Simple | UX isolation; style / height sync friction |
| Server-side HTML include (fetch remote page, parse) | Brittle | Fragile to markup changes; streaming coordination complexity |
| Runtime script loader + exposed UMD build | Requires custom build | Re-implements part of component federation manually |

## 5. Evaluated Options Relative to Multi-Zones
| Option | Description | Pros | Cons | Status |
|--------|-------------|------|------|--------|
| Keep current MF + add zones later | Federation for components; zones for coarse splits | Best of both worlds if limited | Dual patterns to maintain | Preferred contingency |
| Replace MF with zones only | Route-level segmentation only | Official support; RSC-first | Lose fine-grained embedding | Not chosen (loss of KPI expressiveness) |
| Zones + manual runtime loader (custom federation-lite) | Zones for routing; custom script inject for widget embedding | Removes plugin dependency; flexible | Need to design sharing + version sync | Future migration candidate |
| Full replatform (Modern.js or Remix) | Adopt ecosystem with first-class federation path | Future-aligned; cleaner | Higher cost; context switch | Revisit post-KPI |
| ESM CDN modules + zones | Zone hosts dynamic import ESM widgets | Simple mental model | No dependency negotiation; risk duplicate React | Possible fallback |

## 6. Migration / Contingency Paths
| Phase | Trigger | Action | Notes |
|-------|---------|--------|-------|
| A (Current) | KPI delivery | Keep `nextjs-mf` client-only | Document risk (ADR-006) |
| B (De-risk) | After KPIs OR early trigger | Introduce contract tests + build info + version pin | Already planned |
| C (Plugin Replacement) | Plugin incompatibility OR strategic decision | Implement manual runtime loader; remove plugin | Maintain same component-level behavior |
| D (Optional Zone Introduction) | Need route isolation (e.g., `/admin`) | Carve out zone with `assetPrefix` + rewrites | Keep runtime loader for widgets |
| E (Post-Stability) | Ecosystem maturity (Vercel federation native) | Evaluate native RSC federation or Modern.js | Decide consolidation |

## 7. Multi-Zones Adoption Checklist (If Activated)
1. Choose path prefix ownership map (e.g., `/clinical-flags/*`).
2. Add `assetPrefix` in zone project (`clinical-flags-mfe`).
3. Root application config: rewrites for prefix → zone domain.
4. Prevent path conflicts (unique base paths enforced). 
5. Adjust navigation: use `<a>` for cross-zone links.
6. Validate RSC boundaries per zone (each zone can use App Router independently).
7. Add Synthetic navigation metrics: measure hard vs soft nav cost.

## 8. Pros / Cons Summary
**Pros (Multi-Zones)**
- Official Next.js support & RSC friendly
- Clear operational isolation
- Easy to explain to teams (path ownership)

**Cons (Multi-Zones)**
- Does not satisfy component-level sharing by itself
- Hard reload UX penalty on cross-zone navigation
- Duplicate dependencies increase cumulative bundle cost
- Need disciplined path governance

## 9. Decision (Current Status)
Do NOT migrate to Multi-Zones immediately. Treat Multi-Zones as:  
(1) A *coarse-grain segmentation tool* if new product areas appear.  
(2) A *fallback* if `nextjs-mf` becomes non-viable before manual loader refactor is complete.  
Keep Module Federation demo for KPI fidelity; plan manual loader as primary deprecation mitigation (ADR-006).

## 10. Exit / Revisit Criteria
Re-evaluate adoption of Multi-Zones if ANY:
- Additional teams require independent path-space deployments.
- Need for App Router + RSC full adoption conflicts with federation plugin maintenance.
- Federation plugin breaks on Next upgrade and manual loader path blocked.
- Hard reload cost becomes acceptable trade-off vs maintenance overhead.

## 11. Risks Specific to Multi-Zones Strategy
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| User perceives jarring hard reloads | Medium | UX degradation | Co-locate frequently traversed routes in same zone |
| Asset prefix misconfiguration | Low | 404s / asset clashes | Enforce integration tests + preview deploy smoke |
| Version divergence across zones | Medium | Visual inconsistency | Shared UI package with semver policy |
| Over-segmentation (too many zones) | Low | Operational overhead | Architecture review gate |

## 12. Complementary Use with Manual Loader
Even if zones are adopted, we can *simultaneously*:
- Keep component-level embedding using a runtime loader (planned Phase C).
- Serve the remote as a zone-owned page for full-page fallback (/clinical-flags).

## 13. Summary
Multi-Zones are a **coarse-grained isolation strategy** that complements but does not replace our existing fine-grained widget-level integration. We will not pivot prematurely; instead we explicitly record Multi-Zones as a secondary pathway should federation plugin deprecation accelerate or new product boundaries appear.

## 14. Next Actions (If Promoted to Accepted)
| Action | Owner | Status |
|--------|-------|--------|
| Define path ownership map | Arch | Pending |
| Prepare rewrites config template | Arch | Pending |
| Add zone readiness checklist to repo docs | Arch | Pending |

---
**Decision:** Keep current plan. Multi-Zones remain a documented contingency / complementary strategy.
