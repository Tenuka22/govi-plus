import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { ForbiddenError } from '@repo/shared/errors/auth';
import {
  DrizzleDeleteError,
  DrizzleEmptyInsertError,
  DrizzleFailedToDeleteAllError,
  DrizzleFailedToUpdateAllError,
  DrizzleInsertError,
  DrizzleSelectError,
  DrizzleUpdateError,
} from '@repo/shared/errors/database';
import { FarmerId } from '@repo/shared/lib/brands/database';
import {
  deletedSchema,
  farmerDataSchema,
  updatedSchema,
} from '@repo/shared/lib/schemas/database';
import {
  deleteReqEntityPayload,
  getReqFarmerURLParams,
  patchReqFarmerPayload,
  postReqFarmerPayload,
} from '@repo/shared/lib/schemas/payload';
import { Schema } from 'effect';

export class FarmerGroup extends HttpApiGroup.make('farmer')
  .add(
    HttpApiEndpoint.get('get', '/')
      .addSuccess(Schema.Array(farmerDataSchema))
      .setUrlParams(getReqFarmerURLParams)
      .addError(DrizzleSelectError)
      .addError(ForbiddenError)
  )
  .add(
    HttpApiEndpoint.post('post', '/')
      .addSuccess(farmerDataSchema)
      .setPayload(postReqFarmerPayload)
      .addError(DrizzleEmptyInsertError)
      .addError(ForbiddenError)
      .addError(DrizzleInsertError)
  )
  .add(
    HttpApiEndpoint.del('del', '/')
      .addSuccess(deletedSchema(FarmerId))
      .setPayload(deleteReqEntityPayload(FarmerId))
      .addError(DrizzleDeleteError)
      .addError(DrizzleSelectError)
      .addError(DrizzleFailedToDeleteAllError)
      .addError(ForbiddenError)
  )
  .add(
    HttpApiEndpoint.patch('patch', '/')
      .addSuccess(updatedSchema(FarmerId))
      .setPayload(patchReqFarmerPayload)
      .addError(DrizzleSelectError)
      .addError(DrizzleUpdateError)
      .addError(DrizzleFailedToUpdateAllError)
      .addError(ForbiddenError)
  )
  .prefix('/farmer') {}
