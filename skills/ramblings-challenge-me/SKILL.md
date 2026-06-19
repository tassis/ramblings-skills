---
name: ramblings-challenge-me
description: Multi-perspective challenge, pressure test, blind-spot review, product/engineering/QA/DevEx critique, proposal challenge. Use when the user wants their current idea, spec, architecture, plan, or in-progress change challenged from multiple relevant perspectives before commitment. This is optional and should trigger only when the user explicitly wants critique, evaluation, pushback, or structured multi-angle review.
---

# Ramblings Challenge Me

Use this skill when the user wants deliberate pushback from multiple viewpoints.

This skill is for moments like:

- "challenge this idea"
- "help me pressure-test this"
- "review this from multiple angles"
- "I want someone to evaluate and push back"
- "let's review this like product + engineering + QA"

## Goal

Run a focused review panel around the current artifact, not a generic multi-lens summary.

This is an optional review panel, not a mandatory workflow stage.

The job is to:

- pick only the relevant reviewers;
- spawn one independent reviewer lane per selected lens;
- let each reviewer take a clear position;
- preserve useful disagreement;
- synthesize only after the reviewer stances are explicit.

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

### 4. DevEx review

Use `ramblings-devex-review` when the question is:

- how painful this will be to set up, operate, or maintain;
- where tribal knowledge or workflow magic is hiding;
- whether a future maintainer will pay too much for today's convenience.

## How to use this challenge

1. Identify what artifact is being challenged:
   - rough idea
   - brainstorm notes
   - spec
   - implementation plan
   - in-progress change

2. Pick only the relevant lenses.

3. Spawn one independent `@reviewer` invocation per selected lens.
   - use a separate session/context per lens;
   - load only that lens's review skill in that lane;
   - do **not** ask one reviewer invocation to play multiple lenses.

4. Ask each reviewer to produce a position, not just a list:
   - what they believe is true;
   - what they do not buy yet;
   - the most important risk or flaw;
   - what would change their mind;
   - their recommendation now.

5. Surface the real disagreements before trying to resolve them.

6. Synthesize the panel into one bounded outcome:
   - proceed;
   - proceed with cuts;
   - revise now;
   - block pending answers;
   - split scope / change approach.

## Panel behavior

- do not flatten different reviewers into one blended voice too early;
- do not manufacture disagreement for drama, but do not hide it when it matters;
- preserve reviewer attribution clearly;
- each selected lens must run in its own reviewer lane/session to avoid cross-lens contamination;
- keep reviewer exchanges short and bounded rather than open-ended debate.

## Output format

```markdown
## Challenge Summary

**Artifact under review:**
- [idea / spec / plan / change]

**Lenses used:**
- product / engineering / QA / DevEx

**Reviewer positions:**
- **Product:** [position]
- **Engineering:** [position]
- **QA:** [position]
- **DevEx:** [position]  # include only when used

**Main disagreements or tensions:**
- [item]

**Synthesis outcome:**
- [proceed / proceed with cuts / revise now / block pending answers / split scope / change approach]

**Changes recommended now:**
- [item]

**Open questions to resolve:**
- [item]
```

## Guidance

- do not use every lens if one or two are enough;
- reviewer lane count should match selected lens count;
- preserve clear reviewer identity before synthesis;
- be direct and useful, not theatrical;
- when one reviewer would block while another would proceed, name the conflict explicitly instead of smoothing it over;
- if the review substantially changes the direction, update `.ramblings/briefs/` or `.ramblings/plans/`.
- if the user wants one-question-at-a-time pressure questioning instead of a synthesized critique, use `ramblings-grill-me` instead.
