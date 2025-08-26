import { useAtomSet } from '@effect-atom/atom-react';
import { FileId } from '@repo/shared/lib/brands/database';
import type { fileDataSchema } from '@repo/shared/lib/schemas/database';
import { Button } from '@workspace/ui/components/button';
import Spinner from '@workspace/ui/design-system/spinner';
import { Paperclip } from 'lucide-react';
import { type JSX, useCallback, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { uploadFilesFnAtom } from '@/atoms/file';

type UploadedFile = typeof fileDataSchema.Type;

export const FILE_TYPE_OPTIONS = {
  all: {
    label: 'All Files',
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
      'application/pdf': [],
      'text/*': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
  },
  images: {
    label: 'Images Only',
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
  },
  videos: {
    label: 'Videos Only',
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogv'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
    },
  },
  audio: {
    label: 'Audio Only',
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'audio/mp4': ['.m4a'],
      'audio/webm': ['.weba'],
    },
  },
  documents: {
    label: 'Documents Only',
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
  },
  text: {
    label: 'Text Files Only',
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'text/html': ['.html'],
      'text/css': ['.css'],
      'text/javascript': ['.js'],
      'application/typescript': ['.ts'],
    },
  },
  custom: {
    label: 'Custom Types',
    accept: {},
  },
} as const;

export type FileTypeOption = keyof typeof FILE_TYPE_OPTIONS;

interface FileUploadClientProps {
  uploadButton?: (props: {
    uploading: boolean;
    children?: React.ReactNode;
    onClick: () => void;
  }) => JSX.Element;
  value: File[];
  onChange: (files: File[]) => void;
  children?: React.ReactNode;
  onUploadComplete?: (uploadedFiles: UploadedFile[]) => void;
  onUploadTrigger?: (upload: () => Promise<UploadedFile[]>) => void;
  maxSize?: number;
  multiple?: boolean;
  allowedMimeTypes?: string[];
  fileTypeOption?: FileTypeOption;
}

const FileUploadClient = ({
  onChange,
  value,
  uploadButton: UploadButton,
  children,
  onUploadComplete,
  onUploadTrigger,
  maxSize = 100 * 1024 * 1024,
  multiple = true,
  allowedMimeTypes,
  fileTypeOption = 'all',
}: FileUploadClientProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFilesFn = useAtomSet(uploadFilesFnAtom, {
    mode: 'promise',
  });

  const getAcceptObject = useCallback(() => {
    if (fileTypeOption === 'custom' && allowedMimeTypes) {
      const customAccept: Record<string, string[]> = {};
      for (const mimeType of allowedMimeTypes) {
        customAccept[mimeType] = [];
      }
      return customAccept;
    }
    return FILE_TYPE_OPTIONS[fileTypeOption].accept;
  }, [fileTypeOption, allowedMimeTypes]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newFiles = multiple
          ? [...value, ...acceptedFiles]
          : acceptedFiles;
        onChange(newFiles);
        toast.success(`Selected ${acceptedFiles.length} file(s)`);
      }
    },
    [value, onChange, multiple]
  );

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    for (const { file, errors } of rejectedFiles) {
      for (const error of errors) {
        switch (error.code) {
          case 'file-too-large':
            toast.error(`${file.name}: File is too large`);
            break;
          case 'file-invalid-type':
            toast.error(`${file.name}: File type not allowed`);
            break;
          case 'too-many-files':
            toast.error('Too many files selected');
            break;
          default:
            toast.error(`${file.name}: ${error.message}`);
        }
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      accept: getAcceptObject(),
      maxSize,
      multiple: multiple ?? true,
      noClick: !!children || !!UploadButton,
    });

  const uploadFiles = useCallback(async (): Promise<UploadedFile[]> => {
    if (value.length === 0) {
      toast.error('No files selected');
      return [];
    }

    setIsUploading(true);

    try {
      const uploadedFiles = await uploadFilesFn({
        files: value,
      });

      const uploaded = uploadedFiles.map((file) => ({
        ...file,
        id: FileId.make(file.id),
        uploadedAt: new Date(file.uploadedAt),
      }));

      if (onUploadComplete) {
        onUploadComplete(uploaded);
      }

      toast.success(`Successfully uploaded ${uploaded.length} file(s)`);
      onChange([]);
      setIsUploading(false);

      return uploaded;
    } catch (error) {
      setIsUploading(false);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return [];
    }
  }, [value, uploadFilesFn, onChange, onUploadComplete]);

  if (onUploadTrigger) {
    onUploadTrigger(uploadFiles);
  }

  const handleButtonClick = useCallback(() => {
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    input?.click();
  }, []);

  const renderUploadArea = () => {
    if (children) {
      return children;
    }

    if (UploadButton) {
      return (
        <UploadButton onClick={handleButtonClick} uploading={isUploading} />
      );
    }

    return (
      <Button
        disabled={isUploading}
        onClick={handleButtonClick}
        size="icon"
        type="button"
        variant="outline"
      >
        {isUploading ? (
          <Spinner className="size-4" />
        ) : (
          <Paperclip className="size-4" />
        )}
        <span className="sr-only">Attach files</span>
      </Button>
    );
  };

  const renderSelectedFiles = () => {
    if (value.length === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <h4 className="mb-2 font-medium text-sm">Selected Files:</h4>
        <ul className="space-y-1">
          {value.map((file, index) => (
            <li
              className="flex items-center justify-between text-gray-600 text-xs"
              key={file.name}
            >
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => {
                  const newFiles = value.filter((_, i) => i !== index);
                  onChange(newFiles);
                }}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps({
          className: `
            ${isDragActive ? 'border-2 border-primary border-dashed bg-primary/10' : ''} 
            ${isDragReject ? 'border-2 border-destructive border-dashed bg-destructive/10' : ''} 
            ${isDragActive || isDragReject ? 'rounded-lg p-4' : ''}
          `,
        })}
      >
        <input {...getInputProps()} />
        {renderUploadArea()}
        {(isDragActive || isDragReject) && (
          <div className="mt-2 text-center">
            <p className="text-sm">
              {isDragReject
                ? 'Some files are not allowed'
                : `Drop your ${FILE_TYPE_OPTIONS[fileTypeOption].label.toLowerCase()} here`}
            </p>
          </div>
        )}
      </div>
      {renderSelectedFiles()}
    </div>
  );
};

export default FileUploadClient;
