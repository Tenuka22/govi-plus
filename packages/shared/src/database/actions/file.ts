import { FileSystem, HttpServerRequest, Path } from '@effect/platform';
import type { PersistedFile } from '@effect/platform/Multipart';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';
import { and, eq, inArray, type sql } from 'drizzle-orm';
import { Context, Effect, Layer, Schema } from 'effect';
import {
  DrizzleEmptyInsertError,
  DrizzleInsertError,
  DrizzleSelectError,
} from '../../errors/database';
import { FileUploadError, FileValidationError } from '../../errors/file';
import { FileId } from '../../lib/brands/database';
import { UserId } from '../../lib/brands/user';
import {
  fileDataSchema,
  type fileInsertSchema,
  type fileTypeSchema,
} from '../../lib/schemas/database';
import type { postUploadReqFilePayload } from '../../lib/schemas/payload';
import { CurrentUser } from '../../services/current-user';
import { files } from '../groups/file-schema';

type FileType = typeof fileTypeSchema.Type;

const defaultServerConfig = {
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: ['image', 'document', 'video', 'audio'],
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'audio/mp3',
    'audio/wav',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  uploadPath: 'uploads',
};

const getFileType = (mimeType: string) =>
  Effect.gen(function* () {
    if (mimeType.startsWith('image/')) {
      return 'image' as FileType;
    }
    if (mimeType.startsWith('video/')) {
      return 'video' as FileType;
    }
    if (mimeType.startsWith('audio/')) {
      return 'audio' as FileType;
    }
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text') ||
      mimeType.includes('msword') ||
      mimeType.includes('spreadsheet')
    ) {
      return 'document' as FileType;
    }
    if (
      mimeType.includes('zip') ||
      mimeType.includes('rar') ||
      mimeType.includes('tar') ||
      mimeType.includes('gzip')
    ) {
      return 'archive' as FileType;
    }

    return yield* Effect.fail(
      new FileUploadError({
        message: `Unsupported file type: ${mimeType}`,
        code: 'INVALID_FILE_TYPE',
      })
    );
  });

const getFileSize = (file: PersistedFile) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const stats = yield* fs.stat(file.path);
    return Number(stats.size);
  });

const validateFile = (file: PersistedFile) =>
  Effect.gen(function* () {
    const violations: string[] = [];

    const size = yield* getFileSize(file);
    const mimeType = file.contentType;

    if (size > defaultServerConfig.maxFileSize) {
      violations.push(
        `File size ${size} bytes exceeds maximum allowed size of ${defaultServerConfig.maxFileSize} bytes`
      );
    }

    const fileType = yield* getFileType(mimeType).pipe(
      Effect.catchAll(() => Effect.succeed('document' as FileType))
    );

    if (!defaultServerConfig.allowedFileTypes.includes(fileType)) {
      violations.push(`File type ${fileType} is not allowed`);
    }

    if (!defaultServerConfig.allowedMimeTypes.includes(mimeType)) {
      violations.push(`MIME type ${mimeType} is not allowed`);
    }

    if (!file.name || file.name.length === 0) {
      violations.push('File name is required');
    }

    if (violations.length > 0) {
      return yield* Effect.fail(
        new FileValidationError({
          message: 'File validation failed',
          violations,
          fileName: file.name,
        })
      );
    }

    return file;
  });

const generateUploadPath = (fileName: string, userId: typeof UserId.Type) =>
  Effect.sync(
    () =>
      `${defaultServerConfig.uploadPath}/${userId}/${Date.now()}-${fileName}`
  );

const uploadToStorage = (file: PersistedFile, filePath: string) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;

    const serverDir = path.resolve('server/images');
    yield* fs.makeDirectory(serverDir, { recursive: true });

    const buffer = yield* fs.readFile(file.path);
    const fullPath = path.join(serverDir, filePath);

    yield* fs.writeFile(fullPath, buffer);

    return `/images/${filePath}`;
  });

const deleteFromStorage = (filePath: string) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;

    const fullPath = path.resolve('server/images', filePath);
    yield* fs.remove(fullPath);
  });

const createFileFn = (payload: typeof fileInsertSchema.Type) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;
    const [file] = yield* Effect.tryPromise({
      try: async () => drizzleClient.insert(files).values(payload).returning(),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleInsertError({
              values: payload,
              message: e.message,
            })
          : new DrizzleInsertError({ values: payload }),
    });
    if (!file) {
      return yield* Effect.fail(new DrizzleEmptyInsertError());
    }
    return file;
  });

const getFilesFn = (filters?: {
  uploadedBy?: string;
  ids?: string[];
  fileType?: typeof fileTypeSchema.Type;
}) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;
    const conditions: ReturnType<typeof sql>[] = [];

    if (filters?.uploadedBy) {
      conditions.push(eq(files.uploadedBy, filters.uploadedBy));
    }

    if (filters?.ids && filters.ids.length > 0) {
      conditions.push(inArray(files.id, filters.ids));
    }

    if (filters?.fileType) {
      conditions.push(eq(files.fileType, filters.fileType));
    }

    const query =
      conditions.length > 0
        ? drizzleClient
            .select()
            .from(files)
            .where(and(...conditions))
        : drizzleClient.select().from(files);

    const allFiles = yield* Effect.tryPromise({
      try: async () =>
        query.execute().then((v) =>
          v.map((file) => ({
            ...file,
            uploadedBy: UserId.make(file.uploadedBy),
            id: FileId.make(file.id),
          }))
        ),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleSelectError({ filters, message: e.message })
          : new DrizzleSelectError({ filters }),
    });

    return allFiles;
  });

