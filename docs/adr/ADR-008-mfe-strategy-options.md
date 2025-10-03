# ADR-008: Micro-Frontend Strategy Options (Including Pure Multi-Zone Vertical Slicing)

Status: Proposed  
Date: 2025-10-03  
Related ADRs: ADR-002 (Client-Only Federation), ADR-006 (nextjs-mf Deprecation), ADR-007 (Multi-Zones vs Federation)

## 1. Intent
Catalog and evaluate all viable strategies for satisfying the Micro-Frontend KPI:
"Convert one feature into a separate micro-frontend with module federation. Enable independent deployability, shared dependency management, and error isolation."  
Include an explicit analysis of a **Pure Multi-Zone Vertical Slicing** approach (no Module Federation) and articulate what amendments would be required if that path is chosen.

## 2. KPI Clauses (Verbatim)
1. Convert one feature into a separate micro-frontend **with module federation**
2. Enable **independent deployability**
3. Provide **shared dependency management**
4. Provide **error isolation**

## 3. Option Overview
| ID | Strategy | Brief Description |
|----|----------|-------------------|
| A | Status Quo (Client-Only Federation) | Keep existing `nextjs-mf` client-only remote embedding (single remote). |
| B | Pure Multi-Zone Vertical Slicing Only | Split features by path (zones) / monorepo shared packages; no federation. |
| C | Hybrid: Zones + Minimal Federation | Zones for route isolation + a single federated widget to meet KPI literally. |
| D | Manual Runtime Loader + (Optional) Zones | Replace federation with custom ESM bundle loader; optional zones. |
| E | Enhanced Federation (Server + Client) | Full Module Federation (both build targets) for deeper sharing. |
| F | Dual Path: Federation (interim) → Manual Loader | Deliver KPI using federation; migrate off plugin afterwards. |
| G | KPI Reinterpretation (Amended) | Formally revise KPI to remove "with module federation" requirement. |

## 4. Detailed Analysis
### Option A: Status Quo (Client-Only Federation)
- Mechanism: `next/dynamic` + `ssr:false` + remote exposure using `@module-federation/nextjs-mf` (client build only).
- KPI Coverage: Fully literal (all clauses). Shared dependency negotiation via Webpack share scope; error isolation via component boundary.
- Pros: Already implemented; low incremental effort; strong demo.
- Cons: Deprecation risk (ADR-006); limited RSC synergy; potential future upgrade friction.
- Risks: Plugin breakage on Next major; lacking contract tests (mitigation planned).
- Mitigations: Add build-info contract test, fallback manual loader POC.
- Status: CURRENT BASELINE.

### Option B: Pure Multi-Zone Vertical Slicing Only
- Mechanism: Next.js Multi-Zones; each zone independently deployed; no federation plugin.
- KPI Coverage:
  - Federation clause: NOT satisfied (requires KPI reinterpretation).
  - Independent deployability: Satisfied.
  - Shared dependency management: Only compile-time via monorepo (runtime duplication possible) → Partial.
  - Error isolation: Page-level only (hard navigation) → Partial.
- Pros: Officially supported; RSC-native; no plugin risk; clear vertical ownership.
- Cons: Fails literal KPI; weaker runtime sharing; less impressive granular integration story.
- Required Action to Adopt: New ADR amending KPI or clarifying acceptable reinterpretation (route-level MFE).
- Recommendation: DO NOT adopt without formal KPI amendment (see Option G).

### Option C: Hybrid: Zones + Minimal Federation
- Mechanism: Introduce zones for vertical boundaries; retain a single federated remote (e.g., Clinical Flags widget) for literal KPI compliance.
- KPI Coverage: Full (federation requirement satisfied by minimal scope); zones complement deployment story.
- Pros: Balances stability & compliance; reduces plugin blast radius; scalable.
- Cons: Added conceptual duality (two isolation patterns); some plugin maintenance remains.
- Mitigation: Keep remote surface tiny; add contract test.
- Recommendation: STRONG CANDIDATE if zones are needed soon.

### Option D: Manual Runtime Loader + (Optional) Zones
- Mechanism: Remote builds an ESM/UMD bundle exposing `mount()`/`unmount()` and metadata; host dynamically imports (native dynamic import or injected script). Optional Multi-Zones for route segmentation.
- KPI Coverage (literal): Federation clause NOT satisfied (unless KPI broadened to "runtime-loaded independently deployable feature"). Others: Yes (with disciplined peer dependency strategy to avoid duplicate React).
- Pros: Zero plugin dependency; full control; works with RSC seamlessly.
- Cons: Requires custom build output & integrity/version protocol; more upfront engineering; KPI wording mismatch.
- Use Cases: Long-term deprecation escape hatch.

