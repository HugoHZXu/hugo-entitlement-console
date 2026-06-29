// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ActivityLogListResult, Product, UserAccessRow } from '@/shared/types';
import { listActivityLogs, listProducts, updateProductUserAllocations } from './entitlement-api';

const product: Product = {
  description: 'Analytics product granted through a contract license.',
  entitlementInfo: {
    allocationModel: 'Named-user allocation',
    entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
    grantType: 'Contract license',
    renewalDate: '2027-01-14',
    subscriberAccountId: 'account-1001',
    subscriberId: 'subscriber-1001',
  },
  icon: 'insight-studio',
  id: 'prod-insight-studio',
  name: 'Insight Studio',
  provider: 'Licensing Catalog',
  status: 'active',
  supportedPlatforms: ['Admin console'],
  usageDimensions: [
    {
      code: 'named_user_count',
      description: 'Assignable named-user seats.',
      name: 'Named users',
      unit: 'seat',
    },
  ],
};

const activityLogs: ActivityLogListResult = {
  items: [
    {
      action: 'quantity.updated',
      actionLabel: {
        defaultMessage: 'Updated allocation quantity',
        id: 'entitlement.activity.action.quantity.updated',
        values: [],
      },
      actor: {
        displayName: 'System Automation',
        email: null,
        type: 'system',
      },
      entitlementId: 'ent-insight-studio-2026-001',
      eventTime: '2026-06-24T00:00:00Z',
      id: 'activity-1',
      productId: 'prod-insight-studio',
      productName: 'Insight Studio',
      quantityDelta: 1,
      result: 'success',
      summary: 'System Automation updated allocation quantity for Insight Studio.',
      summaryMessage: {
        defaultMessage: '{actorName} updated allocation quantity for {productName}.',
        id: 'entitlement.activity.summary.quantity.updated',
        values: [],
      },
      target: {
        id: 'ent-insight-studio-2026-001',
        name: 'LIC-INSIGHT-STUDIO-2026',
        type: 'entitlement',
      },
    },
  ],
  totalElements: 1,
};

const userAccessRows: UserAccessRow[] = [
  {
    allocatedAt: '2026-06-24T00:00:00Z',
    department: 'Operations',
    email: 'amelia.hart@example.com',
    entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
    entitlementId: 'ent-insight-studio-2026-001',
    id: 'user-amelia-hart',
    isAllocated: true,
    name: 'Amelia Hart',
    productId: 'prod-insight-studio',
    seatQuantity: 1,
    status: 'active',
  },
];

function mockJsonFetch(payload: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      status,
    })
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

function getFetchBody(fetchMock: ReturnType<typeof mockJsonFetch>) {
  const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;

  if (!init?.body || typeof init.body !== 'string') {
    throw new Error('Expected fetch to receive a JSON request body.');
  }

  return JSON.parse(init.body) as Record<string, unknown>;
}

describe('entitlement service API', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads products through the entitlement GraphQL endpoint with selected organization scope', async () => {
    const fetchMock = mockJsonFetch({
      data: {
        products: [product],
      },
    });

    await expect(listProducts({ organizationId: 'org-tenant-001' })).resolves.toEqual([product]);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:4317/graphql',
      expect.objectContaining({
        method: 'POST',
      })
    );
    expect(getFetchBody(fetchMock)).toMatchObject({
      variables: {
        organizationId: 'org-tenant-001',
      },
    });
  });

  it('sends the stored identity token with entitlement GraphQL requests when available', async () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => {
          if (key === 'entitlementConsole.identityAccessToken') {
            return 'identity-token';
          }

          if (key === 'entitlementConsole.identityAccessTokenExpiresAt') {
            return '2099-01-01T00:00:00.000Z';
          }

          return null;
        },
      },
    });
    const fetchMock = mockJsonFetch({
      data: {
        products: [product],
      },
    });

    await listProducts({ organizationId: 'org-tenant-001' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:4317/graphql',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer identity-token',
        }),
      })
    );
  });

  it('sends Activity Log pagination, sorting, search, and organization through GraphQL', async () => {
    const fetchMock = mockJsonFetch({
      data: {
        activityLogs,
      },
    });

    await expect(
      listActivityLogs({
        organizationId: 'org-tenant-001',
        pageNumber: 2,
        pageSize: 100,
        productId: 'prod-insight-studio',
        searchString: '  Amelia  ',
        sortDirection: 'asc',
        sortField: 'actor',
      })
    ).resolves.toEqual(activityLogs);

    expect(getFetchBody(fetchMock)).toMatchObject({
      variables: {
        input: {
          organizationId: 'org-tenant-001',
          pageNumber: 2,
          pageSize: 100,
          productId: 'prod-insight-studio',
          searchString: 'Amelia',
          sortDirection: 'asc',
          sortField: 'actor',
        },
      },
    });
  });

  it('updates manual allocation selections through the entitlement REST command endpoint', async () => {
    const fetchMock = mockJsonFetch(userAccessRows);

    await expect(
      updateProductUserAllocations({
        organizationId: 'org-tenant-001',
        productId: 'prod-insight-studio',
        selectedUserIds: ['user-amelia-hart', 'user-amelia-hart', 'user-noah-kim'],
      })
    ).resolves.toEqual(userAccessRows);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:4317/organizations/org-tenant-001/products/prod-insight-studio/allocations',
      expect.objectContaining({
        method: 'PUT',
      })
    );
    expect(getFetchBody(fetchMock)).toEqual({
      selectedUserIds: ['user-amelia-hart', 'user-noah-kim'],
    });
  });

  it('surfaces backend validation messages from REST command failures', async () => {
    mockJsonFetch(
      {
        error: 'SEAT_LIMIT_EXCEEDED',
        message: 'Selected users exceed available seats for LIC-INSIGHT-STUDIO-2026.',
      },
      400
    );

    await expect(
      updateProductUserAllocations({
        organizationId: 'org-tenant-001',
        productId: 'prod-insight-studio',
        selectedUserIds: ['user-amelia-hart'],
      })
    ).rejects.toThrow('Selected users exceed available seats for LIC-INSIGHT-STUDIO-2026.');
  });

  it('surfaces GraphQL errors from read model failures', async () => {
    mockJsonFetch({
      data: null,
      errors: [
        {
          message: 'Product prod-missing was not found.',
        },
      ],
    });

    await expect(listProducts({ organizationId: 'org-tenant-001' })).rejects.toThrow(
      'Product prod-missing was not found.'
    );
  });
});
