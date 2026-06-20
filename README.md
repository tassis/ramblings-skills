# ramblings

Ramblings is an OpenCode workflow plugin for structured product and engineering work.

It combines agents, skills, commands, and project-root `.ramblings/` artifacts into one workflow system for:

- discussion and brief writing
- implementation planning
- execution
- review
- handoff and resume
- archive and cleanup

Install the plugin, use the command entrypoints when they fit, and let `.ramblings/` artifacts keep work resumable across sessions.

## What you get

- **Commands** for common workflow entrypoints such as `office-hours`, `start-feature`, `write-brief`, `write-plan`, `start-work`, `challenge-me`, and `handoff`
- **Agents** for stable planning and review roles: `@conductor` and `@reviewer`
- **Skills** for workflow phases such as brainstorming, brief writing, planning, execution, debugging, review, and archive
- **Project-root `.ramblings/` artifacts** that keep plans, checklists, handoffs, debug notes, retros, and archive state durable

## Typical lifecycle

1. discuss or shape the work
2. write the brief down
3. turn it into an implementation plan
4. execute from the plan
5. review and verify
6. hand off, resume later, or archive when complete

## Principles

- no automatic commits, merges, or PR creation
- no global bootstrap mode
- skills are manually or contextually invoked, not forced globally
- commands are convenience entrypoints, not hidden workflow overrides

## Install from git-backed plugin spec

Add this to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "ramblings@git+https://github.com/tassis/ramblings.git"
  ]
}
```

Restart OpenCode after changing config.

## Local development install

If you are testing from a local clone instead of GitHub, you can still use a direct plugin path:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/workdir/ramblings/plugin/ramblings-plugin.ts"
  ]
}
```

## Positioning

Ramblings should be thought of as a workflow plugin for OpenCode.

It uses:

- **skills** for workflow semantics and routing
- **agents** when a stable role or permission boundary matters
- **commands** when a common entrypoint should be easier to invoke
- **`.ramblings/` artifacts** when workflow state should remain durable and resumable

## What do I use when?

- early discussion or feature shaping → `office-hours`
- write down a converged discussion brief → `write-brief`
- turn an approved direction into execution tasks → `write-plan`
- execute an existing plan → `start-work`
- challenge a plan or idea from multiple angles → `challenge-me`
- preserve resumable context → `handoff` or `resume-from-handoff`
- summarize readiness → `ready-check`
- clean up and archive finished work → `archive`

## Stable vs evolving

Most stable concepts:

- project-root `.ramblings/` as durable workflow state
- `start-work` as the main execution entrypoint
- review, handoff, ready-check, and archive as workflow phases

More likely to evolve:

- exact helper layout under `plugin/start-work/`
- exact tool inventory
- exact agent prompt wording
- exact command phrasing

## Commands provided by the plugin

- `office-hours`
- `start-feature`
- `careful`
- `challenge-me`
- `grill-me`
- `handoff`
- `resume-from-handoff`
- `retro`
- `investigate`
- `ready-check`
- `archive`
- `write-brief`
- `write-plan`
- `start-work`

`start-work` is the main execution entrypoint. It operates against project-root `.ramblings/` artifacts, prefers a YAML checklist as the durable execution-state source of truth, and now has a small deterministic custom-tool surface for mechanical state operations. On entry it first resolves completed/cancelled cleanup candidates: safe ones are auto-archived and removed from the active area before unfinished work resumes, while unsafe or ambiguous cleanup stops for explicit operator input. Broader cleanup, consolidation, or source-of-truth ambiguity still belong to the explicit `archive` command.

When those helper tools are called directly, use the repo-prefixed names:

- `ramblings_start_work_resolve`
- `ramblings_start_work_record_blocked`
- `ramblings_start_work_rerun_continuation`

Simple checklist begin/complete transitions may be written directly; the retained helpers are for non-trivial start-work decisions and structured blocker recording.

## Skill taxonomy

For the routing guide, overlap rules, and linked skill index, see [`docs/skills.md`](docs/skills.md).

Completed execution artifacts may be moved under project-root `.ramblings/archive/` so active execution discovery can ignore stale plans and checklists.

Archive should happen only after the work is no longer an active execution candidate.

`ready-check` is the command-first readiness gate before making a readiness claim.

`archive` is the explicit operator-facing cleanup/consolidation entrypoint.

## Agent provided by the plugin

- `conductor` / `@conductor` — planning-only custom agent for project-root `.ramblings/` artifacts
- `reviewer` — shared callable review agent for skill-driven product, engineering, QA, and DevEx review

Use Conductor when you want a planning surface that can write:

- `.ramblings/plans/**`
- `.ramblings/briefs/**`
- `.ramblings/checklists/**`
- `.ramblings/handoffs/**`
- `.ramblings/debug/**`
- `.ramblings/retros/**`

without entering implementation.

Use Reviewer (`@reviewer`) when you want a stable shared review agent for direct single-lens review, with the selected review skill supplying persona, skepticism, and recommendation shape.

Preferred style: ask for the review angle in natural language, for example:

- `@reviewer` — review this plan from the engineering perspective
- `@reviewer` — review this proposal from the product perspective
- `@reviewer` — review this change from the QA perspective

Use `challenge-me` when you want structured multi-perspective pressure testing through the shared `Reviewer` surface. When multiple lenses are selected, it should instantiate one independent reviewer lane per lens before synthesis.

Use `grill-me` when you want one-question-at-a-time interrogation to reduce ambiguity before committing to a brief, plan, or implementation direction.

See `docs/commands.md` for details.
