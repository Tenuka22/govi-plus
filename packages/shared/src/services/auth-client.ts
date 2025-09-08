import {
  adminClient,
  jwtClient,
  passkeyClient,
} from 'better-auth/client/plugins';
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
      plugins: [passkeyClient(), adminClient(), jwtClient()],
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

const createBetterAuthApiError = (
  errorObj: unknown,
  fallbackMessage: string
): BetterAuthApiClientError => {
  let errorMessage = fallbackMessage;

  if (typeof errorObj === 'object' && errorObj && 'code' in errorObj) {
    const errorCode = errorObj.code;
    if (typeof errorCode === 'string' && errorCode in authErrorCodeMessages) {
      errorMessage =
        authErrorCodeMessages[errorCode as keyof typeof authErrorCodeMessages]
          .en;
    }
  }

  return new BetterAuthApiClientError({
    ...(typeof errorObj === 'object' ? errorObj : {}),
    message: errorMessage,
  });
};

const processAuthResponse = <TData, TError>(res: {
  data: TData;
  error: TError | null;
}): Effect.Effect<TData, BetterAuthApiClientError, never> => {
  const { data, error: errorResponse } = res;

  if (errorResponse) {
    const errorMessage =
      'Unknown error occurred in an auth function. Retry and contact the administration if error persists.';
    const authError = createBetterAuthApiError(errorResponse, errorMessage);
    return Effect.fail(authError);
  }

  return Effect.succeed(data);
};

const processResponse = <TData>(
  res: unknown
): Effect.Effect<TData, BetterAuthApiClientError, never> => {
  const response = Schema.decodeUnknownEither(authResponseSchema, {
    onExcessProperty: 'preserve',
  })(res);

  if (Either.isLeft(response)) {
    return Effect.succeed(res as unknown as TData);
  }

  const parsedServerResponse = response.right;
  const serverError = parsedServerResponse.error;

  if (serverError) {
    const errorMessage =
      'Unknown error occurred in an auth function. Retry and contact the administration if error persists.';
    const authError = createBetterAuthApiError(serverError, errorMessage);
    return Effect.fail(authError);
  }

  return Effect.succeed(parsedServerResponse.data as TData);
};

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
        catch: (unknownError) =>
          new BetterAuthApiClientError(
            Schema.decodeUnknownSync(errorSchema)(unknownError)
          ),
      }).pipe(
        Effect.flatMap((res) => {
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            'error' in res
          ) {
            return processAuthResponse(
              res as { data: TData; error: TError | null }
            );
          }

          return processResponse<TData>(res);
        })
      );
    return call;
  }),
});
