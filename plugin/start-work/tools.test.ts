import { test } from "bun:test"
import * as assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile } from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { recordDelegatedLaneTerminalOutcome, reconcileAndRerunContinuation } from "./index"
import { startWorkTools } from "../tools/start-work"
import type { StartWorkChecklistState } from "./types"

function assertObjectToolResult(result: unknown): asserts result is { output: string; metadata?: Record<string, unknown> } {
  assert.equal(typeof result, "object")
  assert.ok(result !== null)
  const objectResult = result as { output?: unknown }
  assert.ok("output" in objectResult)
}

test("ramblings_start_work_rerun_continuation returns stable success metadata", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-tool-contract-"))
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })
  const checklistPath = path.join(projectRoot, ".ramblings", "checklists", "tool.yaml")

  await writeFile(checklistPath, `plan: .ramblings/plans/tool.md
active_task: null
execution_state: running
delegations: []
tasks:
  - id: task-1
    title: Todo
    status: not_started
    delegated_to: null
    waiting_on: null
    blocked_by: null
    unblock_when: null
    next_action: null
    last_update: null
`)

  const result = await startWorkTools.ramblings_start_work_rerun_continuation.execute({
    project_root: projectRoot,
    checklist_path: checklistPath,
  }, {} as never)

  assertObjectToolResult(result)
  assert.equal(result.metadata?.ok, true)
  assert.equal(result.metadata?.checklistPath, checklistPath)
  assert.equal(result.metadata?.planPath, ".ramblings/plans/tool.md")
  assert.equal(result.metadata?.continuationKind, "continue")
})

test("ramblings_start_work_rerun_continuation preserves specific checklist error codes", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-tool-error-"))
  const badChecklistPath = path.join(projectRoot, "bad.yaml")
  await writeFile(badChecklistPath, `plan: .ramblings/plans/tool.md
execution_state: running
tasks: []
notes:
  - label: invalid
`)

  const result = await startWorkTools.ramblings_start_work_rerun_continuation.execute({
    project_root: projectRoot,
    checklist_path: badChecklistPath,
  }, {} as never)

  assertObjectToolResult(result)
  assert.equal(result.metadata?.ok, false)
  assert.equal(result.metadata?.code, "CHECKLIST_VALIDATION_FAILED")
})

test("ramblings_start_work_resolve preserves original artifact resolution kind for non-resolved outcomes", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-tool-resolve-"))
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })

  const result = await startWorkTools.ramblings_start_work_resolve.execute({
    project_root: projectRoot,
  }, {} as never)

  assertObjectToolResult(result)
  assert.equal(result.metadata?.ok, true)
  assert.equal(result.metadata?.artifactResolutionKind, "no-active-plan")
  assert.equal(result.metadata?.continuationKind, "ask-user")
})

test("recordDelegatedLaneTerminalOutcome records the first delegated lane completion and clears task delegation", () => {
  const checklist: StartWorkChecklistState = {
    plan: ".ramblings/plans/tool.md",
    active_task: "task-1",
    execution_state: "waiting",
    delegations: [
      {
        name: "lane-1",
        role: "explorer",
        task_ref: "task-1",
        task_id: "lane-task-1",
        status: "running",
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Delegated task",
        status: "in_progress",
        delegated_to: { role: "explorer", task_id: "lane-task-1" },
        waiting_on: "lane_completion",
        blocked_by: null,
        unblock_when: null,
        next_action: null,
        last_update: null,
      },
    ],
  }

  const outcome = recordDelegatedLaneTerminalOutcome(checklist, "task-1", "lane completed")

  assert.equal(outcome.kind, "recorded")
  assert.equal(outcome.metadata.status, "recorded")
  assert.equal(outcome.checklist.tasks[0].delegated_to, null)
  assert.equal(outcome.checklist.tasks[0].waiting_on, null)
  assert.equal(outcome.checklist.delegations?.[0].status, "terminal_unreconciled")
})

test("recordDelegatedLaneTerminalOutcome does not redispatch or rewrite state on duplicate completion", () => {
  const checklist: StartWorkChecklistState = {
    plan: ".ramblings/plans/tool.md",
    active_task: "task-1",
    execution_state: "running",
    delegations: [
      {
        name: "lane-1",
        role: "explorer",
        task_ref: "task-1",
        task_id: "lane-task-1",
        status: "terminal_unreconciled",
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Delegated task",
        status: "in_progress",
        delegated_to: null,
        waiting_on: null,
        blocked_by: null,
        unblock_when: null,
        next_action: null,
        last_update: "lane completed",
      },
    ],
  }

  const outcome = recordDelegatedLaneTerminalOutcome(checklist, "task-1", "lane completed again")

  assert.equal(outcome.kind, "already-handled")
  assert.equal(outcome.metadata.ok, true)
  assert.equal(outcome.metadata.status, "already-handled")
  assert.equal(outcome.checklist.delegations?.[0].status, "terminal_unreconciled")
  assert.equal(outcome.checklist.tasks[0].delegated_to, null)
})

