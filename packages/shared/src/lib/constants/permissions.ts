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
  __test: ['select', 'update', 'delete'],
} as const);

export const rolePermissions: Record<UserRole, typeof Permissions> = {
  admin: ['__test:select'],
  user: ['__test:select'],
};
