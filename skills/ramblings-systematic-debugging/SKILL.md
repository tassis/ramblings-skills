---
name: ramblings-systematic-debugging
description: Existing project bugfix, failing test, unexpected behavior, root cause analysis, reproduction, debug notes. Use when a maintenance task involves a bug, regression, flaky behavior, or unclear failure cause. Investigate first, record findings in .ramblings/debug/ when useful, and avoid symptom-only fixes.
---

# Maintenance Systematic Debugging

Use this skill for debugging in existing codebases.

The goal is not to patch the nearest symptom. The goal is to identify the real failure path and make the smallest safe fix.

## Output location

When written notes help, save them under:

```text
.ramblings/debug/YYYY-MM-DD-<topic>.md
```

You do not need to write a debug note for every tiny issue. Use it when the investigation is non-trivial, spans multiple attempts, or the user will benefit from a persistent record.

## When to use

Use this skill when:

- a bug is reported;
- tests fail unexpectedly;
- behavior differs from expectation;
- you do not yet know the root cause;
- a previous fix attempt failed.

## Debugging flow

### 1. Capture the symptom

Write down:

- what is failing;
- where it appears;
- whether it is reproducible;
- how the user or tests observed it.

If possible, capture a minimal reproduction command or sequence.

### 2. Understand current behavior before editing

Inspect:

- the failing code path;
- recent related changes if known;
- surrounding assumptions, configuration, or state.

Do not edit yet unless the cause is already obvious.

### 3. Trace backward to root cause

Move backward from the failure point:

- where did the bad state originate;
- which caller or condition introduced it;
- which assumption is actually false.

If needed, add temporary instrumentation or targeted logging to reveal the path.

#### Root-cause tracing guidance

When the visible failure happens late in the call chain, do not fix the last step first.

Trace backward and ask:

- where did the bad value, state, or assumption first appear;
- who supplied it;
- why was it allowed to stay invalid;
- what earlier boundary should have rejected or normalized it.

Useful tracing moves:

1. write down the exact failing operation;
2. identify the immediate caller;
3. keep walking backward until you find the first incorrect input or decision;
4. add temporary logs or stack/context capture before the dangerous operation, not after it fails;
5. include relevant context such as cwd, file paths, flags, environment, or lifecycle state.

Do not confuse the first *crash site* with the first *bad cause*.

### 4. Decide the safest proof

Choose one or more:

- add a failing automated test;
- isolate a smaller reproduction;
- capture a manual reproduction with exact steps.

Automated coverage is preferred, but not mandatory when the codebase makes it unreasonable.

### 5. Apply one focused fix

- fix the root cause, not the loudest symptom;
- make one coherent change at a time;
- avoid unrelated cleanup while debugging.

#### Defense-in-depth guidance

After you identify the root cause, consider whether one local fix is enough.

If the bug exposed a fragile boundary, add protection at the most relevant layers, for example:

- input validation at entry points;
- assertions for invalid internal state;
- safer defaults or normalization;
- guardrails around dangerous operations.

Do not spray validations everywhere blindly. Add depth where it prevents recurrence without obscuring the actual design.

### 6. Verify the fix

Check:

- the symptom is gone;
- the intended behavior still works;
- nearby behavior was not obviously broken.

## Escalation rule

If 2-3 plausible fixes fail, stop assuming this is a local bug.

At that point, explicitly consider:

- architectural mismatch;
- hidden shared state;
- incorrect assumptions about ownership or lifecycle;
- a missing test seam or observability seam.

Do not brute-force a fourth random fix.

## Maintenance-specific guidance

In weak-test codebases:

1. Prefer reproductions over guesses.
2. If you cannot add a real test, create the most reliable manual verification possible.
3. State uncertainty explicitly.
4. Keep debug artifacts and notes out of production code once finished.

## Common debugging mistakes

- fixing the line that crashed without tracing the origin;
- bundling several possible fixes at once;
- leaving temporary debug code in production paths;
- claiming confidence without a stable reproduction or verification loop.

## Suggested debug note template

```markdown
# [Topic] Debug Note

## Symptom

## Reproduction

## Suspected root cause

## Evidence checked

## Fix applied

## Verification

## Remaining uncertainty
```
