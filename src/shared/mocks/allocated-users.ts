import type { AllocatedUser, AllocatedUserStatus, UserAccessCandidate } from '@/shared/types';

interface AllocatedUserSeed {
  name: string;
  email: string;
  department: string;
  status: AllocatedUserStatus;
  allocatedAt: string;
}

type UserAccessCandidateSeed = Omit<AllocatedUserSeed, 'allocatedAt'>;

function createAllocatedUserId(email: string): string {
  const atSignIndex = email.indexOf('@');
  const localPart = atSignIndex === -1 ? email : email.slice(0, atSignIndex);

  return `usr-${localPart.replace(/\./g, '-')}`;
}

function createUserAccessCandidates(
  productId: string,
  entitlementId: string,
  users: UserAccessCandidateSeed[]
): UserAccessCandidate[] {
  return users.map((user) => ({
    id: createAllocatedUserId(user.email),
    productId,
    entitlementId,
    seatQuantity: 1,
    ...user,
  }));
}

function createAllocatedUsers(
  productId: string,
  entitlementId: string,
  users: AllocatedUserSeed[]
): AllocatedUser[] {
  return users.map((user) => ({
    id: createAllocatedUserId(user.email),
    productId,
    entitlementId,
    seatQuantity: 1,
    ...user,
  }));
}

const insightStudioContractUsers = createAllocatedUsers(
  'prod-insight-studio',
  'ent-insight-studio-2026-001',
  [
    {
      name: 'Amelia Hart',
      email: 'amelia.hart@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-02-03T10:20:00Z',
    },
    {
      name: 'Noah Kim',
      email: 'noah.kim@example.com',
      department: 'Operations',
      status: 'active',
      allocatedAt: '2026-02-07T14:35:00Z',
    },
    {
      name: 'Lina Torres',
      email: 'lina.torres@example.com',
      department: 'Sales',
      status: 'active',
      allocatedAt: '2026-02-10T08:45:00Z',
    },
    {
      name: 'Owen Price',
      email: 'owen.price@example.com',
      department: 'Finance',
      status: 'active',
      allocatedAt: '2026-02-11T11:25:00Z',
    },
    {
      name: 'Priya Shah',
      email: 'priya.shah@example.com',
      department: 'Product',
      status: 'active',
      allocatedAt: '2026-02-13T15:40:00Z',
    },
    {
      name: 'Caleb Reed',
      email: 'caleb.reed@example.com',
      department: 'Operations',
      status: 'pending',
      allocatedAt: '2026-02-16T09:10:00Z',
    },
    {
      name: 'Nina Brooks',
      email: 'nina.brooks@example.com',
      department: 'Support',
      status: 'active',
      allocatedAt: '2026-02-18T13:30:00Z',
    },
    {
      name: 'Eli Carter',
      email: 'eli.carter@example.com',
      department: 'Customer Success',
      status: 'active',
      allocatedAt: '2026-02-19T10:05:00Z',
    },
    {
      name: 'Sofia Nguyen',
      email: 'sofia.nguyen@example.com',
      department: 'Marketing',
      status: 'active',
      allocatedAt: '2026-02-21T16:20:00Z',
    },
    {
      name: 'Miles Foster',
      email: 'miles.foster@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-02-24T12:15:00Z',
    },
    {
      name: 'Iris Bennett',
      email: 'iris.bennett@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-02-26T09:55:00Z',
    },
    {
      name: 'Theo Morgan',
      email: 'theo.morgan@example.com',
      department: 'Operations',
      status: 'active',
      allocatedAt: '2026-03-02T14:45:00Z',
    },
    {
      name: 'Zoe Turner',
      email: 'zoe.turner@example.com',
      department: 'Finance',
      status: 'pending',
      allocatedAt: '2026-03-04T10:35:00Z',
    },
    {
      name: 'Jonah Clark',
      email: 'jonah.clark@example.com',
      department: 'Sales',
      status: 'active',
      allocatedAt: '2026-03-06T13:50:00Z',
    },
    {
      name: 'Mila Adams',
      email: 'mila.adams@example.com',
      department: 'Product',
      status: 'active',
      allocatedAt: '2026-03-09T09:40:00Z',
    },
    {
      name: 'Kai Rivera',
      email: 'kai.rivera@example.com',
      department: 'Customer Success',
      status: 'active',
      allocatedAt: '2026-03-11T15:05:00Z',
    },
    {
      name: 'Nora Patel',
      email: 'nora.patel@example.com',
      department: 'Support',
      status: 'active',
      allocatedAt: '2026-03-13T08:25:00Z',
    },
    {
      name: 'Leo Griffin',
      email: 'leo.griffin@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-03-17T11:30:00Z',
    },
    {
      name: 'Eva Stone',
      email: 'eva.stone@example.com',
      department: 'Marketing',
      status: 'active',
      allocatedAt: '2026-03-19T16:10:00Z',
    },
    {
      name: 'Samir Khan',
      email: 'samir.khan@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-03-23T09:20:00Z',
    },
    {
      name: 'Grace Ellis',
      email: 'grace.ellis@example.com',
      department: 'Operations',
      status: 'active',
      allocatedAt: '2026-03-25T14:00:00Z',
    },
    {
      name: 'Ian Moore',
      email: 'ian.moore@example.com',
      department: 'Finance',
      status: 'pending',
      allocatedAt: '2026-03-27T12:50:00Z',
    },
    {
      name: 'Ruby Hayes',
      email: 'ruby.hayes@example.com',
      department: 'Sales',
      status: 'active',
      allocatedAt: '2026-03-30T10:15:00Z',
    },
    {
      name: 'Felix Walker',
      email: 'felix.walker@example.com',
      department: 'Support',
      status: 'active',
      allocatedAt: '2026-04-01T15:45:00Z',
    },
    {
      name: 'Ada Coleman',
      email: 'ada.coleman@example.com',
      department: 'Product',
      status: 'active',
      allocatedAt: '2026-04-03T09:05:00Z',
    },
    {
      name: 'Hayden Simmons',
      email: 'hayden.simmons@example.com',
      department: 'Customer Success',
      status: 'active',
      allocatedAt: '2026-04-07T11:55:00Z',
    },
    {
      name: 'June Parker',
      email: 'june.parker@example.com',
      department: 'Marketing',
      status: 'active',
      allocatedAt: '2026-04-09T13:15:00Z',
    },
    {
      name: 'Alexis Ward',
      email: 'alexis.ward@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-04-13T16:35:00Z',
    },
  ]
);

