export type AllocatedUserStatus = 'active' | 'pending' | 'revoked';

export interface AllocatedUser {
  id: string;
  productId: string;
  entitlementId: string;
  seatQuantity: number;
  name: string;
  email: string;
  department: string;
  status: AllocatedUserStatus;
  allocatedAt: string;
}

export interface UserAccessCandidate {
  id: string;
  productId: string;
  entitlementId: string;
  seatQuantity: number;
  name: string;
  email: string;
  department: string;
  status: AllocatedUserStatus;
}

export interface UserAccessRow extends UserAccessCandidate {
  entitlementCode: string;
  isAllocated: boolean;
  allocatedAt: string | null;
}

export interface UpdateProductUserAllocationsInput {
  productId: string;
  selectedUserIds: string[];
}
