import type { Entitlement, UserAccessRow } from '@/shared/types';

export interface UserAccessSelectionState {
  baselineSelectedRowIds: string[];
  hasLoadedInitialSelection: boolean;
  selectedRowIds: string[];
}

export interface SeatChangeDescriptor {
  action: 'assigned' | 'none' | 'released';
  count: number;
}

export function normalizeUserAccessSelection(rowIds: string[]): string[] {
  return Array.from(new Set(rowIds)).sort((first, second) => first.localeCompare(second));
}

export function haveSameUserAccessSelection(first: string[], second: string[]): boolean {
  const normalizedFirst = normalizeUserAccessSelection(first);
  const normalizedSecond = normalizeUserAccessSelection(second);

  return (
    normalizedFirst.length === normalizedSecond.length &&
    normalizedFirst.every((rowId, index) => rowId === normalizedSecond[index])
  );
}

export function getAllocatedUserAccessRowIds(rows: UserAccessRow[]): string[] {
  return normalizeUserAccessSelection(rows.filter((row) => row.isAllocated).map((row) => row.id));
}

export function reconcileUserAccessSelection(
  nextAllocatedRowIds: string[],
  state: UserAccessSelectionState
): UserAccessSelectionState {
  const nextBaseline = normalizeUserAccessSelection(nextAllocatedRowIds);
  const shouldSyncDraft =
    !state.hasLoadedInitialSelection ||
    haveSameUserAccessSelection(state.selectedRowIds, state.baselineSelectedRowIds);

  return {
    baselineSelectedRowIds: nextBaseline,
    hasLoadedInitialSelection: true,
    selectedRowIds: shouldSyncDraft ? [...nextBaseline] : state.selectedRowIds,
  };
}

export function getSelectedSeatQuantity(rowIds: string[], rows: UserAccessRow[]): number {
  const rowById = new Map(rows.map((row) => [row.id, row]));

  return rowIds.reduce((total, rowId) => total + (rowById.get(rowId)?.seatQuantity ?? 0), 0);
}

export function formatSeatChangeLabel(seatDelta: number): string {
  const descriptor = getSeatChangeDescriptor(seatDelta);

  if (descriptor.action === 'none') {
    return 'No pending changes';
  }

  const seatLabel = descriptor.count === 1 ? 'seat' : 'seats';

  return `${descriptor.count} ${seatLabel} will be ${descriptor.action}`;
}

export function getSeatChangeDescriptor(seatDelta: number): SeatChangeDescriptor {
  if (seatDelta === 0) {
    return {
      action: 'none',
      count: 0,
    };
  }

  return {
    action: seatDelta > 0 ? 'assigned' : 'released',
    count: Math.abs(seatDelta),
  };
}

export function getDraftEntitlementUsage(
  rowIds: string[],
  rows: UserAccessRow[]
): Map<string, number> {
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const usage = new Map<string, number>();

  for (const rowId of rowIds) {
    const row = rowById.get(rowId);

    if (row) {
      usage.set(row.entitlementId, (usage.get(row.entitlementId) ?? 0) + row.seatQuantity);
    }
  }

  return usage;
}

export function getOverCapacityEntitlement(
  rowIds: string[],
  rows: UserAccessRow[],
  entitlements: Entitlement[]
): Entitlement | undefined {
  const usage = getDraftEntitlementUsage(rowIds, rows);

  return entitlements.find(
    (entitlement) => (usage.get(entitlement.id) ?? 0) > entitlement.purchasedQuantity
  );
}
