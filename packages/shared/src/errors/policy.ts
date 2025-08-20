import { HttpApiSchema } from '@effect/platform';
import { Schema } from 'effect';

export class PolicyError extends Schema.TaggedError<PolicyError>('PolicyError')(
  'PolicyError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description: 'The server failed to get the permissions',
  })
) {}
