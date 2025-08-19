import { validateVariable } from '@repo/shared/utils/env';
import { config } from 'dotenv';
import { type Config, defineConfig } from 'drizzle-kit';

config({ path: '../../.env' });

const migrationInformation = {
  dialect: 'postgresql',
  schema: '../../packages/shared/src/database/schema.ts',
  out: './drizzle-migrations',
} satisfies Config;

// Don't support top level await. Once supporteed this can be used.
/* 
const getDrizzleKitConfig = Effect.gen(function* () {
  const drizzle = yield* Drizzle;

  const drizzleKitBaseConfig = yield* drizzle.getDrizzleKitConfig;

  const drizzleConfig = yield* Effect.sync(() =>
    defineConfig({
      ...migrationInformation,
      ...drizzleKitBaseConfig,
    })
  );
  return drizzleConfig;
});

const dbConfig = await serverRuntime.runPromise(getDrizzleKitConfig);
 */

const drizzleConfig = () => ({
  ...migrationInformation,
  dbCredentials: {
    url: validateVariable('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: true,
    },
  },
});

export default defineConfig(drizzleConfig());
