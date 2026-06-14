---
name: ramblings-finish-handoff
description: Finish workflow, handoff summary, ready-to-review, ready-to-merge, completion packaging, residual risk summary. Use when implementation is largely done and you need to decide whether the work is ready for handoff, further review, more verification, or follow-up tasks.
---

# Ramblings Finish Handoff

Use this skill when the work is near the end and you need to package it responsibly.

This skill is about deciding whether the work is actually ready to hand off, not just whether code was written.

This skill does not imply automatic git actions. Do not commit, merge, open PRs, or finalize branches unless the user explicitly asks.

## Finish checklist

Before calling work ready, confirm:

1. the intended change is implemented;
2. meaningful verification has been run;
3. known gaps are documented;
4. review has happened or is intentionally deferred;
5. follow-up tasks are captured instead of implied.

## Handoff outcomes

Choose one:

### 1. Ready for review

Use when implementation exists but should still go through focused review.

### 2. Ready for user validation

Use when the user needs to inspect behavior, UI, or environment-specific outcomes.

### 3. Ready for merge-like completion

Use when verification and review are sufficient for the current workflow.

### 4. Not ready

Use when significant verification, fixes, or clarifications are still missing.

## Required summary

Provide a concise finish summary covering:

```markdown
## Handoff Summary

**Status:** ready for review / ready for validation / ready / not ready

**What changed:**
- [summary]

**Verification performed:**
- [tests, commands, manual checks]

**Known gaps or risks:**
- [explicit items]

**Suggested next step:**
- [review / validation / merge / follow-up]
```

## What not to do

- Do not hide remaining uncertainty.
- Do not collapse unfinished follow-ups into vague wording.
- Do not say "done" if the best status is really "ready for review".

## Pairings

- use `ramblings-verification` for the detailed evidence summary;
- use `ramblings-requesting-code-review` if the next step is review;
- use `ramblings-receiving-code-review` if handoff feedback returns with required changes.
