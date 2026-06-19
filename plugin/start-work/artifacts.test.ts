import { test } from "bun:test"
import * as assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import { resolveStartWorkArtifacts } from "./artifacts"

test("resolveStartWorkArtifacts archives one ready completed work unit at entry and continues with unfinished work", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-artifacts-test-"))
  await mkdir(path.join(projectRoot, ".ramblings", "plans"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "debug"), { recursive: true })

  await writeFile(path.join(projectRoot, ".ramblings", "plans", "2026-06-19-complete.md"), "# Complete\n**Status:** complete\n")
  await writeFile(path.join(projectRoot, ".ramblings", "checklists", "2026-06-19-complete.yaml"), `plan: .ramblings/plans/2026-06-19-complete.md
active_task: null
execution_state: done
delegations: []
tasks:
  - id: task-1
    title: Done
    status: complete
    delegated_to: null
    waiting_on: null
    blocked_by: null
    unblock_when: null
    next_action: null
    last_update: null
`)
  await writeFile(path.join(projectRoot, ".ramblings", "debug", "2026-06-19-complete-ready-check.md"), `## Ready Check

**Status:** ready

.ramblings/plans/2026-06-19-complete.md
`)

  await writeFile(path.join(projectRoot, ".ramblings", "plans", "2026-06-19-active.md"), "# Active\n**Status:** not started\n")
  await writeFile(path.join(projectRoot, ".ramblings", "checklists", "2026-06-19-active.yaml"), `plan: .ramblings/plans/2026-06-19-active.md
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

  const resolution = await resolveStartWorkArtifacts(projectRoot)

  assert.equal(resolution.kind, "resolved")
  assert.equal(resolution.candidate.planPath, ".ramblings/plans/2026-06-19-active.md")
  assert.ok(resolution.archiveAction)
  await assert.doesNotReject(() => readFile(path.join(projectRoot, ".ramblings", "archive", "2026-06-19-complete", "plan.md"), "utf8"))
  await assert.rejects(() => readFile(path.join(projectRoot, ".ramblings", "plans", "2026-06-19-complete.md"), "utf8"))
})

test("resolveStartWorkArtifacts asks user when a linked handoff still claims active work", async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "ramblings-handoff-conflict-test-"))
  await mkdir(path.join(projectRoot, ".ramblings", "plans"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "checklists"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "debug"), { recursive: true })
  await mkdir(path.join(projectRoot, ".ramblings", "handoffs"), { recursive: true })

  await writeFile(path.join(projectRoot, ".ramblings", "plans", "2026-06-19-complete.md"), "# Complete\n**Status:** complete\n")
  await writeFile(path.join(projectRoot, ".ramblings", "checklists", "2026-06-19-complete.yaml"), `plan: .ramblings/plans/2026-06-19-complete.md
active_task: null
execution_state: done
delegations: []
tasks:
  - id: task-1
    title: Done
    status: complete
    delegated_to: null
    waiting_on: null
    blocked_by: null
    unblock_when: null
    next_action: null
    last_update: null
`)
  await writeFile(path.join(projectRoot, ".ramblings", "debug", "2026-06-19-complete-ready-check.md"), `## Ready Check

**Status:** ready

.ramblings/plans/2026-06-19-complete.md
`)
  await writeFile(path.join(projectRoot, ".ramblings", "handoffs", "2026-06-19-complete.md"), `.ramblings/plans/2026-06-19-complete.md
status: active
remaining active execution work
`)

  const resolution = await resolveStartWorkArtifacts(projectRoot)

  assert.equal(resolution.kind, "ask-user")
  assert.match(resolution.reason, /handoff/i)
})
