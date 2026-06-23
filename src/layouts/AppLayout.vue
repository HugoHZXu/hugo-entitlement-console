<script setup lang="ts">
import { PageTemplate, type PageTemplateNavItem, type PageTemplateNavProps } from '@hugo-ui/shadcn-vue';
import { Activity, Package, SquareStack } from 'lucide-vue-next';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRoute, useRouter } from 'vue-router';

import { getNextAppLocale, setAppLocale } from '@/app/i18n';
import { useAppStore } from '@/shared/stores/app-store';

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const navItems = computed<PageTemplateNavItem[]>(() => [
  {
    id: 'products',
    label: t('nav.products'),
    icon: h(Package),
    path: '/products',
    children: [
      {
        id: 'product-activity-log',
        label: t('nav.activityLog'),
        icon: h(Activity),
        path: '/activity-log',
      },
    ],
  },
]);

const selectedNavItem = computed(() => {
  if (route.name === 'activity-log') {
    return 'product-activity-log';
  }

  return 'products';
});

const navProps = computed<PageTemplateNavProps>(() => ({
  navItems: navItems.value,
  defaultSelected: selectedNavItem.value,
  defaultExpanded: ['products'],
}));

function handleSelectionChange(selection: string) {
  const selectedItem = navItems.value
    .flatMap((item) => [item, ...(item.children ?? [])])
    .find((item) => item.id === selection);

  if (selectedItem?.path && selectedItem.path !== route.path) {
    void router.push(selectedItem.path);
  }
}

function toggleLocale() {
  setAppLocale(getNextAppLocale(locale.value));
}
</script>

<template>
  <PageTemplate
    :app-icon="h(SquareStack)"
    :app-title="t('app.title')"
    :nav-props="navProps"
    @selection-change="handleSelectionChange"
  >
    <template #titleSlot>
      <div class="app-title-slot">
        <button
          :aria-label="t('app.languageToggleLabel')"
          class="app-title-slot__identity"
          type="button"
          @click="toggleLocale"
        >
          <span>{{ appStore.currentAccount.name }}</span>
          <small>{{ appStore.currentAdmin.name }}</small>
        </button>
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
  appearance: none;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 2px;
  font-family: inherit;
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
