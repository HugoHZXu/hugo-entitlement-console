// @vitest-environment node

import { describe, expect, it } from 'vitest';

import type { Entitlement, UserAccessRow } from '@/shared/types';
import {
  filterUserAccessRows,
  getAllocatedUserAccessRowIds,
  getOverCapacityEntitlement,
  getSelectedSeatQuantity,
  formatSeatChangeLabel,
  haveSameUserAccessSelection,
  normalizeUserAccessSelection,
  reconcileUserAccessSelection,
} from './allocated-user-selection';

const rows: UserAccessRow[] = [
  {
    id: 'usr-amelia-hart',
    productId: 'prod-insight-studio',
    entitlementId: 'ent-insight-studio-2026-001',
    entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
    seatQuantity: 1,
    name: 'Amelia Hart',
    email: 'amelia.hart@example.com',
    department: 'Enablement',
    status: 'active',
    isAllocated: true,
    allocatedAt: '2026-02-03T10:20:00Z',
  },
  {
    id: 'usr-dylan-fox',
    productId: 'prod-insight-studio',
    entitlementId: 'ent-insight-studio-2026-001',
    entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
    seatQuantity: 1,
    name: 'Dylan Fox',
    email: 'dylan.fox@example.com',
    department: 'Operations',
    status: 'active',
    isAllocated: false,
    allocatedAt: null,
  },
];

const entitlements: Entitlement[] = [
  {
    id: 'ent-insight-studio-2026-001',
    productId: 'prod-insight-studio',
    entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
    usageDimensionCode: 'named_user_count',
    purchasedQuantity: 1,
    allocatedQuantity: 1,
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2027-01-14',
    source: 'contract',
  },
];

describe('allocated user selection helpers', () => {
  it('normalizes selected ids for stable draft comparisons', () => {
    expect(
      normalizeUserAccessSelection(['usr-dylan-fox', 'usr-amelia-hart', 'usr-dylan-fox'])
    ).toEqual(['usr-amelia-hart', 'usr-dylan-fox']);
    expect(
      haveSameUserAccessSelection(
        ['usr-dylan-fox', 'usr-amelia-hart'],
        ['usr-amelia-hart', 'usr-dylan-fox']
      )
    ).toBe(true);
  });

  it('reads initial allocated rows as the checked selection', () => {
    expect(getAllocatedUserAccessRowIds(rows)).toEqual(['usr-amelia-hart']);
    expect(getSelectedSeatQuantity(['usr-amelia-hart'], rows)).toBe(1);
  });

  it('filters visible rows without changing selection inputs', () => {
    expect(filterUserAccessRows(rows, '')).toEqual(rows);
    expect(filterUserAccessRows(rows, 'dylan')).toEqual([rows[1]]);
    expect(filterUserAccessRows(rows, 'enablement')).toEqual([rows[0]]);
    expect(filterUserAccessRows(rows, 'missing')).toEqual([]);
  });

  it('formats draft seat changes as assignment intent', () => {
    expect(formatSeatChangeLabel(0)).toBe('No pending changes');
    expect(formatSeatChangeLabel(1)).toBe('1 seat will be assigned');
    expect(formatSeatChangeLabel(2)).toBe('2 seats will be assigned');
    expect(formatSeatChangeLabel(-1)).toBe('1 seat will be released');
    expect(formatSeatChangeLabel(-2)).toBe('2 seats will be released');
  });

  it('syncs selected ids when real rows arrive after an empty first pass', () => {
    expect(
      reconcileUserAccessSelection(['usr-amelia-hart'], {
        baselineSelectedRowIds: [],
        hasLoadedInitialSelection: true,
        selectedRowIds: [],
      })
    ).toEqual({
      baselineSelectedRowIds: ['usr-amelia-hart'],
      hasLoadedInitialSelection: true,
      selectedRowIds: ['usr-amelia-hart'],
    });
  });

  it('preserves draft selection when rows refresh after a user edit', () => {
    expect(
      reconcileUserAccessSelection(['usr-amelia-hart'], {
        baselineSelectedRowIds: ['usr-amelia-hart'],
        hasLoadedInitialSelection: true,
        selectedRowIds: ['usr-dylan-fox'],
      })
    ).toEqual({
      baselineSelectedRowIds: ['usr-amelia-hart'],
      hasLoadedInitialSelection: true,
      selectedRowIds: ['usr-dylan-fox'],
    });
  });

  it('detects over-capacity draft selections by entitlement pool', () => {
    expect(getOverCapacityEntitlement(['usr-amelia-hart'], rows, entitlements)).toBeUndefined();
    expect(
      getOverCapacityEntitlement(['usr-amelia-hart', 'usr-dylan-fox'], rows, entitlements)
        ?.entitlementCode
    ).toBe('LIC-INSIGHT-STUDIO-2026');
  });
});
