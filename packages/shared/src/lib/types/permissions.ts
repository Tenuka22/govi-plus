import type { HttpServerRequest } from '@effect/platform';
import type { PgDrizzle } from '@effect/sql-drizzle/Pg';
import type { Effect } from 'effect';
import type { ForbiddenError } from '../../errors/auth';
import type { BetterAuth } from '../../services/auth';
import type { ServerConfig } from '../../services/config';
import type { CurrentUser } from '../../services/current-user';
import type { Resend } from '../../services/resend';
import type { permissionSchema } from '../schemas/permission';

export type UserPermission = typeof permissionSchema.Type;

export type PermissionAction = 'select' | 'delete' | 'update';

export type PermissionConfig = Record<string, readonly PermissionAction[]>;

export type InferPermissions<T extends PermissionConfig> = {
  [K in keyof T]: T[K][number] extends PermissionAction
    ? `${K & string}:${T[K][number]}`
    : never;
}[keyof T];

export type Policy<E = never, R = never> = Effect.Effect<
  void,
  E | ForbiddenError,
  | CurrentUser
  | BetterAuth
  | ServerConfig
  | PgDrizzle
  | Resend
  | HttpServerRequest.HttpServerRequest
  | R
>;
