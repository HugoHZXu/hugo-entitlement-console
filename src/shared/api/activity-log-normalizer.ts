import type {
  ActivityLogActor,
  ActivityLogEntry,
  ActivityLogKnownAction,
  Product,
  RawActivityLogEntry,
} from '@/shared/types';

const actionLabels: Record<ActivityLogKnownAction, string> = {
  'entitlement.created': 'Entitlement created',
  'quantity.updated': 'Quantity updated',
  'user.allocated': 'User allocated',
  'user.revoked': 'User revoked',
};

const fallbackActor: ActivityLogActor = {
  type: 'system',
  displayName: 'System',
  email: null,
};

function getActionLabel(action: string): string {
  return actionLabels[action as ActivityLogKnownAction] ?? 'Unrecognized activity';
}

function getProductName(productId: string, products: Product[]): string {
  return products.find((product) => product.id === productId)?.name ?? 'Unknown product';
}

function getQuantityText(quantityDelta: number): string {
  if (quantityDelta > 0) {
    return `+${quantityDelta} seats`;
  }

  if (quantityDelta < 0) {
    return `${quantityDelta} seats`;
  }

  return 'no quantity change';
}

function getActivitySummary(event: RawActivityLogEntry, productName: string): string {
  const quantityText = getQuantityText(event.quantityDelta);

  if (event.action === 'user.allocated' && event.status === 'failed') {
    return `Allocation attempt for ${event.target.name} failed on ${productName}.`;
  }

  if (event.action === 'user.allocated') {
    return `${event.target.name} was allocated access to ${productName} (${quantityText}).`;
  }

  if (event.action === 'user.revoked') {
    return `${event.target.name} access was revoked from ${productName} (${quantityText}).`;
  }

  if (event.action === 'quantity.updated') {
    return `${event.target.name} quantity changed by ${quantityText}.`;
  }

  if (event.action === 'entitlement.created') {
    return `${event.target.name} was created for ${productName} (${quantityText}).`;
  }

  return `${getActionLabel(event.action)} recorded for ${event.target.name}.`;
}

export function normalizeActivityLogEntry(
  event: RawActivityLogEntry,
  products: Product[]
): ActivityLogEntry {
  const productName = getProductName(event.productId, products);

  return {
    id: event.id,
    productId: event.productId,
    productName,
    entitlementId: event.entitlementId,
    actor: event.actor ?? fallbackActor,
    target: event.target,
    action: event.action,
    actionLabel: getActionLabel(event.action),
    summary: getActivitySummary(event, productName),
    quantityDelta: event.quantityDelta,
    result: event.status,
    eventTime: event.occurredAt,
  };
}

export function normalizeActivityLogEntries(
  events: RawActivityLogEntry[],
  products: Product[]
): ActivityLogEntry[] {
  return events.map((event) => normalizeActivityLogEntry(event, products));
}
