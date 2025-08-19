import { Schema } from 'effect';

export const validateVariable = (name: string) =>
  Schema.decodeUnknownSync(Schema.String)(process.env[name]);
