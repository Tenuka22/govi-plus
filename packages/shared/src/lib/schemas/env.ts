import { Schema } from 'effect';

const appEnvironment = Schema.Config(
  'APP_ENVIRONMENT',
  Schema.Literal('development', 'production', 'preview')
);

const authSecret = Schema.Config('AUTH_SECRET', Schema.String);

const databaseURL = Schema.Config(
  'DATABASE_URL',
  Schema.Redacted(Schema.String)
);

const resendApiKey = Schema.Config(
  'RESEND_API_KEY',
  Schema.Redacted(Schema.String)
);

const facebookClientId = Schema.Config('FACEBOOK_CLIENT_ID', Schema.String);

const facebookClientSecret = Schema.Config(
  'FACEBOOK_CLIENT_SECRET',
  Schema.Redacted(Schema.String)
);

const googleClientId = Schema.Config('GOOGLE_CLIENT_ID', Schema.String);

const googleClientSecret = Schema.Config(
  'GOOGLE_CLIENT_SECRET',
  Schema.Redacted(Schema.String)
);

const serverServerURL = Schema.Config('SERVER_URL', Schema.String);

const serverWebClientURL = Schema.Config('WEB_CLIENT_URL', Schema.String);

export const WebEnvSchema = Schema.Struct({
  NEXT_PUBLIC_SERVER_URL: Schema.String,
  NEXT_PUBLIC_WEB_CLIENT_URL: Schema.String,
});

export const ServerEnvSchema = {
  appEnvironment,
  resendApiKey,
  facebookClientId,
  facebookClientSecret,
  googleClientId,
  googleClientSecret,
  databaseURL,
  authSecret,
  serverURL: serverServerURL,
  webClientURL: serverWebClientURL,
};
