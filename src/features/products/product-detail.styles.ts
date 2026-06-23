import { cva } from 'class-variance-authority';

import { cn } from '@/shared/utils/class-names';

export const productDetailGridClass = cn(
  'grid grid-cols-[minmax(0,1fr)_320px] items-stretch gap-4',
  'max-[900px]:grid-cols-1'
);

export const productDetailWidePanelClass = 'col-span-full';

export const productInfoClass = 'grid h-full content-start gap-4';

export const productInfoTitleClass = 'm-0 text-xl font-bold leading-tight text-hugo-text-primary';

export const productInfoListClass = 'm-0 grid gap-0';

export const productInfoItemClass = cn(
  'grid min-w-0 grid-cols-[minmax(150px,0.24fr)_auto_minmax(0,1fr)] items-start',
  'gap-3.5 border-b border-hugo-neutral-500 py-[13px] first:border-t',
  'max-[900px]:grid-cols-1 max-[900px]:gap-1'
);

export const productInfoSeparatorClass =
  'font-bold leading-[1.35] text-hugo-text-subtle max-[900px]:hidden';

export const productInfoLabelClass = 'text-sm font-bold leading-[1.35] text-hugo-text-default';

export const productInfoValueClass =
  'm-0 text-sm font-semibold leading-[1.35] text-hugo-text-primary [overflow-wrap:anywhere]';

export const seatCardClass = 'justify-items-center gap-[14px] px-6 py-7 text-center';

export const seatCardIconClass = cn(
  'grid size-28 place-items-center rounded-[28px]',
  'bg-[linear-gradient(180deg,#ffffff_0%,var(--hugo-ui-shadcn-neutral-grey-200)_100%)]',
  'text-hugo-brand-primary',
  'shadow-[0_12px_28px_color-mix(in_oklab,var(--hugo-ui-shadcn-text-primary)_10%,transparent)]',
  '[&_svg]:size-14 [&_svg]:stroke-[1.8]'
);

export const seatCardTotalClass =
  'mt-5 grid min-h-[86px] w-full content-center justify-items-center rounded bg-hugo-neutral-200';

export const seatCardStatsClass = 'grid w-full grid-cols-2 gap-2';

export const seatCardStatClass = cva(
  'grid min-h-[72px] w-full content-center justify-items-center rounded',
  {
    variants: {
      tone: {
        available: 'bg-hugo-success-bg',
        used: 'bg-hugo-error-bg',
      },
    },
  }
);

export const seatCardValueClass = cva('font-medium leading-none text-hugo-text-primary', {
  variants: {
    size: {
      total: 'text-[30px]',
      stat: 'text-[26px]',
    },
  },
  defaultVariants: {
    size: 'total',
  },
});

export const seatCardLabelClass = cva('mt-0.5 leading-[1.1] text-hugo-text-default', {
  variants: {
    size: {
      total: 'text-[17px]',
      stat: 'text-base font-semibold',
    },
  },
  defaultVariants: {
    size: 'total',
  },
});

export const seatCardActionClass = 'mt-[22px]';
