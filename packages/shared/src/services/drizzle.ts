import type { Config as DrizzleKitConfig } from 'drizzle-kit/';
import { Context, Effect, Layer, Redacted } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
import { ServerConfig } from './config';

export class Drizzle extends Context.Tag('Drizzle')<
  Drizzle,
  {
    readonly getDrizzleKitConfig: Effect.Effect<
      DrizzleKitConfig,
      ConfigError,
      ServerConfig
    >;
  }
>() {}

export const DrizzleLive = Layer.succeed(Drizzle, {
  getDrizzleKitConfig: Effect.gen(function* () {
    const config = yield* ServerConfig;
    const env = yield* config.getEnv;
    const PRIMARY_DATABASE_NAME = yield* env.databaseURL;

    return yield* Effect.succeed<DrizzleKitConfig>({
      dialect: 'postgresql',
      dbCredentials: {
        url: Redacted.value(PRIMARY_DATABASE_NAME),
      },
    });
  }),
});
