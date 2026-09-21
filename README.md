# Hello there!

I am Jairus Joer, a Developer and Designer based in Germany with 8+ years of experience. I care deeply about software that feels thoughtful in every layer: clear in its structure, expressive in its interface, respectful of the people who use it, and deliberate in the way it supports real work.

The work I delight in most sits at the intersection of user experience, accessibility, design systems, and developer experience. I enjoy shaping systems that make taste practical, whether through refining interfaces, building resilient foundations, or creating tools that disappear into the flow of thought.

Previously at HERO Software, I led the adoption of design systems, monorepo orchestration and platform modernisation across multiple engineering teams. Currently at BWI, I am supporting Germany’s digitalisation efforts by developing open-source software for various connected codebases.

---

Head to [jairusjoer/jairusjoer](https://github.com/jairusjoer/jairusjoer) to discover my projects.

---

## Workspace

An Nx monorepo managed with pnpm. Apps live in `apps/`:

- `jairusjoer.com`: Personal website (Astro, React, Tailwind; Playwright a11y suite)
- `design-system-primer`: Design system playground (Astro, React, StyleX)

```sh
pnpm install                    # install workspace dependencies
pnpm nx run <project>:<target>  # e.g. pnpm nx run jairusjoer.com:dev
pnpm build                      # build all projects (nx run-many)
pnpm typecheck                  # typecheck root configs and all projects
pnpm lint                       # lint the workspace with ESLint
pnpm format                     # format with Prettier
```

Conventions for CI, releases, and commits are documented in [AGENTS.md](./AGENTS.md).
