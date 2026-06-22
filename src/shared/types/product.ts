export type ProductStatus = 'active' | 'scheduled' | 'retired';

export interface UsageDimension {
  code: string;
  name: string;
  description: string;
  unit: 'seat' | 'device' | 'credit';
}

export interface Product {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: ProductStatus;
  supportedPlatforms: string[];
  usageDimensions: UsageDimension[];
}

export interface ProductEntitlementSummary {
  productId: string;
  purchasedQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
}