const updateFilesFn = (payload: {
  ids: string[];
  data: Partial<typeof fileInsertSchema.Type>;
}) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const failedToUpdate: { itemId: string; error: string }[] = [];

    const updateResults: {
      itemId: typeof FileId.Type;
      result: 'success' | 'error';
    }[] = yield* Effect.all(
      payload.ids.map((id) =>
        Effect.tryPromise({
          try: async () =>
            drizzleClient
              .update(files)
              .set(payload.data)
              .where(eq(files.id, id))
              .returning()
              .then((v) =>
                v[0]
                  ? { itemId: FileId.make(id), result: 'success' as const }
                  : { itemId: FileId.make(id), result: 'error' as const }
              ),
          catch: (e) => {
            failedToUpdate.push({
              itemId: FileId.make(id),
              error:
                e instanceof Error
                  ? e.message
                  : `Unknown error updating file ${id}`,
            });
            return { itemId: FileId.make(id), result: 'error' as const };
          },
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed({
              itemId: FileId.make(id),
              result: 'error' as const,
            })
          )
        )
      )
    );

    const successfullyUpdated = updateResults
      .map((r) => {
        if (r.result === 'error') {
          failedToUpdate.push({
            itemId: r.itemId,
            error: "Server didn't return the updated file",
          });
          return null;
        }
        return r.itemId;
      })
      .filter((id): id is typeof FileId.Type => !!id);

    return {
      updatedItems: successfullyUpdated,
      unUpdatedItems: failedToUpdate,
    };
  });

const dbDeleteFilesFn = (payload: { ids: string[] }) =>
  Effect.gen(function* () {
    const drizzleClient = yield* PgDrizzle;

    const failedToDelete: { itemId: typeof FileId.Type; error: string }[] = [];

    const deleteResults: {
      itemId: typeof FileId.Type;
      result: 'success' | 'error';
    }[] = yield* Effect.all(
      payload.ids.map((id) =>
        Effect.tryPromise({
          try: async () =>
            drizzleClient
              .delete(files)
              .where(eq(files.id, id))
              .returning()
              .then((v) =>
                v[0]
                  ? {
                      itemId: FileId.make(id),
                      result: 'success' as const,
                    }
                  : { itemId: FileId.make(id), result: 'error' as const }
              ),
          catch: (e) => {
            failedToDelete.push({
              itemId: FileId.make(id),
              error:
                e instanceof Error
                  ? e.message
                  : `Unknown error while deleting file ${id}`,
            });
            return { itemId: FileId.make(id), result: 'error' as const };
          },
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed({
              itemId: FileId.make(id),
              result: 'error' as const,
            })
          )
        )
      )
    );

    const successfullyDeleted = deleteResults
      .map((r) => {
        if (r.result === 'error') {
          failedToDelete.push({
            itemId: r.itemId,
            error: "Server didn't return the deleted file",
          });
          return null;
        }
        return r.itemId;
      })
      .filter((v) => v !== null)
      .filter((id): id is typeof FileId.Type => !!id);

    return {
      deletedItems: successfullyDeleted,
      unDeletedItems: failedToDelete,
    };
  });

const uploadFilesFn = (payload: typeof postUploadReqFilePayload.Type) =>
  Effect.gen(function* () {
    const { files: payloadFiles } = payload;
    const failedFiles: { itemid: string; error: string }[] = [];
    const uploadedFiles: (typeof fileDataSchema.Type)[] = [];

    const results = yield* Effect.all(
      payloadFiles.map((file) =>
        Effect.gen(function* () {
          const currentUser = yield* CurrentUser;
          const user = yield* currentUser.user;

          const validatedFile = yield* validateFile(file);

          const uploadPath = yield* generateUploadPath(
            validatedFile.name,
            user.userId
          );
          const fileUrl = yield* uploadToStorage(validatedFile, uploadPath);
          const fileType = yield* getFileType(validatedFile.contentType);

          const savedFile = yield* createFileFn({
            fileName: uploadPath,
            originalFileName: validatedFile.name,
            fileSize: yield* getFileSize(validatedFile),
            mimeType: validatedFile.contentType,
            fileType,
            uploadPath,
            url: fileUrl,
            uploadedAt: new Date(),
            uploadedBy: user.userId,
            metadata: {
              userAgent: yield* Effect.map(
                HttpServerRequest.HttpServerRequest,
                (req) => ({
                  key: 'userAgent',
                  value: req.headers['user-agent'] || 'unknown',
                })
              ),
            },
          });

          const parsedSaveFile = yield* Schema.decodeUnknown(fileDataSchema)(
            {
              ...savedFile,
              id: FileId.make(savedFile.id),
              uploadedBy: UserId.make(savedFile.uploadedBy),
            },
            { errors: 'all' }
          );

          return {
            error: null,
            success: true,
            file: parsedSaveFile,
            originalFile: file,
          };
        }).pipe(
          Effect.catchAll((error) =>
            Effect.succeed({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              file: null,
              originalFile: file,
            })
          )
        )
      )
    );

    for (const result of results) {
      if (result.success && result.file) {
        uploadedFiles.push(result.file);
      } else {
        failedFiles.push({
          itemid: result.originalFile.name,
          error: result.error ?? 'Unknown error occurred when pushing file',
        });
      }
    }

    return {
      uploadedFiles,
      failedFiles,
    };
  });

