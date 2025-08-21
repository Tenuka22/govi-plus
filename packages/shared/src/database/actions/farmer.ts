import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { and, eq, type InferSelectModel, like, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
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

const arrayContains = <T>(col: PgColumn, values: T[]) =>
  sql`${col} @> ${values}::text[]`;

const buildFarmerConditions = (payload: typeof getReqFarmerURLParams.Type) => {
  const conditions: ReturnType<typeof sql>[] = [];

  if (payload.ids && payload.ids.length > 0) {
    conditions.push(sql`${farmers.id} = ANY(${payload.ids}::uuid[])`);
  }

  if (payload.userIds && payload.userIds.length > 0) {
    conditions.push(sql`${farmers.userId} = ANY(${payload.userIds}::uuid[])`);
  }

  if (payload.name) {
    conditions.push(like(farmers.name, `%${payload.name}%`));
  }

  if (payload.email) {
    conditions.push(eq(farmers.email, payload.email));
  }

  if (payload.phone) {
    conditions.push(eq(farmers.phone, payload.phone));
  }

  return conditions;
};

const buildArrayConditions = (payload: typeof getReqFarmerURLParams.Type) => {
  const conditions: ReturnType<typeof sql>[] = [];

  if (payload.cropPreferences && payload.cropPreferences.length > 0) {
    conditions.push(
      arrayContains(farmers.cropPreferences, [...payload.cropPreferences])
    );
  }

  if (
    payload.communicationChannels &&
    payload.communicationChannels.length > 0
  ) {
    conditions.push(
      arrayContains(farmers.communicationChannels, [
        ...payload.communicationChannels,
      ])
    );
  }

  if (payload.farmingMethods && payload.farmingMethods.length > 0) {
    conditions.push(
      arrayContains(farmers.farmingMethods, [...payload.farmingMethods])
    );
  }

  return conditions;
};

const getFarmersFn = (payload: typeof getReqFarmerURLParams.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const basicConditions = buildFarmerConditions(payload);
    const arrayConditions = buildArrayConditions(payload);
    const conditions = [...basicConditions, ...arrayConditions];

    if (payload.isActive !== undefined) {
      conditions.push(eq(farmers.isActive, payload.isActive));
    }

    const query =
      conditions.length > 0
        ? drizzleClient
            .select()
            .from(farmers)
            .where(and(...conditions))
        : drizzleClient.select().from(farmers);

    const filteredFarmers = yield* Effect.tryPromise({
      try: async () => query.execute(),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleSelectError({ filters: payload, message: e.message })
          : new DrizzleSelectError({ filters: payload }),
    });

    return filteredFarmers as InferSelectModel<typeof farmers>[];
  });

export class FarmerActions extends Context.Tag('FarmerActions')<
  FarmerActions,
  {
    createFarmer: typeof createFarmerFn;
    getFarmers: typeof getFarmersFn;
  }
>() {}

export const FarmerActionImplementations = Layer.succeed(FarmerActions, {
  createFarmer: createFarmerFn,
  getFarmers: getFarmersFn,
});
