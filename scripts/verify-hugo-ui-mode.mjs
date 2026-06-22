import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(repoRoot, 'config', 'hugo-ui.json');
const packageName = '@hugo-ui/shadcn-vue';

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const config = readJson(configPath);

if (config.mode !== 'npm') {
  fail(`Unsupported Hugo UI mode "${config.mode}". Expected "npm".`);
}

if (typeof config.expectedVersion !== 'string' || config.expectedVersion.trim() === '') {
  fail('config/hugo-ui.json must define expectedVersion.');
}

const packageJson = readJson(path.join(repoRoot, 'package.json'));
const specifier = packageJson.dependencies?.[packageName];

if (specifier !== config.expectedVersion) {
  fail(
    `package.json must depend on ${packageName} as ${config.expectedVersion}; found ${specifier ?? '<missing>'}.`
  );
}

if (typeof config.localPackagePath === 'string' && config.localPackagePath.trim() !== '') {
  const localPackageJsonPath = path.join(repoRoot, config.localPackagePath, 'package.json');

  if (fs.existsSync(localPackageJsonPath)) {
    const localPackageJson = readJson(localPackageJsonPath);

    if (localPackageJson.name !== packageName) {
      fail(`Expected ${packageName}, found ${localPackageJson.name ?? '<missing name>'}.`);
    }

    if (localPackageJson.version !== config.expectedVersion) {
      fail(
        `Local ${packageName} version mismatch: expected ${config.expectedVersion}, found ${localPackageJson.version}.`
      );
    }
  }
}

console.log(`${packageName} ${config.expectedVersion} verified in npm mode.`);
