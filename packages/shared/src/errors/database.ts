import { HttpApiSchema } from '@effect/platform';
import { Schema } from 'effect';

export class DrizzleEmptyInsertError extends Schema.TaggedError<DrizzleEmptyInsertError>(
  'DrizzleEmptyInsertError'
)(
  'DrizzleEmptyInsertError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description:
      'The server called the insert function but the insert returned empty.',
  })
) {}

export class DrizzleInsertError extends Schema.TaggedError<DrizzleInsertError>(
  'DrizzleInsertError'
)(
  'DrizzleInsertError',
  {
    message: Schema.optional(Schema.String),
    values: Schema.optional(Schema.Any),
  },
  HttpApiSchema.annotations({
    status: 403,
    description: 'The server failed to call the insert function.',
  })
) {}

export class DrizzleSelectError extends Schema.TaggedError<DrizzleSelectError>(
  'DrizzleSelectError'
)(
  'DrizzleSelectError',
  {
    message: Schema.optional(Schema.String),
    filters: Schema.optional(Schema.Any),
  },
  HttpApiSchema.annotations({
    status: 403,
    description: 'The server failed to call the insert function.',
  })
) {}

export class DrizzleFailedToDeleteAllError extends Schema.TaggedError<DrizzleFailedToDeleteAllError>(
  'DrizzleFailedToDeleteAllError'
)(
  'DrizzleFailedToDeleteAllError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description:
      'The server called the delete function but all the deletes failed.',
  })
) {}

export class DrizzleDeleteError extends Schema.TaggedError<DrizzleDeleteError>(
  'DrizzleDeleteError'
)(
  'DrizzleDeleteError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description: 'The server failed to call the delete function.',
  })
) {}

export class DrizzleUpdateError extends Schema.TaggedError<DrizzleUpdateError>(
  'DrizzleUpdateError'
)(
  'DrizzleUpdateError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description: 'The server failed to call the update function.',
  })
) {}

export class DrizzleFailedToUpdateAllError extends Schema.TaggedError<DrizzleFailedToUpdateAllError>(
  'DrizzleFailedToUpdateAllError'
)(
  'DrizzleFailedToUpdateAllError',
  {
    message: Schema.optional(Schema.String),
  },
  HttpApiSchema.annotations({
    status: 403,
    description:
      'The server called the delete function but all the updates failed.',
  })
) {}
