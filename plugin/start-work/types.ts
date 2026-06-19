export type StartWorkTaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "complete"

export type StartWorkExecutionState =
  | "running"
  | "waiting"
  | "blocked"
  | "replanning"
  | "done"
  | "ask-user"

export type StartWorkContinuationKind =
  | "continue"
  | "waiting"
  | "blocked"
  | "replanning"
  | "done"
  | "ask-user"

export type StartWorkSpecialistRole =
  | "orchestrator"
  | "explorer"
  | "librarian"
  | "reviewer"

export interface StartWorkDelegation {
  role: StartWorkSpecialistRole
  /** Delegated lane task id emitted by the specialist/tooling. */
  task_id: string
}

export type StartWorkDelegationStatus =
  | "running"
  | "terminal_unreconciled"
  | "terminal_reconciled"
  | "cancelled_obsolete"

export interface StartWorkDelegationRegistryEntry extends StartWorkDelegation {
  name: string
  /** Checklist task id that owns this delegation entry. */
  task_ref: string
  status: StartWorkDelegationStatus
}

export interface StartWorkChecklistTask {
  id: string
  title: string
  status: StartWorkTaskStatus
  delegated_to: StartWorkDelegation | null
  waiting_on: string | null
  blocked_by: string | null
  unblock_when: string | null
  next_action: string | null
  last_update: string | null
}

export interface StartWorkChecklistState {
  plan: string
  active_task: string | null
  execution_state: StartWorkExecutionState
  delegations?: StartWorkDelegationRegistryEntry[]
  tasks: StartWorkChecklistTask[]
  notes?: string[]
}

export interface StartWorkPlanCandidate {
  planPath: string
  checklistPath: string | null
  handoffPath: string | null
  readyCheckPath: string | null
}

export interface StartWorkArchiveCandidate {
  planPath: string
  checklistPath: string | null
  handoffPath: string | null
  readyCheckPath: string | null
}

export type StartWorkReadyCheckStatus = "ready" | "ready-for-review" | "ready-for-user-validation" | "not-ready"

export interface StartWorkArchiveEligibilityInput {
  candidate: StartWorkArchiveCandidate
  checklist: StartWorkChecklistState | null
  readyCheckStatus?: StartWorkReadyCheckStatus | null
  handoffClaimsActiveWork?: boolean
  hasConsolidationAmbiguity?: boolean
}

export type StartWorkArchiveDecisionKind = "auto-archive" | "ask-user" | "defer"

export interface StartWorkArchiveDecision {
  kind: StartWorkArchiveDecisionKind
  reason: string
}

export interface StartWorkArchiveAction {
  archivePath: string
  archivedFiles: string[]
  removedActiveFiles: string[]
}

export interface StartWorkArtifactConflict {
  reason: string
  details: string[]
}

export interface StartWorkArchiveDiscoveryResult {
  kind: "none" | "defer" | "ask-user" | "auto-archive"
  reason: string
  candidate?: StartWorkArchiveCandidate
  decision?: StartWorkArchiveDecision
  archiveAction?: StartWorkArchiveAction
}

export type StartWorkArtifactResolution =
  | {
      kind: "resolved"
      candidate: StartWorkPlanCandidate
      checklist: StartWorkChecklistState | null
      archiveAction?: StartWorkArchiveAction
    }
  | {
      kind: "ask-user"
      reason: string
      candidates: StartWorkPlanCandidate[]
    }
  | {
      kind: "no-active-plan"
      reason: string
      archiveAction?: StartWorkArchiveAction
    }
  | {
      kind: "conflict"
      conflict: StartWorkArtifactConflict
    }

export type StartWorkTaskSelection =
  | {
      kind: "task"
      task: StartWorkChecklistTask
    }
  | {
      kind: "waiting"
      reason: string
      task: StartWorkChecklistTask | null
    }
  | {
      kind: "blocked"
      reason: string
      task: StartWorkChecklistTask | null
    }
  | {
      kind: "done"
      reason: string
    }
  | {
      kind: "ask-user"
      reason: string
      taskIds: string[]
    }
  | {
      kind: "replanning"
      reason: string
    }

export interface StartWorkContinuation {
  kind: StartWorkContinuationKind
  reason: string
  activeTaskId: string | null
  note?: string
}

export type StartWorkArtifactResolutionKind = StartWorkArtifactResolution["kind"]

export interface StartWorkResolveToolMetadata {
  ok: true
  artifactResolutionKind: StartWorkArtifactResolutionKind
  checklistPath: string | null
  planPath: string | null
  taskSelectionKind?: StartWorkTaskSelection["kind"]
  continuationKind: StartWorkContinuationKind
  activeTaskId: string | null
  reason: string
  note: string | null
  archiveAction: StartWorkArchiveAction | null
}

export interface StartWorkRecordBlockedToolMetadata {
  ok: true
  taskId: string
  checklistPath: string
  executionState: StartWorkExecutionState
  blockedBy: string
  unblockWhen: string
  nextAction: string
}

export interface StartWorkRerunContinuationToolMetadata {
  ok: true
  checklistPath: string
  planPath: string
  continuationKind: StartWorkContinuationKind
  activeTaskId: string | null
  reason: string
  note: string | null
}

export interface StartWorkToolErrorMetadata {
  ok: false
  code: "CHECKLIST_NOT_FOUND" | "CHECKLIST_PARSE_FAILED" | "CHECKLIST_VALIDATION_FAILED"
  checklistPath?: string
  taskId?: string
}

export type StartWorkTerminalResultStatus = "recorded" | "already-handled" | "mismatch" | "error"

export interface StartWorkRecordTerminalToolMetadata {
  /**
   * `ok` reflects workflow success for the terminal-result helper.
   * `recorded` and `already-handled` are successful outcomes; `mismatch` and `error` are failures.
   */
  ok: boolean
  status: StartWorkTerminalResultStatus
  taskId: string
  checklistPath: string
  executionState: StartWorkExecutionState
  delegationStatus: StartWorkDelegationStatus | null
  message: string
}
