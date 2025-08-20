import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from '@effect/platform';
import { BunHttpServer, BunRuntime } from '@effect/platform-bun';
import { ApiLive } from '@repo/domain/api-live';
import { ServerConfig } from '@repo/shared/services/config';
import { Effect, Layer, Logger, LogLevel } from 'effect';
import { applicationServiceLayers } from './runtimes/server';

const CorsEffect = Effect.gen(function* () {
  const serverConfig = yield* ServerConfig;
  const appConfig = yield* serverConfig.getAppConfig;
  const clientOrigin = appConfig.ApplicationInfo.WebOrigin;
  return HttpMiddleware.cors({
    credentials: true,
    allowedOrigins: [clientOrigin],
  });
});

const CorsLayer = HttpApiBuilder.middleware(CorsEffect);

const ServerLayer = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(CorsLayer),
  Layer.provideMerge(HttpServer.layerContext),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(Logger.minimumLogLevel(LogLevel.All)),
  Layer.provide(Logger.structured),
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
);

const program = Layer.launch(ServerLayer).pipe(
  Effect.provide(applicationServiceLayers)
);

BunRuntime.runMain(program);
