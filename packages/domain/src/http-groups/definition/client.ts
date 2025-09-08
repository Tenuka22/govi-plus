import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';

export class ClientGroup extends HttpApiGroup.make('client')
  .add(HttpApiEndpoint.get('get', '/redirect/:rest*'))
  .add(HttpApiEndpoint.get('getRoot', '/redirect'))
  .prefix('/client') {}
