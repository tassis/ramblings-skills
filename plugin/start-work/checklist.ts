import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import YAML from "yaml"
import {
  type StartWorkChecklistState,
  type StartWorkChecklistTask,
  type StartWorkDelegation,
  type StartWorkDelegationRegistryEntry,
  type StartWorkDelegationStatus,
  type StartWorkExecutionState,
  type StartWorkTaskStatus,
} from "./types"

const EXECUTION_STATES: StartWorkExecutionState[] = ["running", "waiting", "blocked", "replanning", "done", "ask-user"]
const TASK_STATUSES: StartWorkTaskStatus[] = ["not_started", "in_progress", "blocked", "complete"]
const DELEGATION_STATUSES: StartWorkDelegationStatus[] = ["running", "terminal_unreconciled", "terminal_reconciled", "cancelled_obsolete"]

export interface StartWorkTaskPatch {
  status?: StartWorkTaskStatus
  delegated_to?: StartWorkDelegation | null
  waiting_on?: string | null
  blocked_by?: string | null
  unblock_when?: string | null
  next_action?: string | null
  last_update?: string | null
}

export function updateChecklistTask(
  checklist: StartWorkChecklistState,
  taskId: string,
  patch: StartWorkTaskPatch,
): StartWorkChecklistState {
  return {
    ...checklist,
    tasks: checklist.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...patch,
          }
        : task,
    ),
  }
}

export function setActiveTask(
  checklist: StartWorkChecklistState,
  activeTaskId: string | null,
  executionState?: StartWorkExecutionState,
): StartWorkChecklistState {
  return {
    ...checklist,
    active_task: activeTaskId,
    execution_state: executionState ?? checklist.execution_state,
  }
}

export function upsertDelegationEntry(
  checklist: StartWorkChecklistState,
  entry: StartWorkDelegationRegistryEntry,
): StartWorkChecklistState {
  // Minimal lifecycle contract:
  // - dispatch creates or refreshes a `running` registry entry
  // - terminal hook return moves it to `terminal_unreconciled`
  // - reconcile + verify + checklist writeback move it to `terminal_reconciled`
  // - stale-lane cleanup may mark it `cancelled_obsolete`
  const delegations = checklist.delegations ?? []
  const existingIndex = delegations.findIndex((delegation) => delegation.task_id === entry.task_id)

  if (existingIndex === -1) {
    return {
      ...checklist,
      delegations: [...delegations, entry],
    }
  }

  return {
    ...checklist,
    delegations: delegations.map((delegation, index) => (index === existingIndex ? entry : delegation)),
  }
}

export function setDelegationStatus(
  checklist: StartWorkChecklistState,
  taskId: string,
  status: StartWorkDelegationStatus,
): StartWorkChecklistState {
  return {
    ...checklist,
    delegations: (checklist.delegations ?? []).map((delegation) =>
      delegation.task_ref === taskId
        ? {
            ...delegation,
            status,
          }
        : delegation,
    ),
  }
}

export function reconcileDelegatedLaneTerminalResult(
  checklist: StartWorkChecklistState,
  taskId: string,
  note?: string | null,
): StartWorkChecklistState {
  return setActiveTask(
    setDelegationStatus(
      clearTaskDelegation(checklist, taskId, {
        registryStatus: "terminal_reconciled",
        last_update: note ?? null,
      }),
      taskId,
      "terminal_reconciled",
    ),
    taskId,
    checklist.execution_state,
  )
}

export function applyContinuationWriteback(
  checklist: StartWorkChecklistState,
  continuation: { kind: "waiting" | "done" | "replanning" | "ask-user"; activeTaskId: string | null; reason: string; note?: string },
): StartWorkChecklistState {
  const updatedChecklist = continuation.activeTaskId
    ? updateChecklistTask(checklist, continuation.activeTaskId, {
        last_update: continuation.note ?? continuation.reason,
      })
    : checklist

  return setActiveTask(
    updatedChecklist,
    continuation.kind === "done" ? null : continuation.activeTaskId ?? checklist.active_task,
    continuation.kind,
  )
}

