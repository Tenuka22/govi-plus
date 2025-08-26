import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const fileTypeEnum = pgEnum('file_type', [
  'image',
  'video',
  'document',
  'audio',
  'archive',
]);

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: text('file_name').notNull(),
  originalFileName: text('original_file_ame').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  fileType: fileTypeEnum('file_type').notNull(),
  uploadPath: text('upload_path').notNull(),
  url: text('url').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});
