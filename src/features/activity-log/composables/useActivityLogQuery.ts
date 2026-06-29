import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';

import { listActivityLogs } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';
import type { ActivityLogListInput, ActivityLogListResult } from '@/shared/types';

const PRODUCT_ACTIVITY_LOG_PAGE_SIZE = 50;

export function useActivityLogsQuery(input: MaybeRefOrGetter<ActivityLogListInput>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope),
    queryKey: computed(() => queryKeys.activityLogs(identityStore.entitlementScopeKey, toValue(input))),
    queryFn: () =>
      listActivityLogs({
        ...toValue(input),
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useProductActivityLogInfiniteQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useInfiniteQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    getNextPageParam: (lastPage: ActivityLogListResult, allPages: ActivityLogListResult[]) => {
      const loadedCount = allPages.reduce((total, page) => total + page.items.length, 0);

      return loadedCount < lastPage.totalElements ? allPages.length : undefined;
    },
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      listActivityLogs({
        organizationId: identityStore.selectedEntitlementOrganizationId,
        pageNumber: Number(pageParam),
        pageSize: PRODUCT_ACTIVITY_LOG_PAGE_SIZE,
        productId: toValue(productId),
        sortDirection: 'desc',
        sortField: 'eventTime',
      }),
    queryKey: computed(() =>
      queryKeys.productActivityLogs(identityStore.entitlementScopeKey, toValue(productId))
    ),
  });
}
