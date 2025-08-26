import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { HttpApiDecodeError } from '@effect/platform/HttpApiError';
import { ForbiddenError, UnauthorizedError } from '@repo/shared/errors/auth';
import { DrizzleSelectError } from '@repo/shared/errors/database';
import { FileUploadError } from '@repo/shared/errors/file';
import { FileId } from '@repo/shared/lib/brands/database';
import {
  deletedSchema,
  fileDataSchema,
  fileTypeSchema,
} from '@repo/shared/lib/schemas/database';
import {
  deleteReqEntityPayload,
  postPathReqFilePayload,
  postTypeReqFilePayload,
  postUploadReqFilePayload,
} from '@repo/shared/lib/schemas/payload';
import { Schema } from 'effect';

export class FileGroupApi extends HttpApiGroup.make('file')
  .add(
    HttpApiEndpoint.get('get', '/')
      .addError(ForbiddenError)
      .addError(DrizzleSelectError)
      .addSuccess(Schema.Array(fileDataSchema))
  )
  .add(
    HttpApiEndpoint.del('del', '/')
      .setPayload(deleteReqEntityPayload(FileId))
      .addSuccess(deletedSchema(FileId))
      .addError(DrizzleSelectError)
      .addError(ForbiddenError)
  )
  .add(
    HttpApiEndpoint.post('post-upload', '/upload')
      .setPayload(postUploadReqFilePayload)
      .addSuccess(Schema.Array(fileDataSchema))
      .addError(ForbiddenError)
      .addError(HttpApiDecodeError)
  )
  .add(
    HttpApiEndpoint.post('post-type', '/type')
      .setPayload(postTypeReqFilePayload)
      .addSuccess(fileTypeSchema)
      .addError(FileUploadError)
      .addError(UnauthorizedError)
      .addError(ForbiddenError)
  )
  .add(
    HttpApiEndpoint.post('post-path', '/path')
      .setPayload(postPathReqFilePayload)
      .addSuccess(Schema.NonEmptyTrimmedString)
      .addError(UnauthorizedError)
      .addError(ForbiddenError)
  )

  .prefix('/file') {}
