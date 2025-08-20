import { Schema } from 'effect';

export const UserId = Schema.String.pipe(Schema.brand('UserId'));

export const SessionId = Schema.String.pipe(Schema.brand('SessionId'));
