<script setup lang="ts">
import { ContentTemplate, DataGrid, Input, type DataGridSort } from '@hugo-ui/shadcn-vue';
import { Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  activityLogDefaultSort,
  useActivityLogColumns,
} from '@/features/activity-log/activity-display';
import { useActivityLogsQuery } from '@/features/activity-log/composables/useActivityLogQuery';
import type { ActivityLogEntry, ActivityLogListInput, ActivityLogSortField } from '@/shared/types';

const search = ref('');
const sort = ref<DataGridSort>(activityLogDefaultSort);
const columns = useActivityLogColumns();
const { t } = useI18n();

const queryInput = computed<ActivityLogListInput>(() => {
  const input: ActivityLogListInput = {};
  const searchString = search.value.trim();

  if (searchString) {
    input.searchString = searchString;
  }

  if (sort.value) {
    input.sortField = sort.value.columnId as ActivityLogSortField;
    input.sortDirection = sort.value.direction;
  }

  return input;
});

const { data: activityLogs, isFetching, isLoading } = useActivityLogsQuery(queryInput);

const rows = computed(() => activityLogs.value?.items ?? []);
const totalElements = computed(() => activityLogs.value?.totalElements ?? 0);

function getActivityLogRowId(row: ActivityLogEntry) {
  return row.id;
}

function handleSortChange(nextSort: DataGridSort) {
  sort.value = nextSort;
}
</script>

<template>
  <ContentTemplate
    type="table"
    :page-title="t('pages.activityLog.title')"
    :title-info="t('pages.activityLog.titleInfo')"
  >
    <div class="activity-log-page">
      <div class="activity-log-toolbar">
        <div class="activity-log-toolbar__search">
          <Input
            v-model="search"
            :aria-label="t('pages.activityLog.searchAriaLabel')"
            :placeholder="t('pages.activityLog.searchPlaceholder')"
            type="search"
          >
            <template #start-icon>
              <Search :size="16" aria-hidden="true" />
            </template>
          </Input>
        </div>

        <p class="activity-log-toolbar__count">
          {{ t('pages.activityLog.recordCount', { count: totalElements }) }}
        </p>
      </div>

      <DataGrid
        :aria-label="t('pages.activityLog.ariaLabel')"
        :columns="columns"
        :empty="t('pages.activityLog.empty')"
        :get-row-id="getActivityLogRowId"
        :height="620"
        :loading="isLoading || isFetching"
        :overscan="10"
        :row-height="56"
        :rows="rows"
        :sort="sort"
        @sort-change="handleSortChange"
      />
    </div>
  </ContentTemplate>
</template>

<style scoped>
.activity-log-page {
  display: grid;
  gap: 16px;
}

.activity-log-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.activity-log-toolbar__search {
  width: min(380px, 100%);
}

.activity-log-toolbar__count {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
}
</style>
