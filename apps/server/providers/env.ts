import { PlatformConfigProvider } from '@effect/platform';
import { BunFileSystem } from '@effect/platform-bun';
import { Effect, Layer } from 'effect';

export const EnvProviderLayer = Layer.unwrapEffect(
  PlatformConfigProvider.fromDotEnv('.env').pipe(
    Effect.map(Layer.setConfigProvider),
    Effect.provide(BunFileSystem.layer)
  )
);
