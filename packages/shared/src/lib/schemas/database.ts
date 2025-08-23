import { Schema } from 'effect';
import {
  communicationChannelEnum,
  cropPreferenceEnum,
  districtEnum,
  experienceLevelEnum,
  farmingMethodEnum,
  provinceEnum,
} from '../../database/schema';
import { FarmerId } from '../brands/database';
import { UserId } from '../brands/user';

export const farmerLocationSchema = Schema.Struct({
  lat: Schema.Number,
  lng: Schema.Number,
  district: Schema.Literal(...districtEnum.enumValues),
  province: Schema.Literal(...provinceEnum.enumValues),
});

export const farmerDataSchema = Schema.Struct({
  id: FarmerId,
  userId: UserId,
  name: Schema.NonEmptyTrimmedString,
  email: Schema.NullOr(Schema.NonEmptyTrimmedString),
  phone: Schema.NonEmptyTrimmedString,
  address: Schema.NullOr(Schema.NonEmptyTrimmedString),
  location: farmerLocationSchema,
  experienceLevel: Schema.NullOr(
    Schema.Literal(...experienceLevelEnum.enumValues)
  ),
  farmingMethods: Schema.Array(
    Schema.Union(Schema.Literal(...farmingMethodEnum.enumValues))
  ),
  communicationChannels: Schema.Array(
    Schema.Literal(...communicationChannelEnum.enumValues)
  ),
  cropPreferences: Schema.Array(
    Schema.Literal(...cropPreferenceEnum.enumValues)
  ),
  isActive: Schema.NullOr(Schema.Boolean),
  createdAt: Schema.NullOr(Schema.Date),
  updatedAt: Schema.NullOr(Schema.Date),
});

export const farmerInsertSchema = Schema.Struct({
  id: FarmerId,
  userId: UserId,
  name: Schema.NonEmptyTrimmedString,
  email: Schema.UndefinedOr(Schema.NonEmptyTrimmedString),
  phone: Schema.NonEmptyTrimmedString,
  address: Schema.UndefinedOr(Schema.NonEmptyTrimmedString),
  location: farmerLocationSchema,
  experienceLevel: Schema.UndefinedOr(
    Schema.Literal(...experienceLevelEnum.enumValues)
  ),
  farmingMethods: Schema.Array(
    Schema.Union(Schema.Literal(...farmingMethodEnum.enumValues))
  ),
  communicationChannels: Schema.Array(
    Schema.Literal(...communicationChannelEnum.enumValues)
  ),
  cropPreferences: Schema.Array(
    Schema.Literal(...cropPreferenceEnum.enumValues)
  ),
  isActive: Schema.UndefinedOr(Schema.Boolean),
  createdAt: Schema.UndefinedOr(Schema.Date),
  updatedAt: Schema.UndefinedOr(Schema.Date),
});

export const deletedSchema = (
  itemId: Schema.brand<typeof Schema.Any, string>
) =>
  Schema.Struct({
    deletedItems: Schema.Array(itemId),
    unDeletedItems: Schema.Array(
      Schema.Struct({
        itemId,
        error: Schema.optional(Schema.String),
      })
    ),
  });

export const updatedSchema = (
  itemId: Schema.brand<typeof Schema.Any, string>
) =>
  Schema.Struct({
    updatedItems: Schema.Array(itemId),
    unUpdatedItems: Schema.Array(
      Schema.Struct({
        itemId,
        error: Schema.optional(Schema.String),
      })
    ),
  });
