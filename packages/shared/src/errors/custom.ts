import { Schema } from 'effect';

export class CustomConfigError extends Schema.TaggedError<CustomConfigError>(
  'CustomConfigError'
)('CustomConfigError', Schema.Struct({ message: Schema.String })) {}

export class CustomSqlError extends Schema.TaggedError<CustomSqlError>(
  'CustomSqlError'
)('CustomSqlError', Schema.Struct({ message: Schema.String })) {}

export class CustomParseError extends Schema.TaggedError<CustomParseError>(
  'CustomParseError'
)('CustomParseError', Schema.Struct({ message: Schema.String })) {}
