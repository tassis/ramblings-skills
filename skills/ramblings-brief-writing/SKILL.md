---
name: ramblings-brief-writing
description: Discussion brief writing, direction capture, planning input, pre-plan artifact. Use when the user has converged enough on a direction to write down the chosen approach before implementation planning. Save brief artifacts under .ramblings/briefs/ and do not assume implementation starts immediately.
---

# Ramblings Brief Writing

Use this skill when the user wants to capture a chosen direction as a planning brief before implementation.

This is the right workflow for cases like:

- recording a chosen direction after discussion has converged;
- turning rough requirements into a durable planning input;
- capturing scope, constraints, and open questions before `ramblings-writing-plans`;
- preserving a pre-plan brief for a new feature, subsystem, DSL, website, or app.

## Output location

Save briefs under:

```text
.ramblings/briefs/YYYY-MM-DD-<topic>.md
```

Use the user's preferred location if they explicitly override this.

## When to use

Use this skill when:

- enough discussion has converged that the chosen direction should be written down;
- the next step is likely implementation planning rather than more open-ended exploration;
- the output should be a planning brief, direction note, or pre-plan artifact;
- scope, constraints, assumptions, and open questions should be preserved for later planning.

Do not use it when the work is still exploratory, when the user wants immediate implementation planning, or when the request is really for a formal feature-spec or technical design document.

## Goals

Produce a brief that is:

- understandable by a future planner or implementer;
- concrete enough to guide `ramblings-writing-plans`;
- explicit about scope, constraints, assumptions, chosen direction, and open questions.

## Brief-writing process

1. Clarify the goal.
2. Confirm the discussion has converged enough to record a chosen direction.
3. Identify scope, constraints, assumptions, and open questions that matter for planning.
4. Summarize the recommended direction and why it fits.
5. Write the result into a structured brief.

## Brief structure

Use this shape unless the user wants something else:

```markdown
# [Topic] Brief

## Goal

## Context

## Scope

## Non-goals

## Constraints

## Chosen Direction

## Alternatives Considered

## Open Questions

## Next Step
```

## Writing guidance

- Prefer concrete language over slogans.
- Keep the artifact oriented toward planning input, not full execution steps.
- Name open questions explicitly instead of hiding them.
- If stack choices are already given, treat them as constraints.
- If uncertainty remains, capture only the options still relevant to planning.

## Not for

This skill is not for:

- company-format feature specs;
- formal technical design documents;
- stakeholder approval artifacts;
- direct bug triage;
- unconverged exploratory brainstorming.

## For DSL or language design

When the topic is a DSL or config language, cover:

- target users;
- intended authoring style;
- core syntax shape;
- examples of valid input;
- parsing or compatibility constraints;
- what the DSL is intentionally not trying to solve.

## For website or app design

When the topic is a website or app, cover:

- audience and primary use cases;
- main screens or flows;
- data sources or existing scripts/services it depends on;
- chosen framework/library constraints;
- rough component or page structure.

## End condition

This skill ends when the brief is good enough to support review, handoff, or `ramblings-writing-plans`.

If the user wants to move toward implementation, the next skill should usually be `ramblings-writing-plans`.
