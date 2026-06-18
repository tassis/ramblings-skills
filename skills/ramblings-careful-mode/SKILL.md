---
name: ramblings-careful-mode
description: Careful mode, high-risk mode, conservative execution, scope freeze, analyze before editing. Use as an explicit or conditionally activated high-risk posture when the task is risky enough that speed should be traded for caution: legacy systems, unclear behavior, sensitive scripts, unfamiliar deployment paths, or changes where an incorrect move would be expensive. Do not treat this as an ordinary phase workflow.
---

# Ramblings Careful Mode

Use this skill when the task needs a deliberately conservative posture.

This is a modifier/posture skill, not a normal phase workflow.

- Use it explicitly when the user already knows the task is risky.
- Or apply its posture conditionally after investigation/execution reveals real risk signals.
- Do not assume all planning or implementation should start in careful mode by default.

## When to use

Use this skill when:

- the system is fragile or poorly understood;
- the task touches dangerous scripts, production-like paths, or important data flows;
- the user wants more caution than speed;
- a mistaken edit would be expensive to recover from.

## Core posture

In careful mode:

1. understand before editing;
2. prefer smaller changes;
3. verify more often;
4. avoid opportunistic cleanup;
5. stop and ask when confidence is low.

## Behavior changes

- prefer reading and mapping before changing code;
- prefer explicit plans over improvised edits;
- avoid batching risky changes;
- treat assumptions as things to verify, not trust;
- keep the user informed when uncertainty is material.

## Good pairings

- `ramblings-investigation`
- `ramblings-writing-plans`
- `ramblings-systematic-debugging`
- `ramblings-ready-check`

## Not for

- ordinary low-risk planning;
- routine one-file changes;
- generic brainstorming without meaningful risk signals.

## What not to do

- do not rush into implementation because the change looks small;
- do not widen scope while in careful mode;
- do not create commits, merges, or branch-finalization actions unless the user explicitly asks.
