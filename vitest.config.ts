import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

import { createHugoUiLocalAliases } from './config/hugo-ui-local-alias';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      ...createHugoUiLocalAliases(repoRoot),
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
