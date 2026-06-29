<script setup lang="ts">
import {
  Badge,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Modal,
} from '@hugo-ui/shadcn-vue';
import { Check, ChevronsUpDown, RefreshCw, UserRound } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  identityAccountListClass,
  identityAccountOptionAccessClass,
  identityAccountOptionClass,
  identityAccountOptionContentClass,
  identityAccountOptionMetaClass,
  identityAccountOptionNameClass,
  identityAccountSelectedClass,
  identityHeaderRootClass,
  identityMenuItemLabelClass,
  identityMenuItemMetaClass,
  identityMenuItemTextClass,
  identityMenuSummaryClass,
  identityMenuSummaryMetaClass,
  identityMenuSummaryNameClass,
  identityMenuSectionClass,
  identityMenuSectionHeaderClass,
  identityMenuSectionMetaClass,
  identityMenuSectionTitleClass,
  identityModalBodyClass,
  identityOrganizationListClass,
  identityOrganizationOptionClass,
  identityOrganizationOptionContentClass,
  identityOrganizationOptionMetaClass,
  identityOrganizationOptionNameClass,
  identityOrganizationSelectedIconClass,
  identityStatusRowClass,
  identityTriggerIconClass,
  identityTriggerMetaClass,
  identityTriggerNameClass,
  identityTriggerTextClass,
  identityMenuTriggerClass,
} from '@/features/identity/identity-header.styles';
import { useIdentitySessionStore } from '@/shared/stores/identity-session-store';
import type { DemoAccount, DemoOrganizationScope } from '@/shared/types';

const identityStore = useIdentitySessionStore();
const {
  accounts,
  currentAccount,
  entitlementOrganizations,
  errorMessage,
  loading,
  noticeKey,
  renewing,
  selectedEntitlementOrganizationId,
  switching,
} = storeToRefs(identityStore);
const accountMenuOpen = ref(false);
const accountModalOpen = ref(false);
const { t } = useI18n();

const accountLabel = computed(
  () => currentAccount.value?.displayName ?? t('identity.account.fallbackName')
);
const accountMeta = computed(() => {
  if (currentAccount.value?.email) {
    return currentAccount.value.email;
  }

  if (loading.value) {
    return t('identity.account.loading');
  }

  return t('identity.account.unavailable');
});
const hasEntitlementOrganizations = computed(() => entitlementOrganizations.value.length > 0);
const accountMenuDisabled = computed(() => loading.value || switching.value);

function isInactiveAccount(account: DemoAccount): boolean {
  return account.accountStatus.toLowerCase() !== 'active';
}

function getEntitlementAccessSummary(account: DemoAccount): string {
  if (account.entitlementOrganizations.length === 0) {
    return t('identity.account.noEntitlementAccess');
  }

  if (account.entitlementOrganizations.length === 1) {
    const organization = account.entitlementOrganizations[0];

    return organization
      ? t('identity.account.singleEntitlementAccess', {
          organization: organization.name,
        })
      : t('identity.account.noEntitlementAccess');
  }

  return t('identity.account.multipleEntitlementAccess', {
    count: account.entitlementOrganizations.length,
  });
}

function formatOrganizationKind(organization: DemoOrganizationScope): string {
  const key = `identity.organization.kind.${organization.kind}`;

  return t(key) === key ? organization.kind : t(key);
}

function formatOrganizationStatus(organization: DemoOrganizationScope): string {
  const key = `identity.organization.status.${organization.status}`;

  return t(key) === key ? organization.status : t(key);
}

function formatOrganizationMeta(organization: DemoOrganizationScope): string {
  return `${formatOrganizationKind(organization)} · ${formatOrganizationStatus(organization)}`;
}

function isSelectedOrganization(organization: DemoOrganizationScope): boolean {
  return organization.id === selectedEntitlementOrganizationId.value;
}

function isUnavailableOrganization(organization: DemoOrganizationScope): boolean {
  return organization.status !== 'active';
}

function handleSelectOrganization(organization: DemoOrganizationScope) {
  if (switching.value || renewing.value || isSelectedOrganization(organization)) {
    return;
  }

  identityStore.selectEntitlementOrganization(organization.id);
  accountMenuOpen.value = false;
}

async function handleSwitchAccount(accountId: string) {
  if (switching.value || accountId === currentAccount.value?.id) {
    accountModalOpen.value = false;
    return;
  }

  accountModalOpen.value = false;
  await identityStore.switchAccount(accountId);
}

function handleOpenAccountModal() {
  accountMenuOpen.value = false;
  accountModalOpen.value = true;
}

function handleRetry() {
  accountMenuOpen.value = false;
  void identityStore.initialize();
}
</script>

