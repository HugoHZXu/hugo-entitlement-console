import type { ActivityLogActor, RawActivityLogEntry } from '@/shared/types';

type NonEmptyArray<T> = readonly [T, ...T[]];

type ActivityEventTemplate = {
  action: RawActivityLogEntry['action'];
  status: RawActivityLogEntry['status'];
  quantityDelta: number;
  targetType: RawActivityLogEntry['target']['type'];
  systemActor?: boolean;
};

type ActivityProductProfile = {
  productId: string;
  entitlementIds: NonEmptyArray<string>;
  entitlementCodes: NonEmptyArray<string>;
  targetUsers: NonEmptyArray<{ id: string; name: string }>;
};

const activityActors: NonEmptyArray<ActivityLogActor> = [
  { type: 'user', displayName: 'Riley Admin', email: 'riley.admin@example.com' },
  { type: 'user', displayName: 'Jordan Admin', email: 'jordan.admin@example.com' },
  { type: 'user', displayName: 'Casey Manager', email: 'casey.manager@example.com' },
  { type: 'user', displayName: 'Morgan Owner', email: 'morgan.owner@example.com' },
  { type: 'user', displayName: 'Avery Operator', email: 'avery.operator@example.com' },
];

const systemActor: ActivityLogActor = {
  type: 'system',
  displayName: 'Entitlement Sync',
  email: null,
};

const activityProductProfiles: NonEmptyArray<ActivityProductProfile> = [
  {
    productId: 'prod-insight-studio',
    entitlementIds: ['ent-insight-studio-2026-001', 'ent-insight-studio-trial-002'],
    entitlementCodes: ['LIC-INSIGHT-STUDIO-2026', 'LIC-INSIGHT-STUDIO-TRIAL'],
    targetUsers: [
      { id: 'user-amelia-hart', name: 'Amelia Hart' },
      { id: 'user-maya-singh', name: 'Maya Singh' },
      { id: 'user-noah-park', name: 'Noah Park' },
      { id: 'user-sofia-reed', name: 'Sofia Reed' },
      { id: 'user-theo-brooks', name: 'Theo Brooks' },
      { id: 'user-lina-chen', name: 'Lina Chen' },
    ],
  },
  {
    productId: 'prod-workflow-hub',
    entitlementIds: ['ent-workflow-hub-2026-001'],
    entitlementCodes: ['LIC-WORKFLOW-HUB-2026'],
    targetUsers: [
      { id: 'user-elliot-shaw', name: 'Elliot Shaw' },
      { id: 'user-priya-rao', name: 'Priya Rao' },
      { id: 'user-nolan-lee', name: 'Nolan Lee' },
      { id: 'user-iris-cole', name: 'Iris Cole' },
      { id: 'user-sam-taylor', name: 'Sam Taylor' },
      { id: 'user-june-miller', name: 'June Miller' },
    ],
  },
  {
    productId: 'prod-access-monitor',
    entitlementIds: ['ent-access-monitor-2026-001'],
    entitlementCodes: ['LIC-ACCESS-MONITOR-2026'],
    targetUsers: [
      { id: 'user-rowan-blake', name: 'Rowan Blake' },
      { id: 'user-harper-stone', name: 'Harper Stone' },
      { id: 'user-quinn-lane', name: 'Quinn Lane' },
      { id: 'user-nora-west', name: 'Nora West' },
      { id: 'user-miles-gray', name: 'Miles Gray' },
      { id: 'user-tessa-kim', name: 'Tessa Kim' },
    ],
  },
];

const eventTemplates: NonEmptyArray<ActivityEventTemplate> = [
  {
    action: 'user.allocated',
    status: 'success',
    quantityDelta: -1,
    targetType: 'user',
  },
  {
    action: 'user.revoked',
    status: 'success',
    quantityDelta: 1,
    targetType: 'user',
  },
  {
    action: 'quantity.updated',
    status: 'success',
    quantityDelta: 5,
    targetType: 'entitlement',
  },
  {
    action: 'user.allocated',
    status: 'pending',
    quantityDelta: -1,
    targetType: 'user',
    systemActor: true,
  },
  {
    action: 'user.allocated',
    status: 'failed',
    quantityDelta: 0,
    targetType: 'user',
  },
  {
    action: 'entitlement.created',
    status: 'success',
    quantityDelta: 25,
    targetType: 'entitlement',
    systemActor: true,
  },
  {
    action: 'quantity.updated',
    status: 'failed',
    quantityDelta: 0,
    targetType: 'entitlement',
  },
];

