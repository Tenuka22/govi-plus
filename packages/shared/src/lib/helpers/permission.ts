import { Effect, Schema } from 'effect';
import type { NonEmptyReadonlyArray } from 'effect/Array';
import { ForbiddenError } from '../../errors/auth';
import { CurrentUser } from '../../services/current-user';
import { SessionId, UserId } from '../brands/user';
import { rolePermissions } from '../constants/permissions';
import { currentUserSchema } from '../schemas/auth';
import type { User, UserRole } from '../types/auth';
import type { Policy, UserPermission } from '../types/permissions';

export const policy = <E, R>(
  predicate: (user: User) => Effect.Effect<boolean, E, R>,
  message?: string
): Policy<E, R> =>
  Effect.gen(function* () {
    const currentUser = yield* CurrentUser;
    const user = yield* currentUser.user.pipe(
      Effect.catchAll((e) =>
        Effect.fail(new ForbiddenError({ message: e.message }))
      )
    );

    const parsedUser = Schema.decodeUnknownSync(currentUserSchema)({
      ...user,
      userId: UserId.make(user.userId),
      sessionId: SessionId.make(user.sessionId),
    });

    const result = yield* predicate(parsedUser);

    if (!result) {
      const fallbackMessage = `User ${parsedUser.userId} does not have permission to proceed with the action.`;

      yield* Effect.fail(
        new ForbiddenError({
          message: message ?? fallbackMessage,
        })
      );
    }
  });

export const withPolicy =
  <E, R>(providedPolicy: Policy<E, R>) =>
  <A, E2, R2>(self: Effect.Effect<A, E2, R2>) =>
    Effect.zipRight(providedPolicy, self);

export const all = <E, R>(
  ...policies: NonEmptyReadonlyArray<Policy<E, R>>
): Policy<E, R> =>
  Effect.all(policies, {
    concurrency: 1,
    discard: true,
  });

export const any = <E, R>(
  ...policies: NonEmptyReadonlyArray<Policy<E, R>>
): Policy<E, R> => Effect.firstSuccessOf(policies);

export const permission = (requiredPermission: UserPermission): Policy =>
  policy((user) => Effect.succeed(user.permissions.has(requiredPermission)));

export const custom = <E, R>(
  predicate: (user: User) => Effect.Effect<boolean, E, R>,
  message?: string
) => policy(predicate, message);

export const getPermissionsByRole = (role: UserRole): Set<UserPermission> => {
  return new Set(rolePermissions[role] ?? []);
};
