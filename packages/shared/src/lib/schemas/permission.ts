import { Schema } from 'effect';
import { Permissions } from '../constants/permissions';

export const permissionSchema = Schema.Literal(...Permissions).annotations({
  identifier: 'Permission',
});
