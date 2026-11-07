// Builds examples/web-vite into the site at /demo/ so the docs link to a live web demo.
// Run after `vitepress build` (see the "build" script).
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const demoApp = resolve(here, '../examples/web-vite');
const dist = resolve(here, '.vitepress/dist');
const base = '/react-native-glass-effect/demo/';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

if (!existsSync(join(demoApp, 'node_modules'))) run('npm install --no-audit --no-fund', demoApp);
run(`npx vite build --base=${base} --outDir "${join(dist, 'demo')}" --emptyOutDir`, demoApp);

// GitHub Pages: serve files as-is (no Jekyll processing).
writeFileSync(join(dist, '.nojekyll'), '');
console.log('Demo built into .vitepress/dist/demo');
