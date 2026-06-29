import { ChartNoAxesColumnIncreasing, Package, ShieldCheck, Workflow } from 'lucide-vue-next';
import type { Component } from 'vue';

import type { ProductIconName } from '@/shared/types';

const productIcons: Record<ProductIconName, Component> = {
  'access-monitor': ShieldCheck,
  'insight-studio': ChartNoAxesColumnIncreasing,
  'workflow-hub': Workflow,
};

export function getProductIcon(icon: ProductIconName): Component {
  return productIcons[icon as keyof typeof productIcons] ?? Package;
}
