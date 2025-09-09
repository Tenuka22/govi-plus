import { Atom } from '@effect-atom/atom-react';
import { ApiProxyLive } from '@workspace/shared/services/client/api-proxy';
import { WebConfigLive } from '@workspace/shared/services/config';
import { Layer, ManagedRuntime } from 'effect';
import { getToken } from '@/app/(root)/actions/auth';

const WebRequirements = Layer.mergeAll(
  ApiProxyLive(getToken),
  WebConfigLive({
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_WEB_CLIENT_URL: process.env.NEXT_PUBLIC_WEB_CLIENT_URL,
  })
);

export const webRuntime = ManagedRuntime.make(WebRequirements);

export const webRuntimeAtom = Atom.runtime(WebRequirements);
