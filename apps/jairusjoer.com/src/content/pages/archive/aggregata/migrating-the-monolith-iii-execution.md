---
title: 'Migrating the Monolith III: Execution'
draft: true
---

## Execution

### Platform and Infrastructure Prerequisites

Your first milestone is operational scaffolding that makes incremental change safe.

- CI/CD: Create isolated build and release lanes per module. Enforce immutability, provenance, and promotion gates.
- - Pipeline stages: compile → unit → contract → integration (ephemeral env) → security scan → artifact sign → canary → full rollout.
    - Required gates: green tests, vulnerability budget, performance regression threshold, and manual approval for schema changes.
- Runtime: Containerize all candidates with consistent base images and resource policies. Use orchestration for rollout strategies and autoscaling.
- - Deployments: blue/green and canary with traffic weights; health and readiness probes; pod disruption budgets.
    - Configuration: immutable config via environment + secrets manager; feature flags kept out of images.
- Observability: Standardize \***\*OpenTelemetry\*\*** across monolith and services for end-to-end traces.
- - Logging: structured JSON with correlation/tenant/request IDs.
    - Tracing: propagate context through gateway, monolith, and new services.
    - Metrics: RED/USE for infra, plus SLIs (latency, error rate, saturation) mapped to SLOs.
- Error management in a hybrid state:
- - Central error boundary with sampling; deduplicate by fingerprint; attach trace links.
    - Circuit breakers, timeouts, and retries with jitter; fallback responses for non-critical paths.
- Routing and control plane:
- - API gateway or service mesh for timeouts, retries, auth, and traffic shaping.
    - Versioned routes to support parallel runs and quick rollbacks.
- Data safety:
- - Migrations: forward-only, idempotent; generate roll-forward scripts for hotfixes.
    - Shadow reads and dual-writes guarded by flags where necessary; audit trails for reconciliation.

Deliverables:

- A golden pipeline template, artifact signing policy, and promotion workflow.
- Observability starter kit (logging schema, trace propagation middleware, dashboard pack).
- Runbooks for rollback, incident response, and data reconciliation.
- SLOs with an error budget policy bound to release cadence.

### Scaling Knowledge and Culture: Preparing the Team

Execution quality is a function of shared practices and clarity.

- Change management:
- - Define “Definition of Ready” and “Definition of Done” for extractions, including docs, alerts, dashboards, and rollback plans.
    - Establish an architectural review lightweight enough to move weekly, with ADRs for decisions.
- Documentation:
- - Living docs per module: contract, ownership, runbook, SLOs, and dependencies (humans and systems).
    - Visual context map in the repo; keep it versioned and diffable.
- Onboarding for distributed systems:
- - Short workshops: tracing deep-dive, failure modes, idempotency, schema evolution, and eventual consistency.
    - Pair reviews focused on contracts and fault injection.
- Feedback loops:
- - Retros after each extraction: what signals predicted pain, which gates caught issues, which didn’t.
    - Rotate “release captain” role to spread operational fluency.

Deliverables:

- Contribution playbook, ADR template, and release checklist.
- Ownership matrix with escalation contacts and on-call rotations.
- Training materials and a sandbox “failure lab” for chaos drills.

### Test, Validate, and Iterate

Harden quality nets before traffic moves.

- Testing strategy expansion:
- - Unit and property tests for critical business rules.
    - Integration tests in ephemeral environments with seeded fixtures.
    - \***\*Contract testing\*\*** (consumer-driven) for each interface; treat contract breakage as a release blocker.
    - Non-functional: load and latency SLO tests on critical paths; resilience tests for timeouts and downstream failures.
- Automation and safety nets:
- - Canary releases with automatic rollback on SLO breach or anomaly detection.
    - Feature flags with ownership, expiry dates, and observability hooks; remove flags post-cutover.
    - Data validation jobs: compare monolith vs. service outputs for a sampled cohort; alert on drift beyond threshold.
- Monitoring business metrics:
- - Define a minimal \***\*North Star\*\*** set: conversion, task success rate, time-to-value, cancellations/returns, support tickets.
    - Tie alarms to business KPIs alongside technical SLIs to catch silent failures.
- Iteration and rollout playbooks:
- - Dry run in staging with production-like traffic replay.
    - Shadow traffic → limited canary (1–5%) → expand canary (25–50%) → full cutover → clean-up (dead code, flags).
    - Post-cutover tasks: ownership handoff, cost and latency review, and regression audit.

Deliverables:

- Contract test suite with CI gate and versioned schemas.
- Canary and rollback runbooks with pre-baked queries/dashboards.
- Cohort-based parity report and reconciliation tools.
- Business KPI dashboards aligned to each extracted module.

Execution is complete when the organization can perform another extraction with near-zero ceremony: pipelines are templatized, contracts are guarded by tests, rollouts are observable and reversible, and teams share a common operational cadence.
