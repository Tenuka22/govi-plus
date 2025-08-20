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
import { EmailRegex } from '../regex';
import { createRegexParseErrorHandler } from '../utils';

export const farmerLocationSchema = Schema.Struct({
  lat: Schema.Number,
  lng: Schema.Number,
  district: Schema.Literal(...districtEnum.enumValues),
  province: Schema.Literal(...provinceEnum.enumValues),
});

export const farmerSchema = Schema.Struct({
  id: FarmerId,
  userId: UserId,
  name: Schema.NonEmptyTrimmedString,
  email: Schema.NullOr(
    Schema.NonEmptyTrimmedString.pipe(
      Schema.pattern(EmailRegex, {
        message: createRegexParseErrorHandler('Email'),
      })
    )
  ),
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

export const farmerStringSchema = Schema.Struct({
  id: Schema.String,
  userId: Schema.String,
  name: Schema.String,
  email: Schema.UndefinedOr(Schema.String),
  phone: Schema.String,
  address: Schema.UndefinedOr(Schema.String),
  location: Schema.String,
  experienceLevel: Schema.UndefinedOr(Schema.String),
  farmingMethods: Schema.Array(Schema.String),
  communicationChannels: Schema.Array(Schema.String),
  cropPreferences: Schema.Array(Schema.String),
  isActive: Schema.UndefinedOr(Schema.String),
  createdAt: Schema.UndefinedOr(Schema.String),
  updatedAt: Schema.UndefinedOr(Schema.String),
});
