# ADR-005: Virtualization Strategy (Placeholder)

Status: Placeholder – to be finalized when implementation begins.
Date: 2025-10-03

## Intent
Define approach for 100K+ row roster with dynamic row heights (expanded summaries) while achieving <100ms initial paint & >50 FPS scroll.

## Draft Outline
* Data Model: Normalized entities; view model separate from render window.
* Core Hooks: `useVirtualWindow`, `useRowHeightCache`, `useScrollSync`.
* Dynamic Height Handling: Measure on expand; optimistic estimated height fallback; recalculation queue.
* Pooling: Reuse DOM nodes to reduce GC churn.
* Bench Harness: Synthetic dataset generator + scroll script to record frame drops & memory delta.
* Edge Cases: Rapid scroll + expand collapse; browser resize; very tall rows.

## Pending Decisions
* Height estimation strategy (static guess vs median sample window)
* Sticky header & column virtualization scope
* Keyboard accessibility mapping (roving tabindex vs native focus)

## To Finalize
Upgrade this ADR from Placeholder → Accepted once prototype metrics captured.
