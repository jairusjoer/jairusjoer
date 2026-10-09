# 01 — Event sources

The system has two trigger points. Both platforms support both.

## Linear

Docs: <https://linear.app/developers/webhooks>

- Configure in **Settings → Administration → API** (needs workspace admin). Team-scoped if you pass `teamId` at creation.
- Data-change events fire for Issues and Comments (among others). Payload shape:

```json
{
  "action": "update",            // create | update | remove
  "type": "Issue",
  "data": { "stateId": "...", "title": "...", "identifier": "TEAM-123", "url": "..." },
  "updatedFrom": { "stateId": "previous-state-id" },   // only on update
  "actor": { ... },
  "organizationId": "..."
}
```

- **Ticket moved to To Do** = `type: "Issue"`, `action: "update"`, `updatedFrom.stateId !== data.stateId`, and the new `stateId` maps to a state whose `type` is `"started"` (fetch states once via GraphQL to build a map).
- Signature: `Linear-Signature` header = HMAC-SHA256 of the **raw body** with the webhook secret (constant-time compare). `Linear-Delivery` UUID is your dedup key. `@linear/sdk/webhooks` ships `LinearWebhookClient` doing verify + typed handler.
- Gotcha: verify against the raw body _before_ any body-parser middleware.

## GitLab

Docs: <https://docs.gitlab.com/user/project/integrations/webhook_events/>

Project-level webhook (admin of the project), events to enable: **Work item / Issue events** + **Pipeline events** (+ optionally Job events).

- Issue/Work-item event: `X-Gitlab-Event: Issue Hook`, `object_attributes.action` ∈ `open|close|reopen|update`, `object_attributes.state_id` / labels show transitions. For "moved to To Do" you'll usually filter on the `changes.state_id` field of update payloads.
- Pipeline event: `X-Gitlab-Event: Pipeline Hook`, `object_attributes.status` ∈ `success|failed|running|...`, `object_attributes.sha|ref`, plus `builds` with per-job status. The failing job's log is then fetched via the API (`GET /projects/:id/jobs/:job_id/trace`) — the webhook gives you the job IDs.
- Auth: **secret token header** (`X-Gitlab-Token`), plain string comparison. No per-payload signature.

## GitHub

- Configure via repo Settings → Webhooks (or the API). Events of interest: `workflow_run`, `check_suite`, `pull_request` (CI status via `check_suite.conclusion`), `issues` (assignments/labeled) if GitHub doubles as the ticket tracker.
- Signature: `X-Hub-Signature-256` = HMAC-SHA256 of raw body; `X-GitHub-Delivery` for dedup.
- GitHub strongly expects a public HTTPS endpoint → tunnel (or smee.io for dev). Failing job logs via `gh run view --log`.

## Common filtering needs (all platforms)

1. `action`/`type` filter — most events are irrelevant.
2. Actor filter — ignore events caused by your own bot (e.g. the agent closing tickets, CI triggered by the agent's own push, loops). Compare actor IDs / bot user IDs.
3. Dedup on the delivery ID (webhooks retry delivery; linear & github retry on non-2xx).
4. Repo/team allowlist so stray webhooks don't spawn agents.
