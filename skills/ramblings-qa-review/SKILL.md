---
name: ramblings-qa-review
description: QA review, edge case review, failure mode review, verification challenge, regression review. Use when an idea, spec, plan, or implementation should be challenged from the QA perspective: what can break, what is unverified, what assumptions are unsafe, and what cases are missing.
---

# Ramblings QA Review

Use this skill to challenge a proposal or change from the failure and verification perspective.

## Core questions

Ask:

1. How could this fail in normal use?
2. What edge cases are not being considered?
3. What assumptions are currently unverified?
4. What regressions are most likely?
5. What proof would make us confident enough?

## Review areas

### Failure modes

- What input, state, or timing conditions could break this?
- What dependencies may behave differently than expected?
- What happens when upstream data is malformed, missing, or delayed?

### Edge cases

- empty states;
- invalid states;
- partial configuration;
- repeated actions;
- platform/environment differences.

### Verification quality

- Are planned checks meaningful enough?
- Are we verifying only the happy path?
- Are we relying on assumptions instead of tests or repros?

### Regression risk

- Which existing flows are most likely to be affected?
- What adjacent behaviors need smoke checks?

## Recommended output

```markdown
## QA Review

**Most likely failure modes:**
- [item]

**Missing edge cases:**
- [item]

**Verification gaps:**
- [item]

**Suggested checks:**
- [test / repro / manual check]

**Recommended direction:**
- [short recommendation]
```

## Guidance

- be concrete;
- prefer likely breakage over exhaustive imagination;
- focus on what would materially change confidence.
