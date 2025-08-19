import { layerWithConfig as PgDrizzleLayer } from '@effect/sql-drizzle/Pg';
import { PgClient } from '@effect/sql-pg';
import type { PgClientConfig } from '@effect/sql-pg/PgClient';
import { Effect, Layer } from 'effect';
// biome-ignore lint/performance/noNamespaceImport: Drizzle client requires the full schema
import * as databaseSchema from '../database/schema';
import { ServerEnvSchema } from '../lib/schemas/env';

const postgresConfig = Effect.gen(function* () {
  const PgConfig = {
    url: yield* ServerEnvSchema.databaseURL,
    ssl: {
      rejectUnauthorized: true,
    },
  } satisfies PgClientConfig;

  return PgConfig;
});

export const PgLive = postgresConfig.pipe(
  Effect.map((config) => PgClient.layer(config)),
  Layer.unwrapEffect
);

const DrizzleLive = PgDrizzleLayer({
  schema: databaseSchema as unknown as Record<string, never>,
}).pipe(Layer.provide(PgLive));

export const DatabaseLive = Layer.mergeAll(PgLive, DrizzleLive);
