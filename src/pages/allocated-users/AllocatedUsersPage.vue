<script setup lang="ts">
import { computed } from 'vue';
import { ContentTemplate } from '@hugo-ui/shadcn-vue';
import { useRouter } from 'vue-router';

import { useAllocatedUsersQuery } from '@/features/allocated-users/composables/useAllocatedUsersQuery';

const props = defineProps<{
  productId: string;
}>();

const router = useRouter();
const { data: allocatedUsers } = useAllocatedUsersQuery(computed(() => props.productId));

function goBackToProduct() {
  void router.push(`/products/${props.productId}`);
}
</script>

<template>
  <ContentTemplate
    type="table"
    page-title="Allocated Users"
    title-info="Product-scoped user allocation placeholder for future seat assignment workflows."
    @back="goBackToProduct"
  >
    <div class="placeholder-panel">
      <p>{{ allocatedUsers?.length ?? 0 }} users are allocated to this product.</p>
    </div>
  </ContentTemplate>
</template>

<style scoped>
p {
  margin: 0;
}

.placeholder-panel {
  min-height: 120px;
  color: #4b5563;
}
</style>
