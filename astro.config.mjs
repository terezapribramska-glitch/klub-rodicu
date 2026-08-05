// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const keystaticEnv = [
  'KEYSTATIC_GITHUB_CLIENT_ID',
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
  'KEYSTATIC_SECRET',
  'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
];

const keystaticDefinitions = Object.fromEntries(
  keystaticEnv.map((name) => [
    `import.meta.env.${name}`,
    JSON.stringify(env[name] ?? ''),
  ]),
);

const keystaticStatus = Object.fromEntries(
  keystaticEnv.map((name) => [
    name,
    {
      existuje: Object.prototype.hasOwnProperty.call(env, name),
      nastavena: Boolean(env[name]),
      delka: env[name]?.length ?? 0,
    },
  ]),
);

export default defineConfig({
  adapter: vercel(),
  vite: {
    define: {
      ...keystaticDefinitions,
      __KEYSTATIC_ENV_STATUS__: JSON.stringify(keystaticStatus),
    },
  },
  integrations: [
    react(),
    markdoc(),
    keystatic(),
  ],
});