const deleteFilesFn = (fileIds: string[]) =>
  Effect.gen(function* () {
    const serverFiles = yield* getFilesFn({ ids: fileIds });

    const parsedFiles = Schema.decodeUnknownSync(Schema.Array(fileDataSchema))(
      serverFiles.map((file) => ({
        ...file,
        id: FileId.make(file.id),
        uploadedBy: UserId.make(file.uploadedBy),
      }))
    );

    const storageResults = yield* Effect.all(
      parsedFiles.map((file) =>
        deleteFromStorage(file.fileName).pipe(
          Effect.map(() => ({
            success: true,
            fileId: file.id,
            error: null,
          })),
          Effect.catchAll((error) =>
            Effect.succeed({
              success: false,
              fileId: file.id,
              error:
                error instanceof Error
                  ? error.message
                  : 'Storage deletion failed',
            })
          )
        )
      )
    );

    const dbResult = yield* dbDeleteFilesFn({ ids: fileIds });

    const failedFiles: { itemId: typeof FileId.Type; error: string }[] = [];
    const deletedFiles: (typeof fileDataSchema.Type)[] = [];

    for (const result of storageResults) {
      if (!result.success) {
        failedFiles.push({
          itemId: result.fileId,
          error: result.error ?? 'Unknown error',
        });
      }
    }

    for (const item of dbResult.unDeletedItems) {
      failedFiles.push({
        itemId: item.itemId,
        error: item.error,
      });
    }

    const successfullyDeletedIds = dbResult.deletedItems;
    for (const file of parsedFiles) {
      if (successfullyDeletedIds.includes(file.id)) {
        deletedFiles.push(file);
      }
    }

    return { deletedFiles, failedFiles };
  });

const deleteFileFn = (id: string) =>
  Effect.gen(function* () {
    const result = yield* dbDeleteFilesFn({ ids: [id] });

    if (result.unDeletedItems.length > 0) {
      return yield* Effect.fail(
        new DrizzleInsertError({
          values: { id },
          message: result.unDeletedItems[0]?.error,
        })
      );
    }

    const drizzleClient = yield* PgDrizzle;
    const deleted = yield* Effect.tryPromise({
      try: async () =>
        drizzleClient.delete(files).where(eq(files.id, id)).returning(),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleInsertError({ values: { id }, message: e.message })
          : new DrizzleInsertError({ values: { id } }),
    });

    return deleted[0] ?? null;
  });

const updateFileFn = (
  id: string,
  updates: Partial<typeof fileInsertSchema.Type>
) =>
  Effect.gen(function* () {
    const result = yield* updateFilesFn({ ids: [id], data: updates });

    if (result.unUpdatedItems.length > 0) {
      return yield* Effect.fail(
        new DrizzleInsertError({
          values: updates,
          message: result.unUpdatedItems[0]?.error,
        })
      );
    }

    const drizzleClient = yield* PgDrizzle;
    const updated = yield* Effect.tryPromise({
      try: async () =>
        drizzleClient
          .update(files)
          .set(updates)
          .where(eq(files.id, id))
          .returning(),
      catch: (e) =>
        e instanceof Error
          ? new DrizzleInsertError({ values: updates, message: e.message })
          : new DrizzleInsertError({ values: updates }),
    });

    return updated[0] ?? null;
  });

export class FileActions extends Context.Tag('FileActions')<
  FileActions,
  {
    createFile: typeof createFileFn;
    getFiles: typeof getFilesFn;
    updateFile: typeof updateFileFn;
    updateFiles: typeof updateFilesFn;
    deleteFile: typeof deleteFileFn;
    deleteFiles: typeof deleteFilesFn;
    uploadFiles: typeof uploadFilesFn;
    validateFile: typeof validateFile;
    getFileType: typeof getFileType;
    generateUploadPath: typeof generateUploadPath;
  }
>() {}

export const FileActionImplementations = Layer.succeed(FileActions, {
  createFile: createFileFn,
  getFiles: getFilesFn,
  updateFile: updateFileFn,
  updateFiles: updateFilesFn,
  deleteFile: deleteFileFn,
  deleteFiles: deleteFilesFn,
  uploadFiles: uploadFilesFn,
  validateFile,
  getFileType,
  generateUploadPath,
});
