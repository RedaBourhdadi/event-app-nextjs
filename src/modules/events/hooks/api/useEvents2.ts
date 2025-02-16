import ApiRoutes from '@common/defs/api-routes';
// import { ROLE } from '@modules/permissions/defs/types';
import { Event, Sub } from '@modules/events/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  title: string;
  location: string;
  date: string;
  maxAttendees: number;
  userId: number;
}
export interface CreateOneInputSub {
  eventId: number;
  userId: number;
}

export interface UpdateOneInput {
  title: string;
  location: string;
  date: string;
  maxAttendees: number;
  userId: number;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvents2: UseItems<Event, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export const usesubEvens: UseItems<Sub, CreateOneInputSub, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Attendees;
  const useItemsHook = useItems<Sub, CreateOneInputSub, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvents2;
