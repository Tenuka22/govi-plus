import type {
  SessionId as SessionIdSchema,
  UserId as UserIdSchema,
} from '../brands/user';
import type { userRoleSchema, userSchema } from '../schemas/auth';

export type UserId = typeof UserIdSchema.Type;
export type SessionId = typeof SessionIdSchema.Type;

export type UserRole = typeof userRoleSchema.Type;

export type User = typeof userSchema.Type;
