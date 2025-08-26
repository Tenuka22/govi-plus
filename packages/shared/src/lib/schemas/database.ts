import { Schema } from 'effect';
import { fileTypeEnum } from '../../database/groups/file-schema';
import {
  communicationChannelEnum,
  cropPreferenceEnum,
  districtEnum,
  experienceLevelEnum,
  farmingMethodEnum,
  provinceEnum,
} from '../../database/schema';
import { FarmerId, FileId } from '../brands/database';
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

export const fileTypeSchema = Schema.Literal(...fileTypeEnum.enumValues);

export const fileDataSchema = Schema.Struct({
  id: FileId,
  fileName: Schema.String,
  originalFileName: Schema.String,
  fileSize: Schema.Number,
  mimeType: Schema.String,
  fileType: fileTypeSchema,
  uploadPath: Schema.String,
  url: Schema.String,
  uploadedAt: Schema.Date,
  uploadedBy: UserId,
  metadata: Schema.NullOr(
    Schema.Record({
      key: Schema.String,
      value: Schema.Unknown,
    })
  ),
});

export const fileInsertSchema = Schema.Struct({
  fileName: Schema.String,
  originalFileName: Schema.String,
  fileSize: Schema.Number,
  mimeType: Schema.String,
  fileType: fileTypeSchema,
  uploadPath: Schema.String,
  url: Schema.String,
  uploadedAt: Schema.Date,
  uploadedBy: UserId,
  metadata: Schema.UndefinedOr(
    Schema.Record({
      key: Schema.String,
      value: Schema.Unknown,
    })
  ),
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
