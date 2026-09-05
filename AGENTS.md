<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## CI Conventions (GitHub Actions)

How to handle CI files for apps in this monorepo:

- **One generic verify workflow.** `.github/workflows/ci.yml` is the only PR/push verification workflow (formatting, lint, typecheck, build, a11y). It must stay project-agnostic: workspace-level checks run at the root, everything app-specific runs via `pnpm exec nx affected -t <task>`. It must not hardcode project names or app paths. Adding a new app requires zero edits to `ci.yml`.
- **Apps opt into CI through Nx targets.** Standard target names consumed by `ci.yml`: `typecheck`, `build`, `a11y` (Playwright projects also provide `install-browsers`). If CI needs to do anything to an app, it must be reproducible locally as `pnpm nx run <project>:<target>` — put the logic in an app target, package script, or script file inside the app (see `apps/jairusjoer.com/actions/open-graph.sh`).
- **Shared setup is a composite action.** Every workflow job runs `actions/checkout` first, then `./.github/actions/workspace-setup` (pnpm + Node + frozen install). Don't repeat those steps inline. The checkout can't live inside the composite action: GitHub resolves local `uses: ./...` actions from the runner workspace, which is empty until the repository is checked out.
- **App-owned automation gets its own file**, named `<app-slug>-<concern>.yml` where `<app-slug>` is the Nx project name in lowercase with non-alphanumeric runs collapsed to `-` (e.g. `jairusjoer-com-open-graph.yml`). Deploy/generation/publishing pipelines live there, never in `ci.yml`. Such a workflow may reference its own project by name (unlike `ci.yml`).
- **Triggers stay narrow.** App workflows use `paths:` filters covering the app directory, its inputs (e.g. scripts/actions), and the workflow file itself, plus `workflow_dispatch` for manual runs. Commit-pushing workflows must guard against self-triggering (see the `ci:` commit-message check in `jairusjoer-com-open-graph.yml`).
- **Caching:** Nx's local task cache covers task outputs (Nx Cloud stays disabled via `neverConnectToCloud`); Actions caches are only for tool binaries such as Playwright browsers, keyed on `hashFiles('pnpm-lock.yaml')`.
- **Artifacts and secrets:** failure artifacts use workspace-wide globs (e.g. `apps/**/playwright-report`), not per-project paths. Secrets are named with the uppercased app slug prefix, e.g. `JAIRUSJOER_COM_*`.
- **Housekeeping:** every workflow declares least-privilege `permissions` and a `concurrency` group named after the workflow file; workflows using `nx affected` must check out with `fetch-depth: 0` and run `nrwl/nx-set-shas@v5`.
