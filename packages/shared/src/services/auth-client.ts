import { adminClient, jwtClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { Context, Effect, Either, Layer, Schema } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
import { BetterAuthApiClientError } from '../errors/auth';
import { authErrorCodeMessages } from '../lib/constants/auth-client-error-messages';
import { authResponseSchema, errorSchema } from '../lib/schemas/auth';
import type { ServerAuthErrorCodes } from './auth';
import { WebConfig } from './config';

const getAuthClient = Effect.gen(function* () {
  const webConfig = yield* WebConfig;
  const env = yield* webConfig.getEnv;
  const SERVER_URL = env.NEXT_PUBLIC_SERVER_URL;

  return yield* Effect.succeed(
    createAuthClient({
      baseURL: SERVER_URL,
      basePath: '/auth',
      plugins: [adminClient(), jwtClient()],
    })
  );
});

type AuthClient = Effect.Effect.Success<typeof getAuthClient>;

type AuthClientErrorCodes = AuthClient['$ERROR_CODES'];

export type AuthErrorCodes = AuthClientErrorCodes & ServerAuthErrorCodes;

export class BetterAuth extends Context.Tag('ClientAuth')<
  BetterAuth,
  {
    readonly getClient: Effect.Effect<AuthClient, ConfigError, WebConfig>;
    readonly caller: Effect.Effect<
      <TData, TError, A extends { data: TData; error: TError }>(
        f: (client: AuthClient, signal: AbortSignal) => Promise<A>
      ) => Effect.Effect<A['data'], BetterAuthApiClientError, never>,
      ConfigError,
      WebConfig
    >;
  }
>() {}

export const BetterAuthALive = Layer.succeed(BetterAuth, {
  getClient: Effect.gen(function* () {
    const client = yield* getAuthClient;
    return client;
  }),
  caller: Effect.gen(function* () {
    const auth = yield* getAuthClient;

    const call = <TData, TError, A extends { data: TData; error: TError }>(
      f: (client: typeof auth, signal: AbortSignal) => Promise<A>
    ) =>
      Effect.tryPromise({
        try: (signal) => f(auth, signal),
        catch: (error) =>
          new BetterAuthApiClientError(
            Schema.decodeUnknownSync(errorSchema)(error)
          ),
      }).pipe(
        Effect.flatMap((res) => {
          const response = Schema.decodeUnknownEither(authResponseSchema, {
            onExcessProperty: 'preserve',
          })(res);

          if (Either.isLeft(response)) {
            return Effect.succeed(res as unknown as A['data']);
          }

          const parsedServerResponse = response.right;
          const error = parsedServerResponse.error;

          if (error) {
            let errorMessage =
              'Unknown error occured in an auth function. Retry and contact the administration if error persists.';

            if (error.code && error.code in authErrorCodeMessages) {
              errorMessage =
                authErrorCodeMessages[error.code as keyof AuthClientErrorCodes]
                  .en;
            }

            return Effect.fail(
              new BetterAuthApiClientError({ ...error, message: errorMessage })
            );
          }

          return Effect.succeed(parsedServerResponse.data as A['data']);
        })
      );

    return call;
  }),
});
