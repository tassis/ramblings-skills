# ramblings-skills

Custom OpenCode-oriented workflow skills and optional command shortcuts.

This repo provides two layers:

1. `skills/` — the actual `ramblings-*` skills
2. `plugin/` — an OpenCode plugin that:
   - registers this repo's `skills/` directory
   - injects optional commands such as `office-hours` and `plan-ceo-review`

## Principles

- no automatic commits, merges, or PR creation
- no global bootstrap mode
- skills are manually or contextually invoked, not forced globally
- commands are convenience entrypoints, not hidden workflow overrides

## Install from git-backed plugin spec

Add this to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "ramblings-skills@git+https://github.com/tassis/ramblings-skills.git"
  ]
}
```

Restart OpenCode after changing config.

## Local development install

If you are testing from a local clone instead of GitHub, you can still use a direct plugin path:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/workdir/ramblings-skills/plugin/ramblings-plugin.ts"
  ]
}
```

## Commands provided by the plugin

- `office-hours`
- `plan-ceo-review`
- `plan-eng-review`
- `qa-review`
- `careful`
- `retro`
- `investigate`
- `write-spec`
- `write-plan`
- `execute-plan`

See `docs/commands.md` for details.