export function clearTaskDelegation(
  checklist: StartWorkChecklistState,
  taskId: string,
  options?: {
    keepRegistry?: boolean
    registryStatus?: StartWorkDelegationStatus
    waiting_on?: string | null
    last_update?: string | null
  },
): StartWorkChecklistState {
  let nextChecklist = updateChecklistTask(checklist, taskId, {
    delegated_to: null,
    waiting_on: options?.waiting_on ?? null,
    last_update: options?.last_update,
  })

  if (options?.keepRegistry === false) {
    nextChecklist = {
      ...nextChecklist,
      delegations: (nextChecklist.delegations ?? []).filter((delegation) => delegation.task_ref !== taskId),
    }
  } else if (options?.registryStatus) {
    const registryStatus = options.registryStatus

    nextChecklist = {
      ...nextChecklist,
      delegations: (nextChecklist.delegations ?? []).map((delegation) =>
        delegation.task_ref === taskId
          ? {
              ...delegation,
              status: registryStatus,
            }
          : delegation,
      ),
    }
  }

  return nextChecklist
}

export function assignTaskDelegation(
  checklist: StartWorkChecklistState,
  taskId: string,
  delegation: StartWorkDelegationRegistryEntry,
  options?: {
    waiting_on?: string | null
    last_update?: string | null
  },
): StartWorkChecklistState {
  return upsertDelegationEntry(
    updateChecklistTask(checklist, taskId, {
      delegated_to: {
        role: delegation.role,
        task_id: delegation.task_id,
      },
      waiting_on: options?.waiting_on ?? "lane_completion",
      last_update: options?.last_update ?? null,
    }),
    delegation,
  )
}

export async function writeChecklistState(
  projectRoot: string,
  checklistPath: string,
  checklist: StartWorkChecklistState,
) {
  const absolutePath = path.isAbsolute(checklistPath)
    ? checklistPath
    : path.join(projectRoot, checklistPath)

  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, serializeChecklistState(checklist), "utf8")
}

export async function readChecklistState(
  projectRoot: string,
  checklistPath: string,
): Promise<StartWorkChecklistState | null> {
  const result = await readChecklistStateDetailed(projectRoot, checklistPath)
  return result.kind === "ok" ? result.checklist : null
}

export type ReadChecklistStateResult =
  | { kind: "ok"; checklist: StartWorkChecklistState }
  | { kind: "not-found"; message: string }
  | { kind: "parse-failed"; message: string }
  | { kind: "validation-failed"; message: string }

export async function readChecklistStateDetailed(
  projectRoot: string,
  checklistPath: string,
): Promise<ReadChecklistStateResult> {
  const absolutePath = path.isAbsolute(checklistPath)
    ? checklistPath
    : path.join(projectRoot, checklistPath)

  try {
    const text = await readFile(absolutePath, "utf8")
    try {
      return {
        kind: "ok",
        checklist: parseChecklistState(text),
      }
    } catch (error) {
      return {
        kind: classifyChecklistParseError(error),
        message: error instanceof Error ? error.message : String(error),
      }
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        kind: "not-found",
        message: `Checklist file could not be found at ${absolutePath}.`,
      }
    }

    return {
      kind: "parse-failed",
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

export function serializeChecklistState(checklist: StartWorkChecklistState) {
  const normalized: StartWorkChecklistState = {
    ...checklist,
    delegations: checklist.delegations ?? [],
    notes: checklist.notes && checklist.notes.length > 0 ? checklist.notes : undefined,
  }

  return YAML.stringify(normalized, {
    indent: 2,
    lineWidth: 0,
    minContentWidth: 0,
  })
}

export function parseChecklistState(text: string): StartWorkChecklistState {
  const parsed = YAML.parse(text) as StartWorkChecklistState | null

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Checklist YAML did not parse to an object.")
  }

  validateChecklistState(parsed)

  return {
    plan: parsed.plan,
    active_task: parsed.active_task ?? null,
    execution_state: parsed.execution_state,
    delegations: parsed.delegations ?? [],
    tasks: (parsed.tasks ?? []).map(normalizeTask),
    notes: parsed.notes && parsed.notes.length > 0 ? parsed.notes : undefined,
  }
}

function normalizeTask(task: StartWorkChecklistTask): StartWorkChecklistTask {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    delegated_to: task.delegated_to ?? null,
    waiting_on: task.waiting_on ?? null,
    blocked_by: task.blocked_by ?? null,
    unblock_when: task.unblock_when ?? null,
    next_action: task.next_action ?? null,
    last_update: task.last_update ?? null,
  }
}

