---
name: ramblings-workflow
description: End-to-end project workflow, feature workflow, new subproject planning, website planning, app planning, spec to implementation flow. Use when the user is starting a substantial project or feature from discussion through design, spec, implementation planning, and execution, especially when they already mention architecture, stack choices, project creation, or a full build-out. Do not use for bug triage, one-off spec writing, or standalone verification.
---

# Ramblings Workflow

Use this skill as the full-flow entry point when the user is clearly starting a substantial project or feature and expects an end-to-end process.

This skill is for cases like:

- designing a new website or app from scratch;
- creating a new subsystem on top of an existing codebase;
- discussing requirements first, then writing spec, then planning implementation;
- starting with stack decisions such as framework, UI library, runtime, or deployment approach.

This workflow coordinates the full path:

1. discussion / requirement shaping;
2. spec writing;
3. implementation planning;
4. execution;
5. verification.

It should not trigger for every maintenance task. For one-off spec work, bug investigation, or final verification, prefer the narrower ramblings skills directly.

## Artifact locations

When you create written artifacts, place them here:

- specs / design notes: `.ramblings/specs/`
- implementation plans: `.ramblings/plans/`
- review notes: `.ramblings/reviews/`
- debugging notes / reproductions: `.ramblings/debug/`

Create directories only when needed.

## Artifact locations

When you create written artifacts, place them here:

- specs / design notes: `.ramblings/specs/`
- implementation plans: `.ramblings/plans/`
- review notes: `.ramblings/reviews/`
- debugging notes / reproductions: `.ramblings/debug/`

Create directories only when needed.

## Workflow phases

### 1. Requirement shaping and spec work

Use `ramblings-spec-writing` when:

- the user is still discussing what to build;
- they want a spec or design doc first;
- implementation is not yet approved;
- stack and constraints are still being decided.

If the overall task is clearly end-to-end, this workflow can begin there and continue forward instead of stopping after the spec.

### 2. Multi-step implementation planning

Use `ramblings-writing-plans` when:

- the spec is good enough to execute;
- the task spans multiple files or phases;
- the work needs an ordered plan before editing.

### 3. Bug, test failure, or unexpected behavior

Use `ramblings-systematic-debugging` when:

- behavior is broken or surprising;
- you do not yet know the root cause;
- the temptation is to patch symptoms.

### 4. Before claiming completion

Use `ramblings-verification` when:

- you are about to say the task is done;
- you changed behavior in a risky area;
- test coverage is weak and you need to state what was actually verified.

## Recommended full-flow sequence

For end-to-end project or feature work, prefer this sequence:

1. Clarify goals, constraints, and stack.
2. Write a spec in `.ramblings/specs/`.
3. Get approval or alignment on the spec.
4. Write an implementation plan in `.ramblings/plans/`.
5. Execute in small tasks.
6. Verify explicitly before claiming completion.

## When not to use this workflow

- Do not use this skill for a standalone bugfix if the user just wants debugging.
- Do not use this skill for spec-only exploration with no implementation intent yet.
- Do not use this skill when only final verification is needed.

## Guidance

- keep the user in the loop during discussion and spec stages;
- do not jump into implementation before the shape of the work is clear;
- use the narrower ramblings skills once the task enters a specific phase.
- do not create commits, merges, or branch-finalization actions unless the user explicitly asks.

If the task turns out to be narrower than expected, stop using this umbrella workflow and switch to the specific skill that matches the current phase.
