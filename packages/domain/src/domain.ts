import { HttpApi } from '@effect/platform';
import { BetterAuthApi } from './http-groups/definition/auth';
import { HealthGroup } from './http-groups/definition/health';

export class DomainApi extends HttpApi.make('domainApi')
  .add(HealthGroup)
  .add(BetterAuthApi) {}
