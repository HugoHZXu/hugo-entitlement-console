<script setup lang="ts">
import { Badge, ContentTemplate } from '@hugo-ui/shadcn-vue';
import { useI18n } from 'vue-i18n';

import { useProductDisplay } from '@/features/products/product-display';
import { getProductIcon } from '@/features/products/product-icons';
import { getProductStatusMessageKey, getProductStatusTone } from '@/features/products/product-status';
import { useProductsQuery } from '@/features/products/composables/useProductsQuery';

const { data: products, isLoading } = useProductsQuery();
const { t } = useI18n();
const { formatProductDescription, formatProductName } = useProductDisplay();
</script>

<template>
  <ContentTemplate
    type="full"
    :page-title="t('pages.products.title')"
    :title-info="t('pages.products.titleInfo')"
  >
    <p v-if="isLoading" class="page-muted">{{ t('pages.products.loading') }}</p>
    <div v-else class="placeholder-grid">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        class="placeholder-card"
        :to="`/products/${product.id}`"
      >
        <div class="placeholder-card__header">
          <div class="placeholder-card__icon" aria-hidden="true">
            <component :is="getProductIcon(product.icon)" />
          </div>
          <h2>{{ formatProductName(product) }}</h2>
        </div>
        <p>{{ formatProductDescription(product) }}</p>
        <div class="placeholder-card__status">
          <Badge :tone="getProductStatusTone(product.status)">
            {{ t(getProductStatusMessageKey(product.status)) }}
          </Badge>
        </div>
      </RouterLink>
    </div>
  </ContentTemplate>
</template>

<style scoped>
.placeholder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.placeholder-card {
  display: grid;
  gap: 8px;
  min-height: 160px;
  padding: 20px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
}

.placeholder-card h2,
.placeholder-card p {
  margin: 0;
}

.placeholder-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.placeholder-card__icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 8px;
  background: var(--hugo-ui-shadcn-surface-tinted);
  color: var(--hugo-ui-shadcn-brand-accent);
}

.placeholder-card__icon svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.placeholder-card h2 {
  color: #111827;
  font-size: 18px;
}

.placeholder-card p {
  color: #4b5563;
}

.placeholder-card__status {
  align-self: end;
}

.page-muted {
  margin: 0;
  color: #4b5563;
}
</style>
