---
name: ramblings-spec-writing
description: Spec writing, design discussion, requirements shaping, architecture notes, DSL design, project proposal, feature spec. Use when the user wants to discuss and document what to build before implementation, especially for new features, new subsystems, DSLs, websites, or apps. Save spec artifacts under .ramblings/specs/ and do not assume implementation starts immediately.
---

# Ramblings Spec Writing

Use this skill when the user wants to shape an idea into a written spec before implementation.

This is the right workflow for cases like:

- designing a DSL;
- exploring a new website or app concept;
- shaping a new subsystem before code exists;
- turning rough requirements into a reviewable spec.

## Output location

Save specs under:

```text
.ramblings/specs/YYYY-MM-DD-<topic>.md
```

Use the user's preferred location if they explicitly override this.

## When to use

Use this skill when:

- the user wants to discuss requirements first;
- implementation is not approved yet;
- there are architecture or stack decisions to make;
- the output should be a spec, proposal, or design note.

Do not use it when the user clearly wants immediate implementation planning or direct bug triage.

## Goals

Produce a spec that is:

- understandable by a future implementer;
- concrete enough to review;
- explicit about scope, constraints, assumptions, and open questions.

## Discussion process

1. Clarify the goal.
2. Identify users, inputs, outputs, and constraints.
3. Explore 2-3 viable approaches when the design is still open.
4. Recommend one direction and explain trade-offs.
5. Write the result into a structured spec.

## Spec structure

Use this shape unless the user wants something else:

```markdown
# [Topic] Spec

## Goal

## Context

## Requirements

## Non-goals

## Constraints

## Proposed Approach

## Alternatives Considered

## Open Questions

## Next Step
```

## Writing guidance

- Prefer concrete language over slogans.
- Separate requirements from implementation details.
- Name open questions explicitly instead of hiding them.
- If stack choices are already given, treat them as constraints.
- If the user is still uncertain, capture options with trade-offs.

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

This skill ends when the spec is good enough for review or handoff.

If the user wants to move toward implementation, the next skill should usually be `ramblings-writing-plans`.
