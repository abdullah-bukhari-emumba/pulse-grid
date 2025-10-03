# ADR-003: Federation vs Orchestrator (single-spa) – Decision

Status: Proposed
Date: 2025-10-03

## Context
We evaluated whether to introduce an orchestrator (single-spa / qiankun / piral) for micro-frontend lifecycle management. Current scope: one host + one small remote. KPI requires demonstrating independent deployability, not multi-framework coexistence.

## Decision
Do NOT introduce single-spa (or similar) in Phase 1.

## Real Reasons (No Fabrication)
* Overhead (registration, lifecycle, activation conditions) offers little value with 1–2 MFEs.
* Module Federation already solves code boundary + dependency sharing.
* Orchestrators do not inherently solve dependency deduplication.
* Simplicity aligns with timeboxed KPI delivery.

## Alternatives
* Adopt single-spa early – increases complexity; questionable ROI.
* Roll custom route-based loader – reinvents solved concerns.

## Consequences
Pros: Lower complexity; faster feature delivery.
Cons: Future polyglot expansion would require revisiting composition.

## Revisit Triggers
* ≥3 independently owned MFEs.
* Introduction of a non-React framework.
* Need for per-route hard unmount semantics.
