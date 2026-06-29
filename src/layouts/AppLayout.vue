<script setup lang="ts">
import {
  PageTemplate,
  type PageTemplateNavItem,
  type PageTemplateNavProps,
} from '@hugo-ui/shadcn-vue';
import { Activity, Languages, Package, SquareStack } from 'lucide-vue-next';
import { computed, h, onBeforeUnmount, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';

import { getNextAppLocale, setAppLocale } from '@/app/i18n';
import { appTitleSlotClass } from '@/layouts/app-layout.styles';
import { identityLanguageButtonClass } from '@/features/identity/identity-header.styles';
import EntitlementAccessState from '@/features/identity/EntitlementAccessState.vue';
import IdentityHeaderMenu from '@/features/identity/IdentityHeaderMenu.vue';
import { useActivityLogFilterStore } from '@/features/activity-log/stores/activity-log-filter-store';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const activityLogFilterStore = useActivityLogFilterStore();
const identityStore = useIdentitySessionStore();
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
  hidden:
    identityStore.loading ||
    Boolean(identityStore.errorMessage) ||
    !identityStore.hasUsableEntitlementScope,
  navItems: navItems.value,
  defaultSelected: selectedNavItem.value,
  defaultExpanded: ['products'],
}));
const blockingAccessState = computed<'error' | 'loading' | 'renewing' | null>(() => {
  if (identityStore.loading || !identityStore.initialized) {
    return 'loading';
  }

  if (identityStore.renewing) {
    return 'renewing';
  }

  if (identityStore.errorMessage) {
    return 'error';
  }

  return null;
});

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

function handleRetryIdentitySession() {
  void identityStore.initialize();
}

function handleIdentityWindowFocus() {
  if (
    !identityStore.initialized ||
    identityStore.loading ||
    identityStore.switching ||
    identityStore.renewing
  ) {
    return;
  }

  void identityStore.refreshSession();
}

onMounted(() => {
  void identityStore.initialize();
  window.addEventListener('focus', handleIdentityWindowFocus);
});

onBeforeUnmount(() => {
  window.removeEventListener('focus', handleIdentityWindowFocus);
});

watch(
  () => identityStore.entitlementScopeKey,
  (nextScopeKey, previousScopeKey) => {
    if (
      !identityStore.initialized ||
      nextScopeKey === previousScopeKey ||
      previousScopeKey.startsWith('no-account:')
    ) {
      return;
    }

    queryClient.removeQueries();
    activityLogFilterStore.resetFilters();

    if (route.name === 'product-detail' || route.name === 'allocated-users') {
      void router.push('/products');
    }
  }
);
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
        <IdentityHeaderMenu />
        <button
          :aria-label="t('app.languageToggleLabel')"
          :class="identityLanguageButtonClass"
          type="button"
          @click="toggleLocale"
        >
          <Languages :size="16" aria-hidden="true" />
          <span class="sr-only">{{ t('app.languageToggleLabel') }}</span>
        </button>
      </div>
    </template>

    <EntitlementAccessState
      v-if="blockingAccessState"
      :detail="identityStore.errorMessage"
      :kind="blockingAccessState"
      @retry="handleRetryIdentitySession"
    />
    <RouterView v-else />
  </PageTemplate>
</template>
