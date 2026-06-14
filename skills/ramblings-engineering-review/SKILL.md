---
name: ramblings-engineering-review
description: Engineering review, architecture challenge, implementation tradeoff review, technical design review, maintainability review. Use when an idea, spec, or implementation plan should be challenged from the engineering perspective: structure, complexity, risk, coupling, maintainability, and feasibility.
---

# Ramblings Engineering Review

Use this skill to evaluate whether the technical shape of a proposal is sound.

## Core questions

Ask:

1. Is the architecture proportionate to the problem?
2. What are the main complexity drivers?
3. Where are the coupling and maintenance risks?
4. What assumptions are fragile?
5. Is there a simpler implementation path?

## Review areas

### Architectural fit

- Does the structure fit the current codebase or system constraints?
- Is the proposed split between components/modules/services sensible?
- Are we introducing infrastructure too early?

### Complexity and coupling

- What will be hard to change later?
- Which boundaries are unclear or overloaded?
- Are we tying unrelated concerns together?

### Feasibility

- Are dependencies, tooling, or runtime assumptions realistic?
- Does the implementation plan line up with actual repo structure?
- Are there hidden migration costs?

### Maintainability

- Will future changes be obvious or brittle?
- Are naming, ownership, and responsibilities clear?
- Does this create testing pain later?

## Recommended output

```markdown
## Engineering Review

**What looks technically sound:**
- [item]

**Main engineering risks:**
- [item]

**Places likely to overcomplicate:**
- [item]

**Simplifications worth considering:**
- [item]

**Recommended direction:**
- [short recommendation]
```

## Guidance

- challenge overengineering directly;
- distinguish "hard because important" from "hard because poorly shaped";
- prefer simpler seams and lower coupling when possible.
