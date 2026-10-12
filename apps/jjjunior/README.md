# jjjunior — webhook coding-agent orchestrator

Provider-agnostic daemon that watches a ticketing board (Linear/GitLab/…) and an SCM (GitLab/GitHub), and drives [OpenCode](https://opencode.ai) sessions through a ticket→worktree→push→CI loop, in `human_in_the_loop` or `fully_autonomous` mode.

Research & design docs: [research/webhook-coding-agent](./research/webhook-coding-agent/README.md) — start at 04-prototype-plan.md, build against 05-implementation-checklist.md.

## Stack

- **Runtime**: Node (tsx in dev, tsc for build)
- **Effect v4** (`effect` + `@effect/platform-node`) for structured errors, Layers/DI, schedules & timeouts
- **Hono** (`hono` + `@hono/node-server`) for the webhook receiver (`POST /hooks/<providerKey>`)
- **OpenCode** server API via `@opencode-ai/sdk` (client subpath)

## Configuration

Jjjunior is the single provider-agnostic config at `src/jjjunior.config.ts`: provider names appear only there
(adapter entries) — never in core code. Adapter secrets come from env vars referenced via `secretEnv`.

## Commands

```sh
pnpm nx run jjjunior:dev        # tsx watch
pnpm nx run jjjunior:build      # tsc → dist/
pnpm nx run jjjunior:typecheck
```
