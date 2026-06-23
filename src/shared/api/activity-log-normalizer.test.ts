// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { mockProducts } from '@/shared/mocks';
import type { RawActivityLogEntry } from '@/shared/types';
import { normalizeActivityLogEntry } from './activity-log-normalizer';

const baseEvent: RawActivityLogEntry = {
  id: 'act-test',
  productId: 'prod-insight-studio',
  entitlementId: 'ent-insight-studio-2026-001',
  action: 'user.allocated',
  actor: {
    type: 'user',
    displayName: 'Riley Admin',
    email: 'riley.admin@example.com',
  },
  target: {
    type: 'user',
    id: 'user-amelia-hart',
    name: 'Amelia Hart',
  },
  quantityDelta: -1,
  status: 'success',
  occurredAt: '2026-06-20T16:00:00Z',
};

describe('normalizeActivityLogEntry', () => {
  it('normalizes a successful event with actor and product context', () => {
    const entry = normalizeActivityLogEntry(baseEvent, mockProducts);

    expect(entry.actor.displayName).toBe('Riley Admin');
    expect(entry.productName).toBe('Insight Studio');
    expect(entry.actionLabel).toEqual({
      defaultMessage: 'User allocated',
      id: 'entitlementConsole.activity.action.USER_ALLOCATED',
      values: expect.arrayContaining([
        { key: 'targetName', value: 'Amelia Hart' },
        { key: 'productName', value: 'Insight Studio' },
        { key: 'quantityDelta', value: '-1' },
      ]),
    });
    expect(entry.result).toBe('success');
    expect(entry.summary).toContain('Amelia Hart was allocated access');
    expect(entry.summaryMessage.id).toBe('entitlementConsole.activity.summary.USER_ALLOCATED');
  });

  it('normalizes failed allocation copy', () => {
    const entry = normalizeActivityLogEntry(
      {
        ...baseEvent,
        quantityDelta: 0,
        status: 'failed',
      },
      mockProducts
    );

    expect(entry.result).toBe('failed');
    expect(entry.summary).toBe('Allocation attempt for Amelia Hart failed on Insight Studio.');
    expect(entry.summaryMessage).toMatchObject({
      defaultMessage: 'Allocation attempt for {targetName} failed on {productName}.',
      id: 'entitlementConsole.activity.summary.USER_ALLOCATION_FAILED',
    });
  });

  it('uses a system fallback when the raw event has no actor', () => {
    const entry = normalizeActivityLogEntry(
      {
        ...baseEvent,
        actor: null,
        status: 'pending',
      },
      mockProducts
    );

    expect(entry.actor.type).toBe('system');
    expect(entry.actor.displayName).toBe('System');
    expect(entry.actor.email).toBeNull();
  });

  it('uses an unknown action fallback for synthetic unmapped events', () => {
    const entry = normalizeActivityLogEntry(
      {
        ...baseEvent,
        action: 'entitlement.previewed',
        target: {
          type: 'entitlement',
          id: 'ent-insight-studio-2026-001',
          name: 'LIC-INSIGHT-STUDIO-2026',
        },
      },
      mockProducts
    );

    expect(entry.actionLabel).toMatchObject({
      defaultMessage: 'Unrecognized activity',
      id: 'entitlementConsole.activity.action.UNKNOWN',
    });
    expect(entry.summaryMessage.id).toBe('entitlementConsole.activity.summary.UNKNOWN');
    expect(entry.summary).toBe('Unrecognized activity recorded for LIC-INSIGHT-STUDIO-2026.');
  });
});
