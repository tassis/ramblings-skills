---
name: ramblings-implementing-plans
description: Execute a scoped .ramblings plan as the workflow orchestrator. Use when a written plan and execution state already exist and the next job is to sequence tasks, delegate safely, verify progress, and write state back without improvising the workflow. Especially useful for /start-work style execution where the orchestrator owns checklist state and delegated lanes may use separate implementation-posture skills.
---

# Ramblings Implementing Plans

Use this skill when a plan already exists and the task is to execute it safely through workflow orchestration.

This skill is for the phase after planning, not for discovering requirements or inventing a new approach from scratch.

It is primarily an execution-orchestration skill, not the implementation persona for a code-editing lane.

## Expected inputs

Usually one of these exists already:

- a plan in `.ramblings/plans/`;
- a plan in `.ramblings/plans/` plus execution state in `.ramblings/checklists/`;
- an approved brief or plan plus a clear execution checklist;
- a user-approved ordered task list.

If there is no real plan yet, stop and use `ramblings-writing-plans` first.

If there is a plan but it does not expose execution state clearly enough to resume safely, add or normalize a checklist/tracker before doing broad multi-step work.

If you are still in Conductor Mode, that normalization may write `.ramblings/plans/**` or `.ramblings/checklists/**` artifacts, but it must not spill into product-code edits.

## Goal

Execute the plan without drifting away from it, while still adapting when reality disagrees with the document.

Own:

- task sequencing;
- delegation choices;
- verification gates;
- checklist or execution-state writeback;
- blocked / waiting / replanning / handoff / ready-check routing.

Do not treat this skill as the default source of coding style, implementation persona, or domain-specific engineering judgment for delegated worker lanes.

## Execution style

Follow these rules:

1. Work in small steps.
2. Keep one active task at a time.
3. Verify after meaningful changes.
4. Do not mix unrelated cleanup into planned work.
5. If the plan is wrong or stale, update the plan instead of silently freelancing.
6. Do not create commits unless the user explicitly asks.
7. Treat execution state as part of the deliverable, not as disposable session memory.

## Execution method choices

During real plan execution, this skill owns the execution-strategy guidance for the orchestrator.

Choose the smallest method that preserves quality and keeps the work reviewable:

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

This is the default mode for normal plan execution.

### 3. Delegated subagent execution

Prefer delegated bounded work when:

- the task is clearly described;
- the work is non-trivial enough that delegation saves time;
- the output can be reviewed as a self-contained result.

Good candidates:

- test-file work;
- focused implementation in one folder;
- isolated documentation generation;
- clearly scoped investigation.

When a task is delegated to a code-editing lane, that lane may layer a separate implementation-posture skill. This skill still owns task selection, verification gates, and state writeback.

### 4. Limited parallel execution

Prefer limited parallel execution only when:

- subtasks are truly independent;
- integration order is already understood;
- each lane can succeed without waiting on another lane.

Do not parallelize when:

- multiple tasks edit the same files or same logic seam;
- the second task depends on the exact result of the first;
- requirements are still changing;
- the overhead of explaining the task is too high.

Regardless of method, keep these checkpoints:

1. confirm the next task;
2. choose the smallest meaningful execution slice;
3. verify that slice;
4. decide whether to continue, review, or re-plan.

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

Choose it from an explicit tracker, checkbox list, separate checklist file, or status field whenever one exists.

### 3. Check reality before coding

Before executing a task, confirm:

- the referenced files still exist;
- the code still roughly matches the assumptions;
- the task is still valid in the current branch/state.
- the task is not already complete according to the plan's completion criteria or current code state.

If reality has changed, update the plan or record the deviation.

### 4. Implement narrowly

Keep the execution slice narrow:

- do the minimum needed for the current task;
- avoid opportunistic redesign at the orchestration level;
- keep delegated or inline work scoped to what the task requires.

If a delegated worker lane needs stricter local code-editing restraint, use a separate implementation-posture skill rather than expanding this skill's core identity.

### 5. Verify immediately

Run the task-specific checks from the plan.

If the plan lacks explicit checks, add the smallest meaningful verification for the changed area.

### 6. Record progress

Keep task tracking current.

If the plan uses checkboxes, update them.
If you discover a blocker, note it clearly rather than skipping ahead invisibly.
If the plan only has prose tasks, add a minimal tracker or status markers before continuing deeper execution.
If the tracker and a task's `Status:` disagree, fix the plan state and use the task `Status:` plus current code reality as the source of truth.
If the plan points to a separate checklist file, use that checklist as the primary execution-state record and keep the plan references consistent with it.

## Idempotent execution posture

Treat each task as resumable work:

1. Re-read the task's completion criteria before making changes.
2. Check whether the step is already complete before re-applying edits.
3. Prefer narrowly scoped edits that can be safely re-verified.
4. Record partial progress or blockers in the plan instead of keeping them only in chat.
5. When a rerun would be destructive or duplicative, stop and update the plan with the new reality.

## Layering model

Preferred structure:

1. `/start-work` or an equivalent execution entrypoint selects the active task.
2. `ramblings-implementing-plans` owns orchestration for that task.
3. If the task is delegated to a code-editing lane, that lane may use a separate implementation-posture skill.
4. The delegated lane returns results; the orchestrator verifies and writes back checklist state.

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
- update the task status or checklist only after the verification for that task passes;
- do not wait until the very end to discover obvious breakage.

Do not mark a task complete based on code edits alone.

Before calling the overall work complete, use `ramblings-ready-check`.

## Related skills

- use `ramblings-systematic-debugging` if execution turns into root-cause investigation;
- use `ramblings-requesting-code-review` after meaningful implementation milestones or before final handoff;
- use `ramblings-receiving-code-review` when feedback comes back and changes are needed.
- use a separate implementation-posture skill inside delegated code-editing lanes when the main risk is sloppy local execution rather than workflow ownership.

## Good execution summary format

When reporting progress, prefer:

```markdown
## Progress Update

**Completed:**
- [task or step]

**Verified:**
- `command` — result

**Plan state updated:**
- [checkbox/status/completion note updated in plan]

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
- Do not rely on unstated chat memory for which steps are done or safe to retry.
- Do not let this skill become the default coding persona for delegated worker lanes.
