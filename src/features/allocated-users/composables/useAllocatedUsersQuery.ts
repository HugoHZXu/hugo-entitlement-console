import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import {
  listAllocatedUsers,
  listProductUserAccess,
  updateProductUserAllocations,
} from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

export function useAllocatedUsersQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    queryKey: computed(() =>
      queryKeys.allocatedUsers(identityStore.entitlementScopeKey, toValue(productId))
    ),
    queryFn: () =>
      listAllocatedUsers(toValue(productId), {
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useProductUserAccessQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    queryKey: computed(() =>
      queryKeys.productUserAccess(identityStore.entitlementScopeKey, toValue(productId))
    ),
    queryFn: () =>
      listProductUserAccess(toValue(productId), {
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useUpdateProductUserAllocationsMutation(productId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient();
  const identityStore = useIdentitySessionStore();

  return useMutation({
    mutationFn: (selectedUserIds: string[]) =>
      updateProductUserAllocations({
        organizationId: identityStore.selectedEntitlementOrganizationId,
        productId: toValue(productId),
        selectedUserIds,
      }),
    onSuccess: async () => {
      const resolvedProductId = toValue(productId);
      const scopeKey = identityStore.entitlementScopeKey;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productUserAccess(scopeKey, resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.allocatedUsers(scopeKey, resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productEntitlementSummary(scopeKey, resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productEntitlements(scopeKey, resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.entitlements(scopeKey),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productActivityLogs(scopeKey, resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.activityLogsRoot(scopeKey),
        }),
      ]);
    },
  });
}
