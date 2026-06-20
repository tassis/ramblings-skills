import {
  assignTaskDelegation,
  clearTaskDelegation,
  applyContinuationWriteback,
  setActiveTask,
  setDelegationStatus,
  reconcileDelegatedLaneTerminalResult,
  updateChecklistTask,
  writeChecklistState,
} from "./checklist"
import { decideStartWorkContinuation, type StartWorkContinuationInput } from "./continuation"
import { getNextRunnableTask, resolveStartWorkArtifacts } from "./artifacts"
import {
  type StartWorkArtifactResolutionKind,
  type StartWorkChecklistState,
  type StartWorkContinuation,
  type StartWorkDelegationRegistryEntry,
  type StartWorkRecordTerminalToolMetadata,
  type StartWorkTaskSelection,
} from "./types"

export interface StartWorkLoopState {
  checklistPath: string
  checklist: StartWorkChecklistState
  taskSelection: StartWorkTaskSelection
  continuation: StartWorkContinuation
  archiveActions?: Array<{
    archivePath: string
    archivedFiles: string[]
    removedActiveFiles: string[]
  }>
}

export interface StartWorkLoopContinuationState {
  artifactResolutionKind: Exclude<StartWorkArtifactResolutionKind, "resolved">
  continuation: StartWorkContinuation
}

export async function resolveStartWorkLoop(projectRoot: string): Promise<StartWorkLoopState | StartWorkLoopContinuationState | StartWorkContinuation> {
  const artifactResolution = await resolveStartWorkArtifacts(projectRoot)

  if (artifactResolution.kind !== "resolved") {
    return {
      artifactResolutionKind: artifactResolution.kind,
      continuation: decideStartWorkContinuation({ artifactResolution }),
    }
  }

  if (!artifactResolution.checklist || !artifactResolution.candidate.checklistPath) {
    return {
      kind: "ask-user",
      reason: "The active plan does not yet have a YAML checklist execution-state artifact. Create or select one before continuing execution.",
      activeTaskId: null,
      note: artifactResolution.candidate.planPath,
    }
  }

  const taskSelection = getNextRunnableTask(artifactResolution.checklist)
  const continuation = decideStartWorkContinuation({
    artifactResolution,
    checklist: artifactResolution.checklist,
    taskSelection,
  })

  return {
    checklistPath: artifactResolution.candidate.checklistPath,
    checklist: artifactResolution.checklist,
    taskSelection,
    continuation,
    archiveActions: artifactResolution.archiveActions,
  }
}

export function dispatchDelegatedLane(
  checklist: StartWorkChecklistState,
  taskId: string,
  delegation: StartWorkDelegationRegistryEntry,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    assignTaskDelegation(checklist, taskId, delegation, {
      waiting_on: "lane_completion",
      last_update: note,
    }),
    taskId,
    "waiting",
  )
}

export function recordDelegatedLaneTerminalResult(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
): StartWorkChecklistState {
  return recordDelegatedLaneTerminalOutcome(checklist, taskId, note).checklist
}

