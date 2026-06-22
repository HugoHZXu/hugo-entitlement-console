export type AllocatedUserStatus = 'active' | 'pending' | 'revoked';

export interface AllocatedUser {
  id: string;
  productId: string;
  entitlementId: string;
  name: string;
  email: string;
  department: string;
  status: AllocatedUserStatus;
  allocatedAt: string;
}
