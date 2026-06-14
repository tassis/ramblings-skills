---
name: ramblings-receiving-code-review
description: Review feedback handling, review response, follow-up fixes, pushback on review comments. Use when code review feedback arrives on an existing-project change and you need to evaluate, implement, or push back on comments without blindly accepting them. Prefer technical verification over performative agreement.
---

# Ramblings Receiving Code Review

Use this skill when review feedback has already arrived and you need to respond responsibly.

The goal is not to agree with everything. The goal is to evaluate feedback technically and improve the change safely.

## Core rule

Do not implement review comments blindly.

For each meaningful comment:

1. understand what the reviewer is claiming;
2. verify it against the codebase and intended behavior;
3. decide whether it is correct, partially correct, or not applicable;
4. implement or respond with technical reasoning.

## Response flow

### 1. Restate the issue

Make sure the feedback is understood in concrete terms.

### 2. Check against reality

Inspect:

- the affected code;
- the surrounding behavior;
- the requirement, spec, or bug context;
- any tests or verification evidence.

### 3. Decide the response

Choose one:

- accept and implement;
- accept partially and narrow the fix;
- push back with evidence;
- ask for clarification if the comment is ambiguous.

### 4. Verify after changes

If the change affects behavior, rerun relevant verification instead of assuming the comment made things better.

## When pushback is appropriate

Push back when:

- the comment would break intended behavior;
- the reviewer missed project-specific context;
- the suggestion adds unnecessary complexity;
- the codebase constraints make the suggestion unrealistic right now;
- the fix would be larger than the stated problem and should become separate work.

Push back with technical reasons, not emotion.

## Good response style

Prefer:

- direct statement of what changed;
- technical explanation of why a comment was or was not applied;
- explicit mention of verification.

Avoid performative praise or vague agreement.

## Useful structure

```markdown
## Review Response Summary

**Accepted and changed:**
- [item]

**Accepted with narrower scope:**
- [item]

**Not applied:**
- [item] — [technical reason]

**Verification rerun:**
- `command` — result
```

## Maintenance-specific guidance

- In fragile codebases, avoid bundling many review-driven changes at once.
- If feedback reveals a deeper root cause, switch to `ramblings-systematic-debugging`.
- If feedback changes the implementation approach substantially, consider updating the plan in `.ramblings/plans/`.
