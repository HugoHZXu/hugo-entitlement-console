import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getProduct, getProductEntitlementSummary, listProducts } from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

export function useProductsQuery() {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope),
    queryKey: computed(() => queryKeys.products(identityStore.entitlementScopeKey)),
    queryFn: () =>
      listProducts({
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useProductQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    queryKey: computed(() => queryKeys.product(identityStore.entitlementScopeKey, toValue(productId))),
    queryFn: () =>
      getProduct(toValue(productId), {
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useProductEntitlementSummaryQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    queryKey: computed(() =>
      queryKeys.productEntitlementSummary(identityStore.entitlementScopeKey, toValue(productId))
    ),
    queryFn: () =>
      getProductEntitlementSummary(toValue(productId), {
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}
