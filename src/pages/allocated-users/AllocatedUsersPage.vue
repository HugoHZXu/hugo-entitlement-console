<script setup lang="ts">
import { computed } from 'vue';

import { useAllocatedUsersQuery } from '@/features/allocated-users/composables/useAllocatedUsersQuery';

const props = defineProps<{
  productId: string;
}>();

const { data: allocatedUsers } = useAllocatedUsersQuery(computed(() => props.productId));
</script>

<template>
  <section class="page">
    <RouterLink class="back-link" :to="`/products/${productId}`">Back to Product</RouterLink>
    <header class="page__header">
      <p class="page__eyebrow">Allocated users</p>
      <h1>Allocated Users</h1>
    </header>

    <article class="panel">
      <p>{{ allocatedUsers?.length ?? 0 }} users are allocated to this product.</p>
    </article>
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
p {
  margin: 0;
}

h1 {
  color: #111827;
  font-size: 28px;
}

.panel {
  padding: 20px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  background: #ffffff;
}
</style>