const seedActivityLogEntries: RawActivityLogEntry[] = [
  {
    id: 'act-001',
    productId: 'prod-insight-studio',
    entitlementId: 'ent-insight-studio-2026-001',
    action: 'entitlement.created',
    actor: activityActors[0] ?? systemActor,
    target: {
      type: 'entitlement',
      id: 'ent-insight-studio-2026-001',
      name: 'LIC-INSIGHT-STUDIO-2026',
    },
    quantityDelta: 75,
    status: 'success',
    occurredAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'act-002',
    productId: 'prod-insight-studio',
    entitlementId: 'ent-insight-studio-2026-001',
    action: 'user.allocated',
    actor: activityActors[0] ?? systemActor,
    target: {
      type: 'user',
      id: 'user-amelia-hart',
      name: 'Amelia Hart',
    },
    quantityDelta: -1,
    status: 'success',
    occurredAt: '2026-02-03T10:20:00Z',
  },
  {
    id: 'act-003',
    productId: 'prod-insight-studio',
    entitlementId: 'ent-insight-studio-trial-002',
    action: 'user.allocated',
    actor: null,
    target: {
      type: 'user',
      id: 'user-maya-singh',
      name: 'Maya Singh',
    },
    quantityDelta: -1,
    status: 'pending',
    occurredAt: '2026-05-09T09:15:00Z',
  },
  {
    id: 'act-004',
    productId: 'prod-workflow-hub',
    entitlementId: 'ent-workflow-hub-2026-001',
    action: 'quantity.updated',
    actor: activityActors[1] ?? systemActor,
    target: {
      type: 'entitlement',
      id: 'ent-workflow-hub-2026-001',
      name: 'LIC-WORKFLOW-HUB-2026',
    },
    quantityDelta: 10,
    status: 'success',
    occurredAt: '2026-04-18T12:30:00Z',
  },
  {
    id: 'act-005',
    productId: 'prod-workflow-hub',
    entitlementId: 'ent-workflow-hub-2026-001',
    action: 'user.allocated',
    actor: activityActors[2] ?? systemActor,
    target: {
      type: 'user',
      id: 'user-nolan-lee',
      name: 'Nolan Lee',
    },
    quantityDelta: 0,
    status: 'failed',
    occurredAt: '2026-05-22T15:45:00Z',
  },
  {
    id: 'act-006',
    productId: 'prod-access-monitor',
    entitlementId: 'ent-access-monitor-2026-001',
    action: 'entitlement.previewed',
    actor: systemActor,
    target: {
      type: 'entitlement',
      id: 'ent-access-monitor-2026-001',
      name: 'LIC-ACCESS-MONITOR-2026',
    },
    quantityDelta: 0,
    status: 'success',
    occurredAt: '2026-06-10T07:10:00Z',
  },
];

function pick<T>(items: NonEmptyArray<T>, index: number): T {
  return items[index % items.length] ?? items[0];
}

function createTarget(
  profile: ActivityProductProfile,
  template: ActivityEventTemplate,
  index: number
): RawActivityLogEntry['target'] {
  if (template.targetType === 'user') {
    const user = pick(profile.targetUsers, index);

    return {
      type: 'user',
      id: user.id,
      name: user.name,
    };
  }

  const entitlementId = pick(profile.entitlementIds, index);

  return {
    type: 'entitlement',
    id: entitlementId,
    name: pick(profile.entitlementCodes, index),
  };
}

function createGeneratedActivityLogEntry(
  profile: ActivityProductProfile,
  productIndex: number,
  index: number
): RawActivityLogEntry {
  const template = pick(eventTemplates, index + productIndex);
  const entitlementId = pick(profile.entitlementIds, index);
  const actor = template.systemActor ? systemActor : pick(activityActors, index + productIndex * 2);
  const hoursBack = productIndex * 11 + index * activityProductProfiles.length;
  const occurredAt = new Date(Date.UTC(2026, 5, 20, 16, 0, 0) - hoursBack * 60 * 60 * 1000);

  return {
    id: `act-${productIndex + 1}-${String(index + 1).padStart(4, '0')}`,
    productId: profile.productId,
    entitlementId,
    action: template.action,
    actor,
    target: createTarget(profile, template, index),
    quantityDelta: template.quantityDelta,
    status: template.status,
    occurredAt: occurredAt.toISOString(),
  };
}

function createGeneratedActivityLogEntries(): RawActivityLogEntry[] {
  return activityProductProfiles.flatMap((profile, productIndex) =>
    Array.from({ length: 420 }, (_, index) =>
      createGeneratedActivityLogEntry(profile, productIndex, index)
    )
  );
}

export const mockActivityLogEntries: RawActivityLogEntry[] = [
  ...seedActivityLogEntries,
  ...createGeneratedActivityLogEntries(),
].sort((first, second) => second.occurredAt.localeCompare(first.occurredAt));
