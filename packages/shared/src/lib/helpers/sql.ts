import { sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

export const arrayContains = <T>(col: PgColumn, values: T[]) =>
  sql`${col} @> ${values}::text[]`;
