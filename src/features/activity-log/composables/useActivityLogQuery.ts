import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { listActivityLog } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';

export function useActivityLogQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.activityLog(toValue(productId))),
    queryFn: () => listActivityLog(toValue(productId)),
  });
}
