import { Schema } from 'effect';
import { fileTypeSchema } from './database';

export const fileUploadConfigSchema = Schema.Struct({
  maxFileSize: Schema.Number,
  allowedFileTypes: Schema.Array(fileTypeSchema),
  allowedMimeTypes: Schema.Array(Schema.String),
  uploadPath: Schema.String,
});
