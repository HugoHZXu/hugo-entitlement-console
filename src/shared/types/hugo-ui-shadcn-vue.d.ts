declare module '@hugo-ui/shadcn-vue' {
  import type { Component, DefineComponent, HTMLAttributes, VNode } from 'vue';

  export type HugoUIShadcnVueButtonVariant = 'solid' | 'outline' | 'ghost';
  export type HugoUIShadcnVueButtonSize = 'sm' | 'default' | 'lg' | 'icon';
  export type HugoUIShadcnVueButtonTone = 'brand' | 'neutral' | 'danger' | 'inverse';
  export type BadgeTone = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

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
  export const PageTemplate: DefineComponent<PageTemplateProps>;
  export const ContentTemplate: DefineComponent<ContentTemplateProps>;
}

declare module '@hugo-ui/shadcn-vue/styles.css' {
  const styles: string;
  export default styles;
}
