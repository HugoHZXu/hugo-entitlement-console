import { Badge, type BadgeTone, type DataGridColumn } from '@hugo-ui/shadcn-vue';
import { h } from 'vue';

import type { ActivityLogEntry, ActivityLogStatus } from '@/shared/types';

export const activityLogDefaultSort = {
  columnId: 'eventTime',
  direction: 'desc',
} as const;

export function formatActivityStatus(status: ActivityLogStatus): string {
  const labels: Record<ActivityLogStatus, string> = {
    failed: 'Failed',
    pending: 'Pending',
    success: 'Success',
  };

  return labels[status];
}

export function getActivityStatusTone(status: ActivityLogStatus): BadgeTone {
  if (status === 'success') {
    return 'success';
  }

  if (status === 'failed') {
    return 'danger';
  }

  return 'warning';
}

export function formatActivityDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function useActivityLogColumns(): DataGridColumn<ActivityLogEntry>[] {
  return [
    {
      id: 'actor',
      header: 'Actor',
      minWidth: 220,
      sortable: true,
      render: (row) =>
        row.actor.email
          ? `${row.actor.displayName} · ${row.actor.email}`
          : `${row.actor.displayName} · system`,
    },
    {
      id: 'summary',
      header: 'Activity',
      minWidth: 360,
      sortable: true,
      render: (row) => `${row.summary} · ${row.actionLabel}`,
    },
    {
      id: 'product',
      header: 'Product',
      minWidth: 180,
      sortable: true,
      render: (row) => row.productName,
    },
    {
      id: 'result',
      header: 'Result',
      minWidth: 120,
      sortable: true,
      render: (row) =>
        h(Badge, { tone: getActivityStatusTone(row.result) }, () =>
          formatActivityStatus(row.result)
        ),
    },
    {
      id: 'eventTime',
      header: 'Event time',
      minWidth: 190,
      sortable: true,
      render: (row) => formatActivityDateTime(row.eventTime),
    },
  ];
}

export function useProductActivityLogColumns(): DataGridColumn<ActivityLogEntry>[] {
  return [
    {
      id: 'actor',
      header: 'Actor',
      minWidth: 220,
      render: (row) =>
        row.actor.email
          ? `${row.actor.displayName} · ${row.actor.email}`
          : `${row.actor.displayName} · system`,
    },
    {
      id: 'summary',
      header: 'Activity',
      minWidth: 420,
      render: (row) => `${row.summary} · ${row.actionLabel}`,
    },
    {
      id: 'result',
      header: 'Result',
      minWidth: 120,
      render: (row) =>
        h(Badge, { tone: getActivityStatusTone(row.result) }, () =>
          formatActivityStatus(row.result)
        ),
    },
    {
      id: 'eventTime',
      header: 'Event time',
      minWidth: 190,
      render: (row) => formatActivityDateTime(row.eventTime),
    },
  ];
}
