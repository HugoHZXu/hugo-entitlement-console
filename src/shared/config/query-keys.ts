export const queryKeys = {
  products: ['products'] as const,
  product: (productId: string) => ['products', productId] as const,
  entitlements: ['entitlements'] as const,
  productEntitlements: (productId: string) => ['products', productId, 'entitlements'] as const,
  productEntitlementSummary: (productId: string) =>
    ['products', productId, 'entitlement-summary'] as const,
  allocatedUsers: (productId: string) => ['products', productId, 'allocated-users'] as const,
  activityLog: (productId: string) => ['products', productId, 'activity-log'] as const,
};
