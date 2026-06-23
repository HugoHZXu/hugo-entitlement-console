import type { Product } from '@/shared/types';

export const mockProducts: Product[] = [
  {
    id: 'prod-insight-studio',
    icon: 'insight-studio',
    name: 'Insight Studio',
    provider: 'Licensing Catalog',
    description:
      'Analytics product granted through a contract license and allocated to named users.',
    status: 'active',
    supportedPlatforms: ['Admin console', 'Provisioning API'],
    usageDimensions: [
      {
        code: 'named_user_count',
        name: 'Named users',
        description: 'Assignable named-user seats granted through licenses.',
        unit: 'seat',
      },
    ],
    entitlementInfo: {
      entitlementCode: 'LIC-INSIGHT-STUDIO-2026',
      grantType: 'Contract license',
      allocationModel: 'Named-user allocation',
      subscriberId: 'subscriber-1001',
      subscriberAccountId: 'account-1001',
      renewalDate: '2027-01-14',
    },
  },
  {
    id: 'prod-workflow-hub',
    icon: 'workflow-hub',
    name: 'Workflow Hub',
    provider: 'Licensing Catalog',
    description:
      'Workflow product with a separate license pool and named-user allocation.',
    status: 'active',
    supportedPlatforms: ['Admin console', 'Provisioning API'],
    usageDimensions: [
      {
        code: 'named_user_count',
        name: 'Named users',
        description: 'Assignable named-user seats granted through licenses.',
        unit: 'seat',
      },
    ],
    entitlementInfo: {
      entitlementCode: 'LIC-WORKFLOW-HUB-2026',
      grantType: 'Contract license',
      allocationModel: 'Named-user allocation',
      subscriberId: 'subscriber-1002',
      subscriberAccountId: 'account-1002',
      renewalDate: '2027-01-31',
    },
  },
  {
    id: 'prod-access-monitor',
    icon: 'access-monitor',
    name: 'Access Monitor',
    provider: 'Licensing Catalog',
    description:
      'Access monitoring product scheduled to become available when the license term starts.',
    status: 'scheduled',
    supportedPlatforms: ['Admin console', 'Provisioning API'],
    usageDimensions: [
      {
        code: 'named_user_count',
        name: 'Named users',
        description: 'Assignable named-user seats granted through licenses.',
        unit: 'seat',
      },
    ],
    entitlementInfo: {
      entitlementCode: 'LIC-ACCESS-MONITOR-2026',
      grantType: 'Scheduled license',
      allocationModel: 'Scheduled named-user allocation',
      subscriberId: 'subscriber-1003',
      subscriberAccountId: 'account-1003',
      renewalDate: '2027-06-30',
    },
  },
];
