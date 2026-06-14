---
name: ramblings-verification
description: Existing project verification, done check, weak test coverage, manual verification. Use before claiming a maintenance task is complete, especially when tests are missing, partial, or unreliable. Summarize what was actually verified, what remains unverified, and the residual risk.
---

# Maintenance Verification

Use this skill before saying a maintenance task is done.

In old or weakly tested codebases, the biggest failure mode is false confidence. This skill prevents that.

## Core rule

Do not claim completion from code inspection alone.

Completion requires explicit evidence, such as:

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

## Required completion summary

Before finishing, summarize using this structure:

```markdown
## Verification Summary

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
```

## If tests are weak or missing

Do not hide that fact. Instead:

1. say which automated coverage exists;
2. say which parts were only manually checked;
3. say what you could not confidently verify;
4. say whether follow-up tests should be added later.

## When to stop and warn

Do not present the task as safely complete if:

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
