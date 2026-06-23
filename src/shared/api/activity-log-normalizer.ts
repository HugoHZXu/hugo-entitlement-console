import type {
  ActivityLogActor,
  ActivityLogEntry,
  ActivityLogKnownAction,
  LocalizedMessage,
  LocalizedMessageValue,
  Product,
  RawActivityLogEntry,
} from '@/shared/types';

type ActivityMessageKey =
  | 'ENTITLEMENT_CREATED'
  | 'QUANTITY_UPDATED'
  | 'USER_ALLOCATED'
  | 'USER_ALLOCATION_FAILED'
  | 'USER_REVOKED'
  | 'UNKNOWN';

type ActivityDefinition = {
  actionLabelDefaultMessage: string;
  actionMessageKey: Exclude<ActivityMessageKey, 'USER_ALLOCATION_FAILED'>;
  summaryDefaultMessage: string;
  summaryMessageKey: ActivityMessageKey;
};

const ACTIVITY_MESSAGE_NAMESPACE = 'entitlementConsole.activity';

const actionLabels: Record<ActivityLogKnownAction, string> = {
  'entitlement.created': 'Entitlement created',
  'quantity.updated': 'Quantity updated',
  'user.allocated': 'User allocated',
  'user.revoked': 'User revoked',
};

const activityDefinitions: Record<ActivityLogKnownAction, ActivityDefinition> = {
  'entitlement.created': {
    actionLabelDefaultMessage: 'Entitlement created',
    actionMessageKey: 'ENTITLEMENT_CREATED',
    summaryDefaultMessage: '{targetName} was created for {productName} ({quantityText}).',
    summaryMessageKey: 'ENTITLEMENT_CREATED',
  },
  'quantity.updated': {
    actionLabelDefaultMessage: 'Quantity updated',
    actionMessageKey: 'QUANTITY_UPDATED',
    summaryDefaultMessage: '{targetName} quantity changed by {quantityText}.',
    summaryMessageKey: 'QUANTITY_UPDATED',
  },
  'user.allocated': {
    actionLabelDefaultMessage: 'User allocated',
    actionMessageKey: 'USER_ALLOCATED',
    summaryDefaultMessage: '{targetName} was allocated access to {productName} ({quantityText}).',
    summaryMessageKey: 'USER_ALLOCATED',
  },
  'user.revoked': {
    actionLabelDefaultMessage: 'User revoked',
    actionMessageKey: 'USER_REVOKED',
    summaryDefaultMessage: '{targetName} access was revoked from {productName} ({quantityText}).',
    summaryMessageKey: 'USER_REVOKED',
  },
};

const failedAllocationDefinition: ActivityDefinition = {
  actionLabelDefaultMessage: 'User allocated',
  actionMessageKey: 'USER_ALLOCATED',
  summaryDefaultMessage: 'Allocation attempt for {targetName} failed on {productName}.',
  summaryMessageKey: 'USER_ALLOCATION_FAILED',
};

const unknownDefinition: ActivityDefinition = {
  actionLabelDefaultMessage: 'Unrecognized activity',
  actionMessageKey: 'UNKNOWN',
  summaryDefaultMessage: 'Unrecognized activity recorded for {targetName}.',
  summaryMessageKey: 'UNKNOWN',
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

function getQuantityDeltaText(quantityDelta: number): string {
  if (quantityDelta > 0) {
    return `+${quantityDelta}`;
  }

  return `${quantityDelta}`;
}

function getDefaultQuantityText(quantityDelta: number): string {
  const absoluteQuantity = Math.abs(quantityDelta);
  const seatLabel = absoluteQuantity === 1 ? 'seat' : 'seats';

  return `${getQuantityDeltaText(quantityDelta)} ${seatLabel}`;
}

function getActivityDefinition(event: RawActivityLogEntry): ActivityDefinition {
  if (event.action === 'user.allocated' && event.status === 'failed') {
    return failedAllocationDefinition;
  }

  return activityDefinitions[event.action as ActivityLogKnownAction] ?? unknownDefinition;
}

const valuesToRecord = (values: LocalizedMessageValue[]) =>
  values.reduce<Record<string, string>>((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});

function interpolateMessage(message: LocalizedMessage): string {
  const values = valuesToRecord(message.values);

  return message.defaultMessage.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => {
    return values[key] ?? '';
  });
}

function createMessageValues(
  event: RawActivityLogEntry,
  productName: string,
  actionName: string
): LocalizedMessageValue[] {
  return [
    { key: 'targetName', value: event.target.name },
    { key: 'productName', value: productName },
    { key: 'quantityDelta', value: String(event.quantityDelta) },
    { key: 'quantityDeltaText', value: getQuantityDeltaText(event.quantityDelta) },
    { key: 'quantityText', value: getDefaultQuantityText(event.quantityDelta) },
    { key: 'actionName', value: actionName },
  ];
}

function createActionLabel(
  definition: ActivityDefinition,
  values: LocalizedMessageValue[]
): LocalizedMessage {
  return {
    id: `${ACTIVITY_MESSAGE_NAMESPACE}.action.${definition.actionMessageKey}`,
    defaultMessage: definition.actionLabelDefaultMessage,
    values,
  };
}

function createSummaryMessage(
  definition: ActivityDefinition,
  values: LocalizedMessageValue[]
): LocalizedMessage {
  return {
    id: `${ACTIVITY_MESSAGE_NAMESPACE}.summary.${definition.summaryMessageKey}`,
    defaultMessage: definition.summaryDefaultMessage,
    values,
  };
}

export function normalizeActivityLogEntry(
  event: RawActivityLogEntry,
  products: Product[]
): ActivityLogEntry {
  const productName = getProductName(event.productId, products);
  const definition = getActivityDefinition(event);
  const actionName = getActionLabel(event.action);
  const values = createMessageValues(event, productName, actionName);
  const actionLabel = createActionLabel(definition, values);
  const summaryMessage = createSummaryMessage(definition, values);

  return {
    id: event.id,
    productId: event.productId,
    productName,
    entitlementId: event.entitlementId,
    actor: event.actor ?? fallbackActor,
    target: event.target,
    action: event.action,
    actionLabel,
    summary: interpolateMessage(summaryMessage),
    summaryMessage,
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
