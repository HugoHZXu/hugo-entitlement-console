export type ProductStatus = 'active' | 'scheduled' | 'retired';
export type ProductIconName = 'insight-studio' | 'workflow-hub' | 'access-monitor';

export interface UsageDimension {
  code: string;
  name: string;
  description: string;
  unit: 'seat' | 'device' | 'credit';
}

export interface ProductEntitlementInfo {
  entitlementCode: string;
  grantType: 'Contract license' | 'Trial license' | 'Scheduled license';
  allocationModel: string;
  subscriberId: string;
  subscriberAccountId: string;
  renewalDate: string;
}

export interface Product {
  id: string;
  icon: ProductIconName;
  name: string;
  provider: string;
  description: string;
  status: ProductStatus;
  supportedPlatforms: string[];
  usageDimensions: UsageDimension[];
  entitlementInfo: ProductEntitlementInfo;
}

export interface ProductEntitlementSummary {
  productId: string;
  purchasedQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
}
