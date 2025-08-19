import { Context, Effect, Layer, Schema } from 'effect';
import type { ConfigSchema } from '../lib/schemas/app-config';
import { ServerEnvSchema, WebEnvSchema } from '../lib/schemas/env';

const AppConfig = Effect.succeed({
  ApplicationInfo: {
    Name: 'Govi +',
    Id: 'govi-plus',
    ShortName: 'GOVI+',
    WebOrigin: 'http://localhost:3001',
  },
  ClientRoutes: {
    Home: '/',
    ForgetPassword: '/auth/forgot-password',
    SignIn: '/auth/sign-in',
    SignUp: '/auth/sign-up',
  },
} as const satisfies typeof ConfigSchema.Type);

export class ServerConfig extends Context.Tag('ServerConfig')<
  ServerConfig,
  {
    readonly getEnv: Effect.Effect<typeof ServerEnvSchema>;
    readonly getAppConfig: Effect.Effect<typeof ConfigSchema.Type>;
  }
>() {}

export const ServerConfigLive = Layer.succeed(ServerConfig, {
  getEnv: Effect.gen(function* () {
    return yield* Effect.succeed(ServerEnvSchema);
  }),
  getAppConfig: AppConfig,
});

export class WebConfig extends Context.Tag('WebConfig')<
  WebConfig,
  {
    readonly getEnv: Effect.Effect<typeof WebEnvSchema.Type>;
    readonly getAppConfig: Effect.Effect<typeof ConfigSchema.Type>;
  }
>() {}

export const WebConfigLive = (env: unknown | typeof WebEnvSchema.Type) =>
  Layer.succeed(WebConfig, {
    getEnv: Effect.gen(function* () {
      return yield* Effect.sync(() =>
        Schema.decodeUnknownSync(WebEnvSchema)(env)
      );
    }),
    getAppConfig: AppConfig,
  });
