import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import {
  and,
  arrayContains,
  eq,
  type InferSelectModel,
  like,
  sql,
} from 'drizzle-orm';
import { Context, Effect, Layer, Schema } from 'effect';
import {
  DrizzleEmptyInsertError,
  DrizzleInsertError,
  DrizzleSelectError,
} from '../../errors/database';
import { FarmerId } from '../../lib/brands/database';
import {
  farmerDataSchema,
  farmerInsertSchema,
} from '../../lib/schemas/database';
import {
  type getReqFarmerURLParams,
  parsedGetReqFarmerURLParams,
  type patchReqFarmerPayload,
  type postReqFarmerPayload,
} from '../../lib/schemas/payload';
import { farmers } from '../schema';

const createFarmerFn = (payload: typeof postReqFarmerPayload.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const parsedPayload = Schema.decodeUnknownSync(farmerInsertSchema)(payload);
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

    const parsedFarmer = Schema.decodeUnknownSync(farmerDataSchema)({
      ...farmer,
      id: FarmerId.make(farmer.id),
    });

    return parsedFarmer;
  });

const buildFarmerConditions = (
  payload: typeof parsedGetReqFarmerURLParams.Type
) => {
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

const buildArrayConditions = (
  payload: typeof parsedGetReqFarmerURLParams.Type
) => {
  const conditions: ReturnType<typeof sql>[] = [];

  if (payload.cropPreferences?.length) {
    conditions.push(
      arrayContains(farmers.cropPreferences, [...payload.cropPreferences])
    );
  }

  if (payload.communicationChannels?.length) {
    conditions.push(
      arrayContains(farmers.communicationChannels, [
        ...payload.communicationChannels,
      ])
    );
  }

  if (payload.farmingMethods?.length) {
    conditions.push(
      arrayContains(farmers.farmingMethods, [...payload.farmingMethods])
    );
  }

  return conditions;
};

const getFarmersFn = (payload: typeof getReqFarmerURLParams.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const parsedPayload = Schema.decodeUnknownSync(parsedGetReqFarmerURLParams)(
      payload
    );

    const basicConditions = buildFarmerConditions(parsedPayload);
    const arrayConditions = buildArrayConditions(parsedPayload);
    const conditions = [...basicConditions, ...arrayConditions];

    if (parsedPayload.isActive !== null) {
      conditions.push(eq(farmers.isActive, parsedPayload.isActive));
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
          ? new DrizzleSelectError({
              filters: parsedPayload,
              message: e.message,
            })
          : new DrizzleSelectError({ filters: parsedPayload }),
    });

    return filteredFarmers as InferSelectModel<typeof farmers>[];
  });

const updateFarmersFn = (payload: typeof patchReqFarmerPayload.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const parsedFarmerData = Schema.decodeUnknownSync(
      Schema.partial(farmerDataSchema)
    )(payload.data);

    const farmerData = {
      ...parsedFarmerData,
      address: parsedFarmerData.address ?? undefined,
      farmingMethods: [...(parsedFarmerData.farmingMethods ?? [])],
      communicationChannels: [
        ...(parsedFarmerData.communicationChannels ?? []),
      ],
      cropPreferences: [...(parsedFarmerData.cropPreferences ?? [])],
    };

    const failedToUpdate: { itemId: typeof FarmerId.Type; error: string }[] =
      [];

    const updateResults: {
      itemId: typeof FarmerId.Type;
      result: 'success' | 'error';
    }[] = yield* Effect.all(
      payload.ids.map((id) =>
        Effect.tryPromise({
          try: async () =>
            drizzleClient
              .update(farmers)
              .set(farmerData)
              .where(eq(farmers.id, id))
              .returning()
              .then((v) =>
                v[0]
                  ? { itemId: id, result: 'success' as const }
                  : { itemId: id, result: 'error' as const }
              ),
          catch: (e) => {
            failedToUpdate.push({
              itemId: id,
              error:
                e instanceof Error
                  ? e.message
                  : `Unknown error updating farmer ${id}`,
            });
            return { itemId: id, result: 'error' as const };
          },
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed({ itemId: id, result: 'error' as const })
          )
        )
      )
    );

    const successfullyUpdated = updateResults
      .map((r) => {
        if (r.result === 'error') {
          failedToUpdate.push({
            itemId: r.itemId,
            error: "Server didn't return the updated farmer",
          });
          return null;
        }
        return r.itemId;
      })
      .filter((id): id is ReturnType<typeof FarmerId.make> => !!id);

    return {
      updatedItems: successfullyUpdated,
      unUpdatedItems: failedToUpdate,
    };
  });

const deleteFarmersFn = (payload: { ids: (typeof FarmerId.Type)[] }) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const failedToDelete: { itemId: typeof FarmerId.Type; error: string }[] =
      [];

    const deleteResults: {
      itemId: typeof FarmerId.Type;
      result: 'success' | 'error';
    }[] = yield* Effect.all(
      payload.ids.map((id) =>
        Effect.tryPromise({
          try: async () =>
            drizzleClient
              .delete(farmers)
              .where(eq(farmers.id, id))
              .returning()
              .then((v) =>
                v[0]
                  ? {
                      itemId: id,
                      result: 'success' as const,
                    }
                  : { itemId: id, result: 'error' as const }
              ),
          catch: (e) => {
            failedToDelete.push({
              itemId: id,
              error:
                e instanceof Error
                  ? e.message
                  : `Unknown error while deleting farmer ${id}`,
            });
            return { itemId: id, result: 'error' as const };
          },
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed({ itemId: id, result: 'error' as const })
          )
        )
      )
    );

    const successfullyDeleted = deleteResults
      .map((r) => {
        if (r.result === 'error') {
          failedToDelete.push({
            itemId: r.itemId,
            error: "Server didn't return the deleted farmer",
          });
          return null;
        }
        return r.itemId;
      })
      .filter((v) => v !== null)
      .filter((id): id is ReturnType<typeof FarmerId.make> => !!id);

    return {
      deletedItems: successfullyDeleted,
      unDeletedItems: failedToDelete,
    };
  });

export class FarmerActions extends Context.Tag('FarmerActions')<
  FarmerActions,
  {
    createFarmer: typeof createFarmerFn;
    getFarmers: typeof getFarmersFn;
    updateFarmers: typeof updateFarmersFn;
    deleteFarmers: typeof deleteFarmersFn;
  }
>() {}

export const FarmerActionImplementations = Layer.succeed(FarmerActions, {
  createFarmer: createFarmerFn,
  getFarmers: getFarmersFn,
  updateFarmers: updateFarmersFn,
  deleteFarmers: deleteFarmersFn,
});
