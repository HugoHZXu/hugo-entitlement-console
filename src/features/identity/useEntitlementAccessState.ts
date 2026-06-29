import { computed } from 'vue';

import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

export type EntitlementPageAccessStateKind =
  | 'noEntitlementScope'
  | 'organizationUnavailable'
  | null;

export function useEntitlementPageAccessState() {
  const identityStore = useIdentitySessionStore();

  return computed<EntitlementPageAccessStateKind>(() => {
    if (!identityStore.hasEntitlementScope) {
      return 'noEntitlementScope';
    }

    if (!identityStore.hasUsableEntitlementScope) {
      return 'organizationUnavailable';
    }

    return null;
  });
}
