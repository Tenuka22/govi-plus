import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import {
  DrizzleEmptyInsertError,
  DrizzleInsertError,
  DrizzleSelectError,
} from '@repo/shared/errors/database';
import { farmerSchema } from '@repo/shared/lib/schemas/database';
import {
  getReqFarmerURLParams,
  postReqFarmerPayload,
} from '@repo/shared/lib/schemas/payload';
import { Schema } from 'effect';

export class FarmerGroup extends HttpApiGroup.make('farmer')
  .add(
    HttpApiEndpoint.get('get', '/')
      .addSuccess(Schema.Array(farmerSchema))
      .setUrlParams(getReqFarmerURLParams)
      .addError(DrizzleSelectError)
  )
  .add(
    HttpApiEndpoint.get('post', '/')
      .addSuccess(farmerSchema)
      .setPayload(postReqFarmerPayload)
      .addError(DrizzleEmptyInsertError)
      .addError(DrizzleInsertError)
  )
  .prefix('/') {}
