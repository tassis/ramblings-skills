---
name: ramblings-resume-from-handoff
description: Resume from handoff, continue prior session, restart from latest handoff, continuation workflow. Use when the current task should continue from a previous handoff artifact. Read the newest relevant handoff in .ramblings/handoffs/, verify it is still current, then resume from referenced specs, plans, reviews, or debug notes instead of relying on the handoff alone.
---

# Ramblings Resume From Handoff

Use this skill when the current session is explicitly continuing work from a prior handoff.

## Goal

Resume safely from the latest relevant state without treating an old handoff note as perfect truth.

## Input location

Look for handoff artifacts in:

```text
.ramblings/handoffs/
```

## Resumption flow

### 1. Find the newest relevant handoff

Use this selection ladder:

1. filter to handoffs relevant to the requested or inferred work unit/topic;
2. prefer exact `work_unit` matches over broader `topic` matches;
3. exclude handoffs marked `superseded`, `stale`, or clearly invalidated by newer source artifacts;
4. prefer a handoff that explicitly `supersedes` another candidate;
5. among the remaining candidates, prefer the newest dated handoff.

Older handoffs without frontmatter metadata may still be considered during resume, but treat them conservatively:

- infer `topic` or workstream from filename/content only when it is reasonably clear;
- prefer explicitly referenced source artifacts over inferred handoff claims;
- if old handoffs remain ambiguous after verification, stop and ask the user.

### 2. Verify that it is still current

Check whether:

- the referenced plan or spec still exists;
- the active checklist or plan does not contradict the handoff's claimed state;
- newer work has already changed the situation;
- blockers are still real;
- the suggested next step still makes sense.

### 3. Read the source artifacts

Do not rely on the handoff note alone.

Read the referenced artifacts first, such as:

- `.ramblings/briefs/...`
- `.ramblings/plans/...`
- `.ramblings/reviews/...`
- `.ramblings/debug/...`

Source artifacts outrank the handoff note even after a candidate handoff is selected.

### 4. Reconstruct current state

Summarize:

- what is still true;
- what has changed;
- what the next actionable step should be.

### 5. Continue with the right next skill

Depending on the state, hand off to:

- `ramblings-writing-plans`
- `ramblings-implementing-plans`
- `ramblings-systematic-debugging`
- `ramblings-ready-check`

## Suggested output

```markdown
## Resume Summary

**Latest handoff used:**
- `.ramblings/handoffs/...`

**Still current:**
- [item]

**Changed or stale:**
- [item]

**Artifacts to treat as source of truth:**
- [paths]

**Next step:**
- [action]

**Suggested next skill:**
- `ramblings-*`
```

## Guidance

- newest handoff first, but verify before trusting;
- if multiple candidates remain equally plausible after verification, stop and ask the user rather than guessing;
- source artifacts outrank the handoff note;
- mixed old/new handoff sets are allowed; new metadata improves selection, but does not retroactively make older notes authoritative;
- if no handoff is current enough, say so and rebuild context deliberately.
