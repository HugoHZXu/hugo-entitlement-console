import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { createHugoUiLocalAliases } from './config/hugo-ui-local-alias';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: [
      ...createHugoUiLocalAliases(repoRoot),
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
});
