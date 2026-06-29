import type { BadgeTone } from '@hugo-ui/shadcn-vue';

import type { ProductStatus } from '@/shared/types';

const productStatusTone: Record<'active' | 'scheduled' | 'retired', BadgeTone> = {
  active: 'success',
  scheduled: 'warning',
  retired: 'neutral',
};

const productStatusMessageKeys: Record<'active' | 'scheduled' | 'retired', string> = {
  active: 'common.status.active',
  retired: 'common.status.retired',
  scheduled: 'common.status.scheduled',
};

export function formatProductStatus(status: ProductStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getProductStatusMessageKey(status: ProductStatus) {
  return (
    productStatusMessageKeys[status as keyof typeof productStatusMessageKeys] ??
    'common.status.unknown'
  );
}

export function getProductStatusTone(status: ProductStatus) {
  return productStatusTone[status as keyof typeof productStatusTone] ?? 'neutral';
}
