<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, ContentTemplate, DataGrid } from '@hugo-ui/shadcn-vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessColumns } from '@/features/allocated-users/allocated-user-display';
import {
  getSeatChangeDescriptor,
  getAllocatedUserAccessRowIds,
  getOverCapacityEntitlement,
  getSelectedSeatQuantity,
  haveSameUserAccessSelection,
  normalizeUserAccessSelection,
  reconcileUserAccessSelection,
} from '@/features/allocated-users/allocated-user-selection';
import {
  useProductUserAccessQuery,
  useUpdateProductUserAllocationsMutation,
} from '@/features/allocated-users/composables/useAllocatedUsersQuery';
import {
  useProductEntitlementsQuery,
  useProductEntitlementSummaryQuery,
} from '@/features/entitlements/composables/useEntitlementsQuery';
import type { UserAccessRow } from '@/shared/types';

const props = defineProps<{
  productId: string;
}>();

const { t } = useI18n();
const router = useRouter();
const productId = computed(() => props.productId);
const {
  data: userAccessRows,
  isFetching: isUserAccessFetching,
  isLoading: isUserAccessLoading,
} = useProductUserAccessQuery(productId);
const { data: entitlements } = useProductEntitlementsQuery(productId);
const { data: entitlementSummary } = useProductEntitlementSummaryQuery(productId);
const updateAllocations = useUpdateProductUserAllocationsMutation(productId);
const columns = useUserAccessColumns();
const selectedRowIds = ref<string[]>([]);
const baselineSelectedRowIds = ref<string[]>([]);
const hasLoadedInitialSelection = ref(false);

const rows = computed(() => userAccessRows.value ?? []);
const hasDraftChanges = computed(
  () => !haveSameUserAccessSelection(selectedRowIds.value, baselineSelectedRowIds.value)
);
const selectedSeatQuantity = computed(() =>
  getSelectedSeatQuantity(selectedRowIds.value, rows.value)
);
const baselineSeatQuantity = computed(() =>
  getSelectedSeatQuantity(baselineSelectedRowIds.value, rows.value)
);
const purchasedQuantity = computed(() => entitlementSummary.value?.purchasedQuantity ?? 0);
const availableAfterDraft = computed(() =>
  Math.max(0, purchasedQuantity.value - selectedSeatQuantity.value)
);
const seatDelta = computed(() => selectedSeatQuantity.value - baselineSeatQuantity.value);
const overCapacityEntitlement = computed(() =>
  getOverCapacityEntitlement(selectedRowIds.value, rows.value, entitlements.value ?? [])
);
const isOverSeatLimit = computed(() => Boolean(overCapacityEntitlement.value));
const isSubmitting = computed(() => updateAllocations.isPending.value);
const submitError = computed(() => {
  const error = updateAllocations.error.value;

  return error instanceof Error ? error.message : null;
});
const canSubmit = computed(
  () => hasDraftChanges.value && !isOverSeatLimit.value && !isSubmitting.value
);
const canClear = computed(() => hasDraftChanges.value && !isSubmitting.value);
const seatDeltaDescriptor = computed(() => getSeatChangeDescriptor(seatDelta.value));
const seatDeltaLabel = computed(() => {
  const descriptor = seatDeltaDescriptor.value;

  if (descriptor.action === 'none') {
    return t('pages.allocatedUsers.seatDelta.none');
  }

  const seatLabelKey =
    descriptor.count === 1
      ? 'pages.allocatedUsers.seatUnit.singular'
      : 'pages.allocatedUsers.seatUnit.plural';

  return t(`pages.allocatedUsers.seatDelta.${descriptor.action}`, {
    count: descriptor.count,
    seatLabel: t(seatLabelKey),
  });
});

