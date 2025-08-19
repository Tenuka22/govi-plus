import { HttpApiBuilder } from '@effect/platform';
import { Effect } from 'effect';
import { DomainApi } from '../../domain';

export const HeathGroupLive = HttpApiBuilder.group(
  DomainApi,
  'health',
  (handlers) =>
    Effect.gen(function* () {
      return handlers.handle('get', () => Effect.succeed('Ok'));
    })
);
