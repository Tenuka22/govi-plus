import { type ConfigError, Context, Effect, Layer, Redacted } from 'effect';
import { Resend as ResendClient } from 'resend';
import { ServerConfig } from './config';
export class Resend extends Context.Tag('Resend')<
  Resend,
  {
    readonly getClient: Effect.Effect<
      ResendClient,
      ConfigError.ConfigError,
      ServerConfig
    >;
  }
>() {}

export const ResendLive = Layer.succeed(Resend, {
  getClient: Effect.gen(function* () {
    const config = yield* ServerConfig;
    const env = yield* config.getEnv;
    const RESEND_API_KEY = yield* env.resendApiKey;

    const resnedClient = new ResendClient(Redacted.value(RESEND_API_KEY));

    return resnedClient;
  }),
});
