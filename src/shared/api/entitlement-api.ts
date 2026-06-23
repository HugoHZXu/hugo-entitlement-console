import {
  mockActivityLogEntries,
  mockAllocatedUsers,
  mockEntitlements,
  mockProducts,
  mockUserAccessCandidates,
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
  UpdateProductUserAllocationsInput,
  UserAccessCandidate,
  UserAccessRow,
} from '@/shared/types';
import { normalizeActivityLogEntries } from './activity-log-normalizer';

const ACTIVITY_LOG_DELAY_MS = 180;
const MOCK_ALLOCATION_SUBMITTED_AT = '2026-06-24T00:00:00Z';

const resolveAsync = async <T>(value: T, delayMs = 0): Promise<T> =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), delayMs);
  });

const normalizedActivityLogEntries = normalizeActivityLogEntries(
  mockActivityLogEntries,
  mockProducts
);
let currentAllocatedUsers = [...mockAllocatedUsers];

function getAllocatedQuantity(entitlementId: string): number {
  return currentAllocatedUsers
    .filter((user) => user.entitlementId === entitlementId)
    .reduce((total, user) => total + user.seatQuantity, 0);
}

function getEntitlementWithCurrentAllocation(entitlement: Entitlement): Entitlement {
  return {
    ...entitlement,
    allocatedQuantity: getAllocatedQuantity(entitlement.id),
  };
}

function listCurrentEntitlements(): Entitlement[] {
  return mockEntitlements.map(getEntitlementWithCurrentAllocation);
}

function getProductUserAccessCandidates(productId: string): UserAccessCandidate[] {
  return mockUserAccessCandidates.filter((user) => user.productId === productId);
}

function getEntitlementById(entitlementId: string): Entitlement | undefined {
  return mockEntitlements.find((entitlement) => entitlement.id === entitlementId);
}

function toUserAccessRow(candidate: UserAccessCandidate): UserAccessRow {
  const allocatedUser = currentAllocatedUsers.find(
    (user) => user.productId === candidate.productId && user.id === candidate.id
  );

  return {
    ...candidate,
    entitlementCode: getEntitlementById(candidate.entitlementId)?.entitlementCode ?? 'n/a',
    isAllocated: Boolean(allocatedUser),
    allocatedAt: allocatedUser?.allocatedAt ?? null,
  };
}

function createAllocatedUser(
  candidate: UserAccessCandidate,
  previousAllocatedUser: AllocatedUser | undefined
): AllocatedUser {
  return {
    ...candidate,
    allocatedAt: previousAllocatedUser?.allocatedAt ?? MOCK_ALLOCATION_SUBMITTED_AT,
  };
}

function assertSelectedUsersBelongToProduct(
  productId: string,
  selectedUserIds: string[],
  candidatesById: Map<string, UserAccessCandidate>
) {
  const unknownUserId = selectedUserIds.find((userId) => !candidatesById.has(userId));

  if (unknownUserId) {
    throw new Error(`User ${unknownUserId} is not assignable to product ${productId}.`);
  }
}

function assertEntitlementCapacity(selectedCandidates: UserAccessCandidate[]) {
  for (const entitlement of mockEntitlements) {
    const selectedQuantity = selectedCandidates
      .filter((candidate) => candidate.entitlementId === entitlement.id)
      .reduce((total, candidate) => total + candidate.seatQuantity, 0);

    if (selectedQuantity > entitlement.purchasedQuantity) {
      throw new Error(`Selected users exceed available seats for ${entitlement.entitlementCode}.`);
    }
  }
}

export async function listProducts(): Promise<Product[]> {
  return resolveAsync(mockProducts);
}

export async function getProduct(productId: string): Promise<Product | undefined> {
  return resolveAsync(mockProducts.find((product) => product.id === productId));
}

export async function listEntitlements(): Promise<Entitlement[]> {
  return resolveAsync(listCurrentEntitlements());
}

export async function listEntitlementsByProduct(productId: string): Promise<Entitlement[]> {
  return resolveAsync(
    listCurrentEntitlements().filter((entitlement) => entitlement.productId === productId)
  );
}

export async function getProductEntitlementSummary(
  productId: string
): Promise<ProductEntitlementSummary> {
  const entitlements = listCurrentEntitlements().filter(
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
  return resolveAsync(currentAllocatedUsers.filter((user) => user.productId === productId));
}

export async function listProductUserAccess(productId: string): Promise<UserAccessRow[]> {
  return resolveAsync(getProductUserAccessCandidates(productId).map(toUserAccessRow));
}

export async function updateProductUserAllocations({
  productId,
  selectedUserIds,
}: UpdateProductUserAllocationsInput): Promise<UserAccessRow[]> {
  const uniqueSelectedUserIds = Array.from(new Set(selectedUserIds));
  const candidates = getProductUserAccessCandidates(productId);
  const candidatesById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const previousAllocatedUsersById = new Map(
    currentAllocatedUsers
      .filter((user) => user.productId === productId)
      .map((user) => [user.id, user])
  );

  assertSelectedUsersBelongToProduct(productId, uniqueSelectedUserIds, candidatesById);

  const selectedCandidates: UserAccessCandidate[] = [];

  for (const userId of uniqueSelectedUserIds) {
    const candidate = candidatesById.get(userId);

    if (candidate) {
      selectedCandidates.push(candidate);
    }
  }

  const nextAllocatedUsers = selectedCandidates.map((candidate) =>
    createAllocatedUser(candidate, previousAllocatedUsersById.get(candidate.id))
  );

  assertEntitlementCapacity(nextAllocatedUsers);

  currentAllocatedUsers = [
    ...currentAllocatedUsers.filter((user) => user.productId !== productId),
    ...nextAllocatedUsers,
  ];

  return listProductUserAccess(productId);
}

export function resetMockEntitlementApiState() {
  currentAllocatedUsers = [...mockAllocatedUsers];
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
    entry.actionLabel.defaultMessage,
    entry.actionLabel.id,
    entry.summary,
    entry.summaryMessage.defaultMessage,
    entry.summaryMessage.id,
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