export function recordDelegatedLaneTerminalOutcome(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
):
  | { kind: "recorded"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "already-handled"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "mismatch"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "error"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string } {
  const task = checklist.tasks.find((candidate) => candidate.id === taskId)
  if (!task) {
    return terminalOutcome(checklist, taskId, "mismatch", `Task ${taskId} was not found in the checklist.`, null)
  }

  if (!checklist.delegations) {
    return terminalOutcome(checklist, taskId, "error", `Checklist ${taskId} has no delegation registry for terminal reconciliation.`, null)
  }

  const registryEntry = checklist.delegations.find((delegation) => delegation.task_ref === taskId)
  const delegatedLaneTaskId = task.delegated_to?.task_id ?? null

  if (!registryEntry) {
    return terminalOutcome(checklist, taskId, "mismatch", `Task ${taskId} has no registry entry for its delegated lane.`, null)
  }

  if (registryEntry.task_ref !== taskId) {
    return terminalOutcome(checklist, taskId, "mismatch", `Task ${taskId} is mapped to a different registry lane.`, registryEntry.status)
  }

  if (delegatedLaneTaskId !== null && delegatedLaneTaskId !== registryEntry.task_id) {
    return terminalOutcome(checklist, taskId, "mismatch", `Task ${taskId} is mapped to a stale delegated lane.`, registryEntry.status)
  }

  if (task.delegated_to === null && registryEntry.status === "terminal_unreconciled") {
    return terminalOutcome(checklist, taskId, "already-handled", `Terminal result for ${taskId} was already recorded.`, registryEntry.status)
  }

  if (registryEntry.status !== "running") {
    return terminalOutcome(checklist, taskId, "mismatch", `Delegation for ${taskId} must be running before recording terminal output.`, registryEntry.status)
  }

  if (delegatedLaneTaskId !== registryEntry.task_id) {
    return terminalOutcome(checklist, taskId, "mismatch", `Task ${taskId} does not match delegated lane task ${registryEntry.task_id}.`, registryEntry.status)
  }

  const updatedChecklist = setActiveTask(
    clearTaskDelegation(
      setDelegationStatus(checklist, taskId, "terminal_unreconciled"),
      taskId,
      {
        registryStatus: "terminal_unreconciled",
        waiting_on: null,
        last_update: note,
      },
    ),
    taskId,
    "running",
  )

  return terminalOutcome(updatedChecklist, taskId, "recorded", `Recorded terminal result for ${taskId}.`, "terminal_unreconciled")
}

function terminalOutcome(
  checklist: StartWorkChecklistState,
  taskId: string,
  kind: "recorded" | "already-handled" | "mismatch" | "error",
  message: string,
  delegationStatus: string | null,
):
  | { kind: "recorded"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "already-handled"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "mismatch"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string }
  | { kind: "error"; checklist: StartWorkChecklistState; metadata: StartWorkRecordTerminalToolMetadata; message: string } {
  const metadata: StartWorkRecordTerminalToolMetadata = {
    ok: kind === "recorded" || kind === "already-handled",
    status: kind,
    taskId,
    checklistPath: "",
    executionState: checklist.execution_state,
    delegationStatus: (delegationStatus as StartWorkRecordTerminalToolMetadata["delegationStatus"]) ?? null,
    message,
  }

  return { kind, checklist, metadata, message }
}

export function recordBlockedTask(
  checklist: StartWorkChecklistState,
  taskId: string,
  blockedBy: string,
  unblockWhen: string,
  nextAction: string,
  note: string,
): StartWorkChecklistState {
  return setActiveTask(
    clearTaskDelegation(
      updateChecklistTask(checklist, taskId, {
        status: "blocked",
        blocked_by: blockedBy,
        unblock_when: unblockWhen,
        next_action: nextAction,
        last_update: note,
      }),
      taskId,
      {
        waiting_on: null,
        last_update: note,
      },
    ),
    taskId,
    "blocked",
  )
}

export function recordReplanningState(
  checklist: StartWorkChecklistState,
  taskId: string | null,
  note: string,
): StartWorkChecklistState {
  const updatedChecklist = taskId
    ? updateChecklistTask(checklist, taskId, {
        next_action: "route back to planning",
        last_update: note,
      })
    : checklist

  return setActiveTask(updatedChecklist, taskId, "replanning")
}

export async function writeLoopChecklist(
  projectRoot: string,
  loopState: StartWorkLoopState,
  checklist: StartWorkChecklistState,
) {
  await writeChecklistState(projectRoot, loopState.checklistPath, checklist)
}

export function rerunContinuation(checklist: StartWorkChecklistState): StartWorkContinuation {
  const taskSelection = getNextRunnableTask(checklist)
  const input: StartWorkContinuationInput = { checklist, taskSelection }
  return decideStartWorkContinuation(input)
}

export function reconcileAndRerunContinuation(
  checklist: StartWorkChecklistState,
  taskId: string,
  note: string,
): { checklist: StartWorkChecklistState; continuation: StartWorkContinuation } {
  const reconciled = reconcileDelegatedLaneTerminalResult(checklist, taskId, note)
  const continuation = rerunContinuation(reconciled)

  switch (continuation.kind) {
    case "waiting":
    case "done":
    case "replanning":
    case "ask-user":
      return {
        checklist: applyContinuationWriteback(reconciled, continuation as any),
        continuation,
      }
    case "continue":
      return { checklist: reconciled, continuation }
  }

  return { checklist: reconciled, continuation }
}
