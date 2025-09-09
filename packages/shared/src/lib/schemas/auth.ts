import { Schema } from 'effect';
import { EmailRegex } from '../regex/auth';
import { createRegexParseErrorHandler } from '../regex/utils';

export const emailLogInFormSchema = Schema.Struct({
  email: Schema.NonEmptyTrimmedString.pipe(
    Schema.pattern(EmailRegex, {
      message: createRegexParseErrorHandler('Email'),
    })
  ),
  password: Schema.NonEmptyTrimmedString,
  name: Schema.optional(Schema.NonEmptyTrimmedString),
});

export const socialLoginFormSchema = Schema.Struct({
  provider: Schema.Literal('google', 'facebook'),
});
