<script setup lang="ts">
import { PageTemplate, type PageTemplateNavItem } from '@hugo-ui/shadcn-vue';
import { Activity, Package, SquareStack } from 'lucide-vue-next';
import { computed, h } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/shared/stores/app-store';

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const navItems: PageTemplateNavItem[] = [
  {
    id: 'products',
    label: 'Products',
    icon: h(Package),
    path: '/products',
    children: [
      {
        id: 'product-activity-log',
        label: 'Activity Log',
        icon: h(Activity),
        path: '/activity-log',
      },
    ],
  },
];

const selectedNavItem = computed(() => {
  if (route.name === 'activity-log') {
    return 'product-activity-log';
  }

  return 'products';
});

function handleSelectionChange(selection: string) {
  const selectedItem = navItems
    .flatMap((item) => [item, ...(item.children ?? [])])
    .find((item) => item.id === selection);

  if (selectedItem?.path && selectedItem.path !== route.path) {
    void router.push(selectedItem.path);
  }
}
</script>

<template>
  <PageTemplate
    :app-icon="h(SquareStack)"
    app-title="Entitlement Console"
    :nav-props="{
      navItems,
      defaultSelected: selectedNavItem,
      defaultExpanded: ['products'],
    }"
    @selection-change="handleSelectionChange"
  >
    <template #titleSlot>
      <div class="app-title-slot">
        <div class="app-title-slot__identity">
          <span>{{ appStore.currentAccount.name }}</span>
          <small>{{ appStore.currentAdmin.name }}</small>
        </div>
      </div>
    </template>

    <RouterView />
  </PageTemplate>
</template>

<style scoped>
.app-title-slot {
  display: flex;
  align-items: center;
  gap: 14px;
}

.app-title-slot__identity {
  display: grid;
  gap: 2px;
  font-size: 14px;
  text-align: right;
}

.app-title-slot__identity span {
  font-weight: 700;
}

.app-title-slot__identity small {
  color: color-mix(in oklab, currentColor 76%, transparent);
  font-size: 13px;
}
</style>
