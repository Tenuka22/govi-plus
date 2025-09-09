import { Schema } from 'effect';

export const serverTokenPairReturnSchema = Schema.Struct({
  refresh: Schema.String,
  username: Schema.String,
  access: Schema.String,
});
