import { Schema } from 'effect';
import { SessionId, UserId } from '../brands/user';
import { EmailRegex } from '../regex';
import { createRegexParseErrorHandler } from '../utils';
import { permissionSchema } from './permission';

export const emailLoginFormSchema = Schema.Struct({
  email: Schema.NonEmptyTrimmedString.pipe(
    Schema.pattern(EmailRegex, {
      message: createRegexParseErrorHandler('Email'),
    })
  ),
  password: Schema.NonEmptyTrimmedString,
  name: Schema.String,
});

export const socialLoginFormSchema = Schema.Struct({
  provider: Schema.Literal('google', 'facebook'),
});

export const errorSchema = Schema.Struct({
  message: Schema.optional(Schema.String),
  statusText: Schema.optional(Schema.String),
  code: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Number),
});

export const authResponseSchema = Schema.Struct({
  data: Schema.optional(Schema.Unknown),
  error: Schema.optional(Schema.Unknown),
});

export const userRoleSchema = Schema.Literal('user', 'admin');

export const userProfileSchema = Schema.Struct({
  id: UserId,
  name: Schema.NonEmptyString,
  email: Schema.NonEmptyTrimmedString.pipe(
    Schema.pattern(EmailRegex, {
      message: createRegexParseErrorHandler('Email'),
    })
  ),
  emailVerified: Schema.Boolean,
  image: Schema.NullishOr(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  role: Schema.NullishOr(userRoleSchema),
  banned: Schema.NullishOr(Schema.Boolean),
  banReason: Schema.NullishOr(Schema.String),
  banExpires: Schema.NullishOr(Schema.Date),
});

export const userProfileFormSchema = Schema.Struct({
  email: Schema.NonEmptyTrimmedString.pipe(
    Schema.pattern(EmailRegex, {
      message: createRegexParseErrorHandler('Email'),
    })
  ),
  password: Schema.NonEmptyTrimmedString,
  name: Schema.String,
});

export const currentUserSchema = Schema.Struct({
  userId: UserId,
  sessionId: SessionId,
  role: userRoleSchema,
  permissions: Schema.SetFromSelf(permissionSchema),
});