const insightStudioTrialUsers = createAllocatedUsers(
  'prod-insight-studio',
  'ent-insight-studio-trial-002',
  [
    {
      name: 'Maya Singh',
      email: 'maya.singh@example.com',
      department: 'Training',
      status: 'pending',
      allocatedAt: '2026-05-09T09:15:00Z',
    },
    {
      name: 'Talia Wells',
      email: 'talia.wells@example.com',
      department: 'Training',
      status: 'active',
      allocatedAt: '2026-05-10T10:45:00Z',
    },
    {
      name: 'Marcus Lane',
      email: 'marcus.lane@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-05-13T13:20:00Z',
    },
    {
      name: 'Elise Young',
      email: 'elise.young@example.com',
      department: 'Operations',
      status: 'active',
      allocatedAt: '2026-05-15T08:50:00Z',
    },
    {
      name: 'Victor Chen',
      email: 'victor.chen@example.com',
      department: 'Support',
      status: 'pending',
      allocatedAt: '2026-05-18T14:25:00Z',
    },
    {
      name: 'Serena Fox',
      email: 'serena.fox@example.com',
      department: 'Sales',
      status: 'active',
      allocatedAt: '2026-05-20T11:40:00Z',
    },
  ]
);

const workflowHubContractUsers = createAllocatedUsers(
  'prod-workflow-hub',
  'ent-workflow-hub-2026-001',
  [
    {
      name: 'Ethan Brooks',
      email: 'ethan.brooks@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-03-12T16:05:00Z',
    },
    {
      name: 'Olivia Grant',
      email: 'olivia.grant@example.com',
      department: 'Operations',
      status: 'active',
      allocatedAt: '2026-03-14T09:25:00Z',
    },
    {
      name: 'Daniel Park',
      email: 'daniel.park@example.com',
      department: 'Finance',
      status: 'active',
      allocatedAt: '2026-03-15T12:45:00Z',
    },
    {
      name: 'Hannah Rossi',
      email: 'hannah.rossi@example.com',
      department: 'Product',
      status: 'pending',
      allocatedAt: '2026-03-18T10:30:00Z',
    },
    {
      name: 'Aaron Blake',
      email: 'aaron.blake@example.com',
      department: 'Support',
      status: 'active',
      allocatedAt: '2026-03-20T14:10:00Z',
    },
    {
      name: 'Claire Novak',
      email: 'claire.novak@example.com',
      department: 'Customer Success',
      status: 'active',
      allocatedAt: '2026-03-23T08:55:00Z',
    },
    {
      name: 'Ben Soto',
      email: 'ben.soto@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-03-25T15:35:00Z',
    },
    {
      name: 'Stella Morris',
      email: 'stella.morris@example.com',
      department: 'Marketing',
      status: 'active',
      allocatedAt: '2026-03-27T11:15:00Z',
    },
    {
      name: 'Nathan Liu',
      email: 'nathan.liu@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-03-30T09:05:00Z',
    },
    {
      name: 'Emma Wright',
      email: 'emma.wright@example.com',
      department: 'Operations',
      status: 'pending',
      allocatedAt: '2026-04-01T13:50:00Z',
    },
    {
      name: 'Jack Quinn',
      email: 'jack.quinn@example.com',
      department: 'Finance',
      status: 'active',
      allocatedAt: '2026-04-03T10:20:00Z',
    },
    {
      name: 'Lucy Hale',
      email: 'lucy.hale@example.com',
      department: 'Product',
      status: 'active',
      allocatedAt: '2026-04-07T16:15:00Z',
    },
    {
      name: 'Omar Diaz',
      email: 'omar.diaz@example.com',
      department: 'Support',
      status: 'active',
      allocatedAt: '2026-04-09T12:35:00Z',
    },
    {
      name: 'Isabel Cruz',
      email: 'isabel.cruz@example.com',
      department: 'Customer Success',
      status: 'active',
      allocatedAt: '2026-04-13T09:45:00Z',
    },
    {
      name: 'Max Powell',
      email: 'max.powell@example.com',
      department: 'Enablement',
      status: 'active',
      allocatedAt: '2026-04-15T14:05:00Z',
    },
    {
      name: 'Cora West',
      email: 'cora.west@example.com',
      department: 'Marketing',
      status: 'active',
      allocatedAt: '2026-04-17T11:30:00Z',
    },
    {
      name: 'Ryan Scott',
      email: 'ryan.scott@example.com',
      department: 'Analytics',
      status: 'active',
      allocatedAt: '2026-04-20T15:20:00Z',
    },
  ]
);

