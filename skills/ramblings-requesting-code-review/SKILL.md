---
name: ramblings-requesting-code-review
description: Code review request, review summary, risky change review, implementation review, .ramblings reviews. Use after a meaningful implementation step, before merge-like completion, or when a risky change in an existing project should be reviewed against requirements, behavior, and verification evidence. Save review notes under .ramblings/reviews/ when useful.
---

# Ramblings Requesting Code Review

Use this skill when work is implemented far enough that a focused review will reduce risk.

This is especially useful for:

- multi-file changes;
- risky maintenance fixes;
- feature work that followed a written spec or plan;
- changes in weakly tested codebases;
- moments just before you present the work as ready.

## Output location

When a persistent review note is useful, save it under:

```text
.ramblings/reviews/YYYY-MM-DD-<topic>.md
```

Do not create a review file for every tiny change. Use it when the work is meaningful enough that the review should be recorded.

## What to prepare before review

Gather the minimum context the reviewer needs:

- what was changed;
- why it was changed;
- what requirement, spec, bug, or plan it maps to;
- what files matter most;
- what verification has already been run;
- what remains uncertain, including any ready-check result if review readiness is already being claimed.

## Review focus

Ask the reviewer to check these areas:

1. **Requirement fit**
   - does the change match the intended behavior or plan?

2. **Behavior risk**
   - could this break nearby flows, edge cases, or historical assumptions?

3. **Code quality**
   - is the change understandable, scoped, and minimally risky?

4. **Verification quality**
   - were the tests or manual checks meaningful enough?

5. **Follow-up gaps**
   - what still needs monitoring, tests, or cleanup?

## Suggested review note template

```markdown
# [Topic] Review Request

## Goal

## Change Summary

## Files to Focus On

## Verification Already Run

## Known Risks / Open Questions

## Reviewer Findings

## Actions Taken
```

## Review request guidance

- Prefer a focused review over dumping the entire session history.
- Point the reviewer at the files and behavior that matter most.
- If the task came from `.ramblings/briefs/` or `.ramblings/plans/`, reference that artifact.
- If the codebase is fragile, say so explicitly.

## Severity handling

Classify findings roughly as:

- **Critical** — broken behavior, data loss, security, or clearly unsafe
- **Important** — should fix before calling the work ready
- **Minor** — readability, small cleanup, non-blocking suggestions

Do not ignore Critical findings. Do not casually defer Important findings without explaining why.

### Review severity guide

Use these meanings consistently:

#### Critical

- the change is unsafe to present as ready;
- behavior is clearly broken;
- important data, security, or core workflow integrity is at risk.

Action: fix before proceeding.

#### Important

- the main behavior may work, but there is a meaningful defect, regression risk, or requirement miss;
- verification is insufficient for the level of risk;
- the implementation likely needs correction before handoff.

Action: normally fix before calling the work ready, or clearly justify deferral.

#### Minor

- readability, naming, small cleanup, or non-blocking improvement;
- useful, but not a reason to block progress by default.

Action: fix when cheap and safe, otherwise capture as follow-up.

## After review

Once feedback arrives:

1. fix Critical items first;
2. resolve or explicitly answer Important items;
3. batch Minor items only if doing so does not destabilize the change;
4. run verification again if behavior changed.
