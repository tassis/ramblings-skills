---
name: ramblings-investigation
description: Investigation, codebase understanding, current-state analysis, trace how this works, explore before deciding. Use when the user needs to understand an existing system, script, workflow, or behavior before deciding whether it is a bug, a feature change, or a redesign.
---

# Ramblings Investigation

Use this skill when the immediate job is understanding, not fixing.

## When to use

Use this skill when:

- the current behavior is unclear;
- you need to trace how a script, system, or workflow works;
- you are not ready to call it a bug yet;
- you need current-state analysis before design or implementation.

## Goal

Produce a clear picture of the current system, enough to support the next decision.

## Output location

When useful, save investigation notes under:

```text
.ramblings/debug/YYYY-MM-DD-<topic>-investigation.md
```

## Investigation flow

1. Define the question.
2. Identify the relevant files, scripts, or entry points.
3. Trace the main execution or data path.
4. Record important assumptions, branches, and dependencies.
5. Summarize what is known, unknown, and likely next.

## Suggested output

```markdown
# [Topic] Investigation

## Question

## Relevant files

## Observed flow

## Key assumptions / dependencies

## Unknowns

## Likely next step
```

## Guidance

- avoid drifting into fixing while still investigating;
- prefer concrete paths and observations over vague summaries;
- if the result reveals a true bug hunt, switch to `ramblings-systematic-debugging`.
