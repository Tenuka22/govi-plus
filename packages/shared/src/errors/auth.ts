import { HttpApiSchema } from '@effect/platform';
import { Schema } from 'effect';
import { UserId } from '../lib/brands/user';
import { errorSchema } from '../lib/schemas/auth';

export class BetterAuthApiError extends Schema.TaggedError<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', errorSchema) {}

export class BetterAuthApiClientError extends Schema.TaggedError<BetterAuthApiError>(
  'BetterAuthApiClientError'
)('BetterAuthApiClientError', errorSchema) {}

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
) {}

export class ForbiddenError extends Schema.TaggedError<ForbiddenError>(
  'ForbiddenError'
)(
  'ForbiddenError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description:
      'The server understood the request but refuses to authorize it',
  })
) {}
