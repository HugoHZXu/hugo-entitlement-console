<script setup lang="ts">
import { useEntitlementsQuery } from '@/features/entitlements/composables/useEntitlementsQuery';

const { data: entitlements } = useEntitlementsQuery();
</script>

<template>
  <section class="page">
    <header class="page__header">
      <p class="page__eyebrow">Entitlements</p>
      <h1>Entitlements</h1>
    </header>

    <article class="panel">
      <p>{{ entitlements?.length ?? 0 }} entitlement records are available in mock data.</p>
    </article>
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
