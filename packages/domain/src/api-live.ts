import { HttpApiBuilder } from '@effect/platform';
import { Layer } from 'effect';
import { DomainApi } from './domain';
import { BetterAuthLive } from './http-groups/implementations/auth';
import { HeathGroupLive } from './http-groups/implementations/health';

const ApiImplementations = Layer.mergeAll(HeathGroupLive, BetterAuthLive);

export const ApiLive = HttpApiBuilder.api(DomainApi).pipe(
  Layer.provide(ApiImplementations)
);
