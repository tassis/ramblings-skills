# Commands

This page is the command reference for ramblings.

Use it when you already know you want a command-first entrypoint and need the quickest way to start the right workflow.

For deeper workflow routing across skills, see [`docs/skills.md`](skills.md).

## office-hours

Use for early discussion, scope discovery, and feature or product shaping.

## start-feature

Use for a substantial feature or project workflow that should move from discussion through brief, plan, execution, and ready-check.

This is the primary umbrella entrypoint for end-to-end lifecycle work.

## challenge-me

Use for structured multi-perspective challenge of the current idea, brief, plan, or in-progress change.

This command routes through the shared `Reviewer` agent (`@reviewer`) for a structured multi-perspective review panel.

For panel reviews, it should spawn one independent reviewer invocation per selected lens and synthesize only after those lane-specific positions are explicit.

Use `challenge-me` for multi-lens review panels, not for ordinary single-lens review requests.

## grill-me

Use for one-question-at-a-time pressure testing of the current idea, brief, plan, or approach.

This command stays question-driven rather than using the shared `Reviewer` panel flow.

For ordinary direct single-lens review, prefer using `@reviewer` with the requested angle explicitly instead of reaching for a panel workflow.

Examples:

- `@reviewer` — review this plan from the product perspective
- `@reviewer` — review this change from the engineering perspective
- `@reviewer` — review this feature from the QA perspective

## careful

Use to shift into a more conservative, high-risk workflow posture.

This is the primary entrypoint for careful/high-risk posture.

## handoff

Use to write transferable context for a future session or another agent.

Create a compact dated artifact under `.ramblings/handoffs/`.

- Keep handoffs append-only; do not overwrite a single `current.md` file.
- New handoffs should include compact frontmatter metadata: `topic`, `work_unit`, `references`, optional `supersedes`, and `status`.
- Keep the body reference-first rather than duplicating full briefs or plans.

## resume-from-handoff

Use to continue safely from the newest relevant handoff artifact.

Selection order:

1. exact `work_unit` match when available;
2. broader `topic` match;
3. exclude handoffs marked `superseded`, `stale`, or invalidated by newer source artifacts;
4. prefer explicit `supersedes` relationships;
5. then prefer the newest remaining dated handoff;
6. verify against referenced source artifacts before trusting it;
7. if multiple candidates remain equally plausible, ask the user.

Examples:

- Same topic, different work units:
  - `2026-06-18-ultrawork-status-handoff.md` with `work_unit: ultrawork-runtime-hardening`
  - `2026-06-19-ultrawork-status-handoff.md` with `work_unit: ultrawork-archive-cleanup`
  - If the requested continuation is runtime hardening, prefer the exact `work_unit` match even if another ultrawork handoff is newer.
- Explicit supersession:
  - `2026-06-18-ultrawork-status-handoff.md`
  - `2026-06-20-ultrawork-runtime-handoff.md` with `supersedes: 2026-06-18-ultrawork-status-handoff.md`
  - Prefer the newer superseding handoff after verifying its references.
- Ambiguity stop:
  - two handoffs imply the same work unit,
  - neither supersedes the other,
  - and current plan/checklist evidence does not clearly disambiguate.
  - In that case, stop and ask the user instead of guessing.

## retro

Use to capture lessons learned after meaningful work.

## investigate

Use to understand how an existing system or flow works before deciding next action.

## ready-check

Use to make an evidence-based readiness call before claiming work is ready for review, validation, completion, or archive.

This is the command-first readiness gate.

## archive

Use for explicit cleanup and archive work once a work unit is no longer an active execution candidate.

Use this when you want operator-driven archive cleanup or consolidation. For simple entry-time cleanup of one clearly completed work unit, `/start-work` may handle it automatically.

## write-brief

Use to turn converged discussion into a written brief.

## write-plan

Use to turn an approved direction into an implementation plan.

## start-work

Use to start or resume execution from the active unfinished plan under the current project's root `.ramblings/` directory.

The intended contract is for `/start-work` to route into a dedicated execution orchestrator rather than the planning-only `conductor`.

`start-work` should prefer a machine-readable YAML checklist under `.ramblings/checklists/` as the durable execution-state source of truth when one exists.

The plugin also exposes small deterministic custom tools for `start-work` so agents can resolve artifacts and write checklist state without reimplementing helper logic.

Use the repo-prefixed helper tool names when calling them directly:

- `ramblings_start_work_resolve`
- `ramblings_start_work_record_terminal`
- `ramblings_start_work_reconcile_and_rerun`
- `ramblings_start_work_record_blocked`
- `ramblings_start_work_rerun_continuation`

Minimum helper metadata contract:

