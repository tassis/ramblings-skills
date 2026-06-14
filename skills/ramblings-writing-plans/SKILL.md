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
- what manual verification is required when tests are weak.

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

## Task structure

Use this format:

```markdown
## Task N: [short name]

**Why:** [why this task exists]

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

## Before finishing the plan

Self-check:

1. Does each requirement map to a task?
2. Are file paths concrete?
3. Does each risky task have verification?
4. Did you clearly distinguish automated vs manual verification?
5. Did you avoid over-design for a maintenance task?
