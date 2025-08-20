import { HttpApi } from '@effect/platform';
import { BetterAuthApi } from './http-groups/definition/auth';
import { HealthGroup } from './http-groups/definition/health';
import { PolicyGroup } from './http-groups/definition/policy';

export class DomainApi extends HttpApi.make('domainApi')
  .add(HealthGroup)
  .add(BetterAuthApi)
  .add(PolicyGroup) {}
