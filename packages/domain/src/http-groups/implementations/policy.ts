import { HttpApiBuilder } from '@effect/platform';
import { CurrentUser } from '@repo/shared/services/current-user';
import { Effect } from 'effect';
import { DomainApi } from '../../domain';

export const PolicyLive = HttpApiBuilder.group(
  DomainApi,
  'policy',
  (handlers) =>
    Effect.gen(function* () {
      return handlers.handle('get', () =>
        Effect.gen(function* () {
          const currentUser = yield* CurrentUser;
          const user = yield* currentUser.user;

          const userPermissions = yield* Effect.succeed({
            userId: user.userId,
            permissions: user.permissions,
          });

          return userPermissions;
        }).pipe(Effect.orDie)
      );
    })
);
