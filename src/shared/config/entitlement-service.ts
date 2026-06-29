const DEFAULT_ENTITLEMENT_GRAPHQL_URL = 'http://127.0.0.1:4317/graphql';
const DEFAULT_ENTITLEMENT_REST_URL = 'http://127.0.0.1:4317';
const DEFAULT_DEMO_ORGANIZATION_ID = 'org-demo-001';

export function getEntitlementGraphqlUrl(): string {
  return import.meta.env.VITE_ENTITLEMENT_GRAPHQL_URL ?? DEFAULT_ENTITLEMENT_GRAPHQL_URL;
}

export function getEntitlementRestUrl(): string {
  return import.meta.env.VITE_ENTITLEMENT_REST_URL ?? DEFAULT_ENTITLEMENT_REST_URL;
}

export function getDemoOrganizationId(): string {
  return import.meta.env.VITE_DEMO_ORGANIZATION_ID ?? DEFAULT_DEMO_ORGANIZATION_ID;
}
