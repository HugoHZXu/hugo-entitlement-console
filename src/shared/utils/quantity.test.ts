import { describe, expect, it } from 'vitest';

import type { Entitlement } from '@/shared/types';
import { getAvailableQuantity } from './quantity';

describe('getAvailableQuantity', () => {
  it('subtracts allocated quantity from purchased quantity', () => {
    const entitlement: Entitlement = {
      id: 'ent-test',
      productId: 'prod-test',
      entitlementCode: 'ENT-TEST',
      usageDimensionCode: 'USER_SEAT',
      purchasedQuantity: 20,
      allocatedQuantity: 7,
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      source: 'marketplace',
    };

    expect(getAvailableQuantity(entitlement)).toBe(13);
  });
});
