import fs from 'node:fs';
import path from 'node:path';

import type { Alias } from 'vite';

const packageName = '@hugo-ui/shadcn-vue';

interface LocalHugoUiConfig {
  enabled?: boolean;
  linkPath?: string;
}

const readLocalConfig = (repoRoot: string): LocalHugoUiConfig | undefined => {
  const configPath = path.join(repoRoot, '.local', 'hugo-ui.json');

  if (!fs.existsSync(configPath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf8')) as LocalHugoUiConfig;
};

const safeRealPath = (value: string): string | undefined => {
  try {
    return fs.realpathSync(value);
  } catch {
    return undefined;
  }
};

export function createHugoUiLocalAliases(repoRoot: string): Alias[] {
  const localConfig = readLocalConfig(repoRoot);

  if (!localConfig || localConfig.enabled === false) {
    return [];
  }

  const linkPath = path.resolve(repoRoot, localConfig.linkPath ?? 'hugo-ui');
  const linkRealPath = safeRealPath(linkPath);

  if (!linkRealPath) {
    return [];
  }

  const packageRoot = path.join(linkRealPath, 'packages', 'shadcn-vue');
  const sourceEntry = path.join(packageRoot, 'src', 'index.ts');
  const stylesEntry = path.join(packageRoot, 'src', 'styles', 'globals.css');
  const componentsRoot = path.join(packageRoot, 'src', 'components');

  if (!fs.existsSync(sourceEntry) || !fs.existsSync(stylesEntry)) {
    return [];
  }

  return [
    {
      find: `${packageName}/styles.css`,
      replacement: stylesEntry,
    },
    {
      find: packageName,
      replacement: sourceEntry,
    },
    {
      find: '@/components',
      replacement: componentsRoot,
    },
  ];
}
