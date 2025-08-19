import type { SqlError } from '@effect/sql/SqlError';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, jwt, openAPI } from 'better-auth/plugins';
import { Context, Effect, Layer, Redacted, Schema } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
// biome-ignore lint/performance/noNamespaceImport: Drizzle client requires the full schema
import * as databaseSchema from '../database/schema';
import { BetterAuthApiError } from '../errors/auth';
import { errorSchema } from '../lib/schemas/auth';
import { ServerConfig } from './config';
import { Resend } from './resend';

const adminPluginConfig = admin();
const openApiPluginConfig = openAPI({ path: '/docs' });
const jwtPluginConfig = jwt();

const getAuth = Effect.gen(function* () {
  const resend = yield* Resend;
  const drizzleClient = yield* PgDrizzle;
  const config = yield* ServerConfig;

  const env = yield* config.getEnv;
  const appConfig = yield* config.getAppConfig;

  const appInfo = appConfig.ApplicationInfo;

  const resendClient = yield* resend.getClient;

  const FACEBOOK_CLIENT_SECRET = yield* env.facebookClientSecret;
  const GOOGLE_CLIENT_SECRET = yield* env.googleClientSecret;
  const FACEBOOK_CLIENT_ID = yield* env.facebookClientId;
  const GOOGLE_CLIENT_ID = yield* env.googleClientId;
  const WEB_CLIENT_URL = yield* env.webClientURL;
  const SERVER_URL = yield* env.serverURL;

  return yield* Effect.succeed(
    betterAuth({
      baseURL: SERVER_URL,
      appName: appInfo.Name,
      trustedOrigins: [WEB_CLIENT_URL],
      basePath: '/auth',

      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
      },

      database: drizzleAdapter(drizzleClient, {
        provider: 'pg',
        schema: databaseSchema,
      }),

      advanced: {
        crossSubDomainCookies: { enabled: true },
      },

      plugins: [adminPluginConfig, openApiPluginConfig, jwtPluginConfig],

      socialProviders: {
        facebook: {
          clientId: FACEBOOK_CLIENT_ID,
          clientSecret: Redacted.value(FACEBOOK_CLIENT_SECRET),
        },
        google: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: Redacted.value(GOOGLE_CLIENT_SECRET),
        },
      },

      emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ url, user }) => {
          await resendClient.emails.send({
            from: 'NoReply <onboarding@resend.dev>',
            to: [user.email],
            subject: 'Verify your email address',
            text: url,
          });
        },
      },
    })
  );
});

export type AdminErrorCodes = {
  [K in keyof typeof adminPluginConfig.$ERROR_CODES]: string;
};

export type ServerAuthErrorCodes = AdminErrorCodes;

type AuthClient = Effect.Effect.Success<typeof getAuth>;

export class BetterAuth extends Context.Tag('ServerAuth')<
  BetterAuth,
  {
    readonly getClient: Effect.Effect<
      AuthClient,
      ConfigError | SqlError,
      ServerConfig | Resend | PgDrizzle
    >;
    readonly caller: Effect.Effect<
      <A>(
        f: (client: AuthClient, signal: AbortSignal) => Promise<A>
      ) => Effect.Effect<A, BetterAuthApiError, never>,
      ConfigError | SqlError,
      ServerConfig | Resend | PgDrizzle
    >;
  }
>() {}

export const BetterAuthALive = Layer.succeed(BetterAuth, {
  caller: Effect.gen(function* () {
    const auth = yield* getAuth;

    const call = <A>(
      f: (client: typeof auth, signal: AbortSignal) => Promise<A>
    ) =>
      Effect.tryPromise({
        try: (signal) => f(auth, signal),
        catch: (error) =>
          new BetterAuthApiError(Schema.decodeUnknownSync(errorSchema)(error)),
      });

    return call;
  }),
  getClient: Effect.gen(function* () {
    const auth = yield* getAuth;
    return auth;
  }),
});
