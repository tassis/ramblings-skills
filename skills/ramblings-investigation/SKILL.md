---
name: ramblings-investigation
description: Investigation, codebase understanding, current-state analysis, trace how this works, explore before deciding. Use when the user needs to understand an existing system, script, workflow, or behavior before deciding what to change or whether the issue should route to debugging, planning, implementation, or answer-only analysis.
---

# Ramblings Investigation

Use this skill when the immediate job is establishing facts before choosing the next route.

This skill does not define permission boundaries.

- In Conductor Mode it stays planning-only because Conductor is planning-only.
- Outside Conductor Mode it may route to debugging, planning, implementation, or answer-only analysis once the facts are clear.

## When to use

Use this skill when:

- the current behavior is unclear;
- you need to trace how a script, system, or workflow works;
- you are not ready to call it a bug yet;
- you need current-state analysis before design or implementation;
- the next action depends on understanding what is true first.

## Goal

Produce a clear picture of the current system, enough to support the next decision and route safely.

## Output location

Do not create an investigation artifact by default.

Write notes only when the investigation is non-trivial, should be resumable, or will materially help later planning/debugging.

- Bug/root-cause related investigation notes may go under:

```text
.ramblings/debug/YYYY-MM-DD-<topic>-investigation.md
```

- Neutral current-state, architecture, workflow, or system-understanding notes may go under:

```text
.ramblings/specs/YYYY-MM-DD-<topic>-current-state.md
```

## Investigation flow

1. Define the question.
2. Identify the relevant files, scripts, or entry points.
3. Trace the main execution or data path.
4. Record important assumptions, branches, and dependencies.
5. Summarize what is known, unknown, and likely next.
6. Choose the next route explicitly.

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

- do not jump into fixing before the facts are established;
- prefer concrete paths and observations over vague summaries;
- if the result reveals a true bug hunt, switch to `ramblings-systematic-debugging`;
- if the result reveals a stable design direction, switch to `ramblings-spec-writing` or `ramblings-writing-plans` as appropriate;
- if the result is enough to answer the user's question directly, answer directly instead of forcing another workflow.

## Route outcomes

After the investigation, choose one of these outcomes explicitly:

1. answer only;
2. switch to `ramblings-systematic-debugging`;
3. switch to `ramblings-spec-writing`;
4. switch to `ramblings-writing-plans`;
5. continue to implementation if user intent and current agent mode allow;
6. ask the user if intent or risk is still unclear.
