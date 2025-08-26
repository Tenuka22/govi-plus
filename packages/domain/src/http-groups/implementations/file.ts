import { HttpApiBuilder } from '@effect/platform';
import { FileActions } from '@repo/shared/database/actions/file';
import { FileId } from '@repo/shared/lib/brands/database';
import { UserId } from '@repo/shared/lib/brands/user';
import { getItemsOwnedPermission } from '@repo/shared/lib/helpers/custom-permission';
import { fileDataSchema } from '@repo/shared/lib/schemas/database';
import { PolicyService } from '@repo/shared/services/policy';
import { Effect, Either, Schema } from 'effect';
import { DomainApi } from '../../domain';

export const FileGroupLive = HttpApiBuilder.group(
  DomainApi,
  'file',
  (handlers) =>
    handlers
      .handle('post-upload', (req) =>
        Effect.gen(function* () {
          const policies = yield* PolicyService;

          yield* policies.require('_file:create');

          const fileActions = yield* FileActions;

          const uploadData = yield* fileActions.uploadFiles(req.payload);

          const parsedData = Schema.decodeUnknownSync(
            Schema.Array(fileDataSchema)
          )(uploadData.uploadedFiles);

          return parsedData;
        })
      )
      .handle('get', () =>
        Effect.gen(function* () {
          const policies = yield* PolicyService;

          yield* policies.require('_file:select');

          const fileActions = yield* FileActions;

          const files = yield* fileActions.getFiles({});
          const parsedFiles = Schema.decodeUnknownSync(
            Schema.Array(fileDataSchema)
          )(
            files.map((f) => ({
              ...f,
              id: FileId.make(f.id),
              uploadedBy: UserId.make(f.uploadedBy),
            }))
          );

          return parsedFiles;
        })
      )
      .handle('del', (req) =>
        Effect.gen(function* () {
          const policies = yield* PolicyService;

          const ids = req.payload.ids.map((id: string) => FileId.make(id));
          const fileActions = yield* FileActions;

          const globalPermission = yield* Effect.either(
            policies.require('_file:delete')
          );

          if (Either.isRight(globalPermission)) {
            const result = yield* fileActions.deleteFiles(ids);
            return {
              deletedItems: result.deletedFiles.map((f) => f.id),
              unDeletedItems: result.failedFiles,
            };
          }

          yield* policies.require('_file:owned-delete');
          const selectedFiles = yield* fileActions.getFiles({ ids });

          const { ownedItems, unPermissionedItems } =
            yield* getItemsOwnedPermission(
              selectedFiles,
              (f) => FileId.make(f.id),
              (f) => UserId.make(f.uploadedBy)
            );

          if (ownedItems.length === 0) {
            return { deletedItems: [], unDeletedItems: unPermissionedItems };
          }

          const ownedFileIds = ownedItems.map((f) => FileId.make(f.id));
          const result = yield* fileActions.deleteFiles(ownedFileIds);

          const parsedData = {
            deletedItems: result.deletedFiles.map((f) => f.id),
            unDeletedItems: [
              ...result.failedFiles.map((f) => ({
                itemId: f.itemId,
                error: f.error,
              })),
              ...unPermissionedItems.map((i) => ({
                itemId: i.itemId,
                error: i.error,
              })),
            ],
          };

          return parsedData;
        })
      )
      .handle('post-type', (req) =>
        Effect.gen(function* () {
          const policies = yield* PolicyService;

          yield* policies.require('_file:select');

          const fileActions = yield* FileActions;
          const parsedType = yield* fileActions.getFileType(
            req.payload.mimeType
          );

          return parsedType;
        })
      )
      .handle('post-path', (req) =>
        Effect.gen(function* () {
          const policies = yield* PolicyService;

          yield* policies.require('_file:create');

          const fileActions = yield* FileActions;
          const path = yield* fileActions.generateUploadPath(
            req.payload.fileName,
            req.payload.userId
          );
          return path;
        })
      )
);
