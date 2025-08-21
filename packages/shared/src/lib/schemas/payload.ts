import { Schema } from 'effect';
import { farmerStringSchema } from './database';

export const getReqFarmerURLParams = Schema.Struct({
  ids: Schema.optional(Schema.Array(Schema.String)),
  userIds: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(farmerStringSchema.fields.name),
  email: Schema.optional(farmerStringSchema.fields.email),
  phone: Schema.optional(farmerStringSchema.fields.phone),
  cropPreferences: Schema.optional(farmerStringSchema.fields.cropPreferences),
  communicationChannels: Schema.optional(
    farmerStringSchema.fields.communicationChannels
  ),
  farmingMethods: Schema.optional(farmerStringSchema.fields.farmingMethods),
  isActive: Schema.optional(farmerStringSchema.fields.isActive),
});

export const postReqFarmerPayload = farmerStringSchema.omit('id', 'userId');
