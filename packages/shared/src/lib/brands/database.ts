import { Schema } from 'effect';

export const FarmerId = Schema.UUID.pipe(Schema.brand('SessionId'));
