---
name: ramblings-challenge-session
description: Multi-role challenge session, product review, engineering review, QA review, proposal challenge, design challenge. Use when the user wants their current idea, spec, architecture, or plan challenged from multiple perspectives before implementation or commitment. This is optional and should trigger only when the user explicitly wants critique, evaluation, pushback, or multi-role review.
---

# Ramblings Challenge Session

Use this skill when the user wants deliberate pushback from multiple viewpoints.

This skill is for moments like:

- "challenge this idea"
- "help me pressure-test this"
- "review this from multiple angles"
- "I want someone to evaluate and push back"
- "let's review this like product + engineering + QA"

## Goal

Apply the right set of review lenses to the current idea, not all possible lenses by default.

This is an optional review panel, not a mandatory workflow stage.

## Available lenses

### 1. Product review

Use `ramblings-product-review` when the question is:

- does this solve the right problem;
- is scope sensible;
- is the user value clear;
- are there simpler or more coherent product cuts.

### 2. Engineering review

Use `ramblings-engineering-review` when the question is:

- is the architecture sensible;
- are the trade-offs acceptable;
- is this overbuilt or under-specified;
- what technical risks and complexity costs exist.

### 3. QA review

Use `ramblings-qa-review` when the question is:

- how could this fail;
- what edge cases or regressions are likely;
- what verification is missing;
- what assumptions need to be tested.

## How to use this session

1. Identify what artifact is being challenged:
   - rough idea
   - brainstorm notes
   - spec
   - implementation plan
   - in-progress change

2. Pick only the relevant lenses.

3. Ask each lens to produce:
   - concerns
   - trade-offs
   - questions
   - recommended changes

4. Synthesize the output into:
   - keep as-is
   - revise now
   - defer open questions

## Output format

```markdown
## Challenge Session Summary

**Artifact under review:**
- [idea / spec / plan / change]

**Lenses used:**
- product / engineering / QA

**Main challenges raised:**
- [item]

**Changes recommended now:**
- [item]

**Questions to defer:**
- [item]
```

## Guidance

- do not manufacture disagreement for its own sake;
- do not use every lens if one or two are enough;
- be direct and useful, not theatrical;
- if the review substantially changes the direction, update `.ramblings/specs/` or `.ramblings/plans/`.
