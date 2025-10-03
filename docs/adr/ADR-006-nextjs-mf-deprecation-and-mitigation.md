# ADR-006: nextjs-mf Deprecation & Mitigation Strategy

Status: Proposed
Date: 2025-10-03

## Context
On 2025-10-03 a public deprecation / EOL notice for `nextjs-mf` (the `@module-federation/nextjs-mf` plugin) made clear:
- Active development by core Module Federation team will cease (maintenance / small fixes only).
- Pages Router will remain *minimally* supported; future Next.js major versions (16+) may or may not work without community fixes.
- RSC + Federation first‑class support is not yet available in stable Next.js.
- Framework authors (Vercel) may ship native/alternate solutions later, but timelines are unclear.
- Recommendation from maintainers: avoid architecting **new** microfrontend ecosystems on Next.js unless accepting these constraints.

## Problem
Our current micro-frontend demonstration uses `nextjs-mf` to satisfy a KPI. Long‑term maintainability risk rises if we double down without an exit path. We must:
1. Preserve near-term delivery velocity to finish KPIs (virtualization, form system, RSC, testing, MFE demo).
2. Document risk transparently to avoid implicit technical debt.
3. Define staged mitigation to reduce lock‑in.

## Forces / Constraints
| Force | Notes |
|-------|-------|
| KPI Deadline | Short-term (weeks) – cannot afford deep replatform now. |
| Need for RSC | Still required for roster/patient streaming – separate from federation. |
| Single Remote (today) | Complexity of heavy orchestration unjustified. |
| Future Growth Unknown | Must keep door open for >3 MFEs or polyglot stack. |
| Tooling Volatility | Federation + RSC integration evolving; premature rewrite risky. |

## Options Considered
| Option | Description | Pros | Cons | Decision |
|--------|-------------|------|------|----------|
| A | Continue current plugin use (document risk) | Fast; zero churn | Ongoing dependency on deprecated path | ✅ Phase 1 |
| B | Manual runtime federation loader (replace plugin in host) | Removes plugin reliance; flexible | Implement sharing logic manually | ⏳ Phase 2 target |
| C | Move remote off Next to pure Webpack/Rspack build | Decouple remote early; leaner artifact | Some rebuild effort; still host plugin initially | 🟡 Evaluate after KPIs |
| D | Full host migration to Modern.js / Remix now | Future‑ready; aligned with active federation ecosystems | Large scope change; delays KPIs | ❌ Defer |
| E | ESM CDN dynamic import (no federation) | Simpler conceptually | Lose dependency de‑dupe; risk multi-React | ❌ Not chosen now |
| F | Iframe isolation | Strong sandboxing | UX, styling, latency overhead | ❌ Not aligned |

## Decision
Proceed with Option A (remain on plugin short-term) while scheduling staged migration to Option B (manual runtime loader) and **optionally** Option C (remote build decoupling) once core KPIs are met.

## Rationale
- KPIs measure breadth (virtualization, form, state, tests, federation) – switching federation plumbing mid‑implementation adds unnecessary schedule risk.
- Client-only consumption already limits complexity surface area.
- Documented risk + exit criteria prevents “silent” technical debt.

## Migration Strategy (Phased)
| Phase | Objective | Actions |
|-------|-----------|---------|
| 1 (Now) | Deliver KPIs | Keep plugin; finalize RSC pages; add contract test & build info export |
| 2 | Reduce lock‑in | Implement manual `loadRemote` utility; remove plugin from host build; keep remote unchanged |
| 3 | Remote Decouple | Rebuild remote as plain federation (Webpack/Rspack) or ESM + federation runtime; host consumes via loader |
| 4 | Platform Evolution | Evaluate Modern.js / native Next federation if released; decide consolidation |

## Exit Criteria (Trigger Migration Earlier)
Trigger migration to Phase 2 or later if any:
1. Next.js 16 breaks plugin beyond trivial fix.
2. Need SSR of remote content (LCP / SEO requirement).
3. Additional remotes (≥3) introduced.
4. Duplicate dependency cost > threshold (e.g., +150KB gzip).
5. Remote failure rate / instability increases due to plugin regressions.

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Plugin incompatibility with future Next.js | Blocked upgrades | Pin Next version; schedule compatibility spike per release |
| Federation feature gap (SSR) | Inability to stream remote | Client-only fallback; plan manual loader enabling experimental SSR later |
| Perception of deprecated tech usage | Stakeholder concern | Transparent ADR + architectural overview + migration roadmap |
| React duplication when moving away from plugin | Hook errors / size bloat | Enforce strict version alignment; add CI dependency diff check |

## Action Items (Immediate)
- [ ] Add build info export in remote (`getBuildInfo`).
- [ ] Host logs remote build info in dev for visibility.
- [ ] Contract test: ensure `clinicalFlagsMfe/ClinicalFlagsWidget` resolves and renders.
- [ ] Add dependency snapshot script (baseline bundle size & shared versions).
- [ ] Pin Next.js & React minor versions (document upgrade policy).

## Manual Loader Preview (Phase 2)
```ts
// loadRemote.ts (draft)
export async function loadRemote<T = any>(remote: string, url: string, exposed: string): Promise<T> {
  if (!document.querySelector(`script[data-remote="${remote}"]`)) {
    await new Promise<void>((res, rej) => {
      const s = document.createElement('script');
      s.src = url; s.async = true; s.dataset.remote = remote;
      s.onload = () => res(); s.onerror = () => rej(new Error(`Failed ${url}`));
      document.head.appendChild(s);
    });
  }
  // Basic share scope init (optional based on runtime)
  // @ts-ignore
  await window.__webpack_init_sharing__?.('default');
  // @ts-ignore
  const container = (window as any)[remote];
  // @ts-ignore
  await container.init?.(window.__webpack_share_scopes__?.default);
  const factory = await container.get(exposed);
  return factory();
}
```

## Consequences
Short-Term Positive:
* No schedule slip; focus on KPI delivery.
Short-Term Negative:
* Carry a known deprecated dependency for a few sprints.
Long-Term Positive:
* Documented path reduces future rewrite shock.
Long-Term Negative:
* If ignored, risk of forced large rewrite under time pressure.

## Status Tracking
Will be updated to Accepted once initial action items are completed. Superseded when a migration ADR (e.g., ADR-010) finalizes manual loader adoption.

---
**Summary:** We consciously accept temporary reliance on `nextjs-mf` with a published, measurable exit strategy that protects long-term architectural integrity while preserving near-term KPI momentum.
