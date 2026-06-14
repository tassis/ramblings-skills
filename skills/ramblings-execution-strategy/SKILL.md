---
name: ramblings-execution-strategy
description: Execution strategy, subagent strategy, parallel execution, inline execution, implementation routing. Use when the work is understood well enough to execute but you need to decide how to execute it: inline, sequentially from a plan, with subagents, or with limited parallelism. Prefer this when orchestration choice affects speed, risk, or reviewability.
---

# Ramblings Execution Strategy

Use this skill when the task is clear enough to execute, but the execution method is still a decision.

This skill helps choose between:

- inline execution in the current session;
- stepwise execution from a plan;
- handing bounded work to subagents;
- limited parallel execution for independent slices.

## Goal

Choose the smallest execution strategy that preserves quality and keeps the work reviewable.

## Default decision order

### 1. Inline execution

Prefer inline execution when:

- the change is small;
- the work is concentrated in one or two files;
- the coordination overhead would exceed the benefit of delegation.

### 2. Plan-driven sequential execution

Prefer this when:

- a written plan already exists;
- tasks depend on each other;
- you want steady progress with verification between tasks.

Usually combine this with `ramblings-implementing-plans`.

### 3. Subagent execution

Prefer subagents when:

- the task is bounded and clearly described;
- the work is non-trivial enough that delegation saves time;
- the output can be reviewed as a self-contained result.

Good candidates:

- test-file work;
- focused implementation in one folder;
- isolated documentation generation;
- clearly scoped investigation.

### 4. Parallel execution

Prefer parallel execution only when:

- subtasks are truly independent;
- integration order is already understood;
- each parallel lane can succeed without waiting on another lane.

Good candidates:

- separate folders or components;
- independent research branches;
- implementation plus test-support work in distinct areas.

## When not to parallelize

Do not parallelize when:

- multiple tasks edit the same files or same logic seam;
- the second task depends on the exact result of the first;
- requirements are still changing;
- the overhead of explaining the task is too high.

## Execution checkpoints

Regardless of strategy, keep these checkpoints:

1. confirm the next task;
2. implement the smallest meaningful slice;
3. verify that slice;
4. decide whether to continue, review, or re-plan.

Git actions remain user-controlled. Do not commit, merge, or create branch-finalization actions unless the user explicitly asks.

## Recommended pairings

- use `ramblings-writing-plans` before orchestration if the task is still fuzzy;
- use `ramblings-implementing-plans` when executing a written plan;
- use `ramblings-requesting-code-review` after major milestones;
- use `ramblings-verification` before final completion.

## Decision cheatsheet

### Choose inline when

- one file or one narrow behavior;
- fast feedback matters more than delegation;
- you already hold the context.

### Choose subagent when

- the task can be described in a few precise sentences;
- the files are known;
- you want a compact result returned.

### Choose parallel when

- the branches are truly independent;
- merge points are obvious;
- failures in one branch should not block discovery in another.

## Output format

When recommending an approach, summarize like this:

```markdown
## Execution Strategy

**Chosen mode:** inline / sequential plan / subagent / parallel

**Why:**
- [reason]

**Scope of this step:**
- [what will be done now]

**Verification point:**
- [how this step will be checked]
```
