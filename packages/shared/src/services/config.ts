import { Context, Data, Effect, Layer, Schema } from 'effect';
import type { ConfigSchema } from '../lib/schemas/app-config';
import { WebEnvSchema } from '../lib/schemas/web-env';

const Config = Data.struct({
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
  ServerRoutes: {
    TokenPair: '/api/token/pair',
  },
} as const);

const AppConfig = Effect.succeed(Config satisfies typeof ConfigSchema.Type);

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
