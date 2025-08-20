import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { Context, Effect, Layer, Schema } from 'effect';
import {
  DrizzleEmptyInsertError,
  DrizzleInsertError,
  DrizzleSelectError,
} from '../../errors/database';
import { FarmerId } from '../../lib/brands/database';
import { farmerSchema } from '../../lib/schemas/database';
import type {
  getReqFarmerURLParams,
  postReqFarmerPayload,
} from '../../lib/schemas/payload';
import { farmers } from '../schema';

const createFarmerFn = (payload: typeof postReqFarmerPayload.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const parsedPayload = Schema.decodeUnknownSync(farmerSchema)(payload);
    const farmerData = {
      ...parsedPayload,
      address: parsedPayload.address ?? undefined,
      farmingMethods: [...parsedPayload.farmingMethods],
      communicationChannels: [...parsedPayload.communicationChannels],
      cropPreferences: [...parsedPayload.cropPreferences],
    };

    const [farmer] = yield* Effect.tryPromise({
      try: async () =>
        drizzleClient.insert(farmers).values(farmerData).returning(),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleInsertError({ values: farmerData, message: e.message })
          : new DrizzleInsertError({ values: farmerData }),
    });

    if (!farmer) {
      return yield* Effect.fail(new DrizzleEmptyInsertError());
    }

    const parsedFarmer = Schema.decodeUnknownSync(farmerSchema)({
      ...farmer,
      id: FarmerId.make(farmer.id),
    });

    return parsedFarmer;
  });

const gerFarmersFn = (payload: typeof getReqFarmerURLParams.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const dynamicFarmersQuery = drizzleClient.select().from(farmers).$dynamic();

    const filteredFarmers = yield* Effect.tryPromise({
      try: async () => dynamicFarmersQuery,
      catch: (e) =>
        e instanceof Error
          ? new DrizzleSelectError({ filters: payload, message: e.message })
          : new DrizzleSelectError({ filters: payload }),
    });
    return filteredFarmers;
  });

export class FarmerActions extends Context.Tag('FarmerActions')<
  FarmerActions,
  {
    createFarmer: typeof createFarmerFn;
    getFarmers: typeof gerFarmersFn;
  }
>() {}

export const FarmerActionImplementations = Layer.succeed(FarmerActions, {
  createFarmer: createFarmerFn,
  getFarmers: gerFarmersFn,
});
