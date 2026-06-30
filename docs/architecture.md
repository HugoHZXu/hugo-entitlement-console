# Architecture

[English](architecture.md) | [简体中文](architecture.zh-CN.md)

This document gives a high-level overview of how the Hugo Entitlement Console is structured.

## Overview

Hugo Entitlement Console is a standalone Vue 3 + Tailwind CSS application. It works alongside a local backend ([hugo-saas-backend](https://github.com/HugoHZXu/hugo-saas-backend)) that provides identity and entitlement services.

## Tech Stack

- Vue 3 + TypeScript with Vite as the build tool
- Vue Router for client-side routing
- Pinia for client-side state (session, filters)
- TanStack Vue Query for server state and caching
- TanStack Table (via a shared DataGrid component)
- `@hugo-ui/shadcn-vue` as the UI component library (from the external [hugo-ui](https://github.com/HugoHZXu/hugo-ui) repo)
- vue-i18n for English/Chinese localization
- Vitest for unit tests, Playwright for E2E tests

## Routes

All routes render within the app shell layout (`src/layouts/AppLayout.vue`).

| Route | Page | Description |
|-------|------|-------------|
| `/` | — | Redirects to `/products` |
| `/products` | `ProductListPage` | Product catalog |
| `/products/:productId` | `ProductDetailPage` | Product overview with entitlement summary and activity |
| `/products/:productId/allocated-users` | `AllocatedUsersPage` | Seat allocation management for a product |
| `/activity-log` | `ActivityLogPage` | Global audit log |

## Directory Layout

```
src/
  app/          App entry, providers, global styles, i18n
  routes/       Vue Router configuration
  layouts/      App shell layout
  pages/        Page components
  features/     Feature modules (composables, components, stores, styles)
  shared/
    api/        API clients (GraphQL + REST)
    config/     Service URLs and query key definitions
    mocks/      Synthetic data for tests and fallback
    stores/     Global Pinia stores
    types/      Shared TypeScript types
    utils/      Utility functions
```

The codebase follows a feature-based organization. Pages compose feature modules, and feature composables call shared API clients rather than reaching directly into transport layers.

## Backend Integration

The app connects to two local services during development:

| Service | Default URL | Purpose |
|---------|-------------|---------|
| Identity Service | `http://127.0.0.1:4320` | Demo accounts, authentication tokens, `/userinfo` |
| Entitlement Service (GraphQL) | `http://127.0.0.1:4317/graphql` | Read queries (products, entitlements, activity log) |
| Entitlement Service (REST) | `http://127.0.0.1:4317` | Write commands (seat allocation changes) |

Configure service URLs via environment variables:

```bash
VITE_IDENTITY_SERVICE_URL=http://127.0.0.1:4320
VITE_ENTITLEMENT_GRAPHQL_URL=http://127.0.0.1:4317/graphql
VITE_ENTITLEMENT_REST_URL=http://127.0.0.1:4317
```

All entitlement requests are scoped to the selected organization and authenticated with the current demo account token.

## Data Flow

Data flows through a layered architecture:

1. **Pages** render UI and call feature composables based on route parameters.
2. **Feature composables** (e.g., `useProductQuery`, `useActivityLogsQuery`) use TanStack Vue Query to fetch data via shared API clients, scoped by the selected account and organization.
3. **API clients** in `src/shared/api/` handle GraphQL queries, REST commands, request authentication, and response normalization.
4. **TanStack Vue Query** caches results and invalidates stale data after mutations to keep views in sync.

Draft UI state (like pending user selections before save) stays local to the page, while persisted state lives on the backend.

## Domain Model

Key business types:

- **Product** — A catalog entry with status, provider, usage dimensions, and metadata.
- **Entitlement** — A quantity record scoped to a product and usage dimension (e.g., licensed seats).
- **ProductEntitlementSummary** — Purchased, allocated, and available seat counts for a product.
- **AllocatedUser** — A user assigned to a seat on a product entitlement.
- **UserAccessRow** — An assignable user with their current allocation state.
- **ActivityLogEntry** — A normalized audit log entry with product context, actor info, and localized display text.

## State Management

Two types of state coexist in the app:

- **Server state** (products, entitlements, allocations, activity logs) is managed by TanStack Vue Query. Cache keys are scoped by account and organization, so switching contexts automatically refetches data under the new scope.
- **Client state** (session info, selected organization, search/filter preferences) is managed by Pinia.
- Transient UI state (draft selections, toggles) stays local to components.

## Testing

- **Unit tests** (Vitest) cover utility functions, composable behavior, store logic, and API client contracts.
- **E2E tests** (Playwright) cover the main product workflow in a real browser.

Run `pnpm run verify` to execute the full validation suite (type check + lint + unit tests + build).
