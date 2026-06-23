<script setup lang="ts">
import { Badge, ContentTemplate } from '@hugo-ui/shadcn-vue';
import { useI18n } from 'vue-i18n';

import {
  pageMutedClass,
  productCardClass,
  productCardDescriptionClass,
  productCardHeaderClass,
  productCardIconClass,
  productCardStatusClass,
  productCardTitleClass,
  productListGridClass,
} from '@/features/products/product-list.styles';
import { useProductDisplay } from '@/features/products/product-display';
import { getProductIcon } from '@/features/products/product-icons';
import {
  getProductStatusMessageKey,
  getProductStatusTone,
} from '@/features/products/product-status';
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
    <p v-if="isLoading" :class="pageMutedClass">{{ t('pages.products.loading') }}</p>
    <div v-else :class="productListGridClass">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :class="productCardClass()"
        :to="`/products/${product.id}`"
      >
        <div :class="productCardHeaderClass">
          <div :class="productCardIconClass" aria-hidden="true">
            <component :is="getProductIcon(product.icon)" />
          </div>
          <h2 :class="productCardTitleClass">{{ formatProductName(product) }}</h2>
        </div>
        <p :class="productCardDescriptionClass">{{ formatProductDescription(product) }}</p>
        <div :class="productCardStatusClass">
          <Badge :tone="getProductStatusTone(product.status)">
            {{ t(getProductStatusMessageKey(product.status)) }}
          </Badge>
        </div>
      </RouterLink>
    </div>
  </ContentTemplate>
</template>
