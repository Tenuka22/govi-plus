import type { UserRole } from '../types/auth';
import type { InferPermissions, PermissionConfig } from '../types/permissions';

export const makePermissions = <T extends PermissionConfig>(
  config: T
): InferPermissions<T>[] => {
  return Object.entries(config).flatMap(([domain, actions]) =>
    actions.map((action) => `${domain}:${action}` as InferPermissions<T>)
  );
};

export const Permissions = makePermissions({
  _farmer: [
    'select',
    'update',
    'delete',
    'owned-update',
    'owned-delete',
    'create',
  ],
  _file: [
    'select',
    'update',
    'delete',
    'owned-update',
    'owned-delete',
    'create',
  ],
} as const);

export const rolePermissions: Record<UserRole, typeof Permissions> = {
  admin: [
    '_farmer:select',
    '_farmer:delete',
    '_farmer:update',
    '_farmer:owned-delete',
    '_farmer:owned-update',
    '_farmer:create',
    '_file:select',
    '_file:delete',
    '_file:update',
    '_file:owned-delete',
    '_file:owned-update',
    '_file:create',
  ],
  user: [
    '_farmer:owned-delete',
    '_farmer:owned-update',
    '_farmer:select',
    '_file:select',
    '_file:create',
    '_file:owned-delete',
  ],
};
