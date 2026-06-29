import { Badge, type BadgeTone, type DataGridColumn } from '@hugo-ui/shadcn-vue';
import { computed, h, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatDateTime } from '@/app/i18n';
import type { AllocatedUserStatus, UserAccessRow } from '@/shared/types';

const allocatedUserStatusMessageKeys: Record<'active' | 'pending' | 'revoked', string> = {
  active: 'common.status.active',
  pending: 'common.status.pending',
  revoked: 'common.status.revoked',
};

export function formatAllocatedUserStatus(status: AllocatedUserStatus): string {
  const labels: Record<'active' | 'pending' | 'revoked', string> = {
    active: 'Active',
    pending: 'Pending',
    revoked: 'Revoked',
  };

  return labels[status as keyof typeof labels] ?? status;
}

export function getAllocatedUserStatusMessageKey(status: AllocatedUserStatus): string {
  return (
    allocatedUserStatusMessageKeys[status as keyof typeof allocatedUserStatusMessageKeys] ??
    'common.status.unknown'
  );
}

export function getAllocatedUserStatusTone(status: AllocatedUserStatus): BadgeTone {
  if (status === 'active') {
    return 'success';
  }

  if (status === 'pending') {
    return 'warning';
  }

  if (status === 'revoked') {
    return 'danger';
  }

  return 'neutral';
}

export function formatAllocationDateTime(
  value: string | null,
  locale: string | undefined,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  return formatDateTime(value, locale);
}

export function useUserAccessColumns(): ComputedRef<DataGridColumn<UserAccessRow>[]> {
  const { locale, t } = useI18n();

  return computed(() => [
    {
      id: 'user',
      header: t('allocatedUsers.columns.user'),
      minWidth: 260,
      render: (row) => `${row.name} - ${row.email}`,
    },
    {
      id: 'department',
      header: t('allocatedUsers.columns.department'),
      minWidth: 160,
      render: (row) => row.department,
    },
    {
      id: 'status',
      header: t('allocatedUsers.columns.status'),
      minWidth: 130,
      render: (row) =>
        h(Badge, { tone: getAllocatedUserStatusTone(row.status) }, () =>
          t(getAllocatedUserStatusMessageKey(row.status))
        ),
    },
    {
      id: 'entitlement',
      header: t('allocatedUsers.columns.entitlement'),
      minWidth: 220,
      render: (row) => row.entitlementCode,
    },
    {
      id: 'seats',
      header: t('allocatedUsers.columns.seats'),
      align: 'right',
      minWidth: 100,
      render: (row) => row.seatQuantity,
    },
    {
      id: 'allocatedAt',
      header: t('allocatedUsers.columns.allocatedAt'),
      minWidth: 190,
      render: (row) =>
        formatAllocationDateTime(row.allocatedAt, locale.value, t('allocatedUsers.notAllocated')),
    },
  ]);
}
