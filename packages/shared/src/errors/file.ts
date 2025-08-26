import { Schema } from 'effect';

export class FileUploadError extends Schema.TaggedError<FileUploadError>()(
  'FileUploadError',
  {
    message: Schema.String,
    code: Schema.Literal(
      'INVALID_FILE_TYPE',
      'FILE_TOO_LARGE',
      'UPLOAD_FAILED',
      'PERMISSION_DENIED'
    ),
    fileName: Schema.optional(Schema.String),
    fileSize: Schema.optional(Schema.Number),
    maxSize: Schema.optional(Schema.Number),
  }
) {}

export class FileDeleteError extends Schema.TaggedError<FileDeleteError>()(
  'FileDeleteError',
  {
    message: Schema.String,
  }
) {}
export class FileValidationError extends Schema.TaggedError<FileValidationError>()(
  'FileValidationError',
  {
    message: Schema.String,
    violations: Schema.Array(Schema.String),
    fileName: Schema.String,
  }
) {}
