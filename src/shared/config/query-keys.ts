import type { ActivityLogListInput } from '@/shared/types';

export const queryKeys = {
  entitlementRoot: ['entitlement'] as const,
  activityLogsRoot: (scopeKey: string) => ['entitlement', scopeKey, 'activity-log'] as const,
  products: (scopeKey: string) => ['entitlement', scopeKey, 'products'] as const,
  product: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId] as const,
  entitlements: (scopeKey: string) => ['entitlement', scopeKey, 'entitlements'] as const,
  productEntitlements: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId, 'entitlements'] as const,
  productEntitlementSummary: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId, 'entitlement-summary'] as const,
  allocatedUsers: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId, 'allocated-users'] as const,
  productUserAccess: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId, 'user-access'] as const,
  activityLogs: (scopeKey: string, input: ActivityLogListInput) =>
    ['entitlement', scopeKey, 'activity-log', input] as const,
  productActivityLogs: (scopeKey: string, productId: string) =>
    ['entitlement', scopeKey, 'products', productId, 'activity-log'] as const,
};