test("recordDelegatedLaneTerminalOutcome reports mapping mismatches clearly", () => {
  const checklist: StartWorkChecklistState = {
    plan: ".ramblings/plans/tool.md",
    active_task: "task-1",
    execution_state: "waiting",
    delegations: [
      {
        name: "lane-1",
        role: "explorer",
        task_ref: "task-1",
        task_id: "lane-task-1",
        status: "running",
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Delegated task",
        status: "in_progress",
        delegated_to: { role: "explorer", task_id: "other-lane" },
        waiting_on: "lane_completion",
        blocked_by: null,
        unblock_when: null,
        next_action: null,
        last_update: null,
      },
    ],
  }

  const outcome = recordDelegatedLaneTerminalOutcome(checklist, "task-1", "mismatch")

  assert.equal(outcome.kind, "mismatch")
  assert.equal(outcome.metadata.ok, false)
  assert.match(outcome.message, /stale delegated lane|does not match delegated lane task|mapped to a different registry lane/i)
  assert.equal(outcome.metadata.status, "mismatch")
})

test("recordDelegatedLaneTerminalOutcome marks missing-task errors as workflow failures", () => {
  const checklist: StartWorkChecklistState = {
    plan: ".ramblings/plans/tool.md",
    active_task: "task-1",
    execution_state: "running",
    tasks: [
      {
        id: "task-1",
        title: "Delegated task",
        status: "in_progress",
        delegated_to: { role: "explorer", task_id: "lane-task-1" },
        waiting_on: "lane_completion",
        blocked_by: null,
        unblock_when: null,
        next_action: null,
        last_update: null,
      },
    ],
  }

  const outcome = recordDelegatedLaneTerminalOutcome(checklist, "task-1", "missing")

  assert.equal(outcome.kind, "error")
  assert.equal(outcome.metadata.ok, false)
  assert.equal(outcome.metadata.status, "error")
})

test("reconcileAndRerunContinuation yields stable waiting, done, and continue outcomes", () => {
  const waiting = reconcileAndRerunContinuation(
    {
      plan: ".ramblings/plans/tool.md",
      active_task: "task-1",
      execution_state: "running",
      delegations: [
        {
          name: "lane-1",
          role: "explorer",
          task_ref: "task-1",
          task_id: "lane-task-1",
          status: "running",
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Delegated task",
          status: "in_progress",
          delegated_to: { role: "explorer", task_id: "lane-task-1" },
          waiting_on: "lane_completion",
          blocked_by: null,
          unblock_when: null,
          next_action: null,
          last_update: null,
        },
        {
          id: "task-2",
          title: "Next task",
          status: "not_started",
          delegated_to: null,
          waiting_on: null,
          blocked_by: null,
          unblock_when: null,
          next_action: null,
          last_update: null,
        },
      ],
    } satisfies StartWorkChecklistState,
    "task-1",
    "lane completed",
  )
  assert.equal(waiting.continuation.kind, "continue")

  const done = reconcileAndRerunContinuation(
    {
      plan: ".ramblings/plans/tool.md",
      active_task: "task-1",
      execution_state: "running",
      delegations: [
        {
          name: "lane-1",
          role: "explorer",
          task_ref: "task-1",
          task_id: "lane-task-1",
          status: "running",
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Delegated task",
          status: "complete",
          delegated_to: { role: "explorer", task_id: "lane-task-1" },
          waiting_on: "lane_completion",
          blocked_by: null,
          unblock_when: null,
          next_action: null,
          last_update: null,
        },
      ],
    } satisfies StartWorkChecklistState,
    "task-1",
    "lane completed",
  )
  assert.equal(done.continuation.kind, "done")

  const continueState = reconcileAndRerunContinuation(
    {
      plan: ".ramblings/plans/tool.md",
      active_task: "task-1",
      execution_state: "running",
      delegations: [
        {
          name: "lane-1",
          role: "explorer",
          task_ref: "task-1",
          task_id: "lane-task-1",
          status: "running",
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Delegated task",
          status: "in_progress",
          delegated_to: { role: "explorer", task_id: "lane-task-1" },
          waiting_on: "lane_completion",
          blocked_by: null,
          unblock_when: null,
          next_action: null,
          last_update: null,
        },
        {
          id: "task-2",
          title: "Next task",
          status: "not_started",
          delegated_to: null,
          waiting_on: null,
          blocked_by: null,
          unblock_when: null,
          next_action: null,
          last_update: null,
        },
      ],
    } satisfies StartWorkChecklistState,
    "task-1",
    "lane completed",
  )
  assert.equal(continueState.continuation.kind, "continue")
})
