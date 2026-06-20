# Architecture

This page explains the internal structure behind the ramblings plugin.

Read this after README if you want the implementation model, surface boundaries, or plugin/runtime contract details.

## Layers

### `skills/`

Contains the actual `ramblings-*` skills. These define workflow guidance such as brainstorming, brief writing, ready checks, debugging, review, and challenge workflows.

See `docs/skills.md` for the current taxonomy, routing rules, and overlap guide.

### `plugin/`

Contains an OpenCode plugin that registers this repo's `skills/` path, injects optional commands into live config, injects the custom `conductor` planning agent, and exposes a small top-level custom-tool surface for `start-work`.

## Workflow lifecycle

The intended framework lifecycle is:

1. discussion / shaping
2. brief writing / converged discussion capture
3. planning
4. execution
5. review
6. handoff / ready-check
7. archive / cleanup

These are not separate products. They are different phases of the same workflow framework.

## Design decisions

- The plugin does **not** inject a global workflow bootstrap.
- The plugin does **not** override user-defined commands of the same name.
- The plugin does **not** override a user-defined `conductor` agent if one already exists.
- The plugin does **not** perform git actions.
- Commands are lightweight prompt shortcuts that encourage the right `ramblings-*` skill usage.
- `conductor` is the repo-owned planning surface; native `@plan` behavior remains outside this repo's contract.
- `Reviewer` / `reviewer` is the shared callable review agent; reviewer persona still comes primarily from the selected review skill.
- `start-work` has a small tool-backed mechanical surface for deterministic state operations, supports post-completion / half-automatic re-entry, but it is not a full runtime scheduler.
- `/start-work` now treats archive cleanup as a startup gate: it resolves safely-packagable completed/cancelled work units first, archives them under `.ramblings/archive/`, cleans active-area copies, and only then resumes unfinished work.
- `ready-check` and `archive` are command-first lifecycle entrypoints layered on top of the existing skills.
- The plugin-exposed helper tools use repo-prefixed names (`ramblings_start_work_*`) as the supported runtime surface.

## Surface taxonomy

- **skill**: capability, context, method, persona, and boundary definition
- **agent**: stable role surface with explicit permissions or reusable operational posture
- **tool**: deterministic operation callable by an agent
- **command**: convenience entrypoint into the right workflow surface

This repo intentionally uses all four surfaces together rather than collapsing everything into one mechanism.

## Stable vs evolving surfaces

More stable at the conceptual level:

- project-root `.ramblings/` artifacts
- `start-work` as execution entrypoint
- review / handoff / ready-check / archive as workflow phases
- `Reviewer` as the shared callable review agent surface

More likely to evolve internally:

- exact helper layout
- exact tool list
- exact agent prompt wording
- exact command wording

## Current command-surface boundary

This repo's command hardening is currently contract-driven, not runtime-engine-driven.

- `handoff`, `resume-from-handoff`, and `start-work` can define artifact rules, selection ladders, and stop conditions in their prompt surfaces.
- `start-work` is now gaining helper-backed control logic under `plugin/start-work/` plus top-level plugin custom tools for artifact resolution, structured blocker recording, and continuation decisions, while simple checklist begin/complete transitions may still be written directly.
- The supported runtime path is currently **post-completion / half-automatic re-entry**: completion can become observable, checklist state can be reconciled, and continuation can be rerun from persisted state.
- These command surfaces still do **not** provide a full standalone runtime scheduler or executor, and they do **not** claim a first-class pre-stop auto-reenter callback.
- Determinism currently comes from clearer artifact contracts plus explicit helper-backed control rules and a small set of decision/validation helpers, not from a deeper runtime engine.

## Start-work execution boundary

The intended `start-work` model is:

- route `/start-work` to a dedicated execution orchestrator;
- do **not** reuse the planning-only `conductor` for execution;
- prefer subagent-first execution for bounded, specialist-shaped, independently finishable work;
- keep orchestrator-direct work narrow: control-plane operations, terminal reconciliation, verification, and very small synchronous checks;
- keep first-iteration execution single-task, single-lane, and sequential by default;
- treat YAML checklists under `.ramblings/checklists/` as the durable execution-state source of truth.

If the host/plugin environment cannot yet hard-bind `/start-work` to a dedicated execution agent, the command surface should still behave as though that execution-orchestrator contract exists.

If no reliable automatic re-entry hook is available at completion time, the fallback remains explicit `/start-work` resume or equivalent session continuation from the persisted checklist state.

Consider a deeper runtime/helper implementation later if:

- multi-handoff ambiguity remains common in real usage;
- delegated execution still drifts even with YAML checklist + helper-backed control logic;
- prompt-level selection still produces inconsistent results;
- or the host/plugin environment gains a better structured mechanism for artifact discovery and ranking.

## Installation model

The repo supports both git-backed plugin installation and direct local plugin-path development. The layout keeps the same `skills/` and `plugin/` split in either case so the command surface and skill paths stay stable.
