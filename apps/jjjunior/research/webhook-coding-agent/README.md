# Webhook-driven coding agent — feasibility & setup notes

Research findings for a system that:

1. Listens for ticket events (Linear/GitLab "moved to To Do") on a local machine.
2. Spawns an OpenCode instance implementing the ticket end-to-end (same flow as the existing `pipeline` skill: worktree → fix + tests → push → MR/PR → CI).
3. Parks the session until the git platform fires a CI-completion webhook (success/failure).
4. On failure, re-prompts the **same session** with the CI failure and lets the cycle repeat N times until green (or a cap / escalation).

**Verdict: feasible, and mostly glue code.** All three pillars exist today:

| Pillar          | Status                                                                                                                                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ticket webhooks | Linear + GitLab (and GitHub) fire issue/state-change webhooks with HMAC signatures.                                                                                                                                                                  |
| Agent runtime   | OpenCode headless (`opencode run`), server API (`POST /session`, `POST /session/:id/message`, SSE `/event`), and `@opencode-ai/sdk`. Session IDs are persistent, so "reactivate the implementation session" = one prompt on the existing session ID. |
| CI events       | GitLab "Pipeline Hook" and GitHub `workflow_run`/`check_suite` webhooks carry status + failure logs/URLs.                                                                                                                                            |
| Local delivery  | Needs a public URL → Cloudflare named tunnel (free, stable hostname with your own domain) or ngrok; polling fallback is trivial and removes the tunnel requirement entirely.                                                                         |

## Docs in this folder

- [01-event-sources.md](01-event-sources.md) — Linear / GitLab / GitHub webhook payloads for the two trigger points (ticket → To Do, CI finished).
- [02-agent-runtime.md](02-agent-runtime.md) — spawning OpenCode headlessly, session lifecycle, resuming with CI failures; how the existing `pipeline` skill maps to it.
- [03-delivery-reliability-security.md](03-delivery-reliability-security.md) — how events reach a local machine (tunnel vs polling), dedup/debounce, signature verification, secrets.
- [04-prototype-plan.md](04-prototype-plan.md) — MVP architecture and a phased build plan with rough effort.

## Key design decisions up front

1. **Orchestrator is a small long-running local process** (Node/Bun daemon), not transient scripts: it must survive sleep/outages and own state.
2. **Persist state on disk** (`state.json` or SQLite): ticket → OpenCode session ID, attempt count, branch/MR URL. The webhook may arrive while the laptop is asleep; the orchestrator reconciles via the platform APIs on wake-up.
3. **Session reuse vs respawn**: reuse the OpenCode session for CI-fix rounds (it remembers context). Cap rounds (e.g. N=3) — if still red, stop and comment on the ticket/MR instead of burning tokens in a loop.
4. **Polling fallback first**: webhooks-through-tunnel is nice but polling GitLab/Linear every 30–60 s is ~30 lines and works before any network setup. Build polling, add webhooks as an optimization.
5. **Gate what the agent may do** with OpenCode permissions config — same as the pipeline skill's hard rules, plus refusal-on-private contexts.
