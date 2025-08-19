import {
  HttpApiBuilder,
  HttpServerRequest,
  HttpServerResponse,
} from '@effect/platform';
import { BetterAuth } from '@repo/shared/services/auth';
import { Effect } from 'effect';
import { DomainApi } from '../../domain';

export const BetterAuthLive = HttpApiBuilder.group(
  DomainApi,
  'auth',
  (handlers) =>
    Effect.gen(function* () {
      const betterAuth = yield* BetterAuth;
      const authCaller = yield* betterAuth.caller;

      return handlers
        .handleRaw('get', () =>
          Effect.gen(function* () {
            const req = yield* HttpServerRequest.HttpServerRequest;
            const raw = req.source as Request;
            const authRes = yield* authCaller((client) => client.handler(raw));
            return yield* HttpServerResponse.raw(authRes.body, {
              status: authRes.status,
              statusText: authRes.statusText,
              headers: authRes.headers,
            });
          }).pipe(Effect.orDie)
        )
        .handleRaw('post', () =>
          Effect.gen(function* () {
            const req = yield* HttpServerRequest.HttpServerRequest;
            const raw = req.source as Request;

            const authRes = yield* authCaller((client) => client.handler(raw));

            return yield* HttpServerResponse.raw(authRes.body, {
              status: authRes.status,
              statusText: authRes.statusText,
              headers: authRes.headers,
            });
          }).pipe(Effect.orDie)
        );
    })
);