function validateChecklistState(checklist: StartWorkChecklistState) {
  if (typeof checklist.plan !== "string" || checklist.plan.length === 0) {
    throw new Error("Checklist plan must be a non-empty string.")
  }

  if (!EXECUTION_STATES.includes(checklist.execution_state)) {
    throw new Error(`Checklist execution_state is invalid: ${String(checklist.execution_state)}`)
  }

  if (checklist.active_task !== null && typeof checklist.active_task !== "string") {
    throw new Error("Checklist active_task must be a string or null.")
  }

  if (!Array.isArray(checklist.tasks)) {
    throw new Error("Checklist tasks must be an array.")
  }

  checklist.tasks.forEach(validateChecklistTask)

  if (checklist.delegations !== undefined) {
    if (!Array.isArray(checklist.delegations)) {
      throw new Error("Checklist delegations must be an array when present.")
    }

    checklist.delegations.forEach(validateDelegationEntry)
  }

  if (checklist.notes !== undefined) {
    if (!Array.isArray(checklist.notes) || checklist.notes.some((note) => typeof note !== "string")) {
      throw new Error("Checklist notes must be an array of strings when present.")
    }
  }
}

function validateChecklistTask(task: StartWorkChecklistTask) {
  if (typeof task.id !== "string" || task.id.length === 0) {
    throw new Error("Checklist task id must be a non-empty string.")
  }

  if (typeof task.title !== "string" || task.title.length === 0) {
    throw new Error(`Checklist task ${task.id} title must be a non-empty string.`)
  }

  if (!TASK_STATUSES.includes(task.status)) {
    throw new Error(`Checklist task ${task.id} has invalid status: ${String(task.status)}`)
  }

  validateNullableString(task.waiting_on, `Checklist task ${task.id} waiting_on`)
  validateNullableString(task.blocked_by, `Checklist task ${task.id} blocked_by`)
  validateNullableString(task.unblock_when, `Checklist task ${task.id} unblock_when`)
  validateNullableString(task.next_action, `Checklist task ${task.id} next_action`)
  validateNullableString(task.last_update, `Checklist task ${task.id} last_update`)

  if (task.delegated_to !== null) {
    validateDelegation(task.delegated_to, `Checklist task ${task.id} delegated_to`)
  }
}

function validateDelegationEntry(delegation: StartWorkDelegationRegistryEntry) {
  validateDelegation(delegation, "Checklist delegation entry")

  if (typeof delegation.name !== "string" || delegation.name.length === 0) {
    throw new Error("Checklist delegation entry name must be a non-empty string.")
  }

  if (typeof delegation.task_ref !== "string" || delegation.task_ref.length === 0) {
    throw new Error("Checklist delegation entry task_ref must be a non-empty string.")
  }

  if (!DELEGATION_STATUSES.includes(delegation.status)) {
    throw new Error(`Checklist delegation entry has invalid status: ${String(delegation.status)}`)
  }
}

function validateDelegation(delegation: StartWorkDelegation, label: string) {
  if (typeof delegation.role !== "string" || delegation.role.length === 0) {
    throw new Error(`${label} role must be a non-empty string.`)
  }

  if (typeof delegation.task_id !== "string" || delegation.task_id.length === 0) {
    throw new Error(`${label} task_id must be a non-empty string.`)
  }
}

function validateNullableString(value: string | null | undefined, label: string) {
  if (value !== null && value !== undefined && typeof value !== "string") {
    throw new Error(`${label} must be a string or null.`)
  }
}

function classifyChecklistParseError(error: unknown): Exclude<ReadChecklistStateResult["kind"], "ok" | "not-found"> {
  if (error instanceof Error) {
    if (error.message.startsWith("Checklist ")) {
      return "validation-failed"
    }

    if (error.message.includes("YAML")) {
      return "parse-failed"
    }
  }

  return "parse-failed"
}

function isNotFoundError(error: unknown) {
  return !!error && typeof error === "object" && "code" in error && error.code === "ENOENT"
}
