import { createI18n } from 'vue-i18n';

import enMessages from './messages/en';
import zhMessages from './messages/zh';

export const supportedLocales = ['en', 'zh'] as const;
export type AppLocale = (typeof supportedLocales)[number];

const LOCALE_STORAGE_KEY = 'entitlement-console.locale';

const messages = {
  en: enMessages,
  zh: zhMessages,
};

export const normalizeAppLocale = (locale: string | undefined): AppLocale => {
  if (locale?.toLowerCase().startsWith('zh')) {
    return 'zh';
  }

  return 'en';
};

function readStoredLocale(): AppLocale | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

  return supportedLocales.includes(storedLocale as AppLocale) ? (storedLocale as AppLocale) : null;
}

function resolveInitialLocale(): AppLocale {
  const storedLocale = readStoredLocale();

  if (storedLocale) {
    return storedLocale;
  }

  return normalizeAppLocale(typeof navigator === 'undefined' ? undefined : navigator.language);
}

export const toIntlLocale = (locale: string | undefined) =>
  normalizeAppLocale(locale) === 'zh' ? 'zh-CN' : 'en-US';

export const formatDate = (value: string, locale: string | undefined) =>
  new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: 'medium',
  }).format(new Date(`${value}T00:00:00`));

export const formatDateTime = (value: string, locale: string | undefined) =>
  new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

function syncDocumentLocale(locale: AppLocale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }
}

export const i18n = createI18n({
  fallbackLocale: 'en',
  legacy: false,
  locale: resolveInitialLocale(),
  messages,
});

export function setAppLocale(locale: AppLocale) {
  i18n.global.locale.value = locale;
  syncDocumentLocale(locale);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function getNextAppLocale(locale: string | undefined): AppLocale {
  return normalizeAppLocale(locale) === 'zh' ? 'en' : 'zh';
}

syncDocumentLocale(normalizeAppLocale(i18n.global.locale.value));
