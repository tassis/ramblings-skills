---
name: ramblings-brainstorming
description: Brainstorming, design discussion, requirement discovery, architecture exploration, stack tradeoffs, feature shaping. Use when the user wants to talk through what to build before committing to a spec or implementation plan, especially for new features, websites, apps, DSLs, or subsystem design.
---

# Ramblings Brainstorming

Use this skill before formal spec writing when the task still needs exploration, clarification, or trade-off discussion.

This is the right skill when the user is saying things like:

- "let's think through this first"
- "help me design this"
- "what would be a good way to structure this"
- "I want to build X with Y and Z"
- "let's discuss requirements before implementation"

## Goal

Turn rough intent into a clearer direction that is ready for one of these next steps:

- write a spec with `ramblings-spec-writing`
- write an implementation plan with `ramblings-writing-plans`
- stop at discussion only if the user is not ready to proceed

## Output location

If the discussion should be written down, save notes or a draft under:

```text
.ramblings/specs/YYYY-MM-DD-<topic>.md
```

Do not force file output for every short discussion. Write it down when the discussion has enough substance that future reference matters.

## Discussion flow

### 1. Clarify the objective

Identify:

- what the user wants to build or change;
- who it is for;
- why it matters;
- what constraints already exist.

### 2. Surface the boundaries

Ask or infer:

- what is in scope;
- what is intentionally out of scope;
- what existing systems or artifacts must be reused;
- what stack choices are already fixed.

### 3. Explore 2-3 plausible approaches

When the design is still open, compare a small number of realistic options.

For each option, cover:

- why it fits;
- trade-offs;
- complexity;
- maintenance cost;
- where it may cause trouble later.

### 4. Recommend a direction

Do not just list options forever. Recommend one approach when enough context exists.

Explain why it is the best fit for the stated constraints.

### 5. Decide the next artifact

Choose one:

- continue discussion only;
- write a spec;
- move to implementation planning.

## Writing guidance

- Prefer concrete questions over abstract theorizing.
- Keep the user moving toward clearer decisions.
- If stack choices are fixed, treat them as constraints rather than reopening them.
- If an approach is obviously mismatched, say so and explain why.

## Useful structure for substantial brainstorming

```markdown
# [Topic] Brainstorm Notes

## Objective

## Constraints

## Options Considered

## Recommended Direction

## Open Questions

## Next Step
```

## Special cases

### New website or app

Cover:

- target users;
- main flows or screens;
- relationship to existing scripts, services, or data;
- framework and UI constraints;
- what must exist in the first version.

### DSL or config language

Cover:

- target users;
- authoring ergonomics;
- required syntax shape;
- compatibility constraints;
- examples of intended usage.

### Existing project feature

Cover:

- which current components or files the feature will touch;
- what historical behavior must be preserved;
- where the design risk is highest.

## When to hand off

When the discussion has converged enough that a document should exist, move to `ramblings-spec-writing`.

When the spec is already clear enough to execute, move to `ramblings-writing-plans`.
