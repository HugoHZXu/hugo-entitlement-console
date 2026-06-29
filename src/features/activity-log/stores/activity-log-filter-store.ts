import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import type {
  ActivityLogListInput,
  ActivityLogSortDirection,
  ActivityLogSortField,
} from '@/shared/types';

export interface ActivityLogSortState {
  columnId: ActivityLogSortField;
  direction: ActivityLogSortDirection;
}

export type ActivityLogSortInput =
  | {
      columnId: string;
      direction: ActivityLogSortDirection;
    }
  | null;

const defaultSort: ActivityLogSortState = {
  columnId: 'eventTime',
  direction: 'desc',
};
const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 50;
export const ACTIVITY_LOG_PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const activityLogSortFields: readonly ActivityLogSortField[] = [
  'actor',
  'summary',
  'product',
  'result',
  'eventTime',
];

function isActivityLogSortField(value: string): value is ActivityLogSortField {
  return activityLogSortFields.includes(value as ActivityLogSortField);
}

export const useActivityLogFilterStore = defineStore('activityLogFilters', () => {
  const pageNumber = ref(DEFAULT_PAGE_NUMBER);
  const pageSize = ref(DEFAULT_PAGE_SIZE);
  const searchString = ref('');
  const sortField = ref<ActivityLogSortField>(defaultSort.columnId);
  const sortDirection = ref<ActivityLogSortDirection>(defaultSort.direction);

  const sort = computed<ActivityLogSortState>(() => ({
    columnId: sortField.value,
    direction: sortDirection.value,
  }));

  const queryInput = computed<ActivityLogListInput>(() => {
    const input: ActivityLogListInput = {
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
      sortDirection: sortDirection.value,
      sortField: sortField.value,
    };
    const trimmedSearchString = searchString.value.trim();

    if (trimmedSearchString) {
      input.searchString = trimmedSearchString;
    }

    return input;
  });

  function setSearchString(nextSearchString: string) {
    searchString.value = nextSearchString;
    pageNumber.value = DEFAULT_PAGE_NUMBER;
  }

  function setPageNumber(nextPageNumber: number) {
    pageNumber.value = Number.isFinite(nextPageNumber)
      ? Math.max(DEFAULT_PAGE_NUMBER, Math.trunc(nextPageNumber))
      : DEFAULT_PAGE_NUMBER;
  }

  function setPageSize(nextPageSize: number) {
    const normalizedPageSize = ACTIVITY_LOG_PAGE_SIZE_OPTIONS.includes(
      nextPageSize as (typeof ACTIVITY_LOG_PAGE_SIZE_OPTIONS)[number]
    )
      ? nextPageSize
      : DEFAULT_PAGE_SIZE;

    pageSize.value = normalizedPageSize;
    pageNumber.value = DEFAULT_PAGE_NUMBER;
  }

  function setSort(nextSort: ActivityLogSortInput) {
    if (!nextSort) {
      sortField.value = defaultSort.columnId;
      sortDirection.value = defaultSort.direction;
      pageNumber.value = DEFAULT_PAGE_NUMBER;
      return;
    }

    if (!isActivityLogSortField(nextSort.columnId)) {
      return;
    }

    sortField.value = nextSort.columnId;
    sortDirection.value = nextSort.direction;
    pageNumber.value = DEFAULT_PAGE_NUMBER;
  }

  function resetFilters() {
    pageNumber.value = DEFAULT_PAGE_NUMBER;
    pageSize.value = DEFAULT_PAGE_SIZE;
    searchString.value = '';
    sortField.value = defaultSort.columnId;
    sortDirection.value = defaultSort.direction;
  }

  return {
    pageNumber,
    pageSize,
    queryInput,
    resetFilters,
    searchString,
    setPageNumber,
    setPageSize,
    setSearchString,
    setSort,
    sort,
    sortDirection,
    sortField,
  };
});
