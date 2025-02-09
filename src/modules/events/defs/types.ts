import { CrudObject } from '@common/defs/types';

export interface Event extends CrudObject {
  // id: number;
  title: string;
  location: string;
  date: string;
  maxAttendees: number;
  userId: number;
  // createdAt?: string;
  // updatedAt?: string;
}
