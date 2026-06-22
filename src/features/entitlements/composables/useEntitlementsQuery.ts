import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { listEntitlements, listEntitlementsByProduct } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';

export function useEntitlementsQuery() {
  return useQuery({
    queryKey: queryKeys.entitlements,
    queryFn: listEntitlements,
  });
}

export function useProductEntitlementsQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.productEntitlements(toValue(productId))),
    queryFn: () => listEntitlementsByProduct(toValue(productId)),
  });
}
