---
name: entitlement-console-feature-slice
description: Plan and implement hugo-entitlement-console feature slices while preserving Vue app, mock API, and external Hugo UI boundaries. Use for Products, Product Detail, Allocated Users, Activity Log, or future entitlement console slices.
---

# Hugo Entitlement Console Feature Slice

Use this skill before building business features in `src/pages`, `src/features`, `src/shared/api`,
or `src/shared/mocks`.

## Step 1: Identify The Layer

Classify each part of the work:

- external `@hugo-ui/shadcn-vue`: generic reusable component API consumed by the app
- route/page: Vue Router entry, page layout, and navigation
- feature: feature-local components, composables, and UI composition
- mock API: data contracts, aggregation, filtering, sorting, pagination, and Activity Log view models
- shared type: contract used by pages, composables, and mock services

Do not put business behavior into `@hugo-ui/shadcn-vue` for convenience. If the feature requires a
component API change, call out that the implementation belongs in the external Hugo UI repository.

## Step 2: Respect Current App Decisions

- This is a standalone Vue app, not a Module Federation remote.
- Side navigation centers on Products. Activity Log may appear as product-scoped sub navigation for hierarchy, but it is not a global route.
- Product detail is reached from product list rows/cards.
- Activity Log is product-local and belongs inside Product Detail.
- Allocated Users is reached from a product-scoped route.
- Mock API owns entitlement quantity aggregation and product-scoped filtering.

## Step 3: Avoid Frontend-Only Query Completion Before Mock Contract

If the feature involves loading, error, empty, pagination, search, filter, or sorting:

- define or inspect the mock API contract first
- keep page-local logic temporary and clearly scoped
- avoid building a complete local data/query layer that will conflict with later API replacement
- prefer UI skeletons over fake production behavior until the contract exists

## Step 4: Define The Slice Contract

For each feature slice, state:

- route and entry point
- data required
- owner of data transformation
- user actions
- empty/loading/error source
- tests and external design-system impact

For Activity Log, use `$activity-log-normalization`.
For mock data or public copy, use `$portfolio-desensitization-review`.

## Step 5: Validate

Typical validation:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

Run Hugo UI checks in the external design-system repository when a reusable component change is
required. Do not start a local dev server unless the user explicitly asks.
