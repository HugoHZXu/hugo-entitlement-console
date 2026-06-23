<script setup lang="ts">
import { ContentTemplate, DataGrid, Input, type DataGridSort } from '@hugo-ui/shadcn-vue';
import { Search } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useActivityLogColumns } from '@/features/activity-log/activity-display';
import { useActivityLogsQuery } from '@/features/activity-log/composables/useActivityLogQuery';
import { useActivityLogFilterStore } from '@/features/activity-log/stores/activity-log-filter-store';
import type { ActivityLogEntry } from '@/shared/types';

const activityLogFilterStore = useActivityLogFilterStore();
const { queryInput, sort } = storeToRefs(activityLogFilterStore);
const columns = useActivityLogColumns();
const { t } = useI18n();

const search = computed({
  get: () => activityLogFilterStore.searchString,
  set: (nextSearchString: string) => activityLogFilterStore.setSearchString(nextSearchString),
});

const { data: activityLogs, isFetching, isLoading } = useActivityLogsQuery(queryInput);

const rows = computed(() => activityLogs.value?.items ?? []);
const totalElements = computed(() => activityLogs.value?.totalElements ?? 0);

function getActivityLogRowId(row: ActivityLogEntry) {
  return row.id;
}

function handleSortChange(nextSort: DataGridSort) {
  activityLogFilterStore.setSort(nextSort);
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
