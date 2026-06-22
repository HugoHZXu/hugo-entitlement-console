import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { listAllocatedUsers } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';

export function useAllocatedUsersQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.allocatedUsers(toValue(productId))),
    queryFn: () => listAllocatedUsers(toValue(productId)),
  });
}
