import type { BadgeTone } from '@hugo-ui/shadcn-vue';

import type { ProductStatus } from '@/shared/types';

const productStatusTone: Record<ProductStatus, BadgeTone> = {
  active: 'success',
  scheduled: 'warning',
  retired: 'neutral',
};

export function formatProductStatus(status: ProductStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getProductStatusTone(status: ProductStatus) {
  return productStatusTone[status];
}
