# 05 — Implementation checklist

Step-by-step build plan for the orchestrator, derived from [04-prototype-plan.md](04-prototype-plan.md). Work through each phase in order; checkboxes map to the phases there (Phase 0 is setup, Phases 1–3 are the build plan's phases).

**Agnosticism rule:** nothing provider-specific lives outside an adapter. The core loop, state store, and receiver stay provider-neutral; provider names appear only in `jjjunior.config.ts` (as adapter entries) and in the adapter modules those entries select. Webhooks follow the same rule: one config entry per provider drives its route, secret, and subscription registration.

## Phase 0 — Prereqs (before any code)

- [x] Scaffold the orchestrator app in `apps/jjjunior/` (Nx project; **Node** runtime decided — workspace CI/tooling is Node+pnpm; `tsx` for dev, `tsc` for build).
- [x] Install deps: web framework (`hono` + `@hono/node-server`), Effect v4 (`effect` + `@effect/platform-node` for runtime DI/launch), OpenCode client (`@opencode-ai/sdk`, server-API client subpath says ready; `@opencode-ai/client` is an unpublished placeholder). Provider access via thin `fetch`-based adapter modules, not heavyweight SDKs, so no provider dep is required before config names one.
- [ ] Start/own an OpenCode server (`opencode --server` or embedded SDK) and define the `pipeline-strict` permission profile the agent runs under.
- [ ] Verify the agent can push: git SSH agent / macOS keychain credentials work from a worktree (the agent's only credential surface).
- [ ] Put adapter secrets in env vars only, referenced per adapter via `secretEnv` (e.g. `LINEAR_WEBHOOK_SECRET`, `GITLAB_WEBHOOK_TOKEN`), never in the repo.
- [ ] Choose first providers in config only (e.g. `ticketing.provider: 'linear'`, `scm.provider: 'gitlab'`) — zero provider names in core code.

## Phase 1 — Polling-only loop (0.5–1 day; prove one ticket end-to-end)

### Core skeleton (provider-neutral)

- [ ] Provider-neutral types: `Ticket`, `CiResult`, `RunState`, mode enum (`human_in_the_loop` | `fully_autonomous`).
- [ ] `jjjunior.config.ts` matching the 04 structure: default mode, `caps: { attempts: 3, noProgress: true, roundTimeoutMin: 15 }`, agent runtime, adapter `lanes` map, allowlists, delivery/polling settings.
- [ ] Effect v4 foundations: `Layer`s for config, state store, and each adapter contract so implementations stay swappable; tagged errors for all fallible steps (API calls, prompts, log fetches) — no bare throw/catch across the core loop.
- [ ] `state.json` store under `~/.local/state/jjjunior/`: atomic writes (tmp + rename), one row per ticket (`sessionId`, `worktree`, `branch`, `changeUrl` (MR/PR), `attempt`, `lastCiSha`, `status`).
- [ ] Two narrow adapter contracts, implemented per provider:
  - **ticketing**: resolve lane map, list/match tickets, post comments, actor filter, delivery auth.
  - **scm**: change (MR/PR) handle, head-SHA pipeline status, fetch failure-job logs, repo allowlist.
- [ ] Core loop functions: `startTicket(ticketRef)` and `onCiResult(ticketRef, ciResult)` — talk only to the adapter contracts.
- [ ] Mode-policy gate: the two modes share everything; only the gate between CI-failure and the next agent round differs.

### Ticketing adapter (first provider via config)

- [ ] Implement the ticketing contract for the configured provider (pick the board you actually use; e.g. Linear or GitLab).
- [ ] Startup: resolve the three lane IDs (`fully_autonomous`, `human_in_the_loop`, `awaiting_approval`) to provider state/label IDs from the config `lanes` map.
- [ ] Allowlist filter from config (team/project + `agent-todo`-style label).
- [ ] Polling loop (60 s) as `Effect.repeat` + `Schedule.fixed('60 seconds')`: tickets moved into a mode lane with no `sessionId` → pickup queue, with 5–15 s debounce (keyed `Effect.timeout` debounce, latest intent wins).
- [ ] Comment-posting capability (pickup ping, round announcements, summaries).
- [ ] Actor filter: ignore moves by the bot user so completion-moves never retrigger pickup.
- [ ] HITL approval detection: owner drags ticket from `awaiting_approval` back into the mode lane (= approved next round); optional `@agent retry` comment as alternative signal (config `approval.comments`).

### SCM+CI adapter (first provider via config)

- [ ] Implement the SCM contract for the configured provider: pipeline status for a head SHA, failing-job log retrieval, MR/PR URLs, repo allowlist from config.

### OpenCode runtime (server API flavor)

- [ ] `makeWorktree(ticketKey)` shared helper (pipeline-skill convention `../<repo>-<KEY>`).
- [ ] Create a session in the worktree directory; round-1 prompt = pipeline-skill steps 0–7.
- [ ] Persist `sessionId` / worktree / branch / change URL from the session result.
- [ ] On pickup, comment on the ticket: "picked up by agent, session `<id>`".
- [ ] Concurrency cap: max ~2 parallel rounds (`Effect.sleep`-free scheduling; `Effect.forkAll` with bounded semaphore).

### CI loop (through the SCM adapter)

- [ ] Poll the change's pipeline status for the head SHA (persisted `lastCiSha`) via `Effect.repeat` with `Schedule.exponential` backoff.
- [ ] On failure, fetch the failing job's log via the SCM adapter.
- [ ] `fully_autonomous`: resume the **same** session with the log ("CI failed (attempt N) … fix, push, re-poll, report") until green or cap (attempt counter + `Effect.retry` policy).
- [ ] HITL: on failure move the ticket into `awaiting_approval` + notify owner; only resume the same session after the approval gesture arrives.
- [ ] Attempt cap (3) → close-out with "capped" summary; no-progress check (failing job set not shrinking between rounds) as an earlier stop.
- [ ] Round timeout: each agent round wrapped in `Effect.timeout('15 minutes')`; timeout = failed round (counts toward cap), dead-letter log.
- [ ] Kill switch: ticket moved back to backlog while working → `POST /session/:id/abort`, park worktree, mark state `aborted` (`Effect.interrupt` on the forked round fiber).

### Close-out + validation

- [ ] Close-out (green / cap / kill switch): move the ticket **into its origin mode lane** with a summary comment ("resolved in N attempts"), park the worktree, mark session done.
- [ ] Ship it on 2–3 real tickets and verify: pickup → MR/PR → CI green, plus at least one HITL pause-and-approve cycle.

## Phase 2 — Webhook push path (~0.5 day)

- [ ] `cloudflared` named tunnel: stable hostname → `http://localhost:<port>` (ngrok is fine for dev).
- [ ] Generic receiver: one factory mounts `POST /hooks/<providerKey>` for **every** configured adapter declaring `secretEnv` (ticketing and SCM) — no per-provider route code. Adapter contract supplies `verifySignature(rawBody, headers)` and `deliveryId(headers)`.
- [ ] Signature verification on the **raw body** from each adapter before JSON parsing (per provider shape: HMAC-SHA256 signature header, or constant-compare token header).
- [ ] Webhook subscription registration from the same single config: on startup and whenever the tunnel URL changes, ensure each configured provider has its webhook pointed at the receiver with the adapter's events selected — create/update via provider API when credentials allow, otherwise emit the exact ready-to-paste payload for manual setup.
- [ ] Dedup table on per-adapter delivery IDs (e.g. `Linear-Delivery`, `X-GitHub-Delivery`) — persisted `Ref`/map keyed by delivery ID.
- [ ] Debounce per (ticket, event-kind), last-state wins.
- [ ] Ack `202` immediately, process in `Effect.forkDaemon`, with a per-event timeout (15 min) and dead-letter logging to a local log dir.
- [ ] Replace the polling pickup trigger with the push trigger; keep polling as the reconciler / source of truth, including laptop-asleep recovery on wake-up.

## Phase 3 — Polish (1 day)

- [ ] No-progress detector (compare failing job sets between rounds).
- [ ] SSE tail (`GET /event`) → per-session log files for debugging.
- [ ] Small status UI / dashboard over `state.json` (mode-lane holders, status, last event, round/token spend).
- [ ] Second provider per adapter type, config + adapter module only (e.g. GitLab ticketing with labels as lanes; GitHub SCM with `workflow_run` / `check_suite` events and `gh run view --log`) — zero core-loop edits proves agnosticism is real.
- [ ] Self-hosted SCM support: config `host` + auth endpoint only.
- [ ] Docs: keep README + `CHANGELOG.md` in sync; note per-ticket token spend of the fix loop.

---

Prev: [04-prototype-plan.md](04-prototype-plan.md) · Back to [README](README.md)
