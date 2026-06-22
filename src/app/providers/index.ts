import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';

import { router } from '@/routes/router';

export function installAppProviders(app: App<Element>) {
  app.use(createPinia());
  app.use(VueQueryPlugin);
  app.use(router);
}
