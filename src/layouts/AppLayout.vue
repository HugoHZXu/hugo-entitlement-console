<script setup lang="ts">
import {
  PageTemplate,
  type PageTemplateNavItem,
  type PageTemplateNavProps,
} from '@hugo-ui/shadcn-vue';
import { Activity, Package, SquareStack } from 'lucide-vue-next';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRoute, useRouter } from 'vue-router';

import { getNextAppLocale, setAppLocale } from '@/app/i18n';
import {
  appIdentityAdminClass,
  appIdentityButtonClass,
  appIdentityNameClass,
  appTitleSlotClass,
} from '@/layouts/app-layout.styles';
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
      <div :class="appTitleSlotClass">
        <button
          :aria-label="t('app.languageToggleLabel')"
          :class="appIdentityButtonClass"
          type="button"
          @click="toggleLocale"
        >
          <span :class="appIdentityNameClass">{{ appStore.currentAccount.name }}</span>
          <small :class="appIdentityAdminClass">{{ appStore.currentAdmin.name }}</small>
        </button>
      </div>
    </template>

    <RouterView />
  </PageTemplate>
</template>
