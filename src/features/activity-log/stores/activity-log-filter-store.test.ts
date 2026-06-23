// @vitest-environment node

import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useActivityLogFilterStore } from './activity-log-filter-store';

describe('activity log filter store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with the default Activity Log sort and no search query', () => {
    const store = useActivityLogFilterStore();

    expect(store.sort).toEqual({
      columnId: 'eventTime',
      direction: 'desc',
    });
    expect(store.queryInput).toEqual({
      sortDirection: 'desc',
      sortField: 'eventTime',
    });
  });

  it('trims search text for the mock API query without rewriting the input value', () => {
    const store = useActivityLogFilterStore();

    store.setSearchString('  Amelia Hart  ');

    expect(store.searchString).toBe('  Amelia Hart  ');
    expect(store.queryInput).toEqual({
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
      sortDirection: 'asc',
      sortField: 'actor',
    });
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
      sortDirection: 'desc',
      sortField: 'eventTime',
    });
  });
});
