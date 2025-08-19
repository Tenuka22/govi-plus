import { Context, Schema } from 'effect';
import { UserId } from '../brands/user';

export class User extends Schema.Class<User>('User')({ userId: UserId }) {}

export class CurrentUser extends Context.Tag('CurrentUser')<
  CurrentUser,
  User
>() {}
