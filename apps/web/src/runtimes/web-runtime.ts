import { Atom } from '@effect-atom/atom-react';
import { BetterAuthALive } from '@repo/shared/services/auth-client';
import { WebConfigLive } from '@repo/shared/services/config';
import { Layer, ManagedRuntime } from 'effect';
import { ApiClient } from '@/services/api-client';

const WebRequirements = Layer.mergeAll(
  ApiClient.Default,
  BetterAuthALive,
  WebConfigLive({
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_WEB_CLIENT_URL: process.env.NEXT_PUBLIC_WEB_CLIENT_URL,
  })
);

export const webRuntime = ManagedRuntime.make(WebRequirements);

export const webRuntimeAtom = Atom.runtime(WebRequirements);
