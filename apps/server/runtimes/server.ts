import { BetterAuthALive } from '@repo/shared/services/auth';
import { ServerConfigLive } from '@repo/shared/services/config';
import { DatabaseLive } from '@repo/shared/services/database';
import { DrizzleLive } from '@repo/shared/services/drizzle';
import { ResendLive } from '@repo/shared/services/resend';
import { Layer, ManagedRuntime } from 'effect';
import { EnvProviderLayer } from '../providers/env';

export const applicationServiceLayers = Layer.mergeAll(
  ServerConfigLive,
  DatabaseLive,
  ResendLive,
  BetterAuthALive,
  EnvProviderLayer,
  DrizzleLive
);

export const serverRuntime = ManagedRuntime.make(applicationServiceLayers);
