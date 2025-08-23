import { Schema } from 'effect';
import { FarmerId } from '../brands/database';
import { UserId } from '../brands/user';
import { farmerDataSchema, farmerInsertSchema } from './database';

export const getReqFarmerURLParams = Schema.Struct({
  ids: Schema.optional(Schema.Array(FarmerId)),
  userIds: Schema.optional(Schema.Array(UserId)),
  name: Schema.optional(Schema.String),
  email: Schema.optional(Schema.String),
  phone: Schema.optional(Schema.String),
  cropPreferences: Schema.optional(Schema.String),
  communicationChannels: Schema.optional(Schema.String),
  farmingMethods: Schema.optional(Schema.String),
  isActive: Schema.optional(Schema.BooleanFromString),
});

export const parsedGetReqFarmerURLParams = Schema.Struct({
  ids: Schema.optional(Schema.Array(FarmerId)),
  userIds: Schema.optional(Schema.Array(UserId)),
  name: farmerDataSchema.fields.name,
  email: farmerDataSchema.fields.email,
  phone: farmerDataSchema.fields.phone,
  cropPreferences: farmerDataSchema.fields.cropPreferences,
  communicationChannels: farmerDataSchema.fields.communicationChannels,
  farmingMethods: farmerDataSchema.fields.farmingMethods,
  isActive: farmerDataSchema.fields.isActive,
});

export const postReqFarmerPayload = farmerInsertSchema.omit('id', 'userId');

export const deleteReqEntityPayload = (
  itemId: Schema.brand<typeof Schema.Any, string>
) =>
  Schema.Struct({
    ids: Schema.Array(itemId),
  });

export const updateReqEntityPayload = <TFields extends Schema.Struct.Fields>(
  itemId: Schema.brand<typeof Schema.Any, string>,
  dataSchema: Schema.Struct<TFields>
) =>
  Schema.Struct({
    ids: Schema.Array(itemId),
    data: Schema.partial(dataSchema),
  });

export const patchReqFarmerPayload = updateReqEntityPayload(
  FarmerId,
  farmerInsertSchema.omit('id')
);
