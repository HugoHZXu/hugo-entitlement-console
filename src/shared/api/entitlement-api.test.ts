// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

import { listActivityLog, listActivityLogs } from './entitlement-api';

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
