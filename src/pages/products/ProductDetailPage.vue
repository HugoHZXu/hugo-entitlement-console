<script setup lang="ts">
import { Badge, Button, Card, ContentTemplate, DataGrid } from '@hugo-ui/shadcn-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRouter } from 'vue-router';

import { useProductActivityLogColumns } from '@/features/activity-log/activity-display';
import { useActivityLogQuery } from '@/features/activity-log/composables/useActivityLogQuery';
import { useProductEntitlementSummaryQuery } from '@/features/entitlements/composables/useEntitlementsQuery';
import { useProductDisplay } from '@/features/products/product-display';
import { getProductIcon } from '@/features/products/product-icons';
import { getProductStatusMessageKey, getProductStatusTone } from '@/features/products/product-status';
import { useProductQuery } from '@/features/products/composables/useProductsQuery';
import type { ActivityLogEntry } from '@/shared/types';

const props = defineProps<{
  productId: string;
}>();

const { t } = useI18n();
const router = useRouter();
const { data: product } = useProductQuery(computed(() => props.productId));
const { data: entitlementSummary } = useProductEntitlementSummaryQuery(
  computed(() => props.productId)
);
const {
  data: activityLog,
  isFetching: isActivityLogFetching,
  isLoading: isActivityLogLoading,
} = useActivityLogQuery(computed(() => props.productId));
const productIcon = computed(() =>
  product.value ? getProductIcon(product.value.icon) : undefined
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
</script>

<template>
  <ContentTemplate
    type="full"
    :page-title="product ? formatProductName(product) : t('pages.productDetail.fallbackTitle')"
    :title-info="
      product ? formatProductDescription(product) : t('pages.productDetail.fallbackTitleInfo')
    "
    @back="goBackToProducts"
  >
    <div class="detail-grid">
      <Card :aria-label="t('pages.productDetail.productInfoAriaLabel')">
        <div class="product-info">
          <h3 class="product-info__title">{{ t('pages.productDetail.productInfoTitle') }}</h3>
          <dl v-if="product" class="product-info__list">
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.provider') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ formatProvider(product) }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.status') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>
                <Badge :tone="getProductStatusTone(product.status)">
                  {{ t(getProductStatusMessageKey(product.status)) }}
                </Badge>
              </dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.entitlementCode') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ product.entitlementInfo.entitlementCode }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.grantType') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ formatGrantType(product) }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.allocationModel') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ formatAllocationModel(product) }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.dimensionApiName') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ product.usageDimensions[0]?.code ?? 'n/a' }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.subscriberAccount') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ product.entitlementInfo.subscriberAccountId }}</dd>
            </div>
            <div class="product-info__item">
              <dt>{{ t('pages.productDetail.fields.renewalDate') }}</dt>
              <span aria-hidden="true">:</span>
              <dd>{{ formatRenewalDate(product) }}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card class="seat-card" :aria-label="t('pages.productDetail.seatAllocationAriaLabel')">
        <div class="seat-card__icon" aria-hidden="true">
          <component :is="productIcon" v-if="productIcon" />
        </div>

        <div class="seat-card__total">
          <strong class="seat-card__value">{{ entitlementSummary?.purchasedQuantity ?? 0 }}</strong>
          <span class="seat-card__label">{{ t('pages.productDetail.seatLabels.seats') }}</span>
        </div>

        <div class="seat-card__stats">
          <div class="seat-card__stat seat-card__stat--available">
            <strong class="seat-card__value seat-card__value--stat">
              {{ entitlementSummary?.availableQuantity ?? 0 }}
            </strong>
            <span class="seat-card__label seat-card__label--stat">
              {{ t('pages.productDetail.seatLabels.available') }}
            </span>
          </div>
          <div class="seat-card__stat seat-card__stat--used">
            <strong class="seat-card__value seat-card__value--stat">
              {{ entitlementSummary?.allocatedQuantity ?? 0 }}
            </strong>
            <span class="seat-card__label seat-card__label--stat">
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
          <div class="seat-card__action">
            <Button as="a" :href="href" size="lg" @click="navigate">
              {{ t('pages.productDetail.manageUserAccess') }}
            </Button>
          </div>
        </RouterLink>
      </Card>

      <ContentTemplate
        id="activity-log"
        class="panel--wide"
        type="table"
        :page-title="t('pages.productDetail.activityTitle')"
      >
        <DataGrid
          :aria-label="t('pages.productDetail.activityAriaLabel')"
          :columns="activityLogColumns"
          :empty="t('pages.productDetail.activityEmpty')"
          :get-row-id="getActivityLogRowId"
          :height="360"
          :loading="isActivityLogLoading || isActivityLogFetching"
          :overscan="8"
          :row-height="56"
          :rows="activityLog ?? []"
        />
      </ContentTemplate>
    </div>
  </ContentTemplate>
