# Install

## Recommended install

Add this to `opencode.json` and restart OpenCode:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "ramblings-skills@git+https://github.com/tassis/ramblings-skills.git"
  ]
}
```

## Local clone install

If you are developing from a local checkout, use a direct plugin path instead:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/workdir/ramblings-skills/plugin/ramblings-plugin.ts"
  ]
}
```

The plugin will:

- register `<repo>/skills`
- inject the bundled commands

## Notes

- If you already define a command with the same name in your own config, this plugin leaves your command untouched.
- Restart OpenCode after config changes.
