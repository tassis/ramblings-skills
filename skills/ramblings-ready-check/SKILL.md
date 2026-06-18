---
name: ramblings-ready-check
description: Ready check, verification evidence, completion status, ready-for-review, ready-for-validation, residual risk summary. Use near completion when the main question is what evidence exists and what readiness state can be claimed next.
---

# Ramblings Ready Check

Use this skill before claiming that a task, change, review request, or handoff is ready for its next state.

In old or weakly tested codebases, the biggest failure mode is false confidence. This skill prevents that.

## Core rule

Do not claim readiness from code inspection alone.

Readiness requires explicit evidence, such as:

- automated tests;
- focused reproduction checks;
- manual verification with concrete steps;
- build, typecheck, lint, or runtime checks.

## What to verify

When relevant, verify these in order:

1. The intended fix or feature works.
2. The original symptom is gone.
3. The changed area still integrates correctly.
4. No obvious nearby regression was introduced.

## Readiness states

Choose the best current state explicitly:

1. **Ready for review**
   - implementation exists and should go through focused review next.

2. **Ready for user validation**
   - implementation exists and the next meaningful check is user or environment-specific validation.

3. **Ready**
   - verification and review are sufficient for the current workflow.

4. **Not ready**
   - important verification, fixes, or clarifications are still missing.

## Required summary

Before finishing, summarize using this structure:

```markdown
## Ready Check

**Status:** ready for review / ready for user validation / ready / not ready

**Automated checks run:**
- `command`
- result

**Manual checks run:**
- [step]
- observed result

**Not verified:**
- [explicit gap]

**Residual risk:**
- low / medium / high
- why

**Suggested next step:**
- review / validation / handoff / follow-up
```

## If tests are weak or missing

Do not hide that fact. Instead:

1. say which automated coverage exists;
2. say which parts were only manually checked;
3. say what you could not confidently verify;
4. say whether follow-up tests should be added later.

## When to stop and warn

Do not present the task as ready if:

- you could not reproduce the original issue clearly;
- you changed behavior but ran no meaningful verification;
- important paths remain unchecked;
- the fix depends on assumptions you could not confirm.

In those cases, report partial confidence, not full confidence.

## Maintenance-specific guidance

- Prefer precise honesty over optimistic language.
- If the repo is fragile, mention that explicitly in residual risk.
- If verification required local assumptions or environment quirks, say so.
- If the best available proof is manual, make the manual steps reproducible.

## Boundaries

- use `ramblings-testing-strategy` before implementation when the validation approach itself is still the question;
- use `ramblings-handoff` for future-session context transfer;
- if a handoff claims readiness, include or reference the result of this ready check.
