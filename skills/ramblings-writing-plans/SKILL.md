---
name: ramblings-writing-plans
description: Existing project implementation plan, legacy maintenance plan, .ramblings plans. Use when a task on an existing codebase is multi-step, risky, spans multiple files, or needs discussion before editing. Write concrete plans into .ramblings/plans/ with exact files, ordered tasks, and verification steps.
---

# Maintenance Writing Plans

Write implementation plans for existing-project work.

This is not greenfield planning. Assume:

- the codebase may be inconsistent;
- tests may be weak;
- names and boundaries may already be messy;
- you should minimize risk while still being concrete.

## Output location

Save plans under:

```text
.ramblings/plans/YYYY-MM-DD-<topic>.md
```

Use the user's preferred location if they explicitly override this.

## When to use

Use this skill when:

- the task is multi-step;
- the task touches multiple files or subsystems;
- you need to discuss approach before editing;
- the existing project is risky enough that execution should be guided by a written plan.

Do not use it for trivial one-file tweaks unless the user explicitly asks for a written plan.

## Plan goals

The plan must help a low-context engineer execute safely.

That means the plan must include:

- exact files to read, create, or modify;
- the order of operations;
- how to validate each risky step;
- where automated tests are realistic and where they are not;
- what manual verification is required when tests are weak;
- execution state markers so a later session can resume without guessing;
- completion criteria that make each task safe to re-check before rerunning.

## Plan shape

Every plan should start with:

```markdown
# [Topic] Maintenance Plan

**Goal:** [one sentence]

**Current Risk:** [what makes this change dangerous or uncertain]

**Approach:** [2-4 sentences]

**Verification Strategy:** [tests, reproductions, manual checks]

---
```

Then add task sections.

Immediately after the header, add an execution tracker:

```markdown
## Execution Tracker

- [ ] Task 1: [short name]
- [ ] Task 2: [short name]
- [ ] Task 3: [short name]
```

This tracker starts unchecked. It exists so implementation sessions can update progress in-place instead of reconstructing state from memory.

The tracker is a compact overview only. If the tracker and a task's `Status:` ever disagree, treat the task's `Status:` field as the source of truth.

## Task structure

Use this format:

```markdown
## Task N: [short name]

**Why:** [why this task exists]

**Status:** [not started | in progress | blocked | complete]

**Files:**
- Read: `path/to/file`
- Modify: `path/to/file`
- Create: `path/to/file`
- Verify: `path/to/test-or-command`

**Steps:**
1. [specific action]
2. [specific action]
3. [specific action]

**Verification:**
- Run: `exact command`
- Expect: [concrete expected result]

**Completion Criteria:**
- [specific observable condition that means this task is actually done]
- [use file state, test result, command output, or visible behavior rather than abstract intent]

**Re-entry / Idempotence Notes:**
- [how to tell whether this task was already completed]
- [what to re-check before rerunning]

**Notes / Risks:**
- [edge case, dependency, ambiguity, migration concern]
```

## Planning rules

1. Use exact file paths.
2. Keep tasks small and ordered.
3. Prefer concrete steps over vague intent.
4. If you mention tests, say exactly which tests or commands.
5. If automated tests are not practical, say so explicitly and specify manual verification.
6. Follow existing project structure unless the user is intentionally restructuring it.
7. Every task must have a visible status field and completion criteria.
8. Every risky or multi-step task must say how to detect "already done" before re-executing it.
9. A task is not complete until its verification has passed and its status/tracker has been updated.

## No-placeholder rule

These are plan failures:

- "TODO"
- "implement later"
- "add validation"
- "handle edge cases"
- "write tests"
- "refactor as needed"
- "similar to previous task"

Replace them with concrete actions.

## Maintenance-specific guidance

For old or fragile codebases:

1. Include a task to understand current behavior before changing it.
2. If behavior is unclear, include a reproduction or observation step.
3. If a risky file is large or confusing, say what part to inspect first.
4. Prefer minimal, reversible changes over cleanup sprees.
5. If execution may span multiple sessions, make the tracker and task statuses sufficient for another agent to resume safely.

## Before finishing the plan

Self-check:

1. Does each requirement map to a task?
2. Are file paths concrete?
3. Does each risky task have verification?
4. Did you clearly distinguish automated vs manual verification?
5. Did you avoid over-design for a maintenance task?
6. Can an implementer tell what is done, what is blocked, and what can be safely retried?
