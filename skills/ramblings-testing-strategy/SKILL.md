---
name: ramblings-testing-strategy
description: Testing strategy, TDD decision, weak tests, legacy tests, manual verification fallback, reproduction-first testing. Use only when the validation approach itself is unclear, risky, or explicitly requested before implementation: whether to use TDD, add regression tests, rely on focused repros, or fall back to manual verification. This is manual and should not trigger for every task automatically.
---

# Ramblings Testing Strategy

Use this skill when testing approach itself is the question.

This skill is intentionally manual. It should help you choose a validation strategy, not force TDD onto every task.

This is a pre-change validation-planning skill, not a final completion-evidence skill.

## Goal

Pick the strongest practical testing approach for the current task.

## Testing ladder

Prefer the highest realistic level on this ladder:

1. **True TDD**
   - write failing test first;
   - make it pass with minimal implementation;
   - refactor safely.

2. **Regression-first testing**
   - reproduce the existing bug in a test;
   - fix the bug;
   - keep the test.

3. **Focused automated verification**
   - add or run targeted tests around the changed area;
   - not necessarily pure TDD, but still automated.

4. **Scripted reproduction**
   - create a repeatable command or script to expose the behavior.

5. **Manual verification**
   - only when automation is not practical right now;
   - steps must be explicit and reproducible.

## When to use TDD

Prefer TDD when:

- the changed behavior is easy to isolate;
- tests are already easy to run;
- the feature surface is small enough to specify first;
- the codebase has usable test seams.

## When not to force TDD

Do not force TDD when:

- the codebase lacks usable test infrastructure;
- the behavior is deeply coupled and first requires investigation;
- building the test harness would dominate the task;
- the task is mainly exploratory debugging.

In those cases, use the strongest available alternative instead of pretending TDD happened.

## Legacy-code guidance

For older projects:

1. first ask whether the behavior can be reproduced reliably;
2. then decide whether that reproduction can become a test;
3. if not, define manual verification tightly;
4. note any verification gaps explicitly.

## Weak-test strategy notes

In weak-test or legacy repositories, use this order of preference:

1. convert the bug or feature expectation into a targeted regression test;
2. if full integration tests are too expensive, add a smaller seam-level test;
3. if no seam exists yet, create a repeatable repro command or script;
4. if only manual verification is possible, make the steps explicit, deterministic, and easy to rerun.

Be honest when the codebase cannot support strong automation yet. The goal is not to pretend coverage exists; the goal is to choose the best available proof.

### Warning signs

- tests require excessive environment setup for a tiny behavior change;
- assertions depend on unstable timing or unrelated global state;
- the only existing tests are too broad to localize regressions;
- adding a proper test would require architecture work larger than the current task.

When these signs appear, fall back deliberately rather than awkwardly forcing pseudo-TDD.

## Recommended output

```markdown
## Testing Strategy

**Chosen level:** TDD / regression-first / focused automated / scripted repro / manual

**Why:**
- [reason]

**What will be added or run:**
- [tests or commands]

**What is still not covered:**
- [gap]
```

## Pairings

- use `ramblings-systematic-debugging` when testing depends on root-cause investigation;
- use `ramblings-ready-check` when summarizing final confidence and readiness;
- use `ramblings-writing-plans` if the testing strategy needs to be embedded in a larger implementation plan.

## Not for

- automatic invocation on every code change;
- final readiness or completion status;
- cases where the validation approach is already obvious and uncontroversial.
