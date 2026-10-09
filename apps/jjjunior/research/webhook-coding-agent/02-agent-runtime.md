# 02 — Agent runtime (OpenCode)

OpenCode exposes three automation surfaces; the orchestrator can use any of them (they share one session store when running against the same server).

## 1) Headless CLI — simplest

```sh
opencode run "Implement ticket TEAM-123 ..." --agent build   # first round
opencode run --session <id> "CI failed: <log>. Fix and repush."   # follow-up round
```

- `opencode run [message..]` runs one prompt non-interactively and prints the result — designed for scripting/CI.
- `--session <id>` (-s) / `--continue` (-c) resume an existing session. `--fork` branches it.
- `--agent` / `-m provider/model` pin the agent+model.
- Spawn via `child_process.spawn` from the orchestrator, capture stdout, use the exit code as a success signal.

## 2) Server API — better for this system, because it's already running by default

`opencode` spawns/stays as a local background server per user account; clients talk HTTP. Endpoints that matter:

| Endpoint                                      | Purpose                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `POST /session`                               | create a session (per ticket)                                           |
| `POST /session/:id/message`                   | send prompt **and wait for response** — the implementation round        |
| `POST /session/:id/prompt_async`              | fire-and-forget alternative                                             |
| `POST /session/:id/abort`                     | cancel a runaway round                                                  |
| `GET /session/:id/diff`                       | review the agent's changes                                              |
| `GET /session/:id/todo`                       | progress inspection while implemented                                   |
| `GET /event` (SSE)                            | live event stream (tool calls, message updates) — useful for logging/UX |
| `POST /session/:id/permissions/:permissionID` | approve/deny permission prompts non-interactively                       |

You can either `opencode --server http://localhost:4096` connect to the shared server, or start/own a server yourself.

## 3) Embedded SDK — max control

```ts
import { OpenCode } from '@opencode/sdk';

await using oc = await OpenCode.create();
const session = await oc.sessions.create({ location: { directory: '/path/to/worktree' } });
await oc.sessions.prompt({ sessionID: session.id, text: '...' });
for await (const ev of oc.events.subscribe()) {
  /* stream */
}
```

Also `@opencode/client` (network client) if you talk to the background server.

## Session lifecycle mapped to the pipeline skill

The existing `~/.config/opencode/skills/pipeline` steps map cleanly to webhook rounds:

- **Round 1 (ticket → To Do)**: deliver the skill's steps 0–7 as one prompt with the issue key: worktree → repro → implement → push → MR → poll CI once and report. Persist: `sessionID`, worktree path, branch, MR URL ← from `GET /session/:id` / diff + stdout parsing.
- **Round 2+ (CI failure webhook)**: same session, prompt like:
  "CI failed for branch <KEY> (pipeline <id>). failing job log: <fetched trace>. Reason per your step 7: read log, fix locally, push, re-poll, report." — session keeps the codebase context, so each retry is cheaper.
- **CI green**: close-out. Orchestrator comments on ticket/MR ("resolved in N attempts"), deletes/marks the worktree stale, ends session (park it for later reference; `DELETE /session/:id` only if truly done).

## Concurrency model

- One OpenCode session per ticket ⇒ parallel tickets run in **separate git worktrees** (the pipeline skill already uses `../<repo>-<KEY>`), so muting/git-locking is a non-issue.
- But limit parallel **rounds** (e.g. max 2 concurrent sessions): each round is token- and CPU-heavy, and two agents pushing to the same project can trigger CI-cache contention.
- Agent must not touch private credentials: OpenCode permission config (deny-file rules, `--permissions`) plus the orchestrator providing only fresh CI logs, never secrets.

## Cap + escalation

The "repeat N times until green" loop needs a **termination rule**:

- hard cap: e.g. 3 CI-fix rounds, then stop,
- no-progress cap: stop if the failing job set doesn't shrink between rounds,
- user-freeze: agent detects ambiguity → comments on MR asking a human (`/hold` style), state becomes `awaiting-human`, no further rounds until the ticket gets a "pick up" event again.

---

Prev: [01-event-sources.md](01-event-sources.md) · Next: [03-delivery-reliability-security.md](03-delivery-reliability-security.md) · Back to [README](README.md)
