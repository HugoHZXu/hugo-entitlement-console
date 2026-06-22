<script setup lang="ts">
import { computed } from 'vue';

import { useActivityLogQuery } from '@/features/activity-log/composables/useActivityLogQuery';
import { useProductEntitlementsQuery } from '@/features/entitlements/composables/useEntitlementsQuery';
import { useProductQuery } from '@/features/products/composables/useProductsQuery';

const props = defineProps<{
  productId: string;
}>();

const { data: product } = useProductQuery(computed(() => props.productId));
const { data: entitlements } = useProductEntitlementsQuery(computed(() => props.productId));
const { data: activityLog } = useActivityLogQuery(computed(() => props.productId));
</script>

<template>
  <section class="page">
    <RouterLink class="back-link" to="/products">Back to Products</RouterLink>
    <header class="page__header">
      <p class="page__eyebrow">Product detail</p>
      <h1>{{ product?.name ?? 'Product detail' }}</h1>
    </header>

    <div class="detail-grid">
      <article class="panel">
        <h2>Product Information</h2>
        <p>{{ product?.description }}</p>
      </article>

      <article class="panel">
        <h2>Seat Allocation</h2>
        <p>{{ entitlements?.length ?? 0 }} entitlement records available for this product.</p>
        <RouterLink v-if="product" :to="`/products/${product.id}/allocated-users`">
          Manage allocated users
        </RouterLink>
      </article>

      <article class="panel panel--wide">
        <h2>Activity Log</h2>
        <p>{{ activityLog?.length ?? 0 }} recent activity entries for this product.</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #3730a3;
  font-weight: 700;
}

.page__header {
  margin-bottom: 24px;
}

.page__eyebrow {
  margin: 0 0 4px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #111827;
  font-size: 28px;
}

h2 {
  color: #111827;
  font-size: 18px;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
}

.panel {
  display: grid;
  gap: 12px;
  padding: 20px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  background: #ffffff;
}

.panel--wide {
  grid-column: 1 / -1;
}

.panel p {
  color: #4b5563;
}

.panel a {
  color: #3730a3;
  font-weight: 700;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
