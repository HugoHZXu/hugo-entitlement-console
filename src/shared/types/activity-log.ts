export type ActivityLogStatus = 'success' | 'failed' | 'pending';

export type ActivityLogKnownAction =
  | 'entitlement.created'
  | 'user.allocated'
  | 'user.revoked'
  | 'quantity.updated';

export type ActivityLogActorType = 'user' | 'system';

export type ActivityLogTargetType = 'entitlement' | 'user';

export type ActivityLogSortField = 'actor' | 'summary' | 'product' | 'result' | 'eventTime';

export type ActivityLogSortDirection = 'asc' | 'desc';

export interface ActivityLogActor {
  type: ActivityLogActorType;
  displayName: string;
  email: string | null;
}

export interface ActivityLogTarget {
  type: ActivityLogTargetType;
  id: string;
  name: string;
}

export interface RawActivityLogEntry {
  id: string;
  productId: string;
  entitlementId: string | null;
  action: ActivityLogKnownAction | (string & {});
  actor: ActivityLogActor | null;
  target: ActivityLogTarget;
  quantityDelta: number;
  status: ActivityLogStatus;
  occurredAt: string;
}

export interface ActivityLogEntry {
  id: string;
  productId: string;
  productName: string;
  entitlementId: string | null;
  actor: ActivityLogActor;
  target: ActivityLogTarget;
  action: string;
  actionLabel: string;
  summary: string;
  quantityDelta: number;
  result: ActivityLogStatus;
  eventTime: string;
}

export interface ActivityLogListInput {
  productId?: string;
  sortField?: ActivityLogSortField;
  sortDirection?: ActivityLogSortDirection;
  searchString?: string;
}

export interface ActivityLogListResult {
  items: ActivityLogEntry[];
  totalElements: number;
}
