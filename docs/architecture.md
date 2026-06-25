# Architecture

This document describes the current architecture of the Hugo Entitlement Console portfolio app. The app is a standalone Vue 3 product surface for a desensitized B2B SaaS entitlement management workflow.

## Application Role

The app owns its own routing, page composition, mock API layer, synthetic data, and product-local view models. It is conceptually related to the broader Hugo SaaS management console portfolio, but it is intentionally kept as an independent Vue and Tailwind CSS application instead of being wired into a micro frontend workspace.

It does not connect to a real backend. All product, entitlement, allocated user, and activity data is synthetic.

## Runtime Stack

- Vue 3 and TypeScript provide the application and component model.
- Vite provides local development and production build tooling.
- Vue Router owns route-level navigation.
- Pinia stores app-wide UI state such as current account/admin context and Activity Log filters.
- TanStack Vue Query owns async mock server state and cache invalidation.
- TanStack Table is consumed through the external DataGrid component API.
- `@hugo-ui/shadcn-vue` provides shared UI primitives and layout components.
- `vue-i18n` provides English and Chinese locale support.

## Route Map

All routes render inside `src/layouts/AppLayout.vue`.

| Route                                  | Page                 | Purpose                                                                 |
| -------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `/`                                    | redirect             | Sends visitors to `/products`.                                          |
| `/products`                            | `ProductListPage`    | Shows the product catalog.                                              |
| `/products/:productId`                 | `ProductDetailPage`  | Shows entitlement metadata, seat summary, and a product activity slice. |
| `/products/:productId/allocated-users` | `AllocatedUsersPage` | Manages named-user seat assignment for one product.                     |
| `/activity-log`                        | `ActivityLogPage`    | Shows synthetic entitlement activity records for the portfolio demo.    |

## Source Layout

```text
src/
  app/          Vue entry, providers, i18n, and global styles
  routes/       Vue Router configuration
  layouts/      Application shell layout
  pages/        Route-level page components
  features/     Feature-local composables, display helpers, stores, and styles
  shared/
    api/        Mock API functions and normalization logic
    config/     Shared query key definitions
    mocks/      Synthetic data seeds
    stores/     App-wide Pinia stores
    types/      Shared business view models
    utils/      Shared pure helpers
```

Pages compose feature modules but avoid reading mock data directly. Feature composables call the shared mock API and expose query or mutation results to route-level views.

## Data Flow

The app follows a client-side mock service pattern:

1. Route params identify the active product or view.
2. Page components call feature composables such as `useProductQuery`, `useProductUserAccessQuery`, or `useActivityLogsQuery`.
3. Feature composables call `src/shared/api/entitlement-api.ts`.
4. The mock API reads synthetic records from `src/shared/mocks`.
5. TanStack Vue Query caches the returned data by keys from `src/shared/config/query-keys.ts`.
6. Mutations invalidate affected query keys so the detail, entitlement summary, allocated users, and related table views stay consistent.

The allocated-user workflow keeps draft selection state in the page while persisted mock allocation state lives inside the mock API module for the current browser session.

## Domain Model

The shared view models are intentionally small and portfolio-safe:

- `Product`: product catalog entry with status, provider, usage dimensions, and entitlement metadata.
- `Entitlement`: license-like quantity record scoped to a product and usage dimension.
- `ProductEntitlementSummary`: purchased, allocated, and available quantity summary for one product.
- `AllocatedUser`: user with an assigned seat on a product entitlement.
- `UserAccessRow`: assignable user row enriched with entitlement code and allocation state.
- `RawActivityLogEntry`: synthetic audit event seed.
- `ActivityLogEntry`: normalized UI-ready activity row with product name, actor fallback, localized message metadata, and display summary.

Entitlements are modeled as product-detail data. They are not an independent top-level product area in this app.

## Activity Log Normalization

Raw activity events are normalized in `src/shared/api/activity-log-normalizer.ts` before reaching the UI. The normalizer:

- Resolves product names from product ids.
- Applies a system actor fallback when an event has no actor.
- Maps known action ids to display labels.
- Creates localized message metadata for action labels and summaries.
- Produces a display summary used by the DataGrid views.
- Preserves unknown actions through a generic fallback instead of failing the page.

This keeps mock event seeds simple while giving the UI a stable `ActivityLogEntry` contract.

## State Ownership

TanStack Vue Query owns server-like async state:

- products
- product details
- entitlements
- entitlement summaries
- allocated users
- assignable user access rows
- activity logs

Pinia owns app and UI state:

- current synthetic account/admin context
- Activity Log search and sort filters

Route-level draft UI state stays local to the page when it is not shared across routes.

## Design System Boundary

The app consumes `@hugo-ui/shadcn-vue` from the external `HugoHZXu/hugo-ui` repository. This repository does not own Hugo UI source code, Storybook, component package exports, publishing scripts, or changesets.

Local development can optionally link to a local `hugo-ui` clone through the ignored symlink workflow, but the app still imports Hugo UI through npm-style package imports.

## Testing And Validation

The project includes focused validation for the current behavior:

- Unit tests cover quantity helpers, allocated-user selection behavior, Activity Log filtering state, mock API behavior, and Activity Log normalization.
- Playwright covers the product workflow at the browser level.
- `pnpm run verify` runs Hugo UI mode verification, typecheck, lint, unit tests, and build.

## Portfolio Safety

This repository is designed for public portfolio use. It must not include real customer data, real endpoints, access tokens, production logs, private screenshots, private permission rules, or source copied from internal projects.

Allowed examples should remain generic B2B SaaS concepts such as Product, Entitlement, Usage Dimension, Allocated User, Available Quantity, Admin, Status, and Activity Log.
