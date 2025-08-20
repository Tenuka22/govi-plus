import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { UnauthorizedError } from '@repo/shared/errors/auth';
import { UserId } from '@repo/shared/lib/brands/user';
import { permissionSchema } from '@repo/shared/lib/schemas/permission';
import { Schema } from 'effect';

export class PolicyGroup extends HttpApiGroup.make('policy')
  .add(
    HttpApiEndpoint.get('get', '/')
      .addSuccess(
        Schema.Struct({
          userId: UserId,
          permissions: Schema.Set(permissionSchema),
        })
      )
      .addError(UnauthorizedError)
  )
  .prefix('/policy') {}