export const mockAllocatedUsers: AllocatedUser[] = [
  ...insightStudioContractUsers,
  ...insightStudioTrialUsers,
  ...workflowHubContractUsers,
];

const insightStudioContractCandidates = createUserAccessCandidates(
  'prod-insight-studio',
  'ent-insight-studio-2026-001',
  [
    {
      name: 'Dylan Fox',
      email: 'dylan.fox@example.com',
      department: 'Operations',
      status: 'active',
    },
    {
      name: 'Maren Hughes',
      email: 'maren.hughes@example.com',
      department: 'Sales',
      status: 'active',
    },
    {
      name: 'Keira Wood',
      email: 'keira.wood@example.com',
      department: 'Customer Success',
      status: 'active',
    },
    {
      name: 'Simon Bell',
      email: 'simon.bell@example.com',
      department: 'Finance',
      status: 'active',
    },
    {
      name: 'Ari Lane',
      email: 'ari.lane@example.com',
      department: 'Support',
      status: 'pending',
    },
    {
      name: 'Rhea Collins',
      email: 'rhea.collins@example.com',
      department: 'Product',
      status: 'active',
    },
    {
      name: 'Evan Blake',
      email: 'evan.blake@example.com',
      department: 'Enablement',
      status: 'active',
    },
    {
      name: 'Tessa Reed',
      email: 'tessa.reed@example.com',
      department: 'Analytics',
      status: 'active',
    },
  ]
);

const insightStudioTrialCandidates = createUserAccessCandidates(
  'prod-insight-studio',
  'ent-insight-studio-trial-002',
  [
    {
      name: 'Jon Ellis',
      email: 'jon.ellis@example.com',
      department: 'Training',
      status: 'active',
    },
    {
      name: 'Avery Cole',
      email: 'avery.cole@example.com',
      department: 'Enablement',
      status: 'pending',
    },
    {
      name: 'Mira West',
      email: 'mira.west@example.com',
      department: 'Support',
      status: 'active',
    },
    {
      name: 'Cole Fisher',
      email: 'cole.fisher@example.com',
      department: 'Operations',
      status: 'active',
    },
  ]
);

const workflowHubContractCandidates = createUserAccessCandidates(
  'prod-workflow-hub',
  'ent-workflow-hub-2026-001',
  [
    {
      name: 'Riley Stone',
      email: 'riley.stone@example.com',
      department: 'Operations',
      status: 'active',
    },
    {
      name: 'Mina Hart',
      email: 'mina.hart@example.com',
      department: 'Product',
      status: 'active',
    },
    {
      name: 'Oscar Mills',
      email: 'oscar.mills@example.com',
      department: 'Finance',
      status: 'active',
    },
    {
      name: 'Jules Ray',
      email: 'jules.ray@example.com',
      department: 'Support',
      status: 'pending',
    },
    {
      name: 'Leah Reed',
      email: 'leah.reed@example.com',
      department: 'Analytics',
      status: 'active',
    },
    {
      name: 'Finn Gray',
      email: 'finn.gray@example.com',
      department: 'Enablement',
      status: 'active',
    },
  ]
);

const accessMonitorContractCandidates = createUserAccessCandidates(
  'prod-access-monitor',
  'ent-access-monitor-2026-001',
  [
    {
      name: 'Harper Quinn',
      email: 'harper.quinn@example.com',
      department: 'Security',
      status: 'active',
    },
    {
      name: 'Logan Wells',
      email: 'logan.wells@example.com',
      department: 'Operations',
      status: 'active',
    },
    {
      name: 'Piper Dean',
      email: 'piper.dean@example.com',
      department: 'Support',
      status: 'pending',
    },
    {
      name: 'Rowan Shaw',
      email: 'rowan.shaw@example.com',
      department: 'Compliance',
      status: 'active',
    },
  ]
);

export const mockUserAccessCandidates: UserAccessCandidate[] = [
  ...mockAllocatedUsers.map(({ allocatedAt: _allocatedAt, ...candidate }) => candidate),
  ...insightStudioContractCandidates,
  ...insightStudioTrialCandidates,
  ...workflowHubContractCandidates,
  ...accessMonitorContractCandidates,
];
