import { DateTime, Effect } from 'effect';
import { FileExtentionRegex, FileSanitizeRegex } from '../regex';
import type { UserId } from '../types/auth';

export const generateUploadPath = (fileName: string, userId: UserId) =>
  Effect.gen(function* () {
    const timestamp = DateTime.toDate(yield* DateTime.now);
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const fileExtension = fileName.split('.').pop() || '';
    const baseName = fileName.replace(FileExtentionRegex, '');
    const sanitizedBaseName = baseName.replace(FileSanitizeRegex, '_');

    return `/images/${userId}/${timestamp}_${randomSuffix}_${sanitizedBaseName}.${fileExtension}`;
  });
