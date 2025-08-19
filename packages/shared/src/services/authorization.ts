import {
  HttpApiMiddleware,
  HttpApiSecurity,
  HttpServerRequest,
} from '@effect/platform';
import { Effect, Layer } from 'effect';
import { UnauthorizedError } from '../errors/auth';
import { UserId } from '../lib/brands/user';
import { CurrentUser, User } from '../lib/models/auth';
import { BetterAuth } from './auth';

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  'Authorization',
  {
    failure: UnauthorizedError,
    provides: CurrentUser,
    security: {
      bearer: HttpApiSecurity.bearer,
    },
  }
) {}

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const betterAuth = yield* BetterAuth;
    const caller = yield* betterAuth.caller;

    return Authorization.of({
      bearer: () =>
        Effect.gen(function* () {
          const req = yield* HttpServerRequest.HttpServerRequest;

          const raw = req.source as Request;

          const userSession = yield* caller((client) =>
            client.api.getSession({
              headers: new Headers(raw.headers),
            })
          ).pipe(
            Effect.tapError((err) => Effect.logError(err)),
            Effect.catchTag(
              'BetterAuthApiError',
              () =>
                new UnauthorizedError({
                  action: 'read',
                  userId: UserId.make('anonymous'),
                  entity: 'Unknown',
                })
            )
          );

          if (!userSession) {
            return yield* Effect.fail(
              new UnauthorizedError({
                action: 'read',
                userId: UserId.make('anonymous'),
                entity: 'Unknown',
              })
            );
          }

          const subId = userSession.session.userId;

          return User.make({
            userId: UserId.make(subId),
          });
        }),
    });
  })
);
