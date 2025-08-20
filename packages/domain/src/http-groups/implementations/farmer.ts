import { HttpApiBuilder } from '@effect/platform';
import { FarmerActions } from '@repo/shared/database/actions/farmer';
import { FarmerId } from '@repo/shared/lib/brands/database';
import { UserId } from '@repo/shared/lib/brands/user';
import { farmerSchema } from '@repo/shared/lib/schemas/database';
import { getReqFarmerURLParams } from '@repo/shared/lib/schemas/payload';
import { Effect, Schema } from 'effect';
import { DomainApi } from '../../domain';

export const FarmerGroupLive = HttpApiBuilder.group(
  DomainApi,
  'farmer',
  (handlers) =>
    Effect.gen(function* () {
      const farmerActions = yield* FarmerActions;

      return handlers
        .handle('get', (req) =>
          Effect.gen(function* () {
            const params = req.urlParams;
            const parsedParmas = Schema.decodeUnknownSync(
              getReqFarmerURLParams
            )(params);

            const farmers = yield* farmerActions.getFarmers(parsedParmas);

            const parsedFarmers = yield* Effect.all(
              farmers.map((farmer) =>
                Effect.sync(() =>
                  Schema.decodeUnknownSync(farmerSchema)({
                    ...farmer,
                    userId: UserId.make(farmer.userId),
                    id: FarmerId.make(farmer.id),
                  })
                )
              )
            );

            return parsedFarmers;
          })
        )
        .handle('post', (req) =>
          Effect.gen(function* () {
            const createdFarmer = yield* farmerActions.createFarmer(
              req.payload
            );
            return createdFarmer;
          })
        );
    })
);
