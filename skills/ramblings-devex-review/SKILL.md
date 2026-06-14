---
name: ramblings-devex-review
description: Developer experience review, workflow friction review, CLI and tooling review, maintainability of scripts and setup. Use when an idea, tool, script, setup flow, or implementation should be challenged from the developer-experience perspective: usability for maintainers, setup pain, debugging friction, and operational clarity.
---

# Ramblings DevEx Review

Use this skill to evaluate whether the developer-facing experience is coherent and maintainable.

## Core questions

Ask:

1. How painful is this to set up, run, or debug?
2. What knowledge is assumed but undocumented?
3. Where will future maintainers stumble?
4. Are scripts, commands, and flows obvious enough?
5. Is the workflow harder than the problem requires?

## Review areas

### Setup and onboarding

- how many hidden prerequisites exist;
- whether file locations, commands, and environment variables are obvious;
- whether a newcomer could get running without tribal knowledge.

### Operational clarity

- whether logs, outputs, and errors are understandable;
- whether failures point to the right next action;
- whether scripts have clear entry points and expectations.

### Maintenance friction

- whether future edits will require too much context;
- whether commands or scripts are overly magical;
- whether naming and layout help or hinder maintainers.

## Suggested output

```markdown
## DevEx Review

**Main friction points:**
- [item]

**Hidden assumptions:**
- [item]

**Improvements worth making:**
- [item]

**Recommended direction:**
- [short recommendation]
```

## Guidance

- focus on maintainer and operator experience, not end-user UX;
- challenge unnecessary setup complexity;
- prefer explicitness over cleverness when workflow reliability matters.
