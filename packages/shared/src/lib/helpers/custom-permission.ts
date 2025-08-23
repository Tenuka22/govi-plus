import type { HttpServerRequest } from '@effect/platform/HttpServerRequest';
import type { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { PolicyService } from '@repo/shared/services/policy';
import { Effect, Either } from 'effect';
import type { BetterAuth } from '../../services/auth';
import type { ServerConfig } from '../../services/config';
import type { CurrentUser } from '../../services/current-user';
import type { Resend } from '../../services/resend';

export interface UnPermissionedItem<IdType> {
  itemId: IdType;
  error?: string;
}

export interface PermissionCheckResult<T, IdType> {
  ownedItems: T[];
  unPermissionedItems: UnPermissionedItem<IdType>[];
}

export const getItemsOwnedPermission = <T, IdType>(
  items: T[],
  getId: (item: T) => IdType,
  getOwnerId: (item: T) => string
): Effect.Effect<
  PermissionCheckResult<T, IdType>,
  never,
  | PolicyService
  | CurrentUser
  | BetterAuth
  | ServerConfig
  | PgDrizzle
  | Resend
  | HttpServerRequest
> => {
  return Effect.gen(function* () {
    const ownedItems: T[] = [];
    const unPermissionedItems: UnPermissionedItem<IdType>[] = [];
    const policies = yield* PolicyService;

    yield* Effect.all(
      items.map((item) =>
        Effect.gen(function* () {
          const itemPermissionResult = yield* Effect.either(
            policies.custom((user) =>
              Effect.succeed(user.userId === getOwnerId(item))
            )
          );

          if (Either.isRight(itemPermissionResult)) {
            ownedItems.push(item);
          } else {
            unPermissionedItems.push({
              itemId: getId(item),
              error: 'Insufficient permissions for this item',
            });
          }
        })
      )
    );

    return { ownedItems, unPermissionedItems };
  });
};
