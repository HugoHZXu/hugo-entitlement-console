import { Badge, type BadgeTone, type DataGridColumn } from '@hugo-ui/shadcn-vue';
import { computed, h, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatDateTime, normalizeAppLocale } from '@/app/i18n';
import type { ActivityLogEntry, ActivityLogStatus, LocalizedMessage } from '@/shared/types';

export function formatActivityStatus(status: ActivityLogStatus): string {
  const labels: Record<ActivityLogStatus, string> = {
    failed: 'Failed',
    pending: 'Pending',
    success: 'Success',
  };

  return labels[status];
}

export function getActivityStatusMessageKey(status: ActivityLogStatus): string {
  return `entitlementConsole.activity.result.${status}`;
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

export function formatActivityDateTime(value: string, locale: string | undefined): string {
  return formatDateTime(value, locale);
}

const valuesToRecord = (message: LocalizedMessage) =>
  message.values.reduce<Record<string, string>>((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});

function formatQuantityText(quantityDelta: string | undefined, locale: string | undefined): string {
  const quantity = Number(quantityDelta ?? 0);
  const quantityDeltaText = quantity > 0 ? `+${quantity}` : `${quantity}`;

  if (normalizeAppLocale(locale) === 'zh') {
    return `${quantityDeltaText} 个席位`;
  }

  const seatLabel = Math.abs(quantity) === 1 ? 'seat' : 'seats';

  return `${quantityDeltaText} ${seatLabel}`;
}

function interpolateDefaultMessage(message: LocalizedMessage, values: Record<string, string>) {
  return message.defaultMessage.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => {
    return values[key] ?? '';
  });
}

function formatLocalizedMessage(
  message: LocalizedMessage,
  locale: string | undefined,
  t: (key: string, values?: Record<string, string>) => string,
  te: (key: string) => boolean
): string {
  const values = valuesToRecord(message);
  values.quantityText = formatQuantityText(values.quantityDelta, locale);
  const messageValues = values;

  return te(message.id)
    ? t(message.id, messageValues)
    : interpolateDefaultMessage(message, messageValues);
}

export function useActivityLogColumns(): ComputedRef<DataGridColumn<ActivityLogEntry>[]> {
  const { locale, t, te } = useI18n();

  return computed(() => [
    {
      id: 'actor',
      header: t('entitlementConsole.activity.column.actor'),
      minWidth: 220,
      sortable: true,
      render: (row) =>
        row.actor.email
          ? `${row.actor.displayName} · ${row.actor.email}`
          : `${row.actor.displayName} · ${t('entitlementConsole.activity.actor.system')}`,
    },
    {
      id: 'type',
      header: t('entitlementConsole.activity.column.type'),
      minWidth: 160,
      render: (row) => formatLocalizedMessage(row.actionLabel, locale.value, t, te),
    },
    {
      id: 'summary',
      header: t('entitlementConsole.activity.column.activity'),
      minWidth: 360,
      sortable: true,
      render: (row) => formatLocalizedMessage(row.summaryMessage, locale.value, t, te),
    },
    {
      id: 'product',
      header: t('entitlementConsole.activity.column.product'),
      minWidth: 180,
      sortable: true,
      render: (row) => row.productName,
    },
    {
      id: 'result',
      header: t('entitlementConsole.activity.column.result'),
      minWidth: 120,
      sortable: true,
      render: (row) =>
        h(Badge, { tone: getActivityStatusTone(row.result) }, () =>
          t(getActivityStatusMessageKey(row.result))
        ),
    },
    {
      id: 'eventTime',
      header: t('entitlementConsole.activity.column.eventTime'),
      minWidth: 190,
      sortable: true,
      render: (row) => formatActivityDateTime(row.eventTime, locale.value),
    },
  ]);
}

export function useProductActivityLogColumns(): ComputedRef<DataGridColumn<ActivityLogEntry>[]> {
  const { locale, t, te } = useI18n();

  return computed(() => [
    {
      id: 'actor',
      header: t('entitlementConsole.activity.column.actor'),
      minWidth: 220,
      render: (row) =>
        row.actor.email
          ? `${row.actor.displayName} · ${row.actor.email}`
          : `${row.actor.displayName} · ${t('entitlementConsole.activity.actor.system')}`,
    },
    {
      id: 'type',
      header: t('entitlementConsole.activity.column.type'),
      minWidth: 160,
      render: (row) => formatLocalizedMessage(row.actionLabel, locale.value, t, te),
    },
    {
      id: 'summary',
      header: t('entitlementConsole.activity.column.activity'),
      minWidth: 420,
      render: (row) => formatLocalizedMessage(row.summaryMessage, locale.value, t, te),
    },
    {
      id: 'result',
      header: t('entitlementConsole.activity.column.result'),
      minWidth: 120,
      render: (row) =>
        h(Badge, { tone: getActivityStatusTone(row.result) }, () =>
          t(getActivityStatusMessageKey(row.result))
        ),
    },
    {
      id: 'eventTime',
      header: t('entitlementConsole.activity.column.eventTime'),
      minWidth: 190,
      render: (row) => formatActivityDateTime(row.eventTime, locale.value),
    },
  ]);
}
