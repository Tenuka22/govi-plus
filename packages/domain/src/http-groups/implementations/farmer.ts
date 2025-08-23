import { HttpApiBuilder } from '@effect/platform';
import { FarmerActions } from '@repo/shared/database/actions/farmer';
import { FarmerId } from '@repo/shared/lib/brands/database';
import { UserId } from '@repo/shared/lib/brands/user';
import { getItemsOwnedPermission } from '@repo/shared/lib/helpers/custom-permission';
import { farmerDataSchema } from '@repo/shared/lib/schemas/database';
import { PolicyService } from '@repo/shared/services/policy';
import { Effect, Either, Schema } from 'effect';
import { DomainApi } from '../../domain';

export const FarmerGroupLive = HttpApiBuilder.group(
  DomainApi,
  'farmer',
  (handlers) =>
    Effect.gen(function* () {
      const farmerActions = yield* FarmerActions;
      const policies = yield* PolicyService;

      return handlers
        .handle('get', (req) =>
          Effect.gen(function* () {
            yield* policies.require('_farmer:select');

            const parsedParams = req.urlParams;

            const safeParams = {
              ...parsedParams,
              ids: parsedParams.ids?.map((id) => FarmerId.make(id)),
            };

            const farmers = yield* farmerActions.getFarmers(safeParams);

            const parsedFarmers = yield* Effect.all(
              farmers.map((farmer) =>
                Effect.sync(() =>
                  Schema.decodeUnknownSync(farmerDataSchema)({
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
            yield* Effect.log('Policy');
            yield* policies.require('_farmer:create');

            const createdFarmer = yield* farmerActions.createFarmer(
              req.payload
            );
            return createdFarmer;
          })
        )

        .handle('del', (req) =>
          Effect.gen(function* () {
            yield* Effect.log('Policy');

            const ids = req.payload.ids.map((id) => FarmerId.make(id));

            const globalPermissionResult = yield* Effect.either(
              policies.require('_farmer:delete')
            );

            if (Either.isRight(globalPermissionResult)) {
              const deletedFarmers = yield* farmerActions.deleteFarmers({
                ids,
              });
              return deletedFarmers;
            }

            yield* policies.require('_farmer:owned-delete');

            const selectedFarmers = yield* farmerActions.getFarmers({
              ...req.payload,
              ids,
            });

            const { ownedItems: ownedFarmers, unPermissionedItems } =
              yield* getItemsOwnedPermission(
                selectedFarmers,
                (f) => FarmerId.make(f.id),
                (f) => UserId.make(f.userId)
              );

            if (ownedFarmers.length === 0) {
              return {
                deletedItems: [],
                unDeletedItems: unPermissionedItems,
              };
            }

            const ownedFarmerIds = ownedFarmers.map((f) => FarmerId.make(f.id));
            const deletedFarmers = yield* farmerActions.deleteFarmers({
              ids: ownedFarmerIds,
            });

            return {
              ...deletedFarmers,
              unDeletedItems: [
                ...(deletedFarmers.unDeletedItems || []),
                ...unPermissionedItems,
              ],
            };
          })
        )

        .handle('patch', (req) =>
          Effect.gen(function* () {
            yield* Effect.log('Policy');

            const ids = req.payload.ids.map((id) => FarmerId.make(id));

            const globalPermissionResult = yield* Effect.either(
              policies.require('_farmer:update')
            );

            if (Either.isRight(globalPermissionResult)) {
              const updatedFarmers = yield* farmerActions.updateFarmers({
                ...req.payload,
                ids,
              });
              return updatedFarmers;
            }

            yield* policies.require('_farmer:owned-update');

            const selectedFarmers = yield* farmerActions.getFarmers({ ids });

            const { ownedItems: ownedFarmers, unPermissionedItems } =
              yield* getItemsOwnedPermission(
                selectedFarmers,
                (f) => FarmerId.make(f.id),
                (f) => UserId.make(f.userId)
              );

            if (ownedFarmers.length === 0) {
              return {
                updatedItems: [],
                unUpdatedItems: unPermissionedItems,
              };
            }

            const ownedFarmerIds = ownedFarmers.map((f) => FarmerId.make(f.id));
            const updatedFarmers = yield* farmerActions.updateFarmers({
              ...req.payload,
              ids: ownedFarmerIds,
            });

            return {
              ...updatedFarmers,
              unUpdatedItems: [
                ...(updatedFarmers.unUpdatedItems || []),
                ...unPermissionedItems,
              ],
            };
          })
        );
    })
);
