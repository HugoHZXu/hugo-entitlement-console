// @vitest-environment node

import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useActivityLogFilterStore } from './activity-log-filter-store';

describe('activity log filter store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with the default Activity Log sort, pagination, and no search query', () => {
    const store = useActivityLogFilterStore();

    expect(store.sort).toEqual({
      columnId: 'eventTime',
      direction: 'desc',
    });
    expect(store.queryInput).toEqual({
      pageNumber: 0,
      pageSize: 50,
      sortDirection: 'desc',
      sortField: 'eventTime',
    });
  });

  it('trims search text for the service query without rewriting the input value', () => {
    const store = useActivityLogFilterStore();

    store.setSearchString('  Amelia Hart  ');

    expect(store.searchString).toBe('  Amelia Hart  ');
    expect(store.queryInput).toEqual({
      pageNumber: 0,
      pageSize: 50,
      searchString: 'Amelia Hart',
      sortDirection: 'desc',
      sortField: 'eventTime',
    });
  });

  it('updates sorting when the grid selects a supported Activity Log column', () => {
    const store = useActivityLogFilterStore();

    store.setSort({
      columnId: 'actor',
      direction: 'asc',
    });

    expect(store.sort).toEqual({
      columnId: 'actor',
      direction: 'asc',
    });
    expect(store.queryInput).toEqual({
      pageNumber: 0,
      pageSize: 50,
      sortDirection: 'asc',
      sortField: 'actor',
    });
  });

  it('resets to the first page when filters change', () => {
    const store = useActivityLogFilterStore();

    store.setPageNumber(3);
    store.setSearchString('quantity');

    expect(store.pageNumber).toBe(0);

    store.setPageNumber(4);
    store.setSort({
      columnId: 'summary',
      direction: 'asc',
    });

    expect(store.pageNumber).toBe(0);
  });

  it('limits page size to the supported Activity Log page size options', () => {
    const store = useActivityLogFilterStore();

    store.setPageNumber(2);
    store.setPageSize(100);

    expect(store.pageSize).toBe(100);
    expect(store.pageNumber).toBe(0);
    expect(store.queryInput).toEqual({
      pageNumber: 0,
      pageSize: 100,
      sortDirection: 'desc',
      sortField: 'eventTime',
    });

    store.setPageSize(500);

    expect(store.pageSize).toBe(50);
  });

  it('ignores unsupported sort columns from generic grid events', () => {
    const store = useActivityLogFilterStore();

    store.setSort({
      columnId: 'type',
      direction: 'asc',
    });

    expect(store.sort).toEqual({
      columnId: 'eventTime',
      direction: 'desc',
    });
  });

  it('resets filters back to the default query state', () => {
    const store = useActivityLogFilterStore();

    store.setSearchString('quantity');
    store.setSort({
      columnId: 'summary',
      direction: 'asc',
    });
    store.resetFilters();

    expect(store.searchString).toBe('');
    expect(store.queryInput).toEqual({
      pageNumber: 0,
      pageSize: 50,
      sortDirection: 'desc',
      sortField: 'eventTime',
    });
  });
});
