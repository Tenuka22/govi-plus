import { FetchHttpClient, HttpApiClient, HttpClient } from '@effect/platform';
import { DomainApi } from '@repo/domain/domain';
import { Duration, Effect, Random, Schedule } from 'effect';

export class ApiClient extends Effect.Service<ApiClient>()('web/api-client', {
  dependencies: [FetchHttpClient.layer],
  scoped: Effect.gen(function* () {
    return {
      http: yield* HttpApiClient.make(DomainApi, {
        baseUrl: 'http://localhost:3000',
        transformClient: (client) =>
          client.pipe(
            HttpClient.transformResponse(
              Effect.fnUntraced(function* (response) {
                if (process.env.NODE_ENV === 'development') {
                  const sleepFor = yield* Random.nextRange(200, 500);
                  yield* Effect.sleep(Duration.millis(sleepFor));
                }
                return yield* response;
              })
            ),
            HttpClient.retryTransient({
              times: 3,
              schedule: Schedule.exponential('100 millis'),
            })
          ),
      }),
    } as const;
  }),
}) {}
