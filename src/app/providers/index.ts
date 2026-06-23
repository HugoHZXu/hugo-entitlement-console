import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';

import { i18n } from '@/app/i18n';
import { router } from '@/routes/router';

export function installAppProviders(app: App<Element>) {
  app.use(createPinia());
  app.use(i18n);
  app.use(VueQueryPlugin);
  app.use(router);
}
