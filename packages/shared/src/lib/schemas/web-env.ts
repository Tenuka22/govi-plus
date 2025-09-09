import { Schema } from 'effect';

export const WebEnvSchema = Schema.Struct({
  NEXT_PUBLIC_SERVER_URL: Schema.String,
  NEXT_PUBLIC_WEB_CLIENT_URL: Schema.String,
});