- `ramblings_start_work_resolve`
  - stable metadata fields: `ok`, `artifactResolutionKind`, `checklistPath`, `planPath`, optional `taskSelectionKind`, `continuationKind`, `activeTaskId`, `reason`, `note`, `archiveAction`
- `ramblings_start_work_record_blocked`
  - stable metadata fields: `ok`, `taskId`, `checklistPath`, `executionState`, `blockedBy`, `unblockWhen`, `nextAction`
- `ramblings_start_work_record_terminal`
  - stable metadata fields: `ok`, `status`, `taskId`, `checklistPath`, `executionState`, `delegationStatus`, `message`
  - `ok: true` means the helper completed successfully (`recorded` or idempotent `already-handled`)
  - `ok: false` means the helper detected a workflow failure (`mismatch` or internal `error`); these no longer coexist with `ok: true`
- `ramblings_start_work_reconcile_and_rerun`
  - stable metadata fields: `ok`, `taskId`, `checklistPath`, `executionState`, `continuationKind`, `activeTaskId`, `reason`, `note`
- `ramblings_start_work_rerun_continuation`
  - stable metadata fields: `ok`, `checklistPath`, `planPath`, `continuationKind`, `activeTaskId`, `reason`, `note`
- checklist read errors should report one of: `CHECKLIST_NOT_FOUND`, `CHECKLIST_PARSE_FAILED`, or `CHECKLIST_VALIDATION_FAILED`

Within this framework, `start-work` is the primary execution surface. Plans make work executable, checklists keep execution state durable, and the retained helper path covers the non-trivial mechanics without claiming a full autonomous scheduler. Direct checklist edits remain acceptable for simple begin/complete transitions when no delegation, terminal-result handling, or continuation mechanics are involved.

The currently supported runtime boundary is **post-completion / half-automatic re-entry**, not a guaranteed pre-stop auto-resume callback. Completion may become observable, terminal state may be recorded and reconciled, and continuation may be rerun from persisted checklist state. When that automatic re-entry path is unavailable or insufficient, fall back to an explicit `/start-work` resume or equivalent session continuation.

Dispatch policy for `/start-work` is **subagent-first** when the next slice is bounded, specialist-shaped, and independently finishable. Keep orchestrator-direct work narrow:

- control-plane and artifact-state operations
- terminal-result reconciliation
- verification
- very small synchronous checks
- no-viable-delegation cases where delegation overhead clearly exceeds the work

Do not treat orchestrator self-parallelism as the default replacement for specialist delegation, and do not describe the current helper path as a full scheduler.

On entry, `/start-work` may evaluate completed work units for simple-path archive cleanup before resuming unfinished work. The first iteration is intentionally narrow: if exactly one completed work unit is clearly archive-eligible, it may package that work unit into `.ramblings/archive/`, clean the active-area plan/checklist copies, and then rerun discovery; ambiguous, missing-ready-check, or source-of-truth-conflicted cases must defer or ask instead of silently batch-archiving.

Recommended YAML execution-state shape:

```yaml
plan: .ramblings/plans/YYYY-MM-DD-topic.md
active_task: task-2
execution_state: running
delegations:
  - name: repo-discovery
    role: explorer
    task_id: ses_xxx
    task_ref: task-2
    status: running
tasks:
  - id: task-2
    title: Review helper-tool output contract examples
    status: in_progress
    delegated_to:
      role: reviewer
      task_id: ses_xxx
    waiting_on: lane_completion
    blocked_by: null
    unblock_when: null
    next_action: wait for terminal hook
    last_update: resolver lane dispatched
```

Rules:

- `status` remains the primary task state; do not replace it with `delegated`.
- Top-level `delegations` may record participating specialist sessions for resume/reconcile support.
- Delegation and waiting should be expressed as annotations such as `delegated_to` and `waiting_on`.
- The tool-backed path is reserved for artifact resolution, terminal-result recording, terminal reconciliation + rerun, blocker recording, and continuation decisions; simple begin/complete checklist state changes may be written directly only when those mechanics are not involved.
- First iteration scope assumes one active task and at most one active delegated lane per task.
- First iteration scope is sequential by default and does not assume routine same-type parallel delegation.
- Recommended registry lifecycle: `running` → `terminal_unreconciled` → `terminal_reconciled`, with `cancelled_obsolete` reserved for stale-lane cleanup after verified terminal completion.

Active discovery should ignore `.ramblings/archive/**`; archived plans are historical records, not execution candidates.

Archive only after the work is truly complete enough that no active execution should resume from it.

`ready-check` is a dedicated command-first readiness gate for evidence-based readiness claims.

`archive` is a dedicated operator-facing cleanup/consolidation command for completed work units and source-of-truth cleanup. `/start-work` may auto-archive only the extremely narrow single-work-unit simple path at entry; broader cleanup, consolidation, and ambiguity resolution still belong to the explicit `archive` command.
