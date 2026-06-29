# Hugo Entitlement Console

This is a portfolio app for B2B product entitlement management.

This repository contains a desensitized admin console for product entitlement management. Products are the primary navigation surface; allocated users, available quantity, usage dimensions, and Activity Log views are presented around the product workflow.

The app connects to local desensitized `identity-service` and `entitlement-service` backends for portfolio development. The service data remains synthetic and is scoped by the selected demo account's entitlement organization access.

## Feature Highlights

- Product catalog with status, provider, and entitlement metadata.
- Demo account switching backed by local `identity-service`.
- Entitlement organization scope selection from the selected account.
- Product detail workflow with entitlement summary and seat availability.
- Allocated user management with search, draft selection, and capacity validation.
- Activity Log views backed by the local entitlement service.
- English and Chinese locale support through `vue-i18n`.

## Screenshots

### Products

![Products page](docs/images/products.png)

### Product Detail

![Product detail page](docs/images/product-detail.png)

### Allocated Users

![Allocated users page](docs/images/allocated-users.png)

### Activity Log

![Activity Log page](docs/images/activity-log.png)

## Related Portfolio Projects

This project belongs to the same Hugo SaaS management console portfolio system as [HugoHZXu/hugo-saas-console](https://github.com/HugoHZXu/hugo-saas-console).

Conceptually, Hugo Entitlement Console represents another product surface in the same B2B SaaS administration domain. If it were built with the same frontend stack and integration conventions as Hugo SaaS Console, it could fit into that portfolio as a workspace-level module within the shared data model and micro frontend architecture.

This repository is intentionally kept as a standalone Vue 3 and Tailwind CSS application so I can practice building a focused product experience with a different frontend stack while preserving the same desensitized SaaS domain model.

## Tech Stack

- Vue 3 and TypeScript
- Vite
- Vue Router
- Pinia
- TanStack Vue Query
- TanStack Table
- Tailwind CSS v4
- `@hugo-ui/shadcn-vue`
- `vue-i18n`
- Vitest
- Playwright
- ESLint and Prettier
- pnpm

## Development

This project expects Node.js `>=22.12.0` and pnpm `>=10.34.1 <11`.

```bash
pnpm install
pnpm run dev
```

Local entitlement service defaults:

```bash
VITE_IDENTITY_SERVICE_URL=http://127.0.0.1:4320
VITE_ENTITLEMENT_GRAPHQL_URL=http://127.0.0.1:4317/graphql
VITE_ENTITLEMENT_REST_URL=http://127.0.0.1:4317
```

Common validation commands:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
pnpm run verify
```

## Design System

The UI is built with [`@hugo-ui/shadcn-vue`](https://github.com/HugoHZXu/hugo-ui), which comes from the external [HugoHZXu/hugo-ui](https://github.com/HugoHZXu/hugo-ui) design system repository.

This repository consumes Hugo UI as an application dependency. It does not own the design system source code, component library publishing flow, Storybook setup, or package release process.

For local development, the app can optionally link to a local clone of `hugo-ui` through the ignored local symlink workflow:

```bash
pnpm run setup:local-hugo-ui
pnpm run verify:hugo-ui
```

## Project Structure

- `src/app`: Vue application entry, providers, global styles, and i18n setup.
- `src/routes`: Vue Router configuration.
- `src/layouts`: application shell layout.
- `src/pages`: route-level product, allocated user, and Activity Log pages.
- `src/features`: feature-local UI composition, display helpers, composables, stores, and styles.
- `src/shared/api`: identity service client plus entitlement service GraphQL and REST API facade.
- `src/shared/mocks`: synthetic product, entitlement, allocated user, and Activity Log data.
- `src/shared/types`: shared business view models.

## Portfolio Safety

This is a desensitized portfolio project. It preserves reusable SaaS administration patterns without including private implementation details.

- All product, entitlement, user, and audit data is synthetic.
- The app does not include real customer records, production endpoints, checked-in access tokens, production logs, or private screenshots.
- Local service endpoints point to `127.0.0.1` and are intended for portfolio development only.
- Entitlement records exist as product-detail data; they are not modeled as an independent product area in this app.
- Hugo UI is an external design system dependency, not a component library owned by this repository.

## License

MIT
