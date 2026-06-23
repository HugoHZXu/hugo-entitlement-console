export type EntitlementStatus = 'active' | 'expired' | 'scheduled' | 'revoked';

export interface Entitlement {
  id: string;
  productId: string;
  entitlementCode: string;
  usageDimensionCode: string;
  purchasedQuantity: number;
  allocatedQuantity: number;
  status: EntitlementStatus;
  startDate: string;
  endDate: string;
  source: 'contract' | 'trial' | 'scheduled';
}
