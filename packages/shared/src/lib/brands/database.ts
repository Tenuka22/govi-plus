import { Schema } from 'effect';

export const FarmerId = Schema.UUID.pipe(Schema.brand('FarmerId'));

export const FileId = Schema.UUID.pipe(Schema.brand('FileId'));
