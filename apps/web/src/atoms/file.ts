import type { postPathReqFilePayload } from '@repo/shared/lib/schemas/payload';
import { withToast } from '@repo/shared/lib/toasted-atoms';
import { Effect } from 'effect';
import { webRuntimeAtom } from '@/runtimes/web-runtime';
import { ApiClient } from '@/services/api-client';

export const uploadFilesFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: { files: File[] }) {
      const apiClient = yield* ApiClient;

      yield* Effect.logDebug('Attempting file upload with args:', args);

      const formData = new FormData();
      for (const file of args.files) {
        formData.append('files', file);
      }

      const data = yield* apiClient.http.file['post-upload']({
        payload: formData,
      });

      yield* Effect.logDebug('File upload successful:', data);

      return data;
    },
    withToast({
      onFailure: (err) =>
        `File upload failed: ${err._tag === 'Some' && err.value.message}`,
      onSuccess: (res) => `Successfully uploaded ${res.length} file(s)!`,
      onWaiting: (args) => `Uploading ${args.files.length} file(s)...`,
    })
  )
);

export const getFilesFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* () {
      const apiClient = yield* ApiClient;
      yield* Effect.logDebug('Fetching all files...');
      const data = yield* apiClient.http.file.get({});
      yield* Effect.logDebug('Files fetched:', data);
      return data;
    },
    withToast({
      onFailure: () => 'Failed to fetch files.',
      onSuccess: (res) => `Fetched ${res.length} file(s).`,
      onWaiting: () => 'Loading files...',
    })
  )
);

export const deleteFileFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: { fileId: string }) {
      const apiClient = yield* ApiClient;
      yield* Effect.logDebug(`Deleting file with id: ${args.fileId}`);
      const data = yield* apiClient.http.file.del({
        payload: { ids: [args.fileId] },
      });
      yield* Effect.logDebug('File deleted:', data);
      return data;
    },
    withToast({
      onFailure: 'Failed to delete file.',
      onSuccess: () => 'File deleted successfully.',
      onWaiting: () => 'Deleting file...',
    })
  )
);

export const getFileTypeFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: { mimeType: string }) {
      const apiClient = yield* ApiClient;
      yield* Effect.logDebug(`Fetching type for mimeType: ${args.mimeType}`);
      const data = yield* apiClient.http.file['post-type']({
        payload: { mimeType: args.mimeType },
      });
      yield* Effect.logDebug('File type fetched:', data);
      return data;
    },
    withToast({
      onFailure: () => 'Failed to fetch file type.',
      onSuccess: (res) => `File type: ${res}`,
      onWaiting: () => 'Fetching file type...',
    })
  )
);

export const getFilePathFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof postPathReqFilePayload.Type) {
      const apiClient = yield* ApiClient;
      yield* Effect.logDebug(`Fetching path for file: ${args.fileName}`);
      const data = yield* apiClient.http.file['post-path']({ payload: args });
      yield* Effect.logDebug('File path fetched:', data);
      return data;
    },
    withToast({
      onFailure: () => 'Failed to fetch file path.',
      onSuccess: () => 'Fetched file path successfully.',
      onWaiting: () => 'Fetching file path...',
    })
  )
);
