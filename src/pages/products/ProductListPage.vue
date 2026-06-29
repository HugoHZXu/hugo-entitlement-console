<script setup lang="ts">
import { Badge, ContentTemplate } from '@hugo-ui/shadcn-vue';
import { PackageOpen } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  pageMutedClass,
  productCardClass,
  productCardDescriptionClass,
  productCardHeaderClass,
  productCardIconClass,
  productCardStatusClass,
  productCardTitleClass,
  productEmptyContentClass,
  productEmptyDescriptionClass,
  productEmptyIconClass,
  productEmptyStateClass,
  productEmptyTitleClass,
  productListGridClass,
} from '@/features/products/product-list.styles';
import { useProductDisplay } from '@/features/products/product-display';
import { getProductIcon } from '@/features/products/product-icons';
import {
  getProductStatusMessageKey,
  getProductStatusTone,
} from '@/features/products/product-status';
import { useProductsQuery } from '@/features/products/composables/useProductsQuery';
import EntitlementAccessState from '@/features/identity/EntitlementAccessState.vue';
import { useEntitlementPageAccessState } from '@/features/identity/useEntitlementAccessState';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

const { data: products, isLoading } = useProductsQuery();
const { t } = useI18n();
const { formatProductDescription, formatProductName } = useProductDisplay();
const accessStateKind = useEntitlementPageAccessState();
const identityStore = useIdentitySessionStore();
const activeOrganizationName = computed(
  () => identityStore.activeEntitlementOrganization?.name ?? t('identity.organization.fallbackName')
);
</script>

<template>
  <EntitlementAccessState v-if="accessStateKind" :kind="accessStateKind" />
  <ContentTemplate
    v-else
    type="full"
    :page-title="t('pages.products.title')"
    :title-info="t('pages.products.titleInfo')"
  >
    <p v-if="isLoading" :class="pageMutedClass">{{ t('pages.products.loading') }}</p>
    <section
      v-else-if="products?.length === 0"
      :class="productEmptyStateClass"
      :aria-label="t('pages.products.emptyTitle')"
    >
      <div :class="productEmptyContentClass">
        <span :class="productEmptyIconClass" aria-hidden="true">
          <PackageOpen />
        </span>
        <h2 :class="productEmptyTitleClass">{{ t('pages.products.emptyTitle') }}</h2>
        <p :class="productEmptyDescriptionClass">
          {{
            t('pages.products.emptyDescription', {
              organization: activeOrganizationName,
            })
          }}
        </p>
      </div>
    </section>
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
