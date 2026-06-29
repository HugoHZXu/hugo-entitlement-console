import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import {
  listAllocatedUsers,
  listProductUserAccess,
  updateProductUserAllocations,
} from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';

export function useAllocatedUsersQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.allocatedUsers(toValue(productId))),
    queryFn: () => listAllocatedUsers(toValue(productId)),
  });
}

export function useProductUserAccessQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.productUserAccess(toValue(productId))),
    queryFn: () => listProductUserAccess(toValue(productId)),
  });
}

export function useUpdateProductUserAllocationsMutation(productId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selectedUserIds: string[]) =>
      updateProductUserAllocations({
        productId: toValue(productId),
        selectedUserIds,
      }),
    onSuccess: async () => {
      const resolvedProductId = toValue(productId);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productUserAccess(resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.allocatedUsers(resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productEntitlementSummary(resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productEntitlements(resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.entitlements,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productActivityLogs(resolvedProductId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.activityLogsRoot,
        }),
      ]);
    },
  });
}
