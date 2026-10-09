# 04 — Prototype plan

## MVP architecture

```txt
┌────────────┐   webhook/poll   ┌───────────────────────────┐   spawn prompt    ┌─────────────────┐
│ Linear /   │ ───────────────▶ │  orchestrator (local      │ ────────────────▶ │ OpenCode head-  │
│ GitLab / GH│                  │  daemon; one TS file,     │  (server API or   │ less run / SDK  │
└────────────┘                  │  express receiver +       │   opencode run)   └──────┬──────────┘
      ▲  ticket update, MR      │  state.json + reconciler  │                          │
      │  close                  └─────────┬─────────────────┘                          │ worktree, push,
      │                                  │ reconcile loop                             │ MR, follow-ups
      └──────────────────────────────────┘                                            ▼
                                                                    Git/Lab platform + CI (webhook loops back)
```

One Node/Bun daemon, single binary-ish, no queue broker needed if you accept "one ticket = one JSON row on disk". npm deps: `express` (or Bun.serve), platform SDKs (`@linear/sdk`, gitlab-api client or raw fetch), `@opencode-ai/sdk`/`@opencode-ai/client` (opencode client).

## Build phases

**Phase 1 — polling-only closet (0.5–1 day).**
No tunnel, no webhook. Cron-ish loop every 60 s:

1. Linear/GitLab: find tickets in To Do with the allowlist label, no `sessionId`.
2. `spawn_opencode_run(ticket)` using the pipeline-skill prompt; write `sessionId`/worktree/branch/MR URL; comment on ticket "picked up by agent, session <id>".
3. On MR open: poll CI; if red → after cap round, send `opencode run -s <id> "CI failed..."; comment on ticket`.
   Ship this, run it on 2–3 real tickets. This alone proves the whole loop.

**Phase 2 — webhooks for latency (~0.5 day).**
`cloudflared` named tunnel + express endpoint; HMAC verify; dedup table; debouncer; replace the "ticket was picked up" poll trigger with the push trigger (keep polling as reconciler only).

**Phase 3 — polish (1 day).**

- concurrency cap, attempt caps, no-progress detection,
- `GET /event` SSE tail → log file per session for debugging,
- small status UI / `opencode` dashboard over state.json,
- GitLab self-hosted if applicable + GitHub parity.

## Rough code shape (server-API flavor)

```ts
// receiver.ts (skeleton)
app.post("/hooks/linear", rawBodyParser, hmacMiddleware, dedupMiddleware, async (req, res) => {
  res.sendStatus(202) // ack fast; do work async
  const ev = req.body
  if (ev.type !== "Issue") return
  if (ev.action !== "update" || !ev.updatedFrom?.stateId) return
  if (!stateMap.isTodo(ev.data.stateId)) return   // e.g. new state type = "started"
  if (!allowlist.has(ev.data.teamId)) return
  debounced.enqueue(ev.data.identifier, 10_000, () => startTicket(ev.data.identifier))
})

async function startTicket(key: string) {
  const wt = makeWorktree(key)                       // pipeline step 1, shared helper
  const s = await oc.sessions.create({ location: { directory: wt } })
  state.save(key, { sessionId: s.id, ... })
  await oc.sessions.prompt({ sessionID: s.id, text: pipelinePrompt(key) })  // steps 0–7
  state.update(key, { status: "waiting-for-ci" })
}

async function onCiFailed(key: string, log: string) {
  const st = state.get(key); if (st.attempt >= 3) return
  await oc.sessions.prompt({ sessionID: st.sessionId,
    text: `CI failed (attempt ${st.attempt + 1}). Failing job log:\n${log}\nFix, push, re-open MR, report.` })
  state.update(key, { attempt: st.attempt + 1, status: "waiting-for-ci" })
}
```

## Risks / open questions

1. **Agent reliability in the fix loop** is the real risk, not the plumbing. The pipeline skill's step-7 discipline (read log, minimal fix, re-run gates) helps; still expect some tickets to hit the cap.
2. **CI webhook tokens** live on the ticket platform; if anything leaks, rotate. The agent should never see them.
3. **Laptop sleep pauses everything** — acceptable for personal use; if uptime matters, move the orchestrator (not the agent!) to a $5 VPS / NAS and keep OpenCode local or also remote.
4. **Cost**: N retry rounds × long-context sessions; the reuse-a-session design mitigates somewhat; monitor per-ticket.
5. **Race: user edits ticket while agent works** — pick a rule (agent wins until CI end, or agent aborts when ticket returns to backlog) and surface it in the ticket comment trail.
6. Existing prior art validating the pattern: GitLab Duo's `fix_pipeline/v1` flow (starts a session from a failed pipeline URL — exactly your round-2 concept), GitHub Copilot coding agent (issue→PR→CI→fix loop), and `imnatann/opencode-auto-batch` (OpenCode server + session resume orchestration).
