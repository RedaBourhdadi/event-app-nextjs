import { CrudObject } from '@common/defs/types';
import { Event } from '@modules/events/defs/types';

export interface Attendee extends CrudObject {
  // id: number;
  eventId: number;
  userId: number;
  event?: Event;
  // createdAt?: string;
  // updatedAt?: string;
}
