---
name: ramblings-handoff
description: Session handoff, context transfer, next-session summary, resumable work note, handoff artifact. Use only when work needs to be handed off to a later session, another agent run, or a future continuation. Save handoff artifacts under .ramblings/handoffs/ with dates, reference existing specs/plans/reviews instead of duplicating them, and prefer the newest relevant handoff when resuming.
---

# Ramblings Handoff

Use this skill only when work is being explicitly handed off.

This is not a generic summary skill. It exists to help the next session continue without re-deriving the entire context.

## Output location

Save handoff files under:

```text
.ramblings/handoffs/YYYY-MM-DD-<topic>.md
```

New handoffs should use a compact frontmatter block:

```yaml
---
topic: ultrawork
work_unit: ultrawork-runtime-hardening
references:
  - .ramblings/plans/...
  - .ramblings/briefs/...
supersedes: 2026-06-18-ultrawork-status-handoff.md   # optional
status: active                                       # active | superseded | stale | complete
---
```

Field guidance:

- `topic`: broad human grouping for the work.
- `work_unit`: narrower resume key; prefer this over `topic` when both are present.
- `references`: source-of-truth artifacts the next session should read first.
- `supersedes`: optional explicit replacement link to an older handoff.
- `status`: handoff lifecycle hint without deleting historical context.

## When to use

Use this skill when:

- the current session is stopping but the work is not finished;
- a later session should resume from current context;
- the user wants a compact transfer artifact;
- another workflow stage should continue from the current one.

Do not use it for ordinary progress updates inside the same session.

## Lifecycle rule

Handoff artifacts are transitional by default.

That means:

1. create them only when a real handoff is needed;
2. date them clearly;
3. keep them append-only rather than rewriting one mutable `current.md` handoff;
4. when resuming, read the newest relevant handoff first;
5. treat older handoffs as historical context, not primary truth;
6. after a successful continuation, obsolete handoffs may be cleaned up or ignored.

## Core rule

Do not duplicate large source artifacts.

Instead of copying full specs, plans, reviews, or diffs into the handoff, reference them explicitly:

- `.ramblings/briefs/...`
- `.ramblings/plans/...`
- `.ramblings/reviews/...`
- `.ramblings/debug/...`

## What the handoff should contain

Include only what the next session actually needs:

1. current objective;
2. current state;
3. relevant artifacts to read first;
4. unresolved questions or blockers;
5. suggested next step;
6. suggested next skills.

## Suggested output

```markdown
---
topic: [broad topic]
work_unit: [narrower work unit]
references:
  - .ramblings/briefs/...
  - .ramblings/plans/...
supersedes: [older handoff filename, optional]
status: active
---

# [Topic] Handoff

## Current objective

## Current state

## Read these first
- `.ramblings/briefs/...`
- `.ramblings/plans/...`

## Open questions / blockers

## Suggested next step

## Suggested next skills
- `ramblings-*`

## Notes to future session
```

## Guidance

- if the handoff claims the work is ready for review, validation, or completion, reference the latest `ramblings-ready-check` result or include equivalent evidence;
- new handoffs should use the normalized metadata contract even if older handoffs did not;
- older handoffs without frontmatter remain valid historical context; do not rewrite them by default just to match the new format;
- prefer forward-only migration unless an existing handoff is actively causing ambiguity for real resume work;
- optimize for continuation, not storytelling;
- keep it compact;
- call out what changed the plan or direction;
- redact or avoid sensitive information when it is not needed for continuation.
