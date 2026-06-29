import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import {
  getProductEntitlementSummary,
  listEntitlements,
  listEntitlementsByProduct,
} from '@/shared/api';
import { queryKeys } from '@/shared/config/query-keys';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

export function useEntitlementsQuery() {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope),
    queryKey: computed(() => queryKeys.entitlements(identityStore.entitlementScopeKey)),
    queryFn: () =>
      listEntitlements({
        organizationId: identityStore.selectedEntitlementOrganizationId,
      }),
  });
}

export function useProductEntitlementsQuery(productId: MaybeRefOrGetter<string>) {
  const identityStore = useIdentitySessionStore();

  return useQuery({
    enabled: computed(() => identityStore.hasUsableEntitlementScope && Boolean(toValue(productId))),
    queryKey: computed(() =>
      queryKeys.productEntitlements(identityStore.entitlementScopeKey, toValue(productId))
    ),
    queryFn: () =>
      listEntitlementsByProduct(toValue(productId), {
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
