import { cva } from 'class-variance-authority';

import { cn } from '@/shared/utils/class-names';

export const productListGridClass = 'grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4';

export const productCardClass = cva([
  'grid min-h-40 gap-2 rounded-lg border border-hugo-neutral-500 bg-hugo-surface-default p-5',
  'text-inherit no-underline transition-[background-color,border-color,box-shadow] duration-150',
  'hover:border-hugo-neutral-800 hover:bg-hugo-surface-tinted',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hugo-focus',
]);

export const productCardHeaderClass = 'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3';

export const productCardIconClass = cn(
  'grid size-10 place-items-center rounded-lg bg-hugo-surface-tinted text-hugo-brand-accent',
  '[&_svg]:size-[22px] [&_svg]:stroke-2'
);

export const productCardTitleClass = 'm-0 text-lg font-semibold text-hugo-text-primary';

export const productCardDescriptionClass = 'm-0 text-hugo-text-default';

export const productCardStatusClass = 'self-end';

export const pageMutedClass = 'm-0 text-hugo-text-default';

export const productEmptyStateClass =
  'grid min-h-72 place-items-center rounded-lg border border-dashed border-hugo-border-default bg-hugo-surface-default px-6 py-10 text-center';

export const productEmptyContentClass = 'grid max-w-md justify-items-center gap-3';

export const productEmptyIconClass =
  'grid size-12 place-items-center rounded-full bg-hugo-surface-tinted text-hugo-brand-accent [&_svg]:size-6';

export const productEmptyTitleClass =
  'm-0 text-lg font-semibold leading-6 text-hugo-text-primary';

export const productEmptyDescriptionClass =
  'm-0 text-sm leading-6 text-hugo-text-default';
