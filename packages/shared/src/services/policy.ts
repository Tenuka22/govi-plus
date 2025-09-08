import type { HttpServerRequest } from '@effect/platform';
import type { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { Context, Effect, Layer } from 'effect';
import type { ForbiddenError } from '../errors/auth';
import { all, any, policy, withPolicy } from '../lib/permission/helpers';
import type { Policy, UserPermission } from '../lib/types/permissions';
import type { BetterAuth } from './auth';
import type { ServerConfig } from './config';
import type { CurrentUser } from './current-user';
import type { Resend } from './resend';

export class PolicyService extends Context.Tag('PolicyService')<
  PolicyService,
  {
    readonly require: (required: UserPermission, message?: string) => Policy;
    readonly all: <E, R>(
      ...policies: [Policy<E, R>, ...Policy<E, R>[]]
    ) => Policy<E, R>;
    readonly any: <E, R>(
      ...policies: [Policy<E, R>, ...Policy<E, R>[]]
    ) => Policy<E, R>;
    readonly with: <E, R>(
      providedPolicy: Policy<E, R>
    ) => <A, E2, R2>(
      self: Effect.Effect<A, E2, R2>
    ) => Effect.Effect<
      A,
      ForbiddenError | E | E2,
      | CurrentUser
      | BetterAuth
      | ServerConfig
      | PgDrizzle
      | Resend
      | HttpServerRequest.HttpServerRequest
      | R
      | R2
    >;
  }
>() {}

export const PolicyServiceLive = Layer.succeed(PolicyService, {
  require: (required: UserPermission, message?: string) =>
    policy((user) => Effect.succeed(user.permissions.has(required)), message),
  all,
  any,
  with: withPolicy,
});
