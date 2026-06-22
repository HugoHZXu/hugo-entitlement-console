import type { Product } from '@/shared/types';

export const mockProducts: Product[] = [
  {
    id: 'prod-learning-suite',
    name: 'Learning Suite',
    provider: 'Hugo Marketplace',
    description: 'Cloud learning tools for training teams and enterprise enablement programs.',
    status: 'active',
    supportedPlatforms: ['Web', 'Windows', 'macOS'],
    usageDimensions: [
      {
        code: 'USER_SEAT',
        name: 'User seat',
        description: 'Named user access to the product.',
        unit: 'seat',
      },
    ],
  },
  {
    id: 'prod-insights-hub',
    name: 'Insights Hub',
    provider: 'Hugo Marketplace',
    description: 'Reporting workspace for entitlement usage and adoption signals.',
    status: 'active',
    supportedPlatforms: ['Web'],
    usageDimensions: [
      {
        code: 'USER_SEAT',
        name: 'User seat',
        description: 'Named user access to dashboard insights.',
        unit: 'seat',
      },
    ],
  },
  {
    id: 'prod-device-connect',
    name: 'Device Connect',
    provider: 'Hugo Marketplace',
    description: 'Device access add-on for managed hardware integrations.',
    status: 'scheduled',
    supportedPlatforms: ['Windows', 'macOS'],
    usageDimensions: [
      {
        code: 'DEVICE_ACCESS',
        name: 'Device access',
        description: 'Managed device entitlement.',
        unit: 'device',
      },
    ],
  },
];
