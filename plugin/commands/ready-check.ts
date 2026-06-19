export const readyCheck = {
  description: "Run a readiness gate before claiming work is ready for the next lifecycle step",
  template: "Use ramblings-ready-check. Inspect the current work unit's verification evidence, summarize what was actually checked, choose an explicit readiness state, and state the next step. Keep the result evidence-based and concise. Do not claim readiness from code inspection alone."
}
