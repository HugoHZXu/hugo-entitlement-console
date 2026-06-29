<script setup lang="ts">
import { Badge, Button, Card, ContentTemplate, DataGrid } from '@hugo-ui/shadcn-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRouter } from 'vue-router';

import { useProductActivityLogColumns } from '@/features/activity-log/activity-display';
import { useProductActivityLogInfiniteQuery } from '@/features/activity-log/composables/useActivityLogQuery';
import { useProductEntitlementSummaryQuery } from '@/features/entitlements/composables/useEntitlementsQuery';
import EntitlementAccessState from '@/features/identity/EntitlementAccessState.vue';
import { useEntitlementPageAccessState } from '@/features/identity/useEntitlementAccessState';
import {
  productDetailGridClass,
  productDetailWidePanelClass,
  productInfoClass,
  productInfoItemClass,
  productInfoLabelClass,
  productInfoListClass,
  productInfoSeparatorClass,
  productInfoTitleClass,
  productInfoValueClass,
  seatCardActionClass,
  seatCardClass,
  seatCardIconClass,
  seatCardLabelClass,
  seatCardStatClass,
  seatCardStatsClass,
  seatCardTotalClass,
  seatCardValueClass,
} from '@/features/products/product-detail.styles';
import { useProductDisplay } from '@/features/products/product-display';
import { getProductIcon } from '@/features/products/product-icons';
import {
  getProductStatusMessageKey,
  getProductStatusTone,
} from '@/features/products/product-status';
import { useProductQuery } from '@/features/products/composables/useProductsQuery';
import type { ActivityLogEntry } from '@/shared/types';

const props = defineProps<{
  productId: string;
}>();

const { t } = useI18n();
const router = useRouter();
const accessStateKind = useEntitlementPageAccessState();
const { data: product } = useProductQuery(computed(() => props.productId));
const { data: entitlementSummary } = useProductEntitlementSummaryQuery(
  computed(() => props.productId)
);
const {
  data: activityLogPages,
  fetchNextPage: fetchNextActivityLogPage,
  hasNextPage: hasNextActivityLogPage,
  isFetchingNextPage: isActivityLogFetchingNextPage,
  isLoading: isActivityLogLoading,
} = useProductActivityLogInfiniteQuery(computed(() => props.productId));
const productIcon = computed(() =>
  product.value ? getProductIcon(product.value.icon) : undefined
);
const activityLogRows = computed(
  () => activityLogPages.value?.pages.flatMap((page) => page.items) ?? []
);
const activityLogColumns = useProductActivityLogColumns();
const {
  formatAllocationModel,
  formatGrantType,
  formatProductDescription,
  formatProductName,
  formatProvider,
  formatRenewalDate,
} = useProductDisplay();

function goBackToProducts() {
  void router.push('/products');
}

function getActivityLogRowId(row: ActivityLogEntry) {
  return row.id;
}

function handleActivityLogEndReached() {
  if (hasNextActivityLogPage.value && !isActivityLogFetchingNextPage.value) {
    void fetchNextActivityLogPage();
  }
}
</script>

<template>
  <EntitlementAccessState v-if="accessStateKind" :kind="accessStateKind" />
  <ContentTemplate
    v-else
    type="full"
    :page-title="product ? formatProductName(product) : t('pages.productDetail.fallbackTitle')"
    :title-info="
      product ? formatProductDescription(product) : t('pages.productDetail.fallbackTitleInfo')
    "
    @back="goBackToProducts"
  >
    <div :class="productDetailGridClass">
      <Card :aria-label="t('pages.productDetail.productInfoAriaLabel')">
        <div :class="productInfoClass">
          <h3 :class="productInfoTitleClass">{{ t('pages.productDetail.productInfoTitle') }}</h3>
          <dl v-if="product" :class="productInfoListClass">
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">{{ t('pages.productDetail.fields.provider') }}</dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">{{ formatProvider(product) }}</dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">{{ t('pages.productDetail.fields.status') }}</dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">
                <Badge :tone="getProductStatusTone(product.status)">
                  {{ t(getProductStatusMessageKey(product.status)) }}
                </Badge>
              </dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.entitlementCode') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">{{ product.entitlementInfo.entitlementCode }}</dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.grantType') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">{{ formatGrantType(product) }}</dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.allocationModel') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">{{ formatAllocationModel(product) }}</dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.dimensionApiName') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">
                {{ product.usageDimensions[0]?.code ?? 'n/a' }}
              </dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.subscriberAccount') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">
                {{ product.entitlementInfo.subscriberAccountId }}
              </dd>
            </div>
            <div :class="productInfoItemClass">
              <dt :class="productInfoLabelClass">
                {{ t('pages.productDetail.fields.renewalDate') }}
              </dt>
              <span :class="productInfoSeparatorClass" aria-hidden="true">:</span>
              <dd :class="productInfoValueClass">{{ formatRenewalDate(product) }}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card :class="seatCardClass" :aria-label="t('pages.productDetail.seatAllocationAriaLabel')">
        <div :class="seatCardIconClass" aria-hidden="true">
          <component :is="productIcon" v-if="productIcon" />
        </div>

        <div :class="seatCardTotalClass">
          <strong :class="seatCardValueClass()">
            {{ entitlementSummary?.purchasedQuantity ?? 0 }}
          </strong>
          <span :class="seatCardLabelClass()">
            {{ t('pages.productDetail.seatLabels.seats') }}
          </span>
        </div>

        <div :class="seatCardStatsClass">
          <div :class="seatCardStatClass({ tone: 'available' })">
            <strong :class="seatCardValueClass({ size: 'stat' })">
              {{ entitlementSummary?.availableQuantity ?? 0 }}
            </strong>
            <span :class="seatCardLabelClass({ size: 'stat' })">
              {{ t('pages.productDetail.seatLabels.available') }}
            </span>
          </div>
          <div :class="seatCardStatClass({ tone: 'used' })">
            <strong :class="seatCardValueClass({ size: 'stat' })">
              {{ entitlementSummary?.allocatedQuantity ?? 0 }}
            </strong>
            <span :class="seatCardLabelClass({ size: 'stat' })">
              {{ t('pages.productDetail.seatLabels.used') }}
            </span>
          </div>
        </div>

        <RouterLink
          v-if="product"
          v-slot="{ href, navigate }"
          custom
          :to="`/products/${product.id}/allocated-users`"
        >
          <div :class="seatCardActionClass">
            <Button as="a" :href="href" size="lg" @click="navigate">
              {{ t('pages.productDetail.manageUserAccess') }}
            </Button>
          </div>
        </RouterLink>
      </Card>

      <ContentTemplate
        id="activity-log"
        :class="productDetailWidePanelClass"
        type="table"
        :page-title="t('pages.productDetail.activityTitle')"
      >
        <DataGrid
          :aria-label="t('pages.productDetail.activityAriaLabel')"
          :columns="activityLogColumns"
          :empty="t('pages.productDetail.activityEmpty')"
          :get-row-id="getActivityLogRowId"
          :has-more="hasNextActivityLogPage"
          :height="360"
          :loading="isActivityLogLoading"
          :loading-more="isActivityLogFetchingNextPage"
          :overscan="8"
          :row-height="56"
          :rows="activityLogRows"
          virtualized
          @end-reached="handleActivityLogEndReached"
        />
      </ContentTemplate>
    </div>
  </ContentTemplate>
</template>
