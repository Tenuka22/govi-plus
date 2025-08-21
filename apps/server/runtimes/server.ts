import { FarmerActionImplementations } from '@repo/shared/database/actions/farmer';
import { BetterAuthALive } from '@repo/shared/services/auth';
import { ServerConfigLive } from '@repo/shared/services/config';
import { CurrentUserLive } from '@repo/shared/services/current-user';
import { DatabaseLive } from '@repo/shared/services/database';
import { DrizzleLive } from '@repo/shared/services/drizzle';
import { PolicyServiceLive } from '@repo/shared/services/policy';
import { ResendLive } from '@repo/shared/services/resend';
import { Layer } from 'effect';
import { EnvProviderLayer } from '../providers/env';

const baseServiceLayers = Layer.mergeAll(
  EnvProviderLayer,
  ServerConfigLive,
  PolicyServiceLive
);

const databaseServiceLayers = Layer.mergeAll(DatabaseLive, DrizzleLive).pipe(
  Layer.provide(baseServiceLayers)
);

const databaseActionsLayer = Layer.mergeAll(FarmerActionImplementations);

const authServiceLayers = Layer.mergeAll(BetterAuthALive, CurrentUserLive).pipe(
  Layer.provide(databaseServiceLayers)
);

export const applicationServiceLayers = Layer.mergeAll(
  ResendLive,
  authServiceLayers,
  databaseServiceLayers,
  baseServiceLayers,
  databaseActionsLayer
);
