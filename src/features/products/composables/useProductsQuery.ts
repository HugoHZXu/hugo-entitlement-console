import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getProduct, getProductEntitlementSummary, listProducts } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';

export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: listProducts,
  });
}

export function useProductQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.product(toValue(productId))),
    queryFn: () => getProduct(toValue(productId)),
  });
}

export function useProductEntitlementSummaryQuery(productId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.productEntitlementSummary(toValue(productId))),
    queryFn: () => getProductEntitlementSummary(toValue(productId)),
  });
}
