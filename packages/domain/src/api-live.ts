import { HttpApiBuilder } from '@effect/platform';
import { Layer } from 'effect';
import { DomainApi } from './domain';
import { BetterAuthLive } from './http-groups/implementations/auth';
import { FarmerGroupLive } from './http-groups/implementations/farmer';
import { HeathGroupLive } from './http-groups/implementations/health';
import { PolicyLive } from './http-groups/implementations/policy';

const ApiImplementations = Layer.mergeAll(
  HeathGroupLive,
  BetterAuthLive,
  FarmerGroupLive,
  PolicyLive
);

export const ApiLive = HttpApiBuilder.api(DomainApi).pipe(
  Layer.provide(ApiImplementations)
);
