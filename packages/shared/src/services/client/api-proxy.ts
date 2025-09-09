import { Context, Effect, Layer } from 'effect';

export class ApiProxy extends Context.Tag('ApiProxy')<
  ApiProxy,
  {
    readonly get: (
      endpoint: string,
      requireAuth?: boolean
    ) => Effect.Effect<{ data: unknown; status: number }>;
    readonly post: (
      endpoint: string,
      body: unknown,
      requireAuth?: boolean
    ) => Effect.Effect<{ data: unknown; status: number }>;
    readonly put: (
      endpoint: string,
      body: unknown,
      requireAuth?: boolean
    ) => Effect.Effect<{ data: unknown; status: number }>;
    readonly del: (
      endpoint: string,
      requireAuth?: boolean
    ) => Effect.Effect<{ data: unknown; status: number }>;
  }
>() {}

const request = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  getToken: () => Promise<string>,
  body?: unknown,
  requireAuth?: boolean
): Effect.Effect<{ data: unknown; status: number }> =>
  Effect.gen(function* () {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = yield* Effect.promise(async () => await getToken());

    if (requireAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = yield* Effect.promise(() =>
        fetch(endpoint, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })
      );

      const data = yield* Effect.promise(() => response.json());
      return { data, status: response.status };
    } catch (error) {
      return {
        data: { message: 'Cannot reach API server', error },
        status: 500,
      };
    }
  });

export const ApiProxyLive = (getToken: () => Promise<string>) =>
  Layer.succeed(ApiProxy, {
    get: (endpoint, requireAuth = false) =>
      request('GET', endpoint, getToken, undefined, requireAuth),

    post: (endpoint, body, requireAuth = false) =>
      request('POST', endpoint, getToken, body, requireAuth),

    put: (endpoint, body, requireAuth = false) =>
      request('PUT', endpoint, getToken, body, requireAuth),

    del: (endpoint, requireAuth = false) =>
      request('DELETE', endpoint, getToken, undefined, requireAuth),
  });
