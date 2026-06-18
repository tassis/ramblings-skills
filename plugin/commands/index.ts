import { careful } from "./careful"
import { conductorCommand } from "./conductor"
import { executePlan } from "./execute-plan"
import { handoff } from "./handoff"
import { investigate } from "./investigate"
import { officeHours } from "./office-hours"
import { planCeoReview } from "./plan-ceo-review"
import { planEngReview } from "./plan-eng-review"
import { qaReview } from "./qa-review"
import { resumeFromHandoff } from "./resume-from-handoff"
import { retro } from "./retro"
import { startFeature } from "./start-feature"
import { startWork } from "./start-work"
import { writePlan } from "./write-plan"
import { writeSpec } from "./write-spec"

export const ramblingsCommands = {
  "careful": careful,
  "conductor": conductorCommand,
  "execute-plan": executePlan,
  "handoff": handoff,
  "investigate": investigate,
  "office-hours": officeHours,
  "plan-ceo-review": planCeoReview,
  "plan-eng-review": planEngReview,
  "qa-review": qaReview,
  "resume-from-handoff": resumeFromHandoff,
  "retro": retro,
  "start-feature": startFeature,
  "start-work": startWork,
  "write-plan": writePlan,
  "write-spec": writeSpec
}
