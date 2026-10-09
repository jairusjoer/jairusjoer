# 03 — Local delivery, reliability, security

## How do webhooks reach a laptop?

| Option                          | Effort    | Notes                                                                                                                                                                         |
| ------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Polling (recommended first)** | ~30 lines | `gitlab_list_pipelines`/`github_pr checks`/Linear GraphQL every 30–60 s with a cursor timestamp. No public URL, survives sleep/reboots naturally.                             |
| **Cloudflare named tunnel**     | low       | `cloudflared tunnel route dns` → stable `hooks.yourdomain.com` → `http://localhost:PORT`. Free, works offline of account quirks. Best webhook option if you have a CF domain. |
| ngrok                           | low       | free tier has one static domain; inspect/replay requests is handy for dev.                                                                                                    |
| smee.io / relays                | lowest    | dev-only quality (no signature guarantees, can drop); fine for prototyping.                                                                                                   |

**Recommendation:** implement both — a polling reconciler is the correctness primitive (it also recovers missed webhooks); a tunnel + signature-verified endpoint is the fast path that removes the 30–60 s latency.

## Reliability rules

1. **Webhooks are at-least-once, not exactly-once.** Both Linear and GitLab retry deliveries. Dedup on `Linear-Delivery` / `X-Gitlab-Token`+event id / `X-GitHub-Delivery` — store recent IDs.
2. **Laptop-asleep gap.** Anything that happened while you're away must be recoverable purely from the retryer/reconciler. Sentinel rule: worktree alive ⇒ agent session concept (session id, attempt count) persisted on disk. The session id _is_ the resume point; there is no "reactivation within the same session process" to worry about.
3. **Reconciler beats event handler.** Twice a minute or once a minute, polling: does this MR have a red head-pipeline with attempt < cap and no active OpenCode round? That statement, not the webhook, is the source of truth. Webhooks make the reconciler cheap to reach and near-instant.
4. **Debounce.** Users drag tickets across 3 columns in 5 seconds → Linear sends 3 webhooks. Coalesce on (ticket, event-kind) with a 5–15 s debounce before forking the agent; pick the **latest** intent (`last-state wins`).
5. **Per-event timeouts & dead-lettering.** Wrap each agent round in a timer (e.g. 15 min). Log ring buffer / files under `~/.local/state/<daemon>/`.

## Security

- **Verify HMAC signatures** against the raw body before JSON parse:
  - Linear: `Linear-Signature` = HMAC-SHA256(body, secret).
  - GitHub: `X-Hub-Signature-256`.
  - GitLab: `X-Gitlab-Token` constant-compare.
  - Rotate secret per endpoint; treat the secret as a credential in the OS keychain, not in the repo.
- Never include the orchestrator's tokens in the agent's environment. Agent gets CI **logs** and URLs, not API tokens. If the agent needs to push (it does), the git remote credential is the git provider's own mechanism (SSH agent / macOS keychain) — that's a scope decision you must consciously accept.
- Branch/label allowlist: only tickets labeled e.g. `agent-todo` and repos in the allowlist trigger spawns — protects against accidental MDM-wide loops.
- The loops themselves run a git remote — a user-error vector. Constrain: `--permissions` config (no `webfetch` surprise, no admin endpoints) and keep AGENTS/hard-rule scope tight like the pipeline skill.

## State

`~/.local/state/agent-orchestrator/state.json` (or SQLite):

```json
{
  "TEAM-123": {
    "sessionId": "ses_abc",
    "worktree": "/path/repo-TEAM-123",
    "branch": "TEAM-123",
    "mrUrl": "https://gitlab.com/.../-/merge_requests/42",
    "attempt": 2,
    "round": "ci-fix",
    "lastCiSha": "abc123",
    "lastEventId": "uuid",
    "status": "waiting-for-ci | implementing | awaiting-human | done | capped"
  }
}
```

Atomic writes (tmp+rename). One ticket-row per concurrent task — also gives you observability: a `TUI`/web dashboard over this file is a ~100-line addition and is where you'd surface OpenCode's SSE stream.