<template>
  <div :class="identityHeaderRootClass">
    <DropdownMenu v-model:open="accountMenuOpen" align="end" :modal="false">
      <template #trigger>
        <button
          type="button"
          :class="identityMenuTriggerClass"
          :disabled="accountMenuDisabled"
          :aria-label="t('identity.account.openMenu')"
        >
          <span :class="identityTriggerIconClass" aria-hidden="true">
            <UserRound />
          </span>
          <span :class="identityTriggerTextClass">
            <span :class="identityTriggerNameClass">{{ accountLabel }}</span>
            <span :class="identityTriggerMetaClass">{{ accountMeta }}</span>
          </span>
          <ChevronsUpDown :size="16" aria-hidden="true" />
        </button>
      </template>

      <div :class="identityMenuSummaryClass">
        <span :class="identityMenuSummaryNameClass">{{ accountLabel }}</span>
        <span :class="identityMenuSummaryMetaClass">{{ accountMeta }}</span>
        <span v-if="currentAccount" :class="identityMenuSummaryMetaClass">
          {{ currentAccount.persona }}
        </span>
        <span v-if="errorMessage" :class="identityMenuSummaryMetaClass">
          {{ t('identity.account.contextUnavailable') }}
        </span>
        <span v-if="noticeKey" :class="identityMenuSummaryMetaClass">
          {{ t(noticeKey) }}
        </span>
      </div>

      <DropdownMenuSeparator />

      <div :class="identityMenuSectionClass">
        <div :class="identityMenuSectionHeaderClass">
          <p :class="identityMenuSectionTitleClass">
            {{ t('identity.organization.menuTitle') }}
          </p>
          <p :class="identityMenuSectionMetaClass">
            {{ t('identity.organization.menuMeta') }}
          </p>
        </div>

        <p v-if="!hasEntitlementOrganizations" :class="identityMenuSummaryMetaClass">
          {{ t('identity.organization.noScope') }}
        </p>

        <div v-else :class="identityOrganizationListClass">
          <button
            v-for="organization in entitlementOrganizations"
            :key="organization.id"
            type="button"
            :class="identityOrganizationOptionClass"
            :disabled="switching || renewing || isUnavailableOrganization(organization)"
            :aria-pressed="isSelectedOrganization(organization)"
            @click="handleSelectOrganization(organization)"
          >
            <span :class="identityOrganizationOptionContentClass">
              <span :class="identityOrganizationOptionNameClass">{{ organization.name }}</span>
              <span :class="identityOrganizationOptionMetaClass">
                {{ formatOrganizationMeta(organization) }}
              </span>
            </span>
            <span
              v-if="isSelectedOrganization(organization)"
              :class="identityOrganizationSelectedIconClass"
            >
              <Check aria-hidden="true" />
              <span class="sr-only">{{ t('identity.organization.current') }}</span>
            </span>
          </button>
        </div>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        :disabled="loading || accounts.length === 0"
        @click="handleOpenAccountModal"
      >
        <template #icon>
          <UserRound />
        </template>
        <span :class="identityMenuItemTextClass">
          <span :class="identityMenuItemLabelClass">{{ t('identity.account.switchAccount') }}</span>
          <span :class="identityMenuItemMetaClass">{{ t('identity.account.switchAccountMeta') }}</span>
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem v-if="errorMessage" @click="handleRetry">
        <template #icon>
          <RefreshCw />
        </template>
        <span :class="identityMenuItemTextClass">
          <span :class="identityMenuItemLabelClass">{{ t('identity.account.retry') }}</span>
          <span :class="identityMenuItemMetaClass">{{ t('identity.account.retryMeta') }}</span>
        </span>
      </DropdownMenuItem>
    </DropdownMenu>

    <Modal
      v-model:open="accountModalOpen"
      :title="t('identity.account.switchModalTitle')"
      type="informational"
    >
      <div :class="identityModalBodyClass">
        <p v-if="accounts.length === 0" class="m-0 text-sm text-hugo-text-subtle">
          {{ t('identity.account.noAccounts') }}
        </p>
        <div v-else :class="identityAccountListClass" :aria-label="t('identity.account.listLabel')">
          <button
            v-for="account in accounts"
            :key="account.id"
            type="button"
            :class="identityAccountOptionClass"
            :disabled="switching"
            :aria-pressed="account.id === currentAccount?.id"
            @click="handleSwitchAccount(account.id)"
          >
            <span :class="identityAccountOptionContentClass">
              <span :class="identityAccountOptionNameClass">{{ account.displayName }}</span>
              <span :class="identityAccountOptionMetaClass">{{ account.email }}</span>
              <span :class="identityStatusRowClass">
                <span :class="identityAccountOptionMetaClass">{{ account.persona }}</span>
                <Badge v-if="isInactiveAccount(account)" tone="warning">
                  {{ account.accountStatus }}
                </Badge>
              </span>
              <span :class="identityAccountOptionAccessClass">
                {{ getEntitlementAccessSummary(account) }}
              </span>
            </span>
            <span v-if="account.id === currentAccount?.id" :class="identityAccountSelectedClass">
              <Check :size="14" aria-hidden="true" />
              {{ t('identity.account.current') }}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