watch(
  () => getAllocatedUserAccessRowIds(rows.value),
  (nextAllocatedRowIds) => {
    const nextSelectionState = reconcileUserAccessSelection(nextAllocatedRowIds, {
      baselineSelectedRowIds: baselineSelectedRowIds.value,
      hasLoadedInitialSelection: hasLoadedInitialSelection.value,
      selectedRowIds: selectedRowIds.value,
    });

    baselineSelectedRowIds.value = nextSelectionState.baselineSelectedRowIds;
    selectedRowIds.value = nextSelectionState.selectedRowIds;
    hasLoadedInitialSelection.value = nextSelectionState.hasLoadedInitialSelection;
  },
  { immediate: true }
);

function goBackToProduct() {
  void router.push(`/products/${props.productId}`);
}

function getUserAccessRowId(row: UserAccessRow) {
  return row.id;
}

function handleSelectedRowIdsChange(nextRowIds: string[]) {
  selectedRowIds.value = normalizeUserAccessSelection(nextRowIds);
  updateAllocations.reset();
}

function clearChanges() {
  selectedRowIds.value = [...baselineSelectedRowIds.value];
  updateAllocations.reset();
}

async function submitChanges() {
  if (!canSubmit.value) {
    return;
  }

  const submittedRowIds = normalizeUserAccessSelection(selectedRowIds.value);

  try {
    await updateAllocations.mutateAsync(submittedRowIds);
    baselineSelectedRowIds.value = [...submittedRowIds];
    selectedRowIds.value = [...submittedRowIds];
    await router.push(`/products/${props.productId}`);
  } catch {
    // The mutation error is surfaced through submitError.
  }
}
</script>

<template>
  <ContentTemplate
    type="table"
    :page-title="t('pages.allocatedUsers.title')"
    :title-info="t('pages.allocatedUsers.titleInfo')"
    @back="goBackToProduct"
  >
    <template #actions>
      <Button
        type="button"
        variant="outline"
        tone="neutral"
        :disabled="!canClear"
        @click="clearChanges"
      >
        {{ t('pages.allocatedUsers.actions.clear') }}
      </Button>
      <Button type="button" :disabled="!canSubmit" :loading="isSubmitting" @click="submitChanges">
        {{ t('pages.allocatedUsers.actions.submit') }}
      </Button>
    </template>

    <div class="allocated-users-page">
      <div class="allocation-summary" aria-live="polite">
        <p>
          <strong>{{ selectedSeatQuantity }}</strong>
          {{ t('pages.allocatedUsers.summary.used') }} &middot;
          <strong>{{ availableAfterDraft }}</strong>
          {{ t('pages.allocatedUsers.summary.available') }} &middot;
          <span>{{ purchasedQuantity }} {{ t('pages.allocatedUsers.summary.totalSeats') }}</span>
        </p>
        <p class="allocation-summary__delta">{{ seatDeltaLabel }}</p>
      </div>

      <p v-if="isOverSeatLimit" class="allocation-message allocation-message--error">
        {{
          t('pages.allocatedUsers.overCapacity', {
            entitlementCode: overCapacityEntitlement?.entitlementCode,
          })
        }}
      </p>
      <p v-else-if="submitError" class="allocation-message allocation-message--error">
        {{ submitError }}
      </p>

      <DataGrid
        :aria-label="t('pages.allocatedUsers.ariaLabel')"
        :columns="columns"
        :empty="t('pages.allocatedUsers.empty')"
        :get-row-id="getUserAccessRowId"
        :height="620"
        :loading="isUserAccessLoading || isUserAccessFetching"
        :overscan="10"
        :row-height="56"
        :rows="rows"
        :selected-row-ids="selectedRowIds"
        :show-header-checkbox="false"
        show-checkbox-column
        @selected-row-ids-change="handleSelectedRowIdsChange"
      />
    </div>
  </ContentTemplate>
</template>

<style scoped>
p {
  margin: 0;
}

.allocated-users-page {
  display: grid;
  gap: 14px;
}

.allocation-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #4b5563;
  font-size: 14px;
}

.allocation-summary strong {
  color: var(--hugo-ui-shadcn-text-primary);
  font-weight: 700;
}

.allocation-summary__delta {
  font-weight: 700;
}

.allocation-message {
  font-size: 14px;
  font-weight: 600;
}

.allocation-message--error {
  color: #b91c1c;
}
</style>
