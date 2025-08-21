import { HttpServerRequest } from '@effect/platform';
import type { SqlError } from '@effect/sql';
import type { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { type ConfigError, Context, Effect, Layer, Schema } from 'effect';
import { type BetterAuthApiError, UnauthorizedError } from '../errors/auth';
import { SessionId, UserId } from '../lib/brands/user';
import { getPermissionsByRole } from '../lib/helpers/permission';
import { userRoleSchema, userSchema } from '../lib/schemas/auth';
import { BetterAuth } from './auth';
import type { ServerConfig } from './config';
import type { Resend } from './resend';

export class User extends Schema.Class<User>('User')(userSchema) {}

export class CurrentUser extends Context.Tag('CurrentUser')<
  CurrentUser,
  {
    user: Effect.Effect<
      User,
      | ConfigError.ConfigError
      | SqlError.SqlError
      | BetterAuthApiError
      | UnauthorizedError,
      | BetterAuth
      | ServerConfig
      | PgDrizzle
      | Resend
      | HttpServerRequest.HttpServerRequest
    >;
  }
>() {}

export const CurrentUserLive = Layer.succeed(CurrentUser, {
  user: Effect.gen(function* () {
    const betterAuth = yield* BetterAuth;
    const caller = yield* betterAuth.caller;
    const req = yield* HttpServerRequest.HttpServerRequest;
    const raw = req.source as Request;

    const userSession = yield* caller((client) =>
      client.api.getSession({
        headers: new Headers(raw.headers),
      })
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

    const userRole = Schema.decodeUnknownSync(userRoleSchema)(
      userSession.user.role
    );

    const userPermissions = yield* Effect.sync(() =>
      getPermissionsByRole(userRole)
    );

    return User.make({
      userId: UserId.make(userSession.session.userId),
      sessionId: SessionId.make(userSession.session.id),
      role: userRole,
      permissions: userPermissions,
    });
  }),
});
