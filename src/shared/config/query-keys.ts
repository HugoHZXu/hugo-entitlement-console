import type { ActivityLogListInput } from '@/shared/types';

export const queryKeys = {
  activityLogsRoot: ['activity-log'] as const,
  products: ['products'] as const,
  product: (productId: string) => ['products', productId] as const,
  entitlements: ['entitlements'] as const,
  productEntitlements: (productId: string) => ['products', productId, 'entitlements'] as const,
  productEntitlementSummary: (productId: string) =>
    ['products', productId, 'entitlement-summary'] as const,
  allocatedUsers: (productId: string) => ['products', productId, 'allocated-users'] as const,
  productUserAccess: (productId: string) => ['products', productId, 'user-access'] as const,
  activityLogs: (input: ActivityLogListInput) => ['activity-log', input] as const,
  productActivityLogs: (productId: string) => ['products', productId, 'activity-log'] as const,
};
