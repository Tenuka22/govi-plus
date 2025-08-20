import { BetterAuth } from '@repo/shared/services/auth';
import { Effect } from 'effect';
import { applicationServiceLayers } from '../runtimes/server';

const getAuthClient = Effect.gen(function* () {
  const auth = yield* BetterAuth;

  const authClient = yield* auth.getClient;

  return authClient;
});

export const auth = await Effect.runPromise(
  getAuthClient.pipe(Effect.provide(applicationServiceLayers))
);
