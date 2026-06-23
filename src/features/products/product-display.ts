import { useI18n } from 'vue-i18n';

import { formatDate } from '@/app/i18n';
import type { Product } from '@/shared/types';

const productCopyKeys: Record<string, { description: string; name: string }> = {
  'prod-access-monitor': {
    description: 'product.items.accessMonitor.description',
    name: 'product.items.accessMonitor.name',
  },
  'prod-insight-studio': {
    description: 'product.items.insightStudio.description',
    name: 'product.items.insightStudio.name',
  },
  'prod-workflow-hub': {
    description: 'product.items.workflowHub.description',
    name: 'product.items.workflowHub.name',
  },
};

const providerKeys: Record<string, string> = {
  'Licensing Catalog': 'product.provider.licensingCatalog',
};

const grantTypeKeys: Record<Product['entitlementInfo']['grantType'], string> = {
  'Contract license': 'product.grantType.contractLicense',
  'Scheduled license': 'product.grantType.scheduledLicense',
  'Trial license': 'product.grantType.trialLicense',
};

const allocationModelKeys: Record<string, string> = {
  'Named-user allocation': 'product.allocationModel.namedUserAllocation',
  'Scheduled named-user allocation': 'product.allocationModel.scheduledNamedUserAllocation',
};

export function useProductDisplay() {
  const { locale, t, te } = useI18n();

  const translateWithFallback = (key: string | undefined, fallback: string) =>
    key && te(key) ? t(key) : fallback;

  return {
    formatAllocationModel(product: Product) {
      return translateWithFallback(
        allocationModelKeys[product.entitlementInfo.allocationModel],
        product.entitlementInfo.allocationModel
      );
    },
    formatGrantType(product: Product) {
      return translateWithFallback(
        grantTypeKeys[product.entitlementInfo.grantType],
        product.entitlementInfo.grantType
      );
    },
    formatProductDescription(product: Product) {
      return translateWithFallback(productCopyKeys[product.id]?.description, product.description);
    },
    formatProductName(product: Product) {
      return translateWithFallback(productCopyKeys[product.id]?.name, product.name);
    },
    formatProvider(product: Product) {
      return translateWithFallback(providerKeys[product.provider], product.provider);
    },
    formatRenewalDate(product: Product) {
      return formatDate(product.entitlementInfo.renewalDate, locale.value);
    },
  };
}
