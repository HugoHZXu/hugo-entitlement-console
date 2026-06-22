export type ActivityLogStatus = 'success' | 'failed' | 'pending';

export interface ActivityLogEntry {
  id: string;
  productId: string;
  entitlementId: string;
  action: 'entitlement.created' | 'user.allocated' | 'user.revoked' | 'quantity.updated';
  actor: string;
  target: string;
  quantityDelta: number;
  status: ActivityLogStatus;
  occurredAt: string;
}
