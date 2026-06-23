// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getProductEntitlementSummary,
  listActivityLog,
  listActivityLogs,
  listAllocatedUsers,
  listEntitlements,
  listProductUserAccess,
  resetMockEntitlementApiState,
  updateProductUserAllocations,
} from './entitlement-api';

async function resolveActivityLogs(input: Parameters<typeof listActivityLogs>[0] = {}) {
  vi.useFakeTimers();
  const activityLogsPromise = listActivityLogs(input);

  await vi.runAllTimersAsync();

  return activityLogsPromise;
}

describe('listActivityLogs', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the synthetic activity log dataset without pagination', async () => {
    const activityLogs = await resolveActivityLogs();

    expect(activityLogs.totalElements).toBeGreaterThan(1000);
    expect(activityLogs.items).toHaveLength(activityLogs.totalElements);
  });

  it('filters product-local activity records', async () => {
    const activityLogs = await resolveActivityLogs({ productId: 'prod-workflow-hub' });

    expect(activityLogs.totalElements).toBeGreaterThan(0);
    expect(activityLogs.items.every((entry) => entry.productId === 'prod-workflow-hub')).toBe(true);
  });

  it('searches activity records in the mock API layer', async () => {
    const activityLogs = await resolveActivityLogs({ searchString: 'Amelia Hart' });

    expect(activityLogs.totalElements).toBeGreaterThan(0);
    expect(
      activityLogs.items.every((entry) =>
        [entry.actor.displayName, entry.target.name, entry.summary, entry.productName].some(
          (value) => value.toLowerCase().includes('amelia hart')
        )
      )
    ).toBe(true);
  });

  it('sorts activity records in the mock API layer', async () => {
    const activityLogs = await resolveActivityLogs({
      sortDirection: 'asc',
      sortField: 'actor',
    });
    const actorNames = activityLogs.items.map((entry) => entry.actor.displayName.toLowerCase());
    const sortedActorNames = [...actorNames].sort((first, second) => first.localeCompare(second));

    expect(actorNames).toEqual(sortedActorNames);
  });
});

describe('listActivityLog', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps the product-scoped query available for product detail views', async () => {
    vi.useFakeTimers();
    const activityLogPromise = listActivityLog('prod-insight-studio');

    await vi.runAllTimersAsync();

    const activityLog = await activityLogPromise;

    expect(activityLog.length).toBeGreaterThan(0);
    expect(activityLog.every((entry) => entry.productId === 'prod-insight-studio')).toBe(true);
  });
});

describe('listAllocatedUsers', () => {
  afterEach(() => {
    resetMockEntitlementApiState();
  });

  it('returns product-scoped allocated users with seat usage tied to the product summary', async () => {
    const allocatedUsers = await listAllocatedUsers('prod-insight-studio');
    const entitlementSummary = await getProductEntitlementSummary('prod-insight-studio');
    const usedSeats = allocatedUsers.reduce((total, user) => total + user.seatQuantity, 0);

    expect(allocatedUsers).toHaveLength(34);
    expect(allocatedUsers.every((user) => user.productId === 'prod-insight-studio')).toBe(true);
    expect(usedSeats).toBe(entitlementSummary.allocatedQuantity);
    expect(entitlementSummary.availableQuantity).toBe(
      entitlementSummary.purchasedQuantity - usedSeats
    );
  });

  it('keeps allocated user seat totals aligned with each entitlement pool', async () => {
    const entitlements = await listEntitlements();

    for (const entitlement of entitlements) {
      const allocatedUsers = await listAllocatedUsers(entitlement.productId);
      const allocatedSeats = allocatedUsers
        .filter((user) => user.entitlementId === entitlement.id)
        .reduce((total, user) => total + user.seatQuantity, 0);

      expect(allocatedSeats).toBe(entitlement.allocatedQuantity);
    }
  });
});

describe('listProductUserAccess', () => {
  afterEach(() => {
    resetMockEntitlementApiState();
  });

  it('marks the initially used seats as selected user access rows', async () => {
    const userAccessRows = await listProductUserAccess('prod-insight-studio');
    const allocatedRows = userAccessRows.filter((row) => row.isAllocated);

    expect(userAccessRows.length).toBeGreaterThan(allocatedRows.length);
    expect(allocatedRows).toHaveLength(34);
    expect(allocatedRows.reduce((total, row) => total + row.seatQuantity, 0)).toBe(34);
  });

  it('persists submitted user allocation changes in mock API memory', async () => {
    const initialRows = await listProductUserAccess('prod-insight-studio');
    const initialAllocatedRowIds = initialRows
      .filter((row) => row.isAllocated)
      .map((row) => row.id);
    const userToAllocate = initialRows.find((row) => !row.isAllocated);

    if (!userToAllocate) {
      throw new Error('Expected at least one unallocated user access row.');
    }

    await updateProductUserAllocations({
      productId: 'prod-insight-studio',
      selectedUserIds: [...initialAllocatedRowIds, userToAllocate.id],
    });

    const entitlementSummary = await getProductEntitlementSummary('prod-insight-studio');
    const allocatedUsers = await listAllocatedUsers('prod-insight-studio');
    const updatedRows = await listProductUserAccess('prod-insight-studio');
    const updatedUser = updatedRows.find((row) => row.id === userToAllocate.id);

    expect(entitlementSummary.allocatedQuantity).toBe(35);
    expect(entitlementSummary.availableQuantity).toBe(55);
    expect(allocatedUsers).toHaveLength(35);
    expect(updatedUser?.isAllocated).toBe(true);
  });
});
