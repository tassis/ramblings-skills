import { test } from "bun:test"
import * as assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { decideSimplePathArchiveEligibility, performSimplePathArchive } from "./archive"
import type { StartWorkChecklistState } from "./types"

function completeChecklist(planPath: string): StartWorkChecklistState {
  return {
    plan: planPath,
    active_task: null,
    execution_state: "done",
    delegations: [],
    tasks: [
      {
        id: "task-1",
        title: "Done task",
        status: "complete",
        delegated_to: null,
        waiting_on: null,
        blocked_by: null,
        unblock_when: null,
        next_action: null,
        last_update: null,
      },
    ],
  }
}

test("decideSimplePathArchiveEligibility returns auto-archive when ready-check is ready", () => {
  const candidate = {
    planPath: ".ramblings/plans/2026-06-19-topic.md",
    checklistPath: ".ramblings/checklists/2026-06-19-topic.yaml",
    handoffPath: null,
    readyCheckPath: ".ramblings/debug/2026-06-19-topic-ready-check.md",
  }

  const decision = decideSimplePathArchiveEligibility({
    candidate,
    checklist: completeChecklist(candidate.planPath),
    readyCheckStatus: "ready",
  })

  assert.equal(decision.kind, "auto-archive")
})

test("decideSimplePathArchiveEligibility defers when no ready-check evidence exists", () => {
  const candidate = {
    planPath: ".ramblings/plans/2026-06-19-topic.md",
    checklistPath: ".ramblings/checklists/2026-06-19-topic.yaml",
    handoffPath: null,
    readyCheckPath: null,
  }

  const decision = decideSimplePathArchiveEligibility({
    candidate,
    checklist: completeChecklist(candidate.planPath),
    readyCheckStatus: null,
  })

  assert.equal(decision.kind, "defer")
})

test("performSimplePathArchive packages files and removes active plan/checklist copies", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-archive-test-"))
  await mkdir(path.join(projectRoot, ".ramblings", "plans"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "debug"), { recursive: true })

  const candidate = {
    planPath: ".ramblings/plans/2026-06-19-topic.md",
    checklistPath: ".ramblings/checklists/2026-06-19-topic.yaml",
    handoffPath: null,
    readyCheckPath: ".ramblings/debug/2026-06-19-topic-ready-check.md",
  }

  await writeFile(path.join(projectRoot, candidate.planPath), "# Plan\n")
  await writeFile(path.join(projectRoot, candidate.checklistPath), "plan: .ramblings/plans/2026-06-19-topic.md\nexecution_state: done\ntasks: []\n")
  await writeFile(path.join(projectRoot, candidate.readyCheckPath), "## Ready Check\n\n**Status:** ready\n\n.ramblings/plans/2026-06-19-topic.md\n")

  const action = await performSimplePathArchive(projectRoot, candidate, completeChecklist(candidate.planPath))

  assert.equal(action.archivePath, ".ramblings/archive/2026-06-19-topic")
  await assert.doesNotReject(() => readFile(path.join(projectRoot, ".ramblings", "archive", "2026-06-19-topic", "plan.md"), "utf8"))
  await assert.doesNotReject(() => readFile(path.join(projectRoot, ".ramblings", "archive", "2026-06-19-topic", "checklist.yaml"), "utf8"))
  await assert.doesNotReject(() => readFile(path.join(projectRoot, ".ramblings", "archive", "2026-06-19-topic", "ready-check.md"), "utf8"))
  await assert.rejects(() => readFile(path.join(projectRoot, candidate.planPath), "utf8"))
  await assert.rejects(() => readFile(path.join(projectRoot, candidate.checklistPath), "utf8"))
  await assert.rejects(() => readFile(path.join(projectRoot, candidate.readyCheckPath), "utf8"))
})

test("decideSimplePathArchiveEligibility asks user when linked handoff still claims active work", () => {
  const candidate = {
    planPath: ".ramblings/plans/2026-06-19-topic.md",
    checklistPath: ".ramblings/checklists/2026-06-19-topic.yaml",
    handoffPath: ".ramblings/handoffs/2026-06-19-topic.md",
    readyCheckPath: ".ramblings/debug/2026-06-19-topic-ready-check.md",
  }

  const decision = decideSimplePathArchiveEligibility({
    candidate,
    checklist: completeChecklist(candidate.planPath),
    readyCheckStatus: "ready",
    handoffClaimsActiveWork: true,
  })

  assert.equal(decision.kind, "ask-user")
})

test("performSimplePathArchive fails when archive destination already exists and preserves active files", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-archive-collision-"))
  await mkdir(path.join(projectRoot, ".ramblings", "plans"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "archive", "2026-06-19-topic"), { recursive: true })

  const candidate = {
    planPath: ".ramblings/plans/2026-06-19-topic.md",
    checklistPath: ".ramblings/checklists/2026-06-19-topic.yaml",
    handoffPath: null,
    readyCheckPath: null,
  }

  await writeFile(path.join(projectRoot, candidate.planPath), "# Plan\n")
  await writeFile(path.join(projectRoot, candidate.checklistPath), "plan: .ramblings/plans/2026-06-19-topic.md\nexecution_state: done\ntasks: []\n")

  await assert.rejects(() => performSimplePathArchive(projectRoot, candidate, completeChecklist(candidate.planPath)), /Archive destination already exists/)
  await assert.doesNotReject(() => readFile(path.join(projectRoot, candidate.planPath), "utf8"))
  await assert.doesNotReject(() => readFile(path.join(projectRoot, candidate.checklistPath), "utf8"))
})
