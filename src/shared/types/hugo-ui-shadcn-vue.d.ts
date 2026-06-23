declare module '@hugo-ui/shadcn-vue' {
  import type { Component, DefineComponent, HTMLAttributes, VNode } from 'vue';

  export type HugoUIShadcnVueButtonVariant = 'solid' | 'outline' | 'ghost';
  export type HugoUIShadcnVueButtonSize = 'sm' | 'default' | 'lg' | 'icon';
  export type HugoUIShadcnVueButtonTone = 'brand' | 'neutral' | 'danger' | 'inverse';
  export type BadgeTone = 'success' | 'warning' | 'neutral' | 'danger' | 'info';
  export type InputStatus = 'default' | 'success' | 'error';
  export type InputSize = 'default' | 'sm';
  export type InputElement = 'input' | 'textarea';

  export type ButtonProps = {
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes['class'];
    disabled?: boolean;
    loading?: boolean;
    loadingPosition?: 'start' | 'center';
    size?: HugoUIShadcnVueButtonSize;
    tone?: HugoUIShadcnVueButtonTone;
    type?: 'button' | 'submit' | 'reset';
    variant?: HugoUIShadcnVueButtonVariant;
  };

  export type CardSize = 'default' | 'sm';

  export type BadgeProps = {
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes['class'];
    tone?: BadgeTone;
  };

  export type InputClassNames = {
    root?: HTMLAttributes['class'];
    label?: HTMLAttributes['class'];
    requiredMark?: HTMLAttributes['class'];
    control?: HTMLAttributes['class'];
    field?: HTMLAttributes['class'];
    input?: HTMLAttributes['class'];
    textarea?: HTMLAttributes['class'];
    adornment?: HTMLAttributes['class'];
    helper?: HTMLAttributes['class'];
    helperContent?: HTMLAttributes['class'];
    status?: HTMLAttributes['class'];
    spinner?: HTMLAttributes['class'];
    counter?: HTMLAttributes['class'];
  };

  export type InputSlotAttributes = HTMLAttributes & Record<string, unknown>;

  export type InputSlotProps = {
    label?: InputSlotAttributes;
    control?: InputSlotAttributes;
    input?: InputSlotAttributes;
    textarea?: InputSlotAttributes;
    helper?: InputSlotAttributes;
  };

  export type InputProps = {
    as?: InputElement;
    autoFocus?: boolean;
    autoFocusSource?: 'keyboard' | 'mouse';
    class?: HTMLAttributes['class'];
    classNames?: InputClassNames;
    defaultValue?: string | number | null;
    description?: string | number | VNode;
    disabled?: boolean;
    id?: string;
    label?: string | number | VNode;
    loading?: boolean;
    maxLength?: number;
    message?: string | number | VNode;
    modelValue?: string | number | null;
    name?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    showCharacterCount?: boolean;
    size?: InputSize;
    slotProps?: InputSlotProps;
    status?: InputStatus;
    type?: string;
    value?: string | number | null;
  };

  export type DataGridColumn<T> = {
    id: string;
    header: string | VNode | (() => VNode | string);
    render: (row: T) => string | number | VNode;
    sortable?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    align?: 'left' | 'center' | 'right';
    resizable?: boolean;
  };

  export type DataGridSort = {
    columnId: string;
    direction: 'asc' | 'desc';
  } | null;

  export type DataGridPagination = {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
  };

  export type DataGridColumnSizing = {
    widths?: Record<string, number>;
    defaultWidths?: Record<string, number>;
    resizeMode?: 'onChange' | 'onEnd';
  };

  export type DataGridProps<T> = {
    ariaLabel: string;
    as?: string | Component;
    class?: HTMLAttributes['class'];
    columns: DataGridColumn<T>[];
    columnSizing?: DataGridColumnSizing;
    empty?: string | VNode;
    error?: string | VNode;
    getRowId: (row: T) => string;
    height?: number | string;
    loading?: boolean;
    overscan?: number;
    pagination?: DataGridPagination;
    rowHeight?: number;
    rows: T[];
    selectedRowId?: string;
    sort?: DataGridSort;
  };

  export type CardProps = {
    as?: string | Component;
    class?: HTMLAttributes['class'];
    clickable?: boolean;
    size?: CardSize;
  };

  export type PageTemplateNavItem = {
    id: string;
    label: string | VNode;
    icon?: string | VNode;
    path?: string;
    children?: PageTemplateNavItem[];
  };

  export type PageTemplateNavProps = {
    navItems: PageTemplateNavItem[];
    defaultSelected?: string;
    defaultExpanded?: string[];
    hidden?: boolean;
  };

  export type PageTemplateProps = {
    appIcon?: string | VNode;
    appTitle?: string | VNode;
    as?: string | DefineComponent;
    class?: HTMLAttributes['class'];
    hidden?: boolean;
    navProps?: PageTemplateNavProps;
    titleSlot?: string | VNode;
  };

  export type ContentTemplateType = 'card' | 'table' | 'error' | 'full';

  export type ContentTemplateProps = {
    actionItems?: string | VNode;
    as?: string | DefineComponent;
    class?: HTMLAttributes['class'];
    errorMessage?: string | VNode;
    pageTitle?: string | VNode;
    titleInfo?: string | VNode;
    type: ContentTemplateType;
  };

  export const Badge: DefineComponent<BadgeProps>;
  export const Button: DefineComponent<ButtonProps>;
  export const Card: DefineComponent<CardProps>;
  export const DataGrid: DefineComponent<Record<string, unknown>>;
  export const Input: DefineComponent<InputProps>;
  export const PageTemplate: DefineComponent<PageTemplateProps>;
  export const ContentTemplate: DefineComponent<ContentTemplateProps>;
}

declare module '@hugo-ui/shadcn-vue/styles.css' {
  const styles: string;
  export default styles;
}
