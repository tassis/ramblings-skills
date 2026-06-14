---
name: ramblings-implementing-plans
description: Execute implementation plan, follow .ramblings plan, multi-step project execution, planned feature delivery. Use when a written plan already exists and the next job is to execute it in small, verified steps instead of improvising. Especially useful after ramblings-writing-plans or when the user wants structured implementation from an approved plan.
---

# Ramblings Implementing Plans

Use this skill when a plan already exists and the task is to execute it safely.

This skill is for the phase after planning, not for discovering requirements or inventing a new approach from scratch.

## Expected inputs

Usually one of these exists already:

- a plan in `.ramblings/plans/`;
- an approved spec plus a clear execution checklist;
- a user-approved ordered task list.

If there is no real plan yet, stop and use `ramblings-writing-plans` first.

## Goal

Implement the plan without drifting away from it, while still adapting when reality disagrees with the document.

## Execution style

Follow these rules:

1. Work in small steps.
2. Keep one active task at a time.
3. Verify after meaningful changes.
4. Do not mix unrelated cleanup into planned work.
5. If the plan is wrong or stale, update the plan instead of silently freelancing.
6. Do not create commits unless the user explicitly asks.

## Basic flow

### 1. Read the plan fully

Before editing, understand:

- the goal;
- the task order;
- the files involved;
- the verification strategy;
- any risks or assumptions.

### 2. Choose the next concrete task

Do not execute the whole plan at once.

Pick the next smallest meaningful task and focus on that slice only.

### 3. Check reality before coding

Before implementing a task, confirm:

- the referenced files still exist;
- the code still roughly matches the assumptions;
- the task is still valid in the current branch/state.

If reality has changed, update the plan or record the deviation.

### 4. Implement narrowly

- do the minimum needed for the current task;
- avoid opportunistic redesign;
- keep changes scoped to what the task requires.

### 5. Verify immediately

Run the task-specific checks from the plan.

If the plan lacks explicit checks, add the smallest meaningful verification for the changed area.

### 6. Record progress

Keep task tracking current.

If the plan uses checkboxes, update them.
If you discover a blocker, note it clearly rather than skipping ahead invisibly.

## When to stop and re-plan

Stop execution and go back to planning when:

- the plan assumptions are no longer true;
- one task reveals significantly different architecture than expected;
- the codebase requires a different order of operations;
- new risk appears that should be discussed first.

Use `ramblings-writing-plans` to revise the plan when needed.

## Verification posture

After each meaningful task:

- run the specific tests or commands tied to that task;
- if automated checks are weak, perform explicit manual verification;
- do not wait until the very end to discover obvious breakage.

Before calling the overall work complete, use `ramblings-verification`.

## Related skills

- use `ramblings-systematic-debugging` if execution turns into root-cause investigation;
- use `ramblings-requesting-code-review` after meaningful implementation milestones or before final handoff;
- use `ramblings-receiving-code-review` when feedback comes back and changes are needed.

## Good execution summary format

When reporting progress, prefer:

```markdown
## Progress Update

**Completed:**
- [task or step]

**Verified:**
- `command` — result

**Blocked / Changed:**
- [issue or plan deviation]

**Next:**
- [next task]
```

## What not to do

- Do not treat the plan as optional suggestion text.
- Do not improvise large design changes without reflecting them in the plan.
- Do not batch many risky tasks before verifying.
- Do not declare the plan complete just because code was written.
- Do not commit, merge, or finalize branches by default.