</template>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: stretch;
  gap: 16px;
}

.panel--wide {
  grid-column: 1 / -1;
}

.product-info {
  display: grid;
  align-content: start;
  gap: 16px;
  height: 100%;
}

.product-info__title {
  margin: 0;
  color: var(--hugo-ui-shadcn-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
}

.product-info__list {
  margin: 0;
  display: grid;
  gap: 0;
}

.product-info__item {
  display: grid;
  grid-template-columns: minmax(150px, 0.24fr) auto minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  padding: 13px 0;
  border-bottom: 1px solid var(--hugo-ui-shadcn-neutral-grey-500);
  align-items: start;
}

.product-info__item:first-child {
  border-top: 1px solid var(--hugo-ui-shadcn-neutral-grey-500);
}

.product-info__item > span {
  color: var(--hugo-ui-shadcn-text-subtle);
  font-weight: 700;
  line-height: 1.35;
}

.product-info__list dt {
  color: var(--hugo-ui-shadcn-text-default);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.product-info__list dd {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--hugo-ui-shadcn-text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}

.seat-card {
  justify-items: center;
  gap: 14px;
  padding: 28px 24px;
  text-align: center;
}

.seat-card__icon {
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  border-radius: 28px;
  background: linear-gradient(180deg, #ffffff 0%, var(--hugo-ui-shadcn-neutral-grey-200) 100%);
  color: var(--hugo-ui-shadcn-brand-primary);
  box-shadow: 0 12px 28px color-mix(in oklab, var(--hugo-ui-shadcn-text-primary) 10%, transparent);
}

.seat-card__icon svg {
  width: 56px;
  height: 56px;
  stroke-width: 1.8;
}

.seat-card__total,
.seat-card__stat {
  display: grid;
  align-content: center;
  justify-items: center;
  width: 100%;
}

.seat-card__total {
  min-height: 86px;
  margin-top: 20px;
  border-radius: 4px;
  background: var(--hugo-ui-shadcn-neutral-grey-200);
}

.seat-card__stats {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.seat-card__stat {
  min-height: 72px;
  border-radius: 4px;
}

.seat-card__stat--available {
  background: var(--hugo-ui-shadcn-success-green-bg);
}

.seat-card__stat--used {
  background: var(--hugo-ui-shadcn-error-bg);
}

.seat-card__value {
  color: var(--hugo-ui-shadcn-text-primary);
  font-size: 30px;
  font-weight: 500;
  line-height: 1;
}

.seat-card__label {
  margin-top: 2px;
  color: var(--hugo-ui-shadcn-text-default);
  font-size: 17px;
  line-height: 1.1;
}

.seat-card__value--stat {
  font-size: 26px;
}

.seat-card__label--stat {
  font-size: 16px;
  font-weight: 600;
}

.seat-card__action {
  margin-top: 22px;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .product-info__item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .product-info__item > span {
    display: none;
  }
}
</style>
