# jjjunior

Runs local Claude Code agents for cards on a GitLab group board (`GITLAB_GROUP`), with a human review at the end.

The board's lists are **work item statuses** (To do, In progress, In Review, …), not labels. Moves are detected by polling one GraphQL query every 30 seconds. That query covers every project in the group, needs no webhook, tunnel or public endpoint, and misses nothing while the machine is off.

## Flow

Only issues that are **assigned to `ASSIGNEE`**, carry the **`TRIGGER_LABEL`** (`claude`, opt-in) and are in the **current iteration** are touched.

```text
To do ───────────▶ In progress   implementer agent (worktree, branch issue-<iid>, commits)
                     └─▶ push + draft MR ("Closes #iid", assigned to you)
                     └─▶ wait for CI; failed → job logs back to implementer (max MAX_ROUNDS attempts)
                  ▶ In Review     adversarial reviewer agent (read-only, fresh context)
                     ├─ rejected → findings comment → In progress → implementer (resumed)  … max MAX_ROUNDS
                     └─ approved → "✅ Loop completed" → stays In Review for the human

moved into In Review by a human ─▶ adversarial review of the existing branch (same loop from there)
```

Every outcome that needs a person ends up in **In Review** with a comment: approved, blocked on a question, review round cap reached, CI still failing, failed, or no commits. To retry or ask for changes, comment on the issue and move it back to **To do**. The next run reuses the branch and MR, and its prompt includes the whole discussion.

## Rules

| Board state                                                              | Action                        |
| ------------------------------------------------------------------------ | ----------------------------- |
| status **To do**                                                         | start implement ⇄ review loop |
| moved **into In Review** by a human                                      | start adversarial review      |
| closed, unassigned, label removed, or another status while an agent runs | abort agent                   |
| closed                                                                   | remove worktree               |

- The orchestrator's own status moves never trigger anything. It records them and skips poll data that is older than its last move.
- Agents write code and the orchestrator moves tickets: statuses, comments, push and MR are handled in code. Agents return JSON checked against a schema.
- CI gate: after each push the orchestrator waits for every pipeline on that commit (push and MR pipelines). Failed jobs' log tails go back to the implementer, which must fix the root cause and must not skip or disable tests. If no pipeline appears within 3 minutes, the repo is treated as having no CI. `PIPELINE_TIMEOUT_MIN=0` turns the gate off.
- One git worktree per issue, at most `MAX_PARALLEL` runs at once, `AGENT_TIMEOUT_MIN` per agent.

## Setup

```sh
glab auth login              # api scope; agents and orchestrator both use glab
cp .env.example .env
pnpm install && pnpm nx run jjjunior:typecheck
pnpm nx run jjjunior:start    # Node ≥ 23.6 runs .ts natively
```

Create the `claude` label in the group once, then add it to any issue you want an agent to take.

## Known limits

- Run state is kept in memory. If the process dies mid-run, the issue stays in In progress; move it back to To do.
- When the process starts, issues already sitting in In Review are not reviewed. Only moves seen while it runs count.
