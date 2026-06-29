export type AllocatedUserStatus = 'active' | 'pending' | 'revoked' | (string & {});

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
  sourceJobId?: string | null;
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
  organizationId?: string | null;
  productId: string;
  selectedUserIds: string[];
}
