import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';

export class BetterAuthApi extends HttpApiGroup.make('auth')
  .add(HttpApiEndpoint.get('get', '/*'))
  .add(HttpApiEndpoint.post('post', '/*'))
  .prefix('/auth') {}
