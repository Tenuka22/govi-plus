import { Schema } from 'effect';
import { farmerStringSchema } from './database';

export const getReqFarmerURLParams = Schema.Struct({
  ids: Schema.Array(Schema.String),
  userIds: Schema.Array(Schema.String),
  name: farmerStringSchema.fields.name,
  email: farmerStringSchema.fields.email,
  phone: farmerStringSchema.fields.phone,
  cropPreferences: farmerStringSchema.fields.cropPreferences,
  communicationChannels: farmerStringSchema.fields.communicationChannels,
  farmingMethods: farmerStringSchema.fields.farmingMethods,
  isActive: farmerStringSchema.fields.isActive,
});

export const postReqFarmerPayload = farmerStringSchema.omit('id', 'userId');
