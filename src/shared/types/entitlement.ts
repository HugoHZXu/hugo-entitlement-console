export type EntitlementStatus = 'active' | 'expired' | 'scheduled' | 'revoked' | (string & {});

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
  source: 'contract' | 'trial' | 'scheduled' | (string & {});
}
