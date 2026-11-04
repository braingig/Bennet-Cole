import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const vercel = process.env.VERCEL === '1' || process.argv.includes('--vercel');
const entry = vercel
  ? new URL('../node_modules/next/dist/bin/next', import.meta.url)
  : new URL('./run-framework.mjs', import.meta.url);
const args = vercel ? ['build', '--webpack'] : ['build'];
const result = spawnSync(process.execPath, [fileURLToPath(entry), ...args], {
  stdio: 'inherit',
  env: vercel ? { ...process.env, DEPLOYMENT_TARGET: 'vercel' } : process.env,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
