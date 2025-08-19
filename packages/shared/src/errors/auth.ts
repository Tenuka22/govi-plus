import { HttpApiSchema } from '@effect/platform';
import { Effect, Predicate, Schema } from 'effect';
import { UserId } from '../lib/brands/user';
import { CurrentUser } from '../lib/models/auth';
import { errorSchema } from '../lib/schemas/auth';

export class BetterAuthApiError extends Schema.TaggedError<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', errorSchema) {}

export class BetterAuthApiClientError extends Schema.TaggedError<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', errorSchema) {}

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>(
  'UnauthorizedError'
)(
  'UnauthorizedError',
  {
    userId: UserId,
    entity: Schema.String,
    action: Schema.String,
  },
  HttpApiSchema.annotations({ status: 403 })
) {
  override get message() {
    return `Actor (${this.userId}) is not authorized to perform action "${this.action}" on entity "${this.entity}"`;
  }
  static is(u: unknown): u is UnauthorizedError {
    return Predicate.isTagged(u, 'UnauthorizedError');
  }

  static refail(entity: string, action: string) {
    return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
      Effect.catchIf(
        effect,
        (e) => !UnauthorizedError.is(e),
        () =>
          Effect.flatMap(
            CurrentUser,
            (actor) =>
              new UnauthorizedError({
                userId: actor.userId,
                entity,
                action,
              })
          )
      );
  }
}
