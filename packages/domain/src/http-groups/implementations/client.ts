import { HttpApiBuilder, HttpServerResponse } from '@effect/platform';
import { ServerConfig } from '@repo/shared/services/config';
import { Effect } from 'effect';
import { DomainApi } from '../../domain';

const REDIRECT_PREFIX_REGEX = /^\/client\/redirect\//;

export const ClientGroupLive = HttpApiBuilder.group(
  DomainApi,
  'client',
  (handlers) =>
    Effect.gen(function* () {
      const serverConfig = yield* ServerConfig;
      const env = yield* serverConfig.getEnv;
      const clientURL = yield* env.webClientURL;
      const serverURL = yield* env.serverURL;

      return handlers
        .handle('get', ({ request }) =>
          Effect.gen(function* () {
            const url = new URL(request.url, serverURL);

            const parts = yield* Effect.sync(() =>
              url.pathname
                .replace(REDIRECT_PREFIX_REGEX, '')
                .split('/')
                .filter(Boolean)
            );

            const redirectUrl = new URL(`${clientURL}/${parts.join('/')}`);

            yield* Effect.sync(() => {
              for (const [key, value] of url.searchParams.entries()) {
                redirectUrl.searchParams.set(key, value);
              }
            });

            return HttpServerResponse.redirect(redirectUrl);
          })
        )
        .handle('getRoot', ({ request }) =>
          Effect.gen(function* () {
            const url = new URL(request.url, serverURL);

            const error = url.searchParams.get('error');

            yield* Effect.logInfo(`Error param: ${error}`);

            if (error) {
              const redirectUrl = new URL(`${clientURL}/error`);
              redirectUrl.searchParams.set('error', error);
              return HttpServerResponse.redirect(redirectUrl.href);
            }

            const redirectUrl = new URL(clientURL);
            return HttpServerResponse.redirect(redirectUrl.href);
          })
        );
    })
);
