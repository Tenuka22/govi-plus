import { BetterAuth } from '@repo/shared/services/auth';
import { Effect } from 'effect';
import { serverRuntime } from '../runtimes/server';

const getAuthClient = Effect.gen(function* () {
  const auth = yield* BetterAuth;

  const authClient = yield* auth.getClient;

  return authClient;
});

export const auth = await serverRuntime.runPromise(getAuthClient);
