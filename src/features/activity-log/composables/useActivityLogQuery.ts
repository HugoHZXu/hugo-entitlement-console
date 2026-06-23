import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { listActivityLog, listActivityLogs } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import type { ActivityLogListInput } from '@/shared/types';

export function useActivityLogsQuery(input: MaybeRefOrGetter<ActivityLogListInput>) {
  return useQuery({
    queryKey: computed(() => queryKeys.activityLogs(toValue(input))),
    queryFn: () => listActivityLogs(toValue(input)),
  });
}

export function useActivityLogQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.activityLog(toValue(productId))),
    queryFn: () => listActivityLog(toValue(productId)),
  });
}
