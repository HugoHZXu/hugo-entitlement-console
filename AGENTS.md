# AGENTS

## Repo Role

- This repository is a standalone Vue 3 portfolio app for a desensitized B2B entitlement management console.
- It is conceptually a peer of the Organization and User management products in `admin-dashboard`, but is intentionally split out to practice Vue instead of joining the micro frontend system.
- The app owns Vue routing, page composition, mock API contracts, synthetic data, and product-local Activity Log view models.
- The design system is maintained in the separate `HugoHZXu/hugo-ui` repository. This repository consumes `@hugo-ui/shadcn-vue`; it does not own Hugo UI component source, Storybook, package publishing, or changesets.

## Core Boundaries

- Prefer small, feature-scoped changes. Avoid mixing unrelated edits across routing, data, and tooling.
- Do not edit generated output in `dist`, `coverage`, `playwright-report`, `test-results`, or `node_modules`.
- Preserve user changes already present in the worktree. Do not revert unrelated edits.
- If `.codex/local-context.md` exists, read it for local-only cross-repo context. Do not commit that file.
- Keep Hugo UI changes in the external `hugo-ui` repository unless the user explicitly asks to work across repositories.
- Do not add private company code, real customer data, real endpoints, access tokens, screenshots, production logs, or internal business rules.
- Use only synthetic B2B entitlement examples such as Product, Usage Dimension, Allocated User, Available Quantity, Admin, Status, and Activity Log. Entitlement records may exist as product-detail data, but they are not an independent page in this app.

## Portfolio-Specific Guardrails

- Treat this repository as a desensitized portfolio app, not an open-source copy of any prior product.
- Preserve reusable capability patterns only. Do not copy private implementation assets, class names, token names, endpoint names, screenshots, customer data, permission rules, or product-specific wording from external/internal projects.
- Mock data must be synthetic and should not resemble real customer records.
- Activity Log is product-local in this app. Do not add a global Activity Log route unless the user explicitly changes the scope.

## External Design System Boundary

- Import `@hugo-ui/shadcn-vue` through npm-style package imports.
- Local source linking uses the ignored `hugo-ui/` symlink plus `.local/hugo-ui.json`; do not commit the symlink or `.local/hugo-ui.json`.
- Keep docs clear that Hugo UI is external. Do not list Hugo UI packages as packages owned by this repository.
- Do not add component-library tests, stories, package exports, changesets, or publishing scripts to this repository.
- Do not override external component-library styles by default. Judge this by the final rendered/computed result, not only by whether a class was passed to the component. This includes global resets, cascade-layer ordering, inherited properties, parent selectors, and descendant selectors that change the component's rendered DOM or slot content. Use the library's public props, slots, variants, or wrapper elements for layout spacing unless the user explicitly asks for a component-level style override.
- If a task requires a reusable component API change, call out that the change belongs in the external design-system repository before editing.

## Current Architecture Boundaries

- `src/app`: Vue application entry and provider setup.
- `src/routes`: Vue Router configuration.
- `src/layouts`: application shell layout.
- `src/pages`: route-level pages.
- `src/features`: feature-local UI, composables, and view composition.
- `src/shared/api`: mock API functions and mock-service contracts.
- `src/shared/mocks`: synthetic data only.
- `src/shared/stores`: app-wide Pinia state.
- `src/shared/types`: shared business view models.

## Project Skills

- Use `$portfolio-desensitization-review` when adding mock data, business copy, docs, README content, Activity Log examples, or code adapted from prior experience.
- Use `$local-hugo-ui-link` when setting up or repairing local symlink-based linking to an external `hugo-ui` clone without npm publishing.
- Use `$entitlement-console-feature-slice` before implementing Products, Allocated Users, Product Detail, Activity Log, or future entitlement console slices.
- Use `$activity-log-normalization` before implementing Activity Log mock contracts, normalization, or audit-event view models.

## Plan Before Editing

- Make a brief plan first when the task changes routing, shared infra, external design-system consumption, public APIs, or mock data contracts.
- Skip formal planning only for narrow, low-risk edits such as a focused component usage fix, a local test update, or typo-level documentation change.
- If the change affects multiple architecture boundaries, state the impact surface before editing.

## Definition Of Done

- App behavior changes should include focused validation for the affected area.
- Mock API or data-contract changes should include tests when behavior changed.
- Public docs and README changes should stay aligned with the current architecture and external design-system boundary.
- Generated output must not be left behind in the worktree unless the user explicitly asked for build artifacts.
- Do not start a local dev server after code updates unless the user explicitly asks for it.

## Default Validation Ladder

- First: run the nearest unit, composable, or file-scoped validation that matches the change.
- Then: run `pnpm run typecheck` and `pnpm run lint` for app, routing, provider, or data-contract changes.
- Then: run `pnpm run build` for routing, styling, provider, dependency, or Vite changes.
- Use `pnpm run verify` for broad-impact infrastructure changes.

## Validation Failures And Stop Conditions

- If validation fails, first determine whether the failure was introduced by the current change or already existed.
- Do not fix unrelated pre-existing failures unless the user asked for broader repair.
- If a new failure is caused by the current patch, prefer shrinking the change over expanding into a broader refactor.
- If reliable validation is not possible, report the unverified area explicitly instead of implying success.

## Common Commands

- Install dependencies: `pnpm install`
- Verify Hugo UI dependency mode: `pnpm run verify:hugo-ui`
- Set up local Hugo UI link: `pnpm run setup:local-hugo-ui`
- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Unit tests: `pnpm run test`
- Build: `pnpm run build`
- E2E tests: `pnpm run test:e2e`
