import type { Entitlement } from '@/shared/types';

export function getAvailableQuantity(entitlement: Entitlement): number {
  return entitlement.purchasedQuantity - entitlement.allocatedQuantity;
}
