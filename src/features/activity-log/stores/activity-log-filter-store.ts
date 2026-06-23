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
  const searchString = ref('');
  const sortField = ref<ActivityLogSortField>(defaultSort.columnId);
  const sortDirection = ref<ActivityLogSortDirection>(defaultSort.direction);

  const sort = computed<ActivityLogSortState>(() => ({
    columnId: sortField.value,
    direction: sortDirection.value,
  }));

  const queryInput = computed<ActivityLogListInput>(() => {
    const input: ActivityLogListInput = {
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
  }

  function setSort(nextSort: ActivityLogSortInput) {
    if (!nextSort) {
      sortField.value = defaultSort.columnId;
      sortDirection.value = defaultSort.direction;
      return;
    }

    if (!isActivityLogSortField(nextSort.columnId)) {
      return;
    }

    sortField.value = nextSort.columnId;
    sortDirection.value = nextSort.direction;
  }

  function resetFilters() {
    searchString.value = '';
    sortField.value = defaultSort.columnId;
    sortDirection.value = defaultSort.direction;
  }

  return {
    queryInput,
    resetFilters,
    searchString,
    setSearchString,
    setSort,
    sort,
    sortDirection,
    sortField,
  };
});