### Option E: Enhanced Federation (Server + Client)
- Mechanism: Enable federation on both server and client builds for SSR of remote.
- KPI Coverage: Full. Adds SSR/streaming potential for remote.
- Pros: Most powerful demonstration of cross-runtime sharing; potential smaller initial client payload via server pre-render.
- Cons: Triggered hook errors earlier (React multiple instances risk); higher complexity; increased fragility with evolving Next.js internals.
- Recommendation: NOT ADVISED short-term (risk > benefit for KPI scope).

### Option F: Dual Path (Federation Interim → Manual Loader)
- Mechanism: Use Option A for KPI delivery; after KPIs met, refactor remote distribution to manual loader (Option D) and remove plugin.
- KPI Coverage: Full short-term; long-term retains deployability + runtime embedding.
- Pros: Fast KPI compliance + strategic de-risking; incremental migration.
- Cons: Two phases of integration work; need to maintain parity during transition.
- Recommendation: PRIMARY MIGRATION STRATEGY (aligns with ADR-006 mitigation plan).

### Option G: KPI Reinterpretation / Amendment
- Mechanism: Governance decision to redefine Micro-Frontend KPI to: "Demonstrate independently deployable feature via vertical slicing (multi-zone) with shared internal packages and page-level error isolation." Remove explicit "module federation" phrase.
- KPI Coverage: All revised clauses satisfied under Option B.
- Pros: Simplifies architecture; removes plugin dependency from roadmap.
- Cons: Dilutes original technical learning objective; must secure stakeholder approval.
- Recommendation: Only if organizational risk tolerance for plugin is zero AND educational goal can shift.

## 5. Comparative Matrix (Condensed)
| Criterion | A | B | C | D | E | F | G* |
|-----------|---|---|---|---|---|---|----|
| Literal Federation Clause | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | (Removed) |
| Independent Deployability | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Runtime Shared Deps (negotiated) | ✅ | ❌ | ✅ | ⚠️ (manual) | ✅ | ✅ | ❌ |
| Component-Level Embedding | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Page-Level Isolation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Complexity (lower is better) | Medium | Low | Medium | Medium | High | Medium | Low |
| Deprecation Risk Exposure | Medium | None | Low | None | High | Temp Medium → None | None |
| RSC Compatibility | Medium | High | High | High | Medium | High | High |

*G assumes KPI text amended.

## 6. Risks & Mitigations (Key)
| Risk | Options A/C/F | Option B | Option D | Option E |
|------|--------------|----------|----------|----------|
| Plugin deprecation | Mitigate via fallback loader | None | None | Elevated |
| KPI rejection (literal) | None | High | High | None | None |
| Engineering rework | Moderate | Low | Moderate (custom infra) | High | Moderate |
| Performance regress (dup libs) | Low | Medium | Low/Medium | Low | Low |

## 7. Decision Drivers
Priority ordering (from KPI + architecture docs):
1. Hit KPIs literally unless formally amended.
2. Minimize future rework from deprecation risk.
3. Preserve opportunity to showcase RSC + streaming.
4. Keep complexity proportionate to demonstration value.

## 8. Recommendation
Adopt **Option F (Dual Path)**: Maintain current client-only federation (Option A) to satisfy KPI verbatim; concurrently prepare a Manual Runtime Loader (Option D) as a post-KPI deprecation mitigation; optionally layer zones later if route-scale segmentation emerges (Option C deferred).  
Do NOT adopt Option B (Pure Multi-Zone Only) unless KPI is formally amended (would require new ADR documenting the change—see Option G).

## 9. Immediate Action Items
| Action | Owner | Priority |
|--------|-------|----------|
| Add build-info export + contract test (federated remote) | Dev | High |
| Draft Manual Loader POC (mount/unmount + manifest) | Dev | High |
| Add ADR for Loader (post-PoC) | Arch | Medium |
| Perf baseline (virtualized table first render + scroll FPS) | Dev | High |
| Form builder base (compound API skeleton) | Dev | High |
| RSC App Router scaffold in host | Dev | Medium |
| Zone extraction (if justified) – defer | Arch | Low |

## 10. Exit / Revisit Criteria
Re-evaluate this ADR if ANY:
- Federation plugin breaks on Next upgrade.
- Loader POC demonstrates lower operational overhead sooner than expected.
- Stakeholders approve KPI amendment (would promote Option B or D).
- Additional product verticals necessitate zones (trigger Option C layering).

## 11. Glossary
- Component-Level Embedding: Mounting remote UI inside an existing page without a full navigation.
- Runtime Shared Dependencies: Negotiation/loading of a single copy of libraries (React, UI kit) across independently built artifacts.
- Contract Test: Automated check ensuring remote exposure + version metadata is resolvable before deploy.

## 12. Status Proposal
Mark as Proposed. Accept once build-info contract test + loader POC tasks are scheduled in the work plan (sprint backlog) and stakeholders concur with Option F baseline.

---
**Proposed Decision:** Proceed with Option F (Dual Path). Keep federation minimal for KPI compliance; build manual loader fallback; treat zones as optional future segmentation tool.
