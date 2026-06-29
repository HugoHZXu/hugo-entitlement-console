export type ActivityLogStatus = 'success' | 'failed' | 'pending' | (string & {});

export type ActivityLogKnownAction =
  | 'entitlement.created'
  | 'user.allocated'
  | 'user.revoked'
  | 'quantity.updated';

export type ActivityLogActorType = 'user' | 'system';

export type ActivityLogTargetType = 'entitlement' | 'user';

export type ActivityLogSortField = 'actor' | 'summary' | 'product' | 'result' | 'eventTime';

export type ActivityLogSortDirection = 'asc' | 'desc';

export interface LocalizedMessageValue {
  key: string;
  value: string;
}

export interface LocalizedMessage {
  id: string;
  defaultMessage: string;
  values: LocalizedMessageValue[];
}

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
  actionLabel: LocalizedMessage;
  summary: string;
  summaryMessage: LocalizedMessage;
  quantityDelta: number;
  result: ActivityLogStatus;
  eventTime: string;
}

export interface ActivityLogListInput {
  organizationId?: string | null;
  productId?: string | null;
  sortField?: ActivityLogSortField | null;
  sortDirection?: ActivityLogSortDirection | null;
  searchString?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}

export interface ActivityLogListResult {
  items: ActivityLogEntry[];
  totalElements: number;
}
