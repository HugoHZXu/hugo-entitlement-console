import type { AllocatedUser } from '@/shared/types';

export const mockAllocatedUsers: AllocatedUser[] = [
  {
    id: 'usr-amelia-hart',
    productId: 'prod-learning-suite',
    entitlementId: 'ent-learning-annual-001',
    name: 'Amelia Hart',
    email: 'amelia.hart@example.com',
    department: 'Enablement',
    status: 'active',
    allocatedAt: '2026-02-03T10:20:00Z',
  },
  {
    id: 'usr-noah-kim',
    productId: 'prod-learning-suite',
    entitlementId: 'ent-learning-annual-001',
    name: 'Noah Kim',
    email: 'noah.kim@example.com',
    department: 'Operations',
    status: 'active',
    allocatedAt: '2026-02-07T14:35:00Z',
  },
  {
    id: 'usr-maya-singh',
    productId: 'prod-learning-suite',
    entitlementId: 'ent-learning-trial-002',
    name: 'Maya Singh',
    email: 'maya.singh@example.com',
    department: 'Training',
    status: 'pending',
    allocatedAt: '2026-05-09T09:15:00Z',
  },
  {
    id: 'usr-ethan-brooks',
    productId: 'prod-insights-hub',
    entitlementId: 'ent-insights-annual-001',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@example.com',
    department: 'Analytics',
    status: 'active',
    allocatedAt: '2026-03-12T16:05:00Z',
  },
];
