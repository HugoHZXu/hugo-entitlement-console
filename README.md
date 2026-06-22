# Entitlement Console

Vue 3 portfolio app for entitlement management.

This repository contains a desensitized standalone admin console for Products, Entitlements, Allocated Users, and product-local Activity Log surfaces. It uses synthetic mock data only and does not connect to a real backend.

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

## Hugo UI

The app consumes `@hugo-ui/shadcn-vue` as an external npm package. Local source linking is optional and uses ignored local config plus a generated `hugo-ui/` symlink.

```bash
pnpm run setup:local-hugo-ui
pnpm run verify:hugo-ui
```
