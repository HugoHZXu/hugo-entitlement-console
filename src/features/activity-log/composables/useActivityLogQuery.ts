import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';

import { listActivityLogs } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import type { ActivityLogListInput, ActivityLogListResult } from '@/shared/types';

const PRODUCT_ACTIVITY_LOG_PAGE_SIZE = 50;

export function useActivityLogsQuery(input: MaybeRefOrGetter<ActivityLogListInput>) {
  return useQuery({
    queryKey: computed(() => queryKeys.activityLogs(toValue(input))),
    queryFn: () => listActivityLogs(toValue(input)),
  });
}

export function useProductActivityLogInfiniteQuery(productId: MaybeRefOrGetter<string>) {
  return useInfiniteQuery({
    getNextPageParam: (lastPage: ActivityLogListResult, allPages: ActivityLogListResult[]) => {
      const loadedCount = allPages.reduce((total, page) => total + page.items.length, 0);

      return loadedCount < lastPage.totalElements ? allPages.length : undefined;
    },
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      listActivityLogs({
        pageNumber: Number(pageParam),
        pageSize: PRODUCT_ACTIVITY_LOG_PAGE_SIZE,
        productId: toValue(productId),
        sortDirection: 'desc',
        sortField: 'eventTime',
      }),
    queryKey: computed(() => queryKeys.productActivityLogs(toValue(productId))),
  });
}
