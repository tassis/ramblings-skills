import { archive } from "./archive"
import { careful } from "./careful"
import { challengeMe } from "./challenge-me"
import { grillMe } from "./grill-me"
import { handoff } from "./handoff"
import { investigate } from "./investigate"
import { officeHours } from "./office-hours"
import { readyCheck } from "./ready-check"
import { resumeFromHandoff } from "./resume-from-handoff"
import { retro } from "./retro"
import { startFeature } from "./start-feature"
import { startWork } from "./start-work"
import { writePlan } from "./write-plan"
import { writeBrief } from "./write-brief"

export const ramblingsCommands = {
  "careful": careful,
  "archive": archive,
  "challenge-me": challengeMe,
  "grill-me": grillMe,
  "handoff": handoff,
  "investigate": investigate,
  "office-hours": officeHours,
  "ready-check": readyCheck,
  "resume-from-handoff": resumeFromHandoff,
  "retro": retro,
  "start-feature": startFeature,
  "start-work": startWork,
  "write-plan": writePlan,
  "write-brief": writeBrief
}
