# Hugo Entitlement Console

[English](README.md) | [简体中文](README.zh-CN.md)

A Vue 3 portfolio project demonstrating a B2B product entitlement management console. Manage product catalogs, seat allocations, and audit activity logs — all built with a modern Vue 3 + TypeScript stack.

## Quick Start

This app works with a local backend service. To run the full demo:

```bash
# 1. Start the backend (from hugo-saas-backend)
git clone https://github.com/HugoHZXu/hugo-saas-backend.git
cd hugo-saas-backend
pnpm install
pnpm run db:reset
pnpm run dev:services

# 2. Start the frontend (from this repo)
cd ../entitlement-console-portfolio
pnpm install
pnpm run dev
```

The backend services run on these local ports by default:

| Service | URL |
|---------|-----|
| Identity Service | `http://127.0.0.1:4320` |
| Entitlement Service (GraphQL) | `http://127.0.0.1:4317/graphql` |
| Entitlement Service (REST) | `http://127.0.0.1:4317` |

> **Note:** All data in this demo is synthetic. No real customer information is used.

## Features

- **Product Catalog** — Browse products with status, provider, platform, usage dimensions, and entitlement metadata.
- **Account Switching** — Switch between demo accounts with different organizations and access scopes.
- **Product Detail** — View entitlement summaries, seat availability, and product-scoped activity.
- **Seat Allocation** — Manage named-user assignments with search, draft selection, and capacity validation.
- **Activity Log** — Audit trail with pagination, search, sorting, and localized messages.
- **i18n** — Full English and Chinese UI via `vue-i18n`.

## Screenshots

### Products

The main product catalog showing available products with status and metadata.

![Products page](docs/images/products.png)

### Product Detail

Entitlement summary, seat usage, and recent activity for a selected product.

![Product detail page](docs/images/product-detail.png)

### Allocated Users

Seat management with search, multi-select, and capacity checking before saving changes.

![Allocated users page](docs/images/allocated-users.png)

### Activity Log

Global audit log with filtering, sorting, and pagination across all products.

![Activity Log page](docs/images/activity-log.png)

## Tech Stack

- **Framework:** Vue 3 + TypeScript, Vite
- **Routing:** Vue Router
- **State Management:** Pinia (client state), TanStack Vue Query (server state)
- **Tables:** TanStack Table (via DataGrid component)
- **Styling:** Tailwind CSS v4, `@hugo-ui/shadcn-vue` component library
- **i18n:** vue-i18n
- **Testing:** Vitest (unit), Playwright (E2E)
- **Tooling:** ESLint, Prettier, pnpm

## Related Projects

- [hugo-saas-backend](https://github.com/HugoHZXu/hugo-saas-backend) — Companion local backend providing identity and entitlement services.
- [hugo-ui](https://github.com/HugoHZXu/hugo-ui) — External design system (`@hugo-ui/shadcn-vue`).
- [hugo-saas-console](https://github.com/HugoHZXu/hugo-saas-console) — Related SaaS admin console frontend.

## Development

**Requirements:** Node.js `>=22.12.0`, pnpm `>=10.34.1`

```bash
pnpm install
pnpm run dev
```

Useful commands:

```bash
pnpm run typecheck    # Type checking
pnpm run lint         # ESLint
pnpm run test         # Unit tests (Vitest)
pnpm run test:e2e     # E2E tests (Playwright)
pnpm run build        # Production build
pnpm run verify       # Full verification (typecheck + lint + test + build)
```

### Local Design System Link

To develop against a local clone of `hugo-ui`:

```bash
pnpm run setup:local-hugo-ui
pnpm run verify:hugo-ui
```

## Project Structure

```
src/
  app/          App entry, providers, global styles, i18n
  routes/       Vue Router configuration
  layouts/      App shell layout
  pages/        Page components
  features/     Feature modules (composables, components, stores, styles)
  shared/       Shared API, config, stores, types, and utilities
```

For architectural details, see [docs/architecture.md](docs/architecture.md).

## Documentation

- [Architecture Overview](docs/architecture.md) (EN) | [架构说明](docs/architecture.zh-CN.md) (中文)

## License

MIT
