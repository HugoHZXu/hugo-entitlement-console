import {
  mockActivityLogEntries,
  mockAllocatedUsers,
  mockEntitlements,
  mockProducts,
} from '@/shared/mocks';
import type {
  ActivityLogEntry,
  ActivityLogListInput,
  ActivityLogListResult,
  ActivityLogSortField,
  AllocatedUser,
  Entitlement,
  Product,
  ProductEntitlementSummary,
} from '@/shared/types';
import { normalizeActivityLogEntries } from './activity-log-normalizer';

const ACTIVITY_LOG_DELAY_MS = 180;

const resolveAsync = async <T>(value: T, delayMs = 0): Promise<T> =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), delayMs);
  });

const normalizedActivityLogEntries = normalizeActivityLogEntries(
  mockActivityLogEntries,
  mockProducts
);

export async function listProducts(): Promise<Product[]> {
  return resolveAsync(mockProducts);
}

export async function getProduct(productId: string): Promise<Product | undefined> {
  return resolveAsync(mockProducts.find((product) => product.id === productId));
}

export async function listEntitlements(): Promise<Entitlement[]> {
  return resolveAsync(mockEntitlements);
}

export async function listEntitlementsByProduct(productId: string): Promise<Entitlement[]> {
  return resolveAsync(
    mockEntitlements.filter((entitlement) => entitlement.productId === productId)
  );
}

export async function getProductEntitlementSummary(
  productId: string
): Promise<ProductEntitlementSummary> {
  const entitlements = mockEntitlements.filter(
    (entitlement) => entitlement.productId === productId
  );
  const purchasedQuantity = entitlements.reduce(
    (total, entitlement) => total + entitlement.purchasedQuantity,
    0
  );
  const allocatedQuantity = entitlements.reduce(
    (total, entitlement) => total + entitlement.allocatedQuantity,
    0
  );

  return resolveAsync({
    productId,
    purchasedQuantity,
    allocatedQuantity,
    availableQuantity: purchasedQuantity - allocatedQuantity,
  });
}

export async function listAllocatedUsers(productId: string): Promise<AllocatedUser[]> {
  return resolveAsync(mockAllocatedUsers.filter((user) => user.productId === productId));
}

function getActivityLogSortValue(entry: ActivityLogEntry, sortField: ActivityLogSortField): string {
  if (sortField === 'actor') {
    return entry.actor.displayName;
  }

  if (sortField === 'summary') {
    return entry.summary;
  }

  if (sortField === 'product') {
    return entry.productName;
  }

  if (sortField === 'result') {
    return entry.result;
  }

  return entry.eventTime;
}

function sortActivityLogEntries(
  entries: ActivityLogEntry[],
  input: ActivityLogListInput
): ActivityLogEntry[] {
  const sortField = input.sortField ?? 'eventTime';
  const sortDirection = input.sortDirection ?? 'desc';
  const direction = sortDirection === 'asc' ? 1 : -1;

  return [...entries].sort((first, second) => {
    const firstValue = getActivityLogSortValue(first, sortField).toLowerCase();
    const secondValue = getActivityLogSortValue(second, sortField).toLowerCase();

    if (firstValue < secondValue) {
      return -1 * direction;
    }

    if (firstValue > secondValue) {
      return 1 * direction;
    }

    return second.eventTime.localeCompare(first.eventTime);
  });
}

function matchesActivityLogSearch(entry: ActivityLogEntry, searchString: string): boolean {
  const search = searchString.trim().toLowerCase();

  if (!search) {
    return true;
  }

  return [
    entry.actor.displayName,
    entry.actor.email ?? '',
    entry.productName,
    entry.target.name,
    entry.action,
    entry.actionLabel,
    entry.summary,
    entry.result,
    entry.eventTime,
  ].some((value) => value.toLowerCase().includes(search));
}

export async function listActivityLogs(
  input: ActivityLogListInput = {}
): Promise<ActivityLogListResult> {
  const filteredEntries = normalizedActivityLogEntries.filter((entry) => {
    if (input.productId && entry.productId !== input.productId) {
      return false;
    }

    return matchesActivityLogSearch(entry, input.searchString ?? '');
  });

  return resolveAsync(
    {
      items: sortActivityLogEntries(filteredEntries, input),
      totalElements: filteredEntries.length,
    },
    ACTIVITY_LOG_DELAY_MS
  );
}

export async function listActivityLog(productId: string): Promise<ActivityLogEntry[]> {
  const activityLogs = await listActivityLogs({ productId });

  return activityLogs.items;
}
