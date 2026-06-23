import { cva } from 'class-variance-authority';

export const allocatedUsersPageClass = 'grid gap-[14px]';

export const allocationSummaryClass =
  'flex flex-wrap items-center justify-between gap-2.5 text-sm text-hugo-text-default';

export const allocationSummaryMetricClass = 'font-bold text-hugo-text-primary';

export const allocationSummaryDeltaClass = 'm-0 font-bold';

export const allocationMessageClass = cva('m-0 text-sm font-semibold', {
  variants: {
    tone: {
      error: 'text-hugo-status-error',
    },
  },
  defaultVariants: {
    tone: 'error',
  },
});

export const allocatedUsersToolbarClass = 'flex flex-wrap items-center justify-between gap-3';

export const allocatedUsersToolbarSearchClass = 'w-[min(380px,100%)]';
