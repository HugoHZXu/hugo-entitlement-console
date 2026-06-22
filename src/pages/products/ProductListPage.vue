<script setup lang="ts">
import { useProductsQuery } from '@/features/products/composables/useProductsQuery';

const { data: products, isLoading } = useProductsQuery();
</script>

<template>
  <section class="page">
    <header class="page__header">
      <p class="page__eyebrow">Products</p>
      <h1>Products</h1>
    </header>

    <p v-if="isLoading">Loading products...</p>
    <div v-else class="placeholder-grid">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        class="placeholder-card"
        :to="`/products/${product.id}`"
      >
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <span>{{ product.status }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
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

h1 {
  margin: 0;
  color: #111827;
  font-size: 28px;
}

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
}

.placeholder-card h2,
.placeholder-card p {
  margin: 0;
}

.placeholder-card h2 {
  color: #111827;
  font-size: 18px;
}

.placeholder-card p {
  color: #4b5563;
}

.placeholder-card span {
  align-self: end;
  color: #166534;
  font-size: 13px;
  font-weight: 700;
}
</style>
