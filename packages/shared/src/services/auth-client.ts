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

const handleErrors = <S extends { data: unknown; error: unknown }, E, R>(
  authCall: Effect.Effect<S, E, R>
) => {
  return authCall.pipe(
    Effect.map((v) => v),
    Effect.flatMap((res) => {
      const response = Schema.decodeUnknownEither(authResponseSchema, {
        onExcessProperty: 'preserve',
      })(res);

      if (Either.isLeft(response)) {
        return Effect.succeed(null);
      }

      const parsedServerResponse = response.right;
      const error = parsedServerResponse.error;

      if (error) {
        let errorMessage =
          'Unknown error occurred in an auth function. Retry and contact the administration if error persists.';

        const parsedError = Schema.decodeUnknownSync(errorSchema, {
          onExcessProperty: 'preserve',
        })(error);

        if (parsedError.code && parsedError.code in authErrorCodeMessages) {
          errorMessage =
            authErrorCodeMessages[
              parsedError.code as keyof AuthClientErrorCodes
            ].en;
        }

        return Effect.fail(
          new BetterAuthApiClientError({ ...error, message: errorMessage })
        );
      }

      return Effect.succeed(parsedServerResponse.data as S['data']);
    })
  );
};

export class BetterAuth extends Context.Tag('ClientAuth')<
  BetterAuth,
  {
    readonly getClient: Effect.Effect<AuthClient, ConfigError, WebConfig>;
    readonly handleErrors: typeof handleErrors;
  }
>() {}

export const BetterAuthLive = Layer.succeed(BetterAuth, {
  getClient: Effect.gen(function* () {
    const client = yield* getAuthClient;
    return client;
  }),
  handleErrors,
});
