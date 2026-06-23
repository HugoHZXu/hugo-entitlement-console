---
name: local-hugo-ui-link
description: Set up or repair entitlement-console-portfolio local development against a separately cloned hugo-ui repository through the reusable symlink workflow. Use when the user asks to link this app to local hugo-ui without npm publishing, configure cross-repo local UI imports, create .local/hugo-ui.json, troubleshoot the hugo-ui symlink, or verify @hugo-ui/shadcn-vue resolves from a local clone.
---

# Local Hugo UI Link

Use this skill to connect `entitlement-console-portfolio` to a local `hugo-ui` clone without
publishing npm packages. Keep the reusable script generic; put machine-specific paths only in
ignored local config.

## Rules

- Do not hardcode a personal path in `scripts/setup-local-hugo-ui.mjs`.
- Do not commit `.local/hugo-ui.json`, `.codex/local-context.md`, the generated `hugo-ui` symlink,
  or `.local/*` backups.
- Prefer a sibling clone layout:

```text
<WORKSPACE_ROOT>/
  entitlement-console-portfolio/
  hugo-ui/
```

- Use `../hugo-ui` as the default local root when the sibling clone exists.
- If the `hugo-ui` clone is elsewhere, write that absolute or relative path only to
  `.local/hugo-ui.json`.
- Do not start dev servers unless the user explicitly asks.

## Workflow

1. Confirm the current repo is `entitlement-console-portfolio`.
2. Check whether `../hugo-ui` exists and contains `packages/shadcn-vue/src/index.ts`.
3. If no local `hugo-ui` clone can be found, ask the user for `<HUGO_UI_ROOT>` instead of guessing.
4. Create `.local/hugo-ui.json` with this shape:

```json
{
  "enabled": true,
  "root": "<HUGO_UI_ROOT>",
  "linkPath": "hugo-ui",
  "repository": "https://github.com/HugoHZXu/hugo-ui",
  "shareNodeModules": true
}
```

5. Run:

```bash
pnpm run setup:local-hugo-ui
pnpm install
pnpm run setup:local-hugo-ui
```

6. Verify:

```bash
readlink hugo-ui
git check-ignore -v hugo-ui .local/hugo-ui.json
pnpm run verify:hugo-ui
pnpm list @hugo-ui/shadcn-vue --depth 0
```

The committed package manifest should keep `@hugo-ui/shadcn-vue` on the npm version recorded in
`config/hugo-ui.json`. The local `hugo-ui/` symlink and `.local/hugo-ui.json` are ignored by Git and
only enable local source inspection or version-matched development.

## Repair Notes

- If `entitlement-console-portfolio/hugo-ui` is a real directory, do not overwrite it. Report that
  the in-repo directory must be removed or moved before the symlink can be created.
- If `entitlement-console-portfolio/hugo-ui` is a symlink to the wrong target, remove only that
  symlink and rerun setup.
- When `shareNodeModules` is enabled, the setup script may move only the Hugo UI repository root
  `node_modules` into `.local/hugo-ui-node-modules-backup-*`, then link that root directory to this
  app's `node_modules`. Do not move package-level directories such as
  `packages/shadcn-vue/node_modules`; Hugo UI's own local Storybook/Vite workflow may need those
  package workspace links.
- If an older setup run already moved `packages/shadcn-vue/node_modules` aside, rerun
  `pnpm run setup:local-hugo-ui`; the script should restore the latest matching backup when the
  package directory is missing. If no backup exists, run `pnpm install` in the Hugo UI repository
  after switching Hugo UI back to local mode.
