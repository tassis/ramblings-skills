# Architecture

## Layers

### `skills/`

Contains the actual `ramblings-*` skills. These define workflow guidance such as brainstorming, spec writing, ready checks, debugging, review, and challenge workflows.

See `docs/skills.md` for the current taxonomy, routing rules, and overlap guide.

### `plugin/`

Contains an OpenCode plugin that registers this repo's `skills/` path, injects optional commands into live config, and injects the custom `conductor` planning agent.

## Design decisions

- The plugin does **not** inject a global workflow bootstrap.
- The plugin does **not** override user-defined commands of the same name.
- The plugin does **not** override a user-defined `conductor` agent if one already exists.
- The plugin does **not** perform git actions.
- Commands are lightweight prompt shortcuts that encourage the right `ramblings-*` skill usage.
- `conductor` is the repo-owned planning surface; native `@plan` behavior remains outside this repo's contract.

## Installation model

The repo supports both git-backed plugin installation and direct local plugin-path development. The layout keeps the same `skills/` and `plugin/` split in either case so the command surface and skill paths stay stable.
